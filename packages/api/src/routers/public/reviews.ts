import { TRPCError } from '@trpc/server'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'

import { user, vendorReviews } from '@ticketur/db'

import { createTRPCRouter, publicProcedure } from '../../trpc'
import { newId } from '../../lib/ids'

const RATING_VALUES = [1, 2, 3, 4, 5] as const

const submitInput = z.object({
  vendorId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1500).default(''),
  // Only read when there's no session — a guest's identity for this review.
  reviewerName: z.string().trim().min(1).max(120).optional(),
  reviewerEmail: z.email('Enter a valid email').optional(),
})

export const publicReviewsRouter = createTRPCRouter({
  listByVendor: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          id: vendorReviews.id,
          rating: vendorReviews.rating,
          comment: vendorReviews.comment,
          createdAt: vendorReviews.createdAt,
          // Signed-in reviewer → their account name; guest → the name they
          // typed in the modal.
          reviewerName: sql<string>`coalesce(${user.name}, ${vendorReviews.guestName})`,
        })
        .from(vendorReviews)
        .leftJoin(user, eq(user.id, vendorReviews.reviewerId))
        .where(eq(vendorReviews.vendorId, input.vendorId))
        .orderBy(desc(vendorReviews.createdAt))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize)

      const totalRows = await ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(vendorReviews)
        .where(eq(vendorReviews.vendorId, input.vendorId))

      return {
        rows,
        total: totalRows[0]?.count ?? 0,
        page: input.page,
        pageSize: input.pageSize,
      }
    }),

  // Average + per-star distribution, used for the rating badge everywhere a
  // vendor is shown and for the Reviews tab's ratings summary card.
  summaryByVendor: publicProcedure
    .input(z.object({ vendorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const distributionRows = await ctx.db
        .select({
          rating: vendorReviews.rating,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(vendorReviews)
        .where(eq(vendorReviews.vendorId, input.vendorId))
        .groupBy(vendorReviews.rating)

      const distribution = Object.fromEntries(
        RATING_VALUES.map((value) => [
          value,
          distributionRows.find((row) => row.rating === value)?.count ?? 0,
        ])
      ) as Record<(typeof RATING_VALUES)[number], number>

      const total = distributionRows.reduce((sum, row) => sum + row.count, 0)
      const average =
        total === 0
          ? 0
          : RATING_VALUES.reduce(
              (sum, value) => sum + value * distribution[value],
              0
            ) / total

      return { average, total, distribution }
    }),

  // Anyone can review a vendor — signed in or not. Signed-in reviewers are
  // capped at one review per vendor (upsert by reviewerId, identity from the
  // session — the posted name/email, if any, is ignored). Guests must supply
  // a name + email, which becomes their identity for the same one-review-
  // per-vendor cap (upsert by vendorId + guestEmail).
  submit: publicProcedure
    .input(submitInput)
    .mutation(async ({ ctx, input }) => {
      const [vendor] = await ctx.db
        .select({ id: user.id })
        .from(user)
        .where(and(eq(user.id, input.vendorId), eq(user.role, 'vendor')))
        .limit(1)

      if (!vendor) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Vendor not found' })
      }

      const reviewerId = ctx.session?.user.id ?? null

      if (!reviewerId && (!input.reviewerName || !input.reviewerEmail)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Name and email are required',
        })
      }

      const identityFilter = reviewerId
        ? eq(vendorReviews.reviewerId, reviewerId)
        : and(
            isNull(vendorReviews.reviewerId),
            eq(vendorReviews.guestEmail, input.reviewerEmail!)
          )

      const [existing] = await ctx.db
        .select({ id: vendorReviews.id })
        .from(vendorReviews)
        .where(and(eq(vendorReviews.vendorId, input.vendorId), identityFilter))
        .limit(1)

      if (existing) {
        await ctx.db
          .update(vendorReviews)
          .set({
            rating: input.rating,
            comment: input.comment,
            ...(reviewerId ? {} : { guestName: input.reviewerName }),
          })
          .where(eq(vendorReviews.id, existing.id))
        return { ok: true, id: existing.id }
      }

      const id = newId('rev')
      await ctx.db.insert(vendorReviews).values({
        id,
        vendorId: input.vendorId,
        reviewerId,
        guestName: reviewerId ? null : input.reviewerName,
        guestEmail: reviewerId ? null : input.reviewerEmail,
        rating: input.rating,
        comment: input.comment,
      })
      return { ok: true, id }
    }),
})

export type PublicReviewsRouter = typeof publicReviewsRouter

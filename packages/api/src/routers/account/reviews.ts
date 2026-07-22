import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { user, vendorReviews } from '@ticketur/db'

import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { newId } from '../../lib/ids'

const submitInput = z.object({
  vendorId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1500).default(''),
})

export const accountReviewsRouter = createTRPCRouter({
  // Upsert — a reviewer can only have one review per vendor. Resubmitting
  // (e.g. editing from the same modal) updates the existing row.
  submit: protectedProcedure
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

      const [existing] = await ctx.db
        .select({ id: vendorReviews.id })
        .from(vendorReviews)
        .where(
          and(
            eq(vendorReviews.vendorId, input.vendorId),
            eq(vendorReviews.reviewerId, ctx.session.user.id)
          )
        )
        .limit(1)

      if (existing) {
        await ctx.db
          .update(vendorReviews)
          .set({ rating: input.rating, comment: input.comment })
          .where(eq(vendorReviews.id, existing.id))
        return { ok: true, id: existing.id }
      }

      const id = newId('rev')
      await ctx.db.insert(vendorReviews).values({
        id,
        vendorId: input.vendorId,
        reviewerId: ctx.session.user.id,
        rating: input.rating,
        comment: input.comment,
      })
      return { ok: true, id }
    }),
})

export type AccountReviewsRouter = typeof accountReviewsRouter

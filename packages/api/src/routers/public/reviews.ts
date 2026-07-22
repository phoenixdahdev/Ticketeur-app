import { desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { user, vendorReviews } from '@ticketur/db'

import { createTRPCRouter, publicProcedure } from '../../trpc'

const RATING_VALUES = [1, 2, 3, 4, 5] as const

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
          reviewerName: user.name,
        })
        .from(vendorReviews)
        .innerJoin(user, eq(user.id, vendorReviews.reviewerId))
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
})

export type PublicReviewsRouter = typeof publicReviewsRouter

import { and, eq } from 'drizzle-orm'

import { user } from '@ticketur/db'

import { createTRPCRouter, organizerProcedure } from '../trpc'

export const vendorsRouter = createTRPCRouter({
  // Returns only admin-approved vendors — pending and rejected vendors are
  // hidden from the assign UI.
  listRegistered: organizerProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: user.id,
        name: user.name,
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessDescription: user.businessDescription,
        image: user.image,
      })
      .from(user)
      .where(
        and(eq(user.role, 'vendor'), eq(user.vendorApprovalStatus, 'approved'))
      )

    return rows.map((row) => ({
      id: row.id,
      name: row.businessName ?? row.name,
      category: row.businessCategory ?? 'Uncategorized',
      description: row.businessDescription ?? '',
      image: row.image,
      status: 'verified' as const,
    }))
  }),
})

export type VendorsRouter = typeof vendorsRouter

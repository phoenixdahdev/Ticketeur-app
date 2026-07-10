import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { user } from '@ticketur/db'

import { createTRPCRouter, organizerProcedure } from '../../trpc'

const profileInput = z.object({
  name: z.string().trim().min(1, 'Your name is required'),
  orgName: z.string().trim().min(1, 'Organization name is required'),
  orgType: z.string().trim().max(80).optional(),
  // Organizer logo/avatar. Null clears it.
  image: z.string().nullable().optional(),
})

export const orgProfileRouter = createTRPCRouter({
  get: organizerProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        orgName: user.orgName,
        orgType: user.orgType,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, ctx.session.user.id))
      .limit(1)

    return rows[0] ?? null
  }),

  update: organizerProcedure
    .input(profileInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          name: input.name,
          orgName: input.orgName,
          orgType: input.orgType ?? null,
          image: input.image ?? null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.session.user.id))

      return { ok: true }
    }),
})

export type OrgProfileRouter = typeof orgProfileRouter

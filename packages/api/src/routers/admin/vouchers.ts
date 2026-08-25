import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { events, user, vouchers } from '@ticketur/db'

import { createTRPCRouter, adminProcedure } from '../../trpc'
import { newId } from '../../lib/ids'
import { sendVoucherCode, voucherSendInput } from '../../lib/voucher-send'

const discountTypeEnum = z.enum(['percent', 'fixed'])

// Mirrors org/vouchers' input, minus the organizer-ownership constraint: an
// admin voucher has no organizer, so `eventId` may point at any event.
const baseFields = {
  code: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, 'Use letters, numbers, - and _ only'),
  // null = applies to every event on the platform.
  eventId: z.string().nullable().default(null),
  discountType: discountTypeEnum,
  discountValue: z.number().int().positive(),
  maxRedemptions: z.number().int().positive().nullable().default(null),
  validFrom: z.date().nullable().default(null),
  validUntil: z.date().nullable().default(null),
}

function refineFields(
  v: {
    discountType: 'percent' | 'fixed'
    discountValue: number
    validFrom: Date | null
    validUntil: Date | null
  },
  ctx: z.RefinementCtx
) {
  if (v.discountType === 'percent' && v.discountValue > 100) {
    ctx.addIssue({
      code: 'custom',
      path: ['discountValue'],
      message: 'Percent discount must be between 1 and 100',
    })
  }
  if (v.validFrom && v.validUntil && v.validUntil < v.validFrom) {
    ctx.addIssue({
      code: 'custom',
      path: ['validUntil'],
      message: 'End date must be on or after the start date',
    })
  }
}

const createInput = z.object(baseFields).superRefine(refineFields)
const updateInput = z
  .object({ id: z.string(), ...baseFields })
  .superRefine(refineFields)

// percent → basis points; fixed → minor units as given.
function toStoredValue(type: 'percent' | 'fixed', value: number) {
  return type === 'percent' ? value * 100 : value
}

// A platform voucher is one with no organizer.
const IS_PLATFORM = isNull(vouchers.organizerId)

export const adminVouchersRouter = createTRPCRouter({
  // Every event on the platform is scopable, since a platform voucher isn't
  // tied to one organizer. Draft events are excluded — they have no public
  // page to send anyone to.
  eventOptions: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({ id: events.id, title: events.title, status: events.status })
      .from(events)
      .where(eq(events.status, 'upcoming'))
      .orderBy(desc(events.createdAt))
  }),

  // Platform vouchers only — an organizer's own codes stay in their dashboard.
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: vouchers.id,
        code: vouchers.code,
        eventId: vouchers.eventId,
        eventTitle: events.title,
        discountType: vouchers.discountType,
        discountValue: vouchers.discountValue,
        maxRedemptions: vouchers.maxRedemptions,
        redeemedCount: vouchers.redeemedCount,
        validFrom: vouchers.validFrom,
        validUntil: vouchers.validUntil,
        active: vouchers.active,
        createdAt: vouchers.createdAt,
      })
      .from(vouchers)
      .leftJoin(events, eq(events.id, vouchers.eventId))
      .where(IS_PLATFORM)
      .orderBy(desc(vouchers.createdAt))
  }),

  // Read-only view of organizer-owned codes, so an admin can see what is in
  // circulation platform-wide without being able to edit someone else's code.
  listOrganizerOwned: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: vouchers.id,
        code: vouchers.code,
        eventTitle: events.title,
        organizerName: sql<string>`COALESCE(NULLIF(${user.orgName}, ''), ${user.name})`,
        discountType: vouchers.discountType,
        discountValue: vouchers.discountValue,
        maxRedemptions: vouchers.maxRedemptions,
        redeemedCount: vouchers.redeemedCount,
        validUntil: vouchers.validUntil,
        active: vouchers.active,
      })
      .from(vouchers)
      .innerJoin(user, eq(user.id, vouchers.organizerId))
      .leftJoin(events, eq(events.id, vouchers.eventId))
      .orderBy(desc(vouchers.createdAt))
  }),

  create: adminProcedure.input(createInput).mutation(async ({ ctx, input }) => {
    // Friendly duplicate check; the partial unique index on
    // lower(code) WHERE organizer_id IS NULL is the race backstop.
    const [dup] = await ctx.db
      .select({ id: vouchers.id })
      .from(vouchers)
      .where(
        and(IS_PLATFORM, sql`lower(${vouchers.code}) = lower(${input.code})`)
      )
      .limit(1)
    if (dup) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `A platform voucher with the code ${input.code} already exists.`,
      })
    }

    const id = newId('vch')
    await ctx.db.insert(vouchers).values({
      id,
      // NULL owner is what makes this a platform voucher.
      organizerId: null,
      eventId: input.eventId ?? null,
      code: input.code,
      discountType: input.discountType,
      discountValue: toStoredValue(input.discountType, input.discountValue),
      maxRedemptions: input.maxRedemptions ?? null,
      validFrom: input.validFrom ?? null,
      validUntil: input.validUntil ?? null,
    })
    return { id }
  }),

  update: adminProcedure.input(updateInput).mutation(async ({ ctx, input }) => {
    const [existing] = await ctx.db
      .select({ id: vouchers.id })
      .from(vouchers)
      .where(and(eq(vouchers.id, input.id), IS_PLATFORM))
      .limit(1)
    if (!existing) throw new TRPCError({ code: 'NOT_FOUND' })

    await ctx.db
      .update(vouchers)
      .set({
        code: input.code,
        eventId: input.eventId ?? null,
        discountType: input.discountType,
        discountValue: toStoredValue(input.discountType, input.discountValue),
        maxRedemptions: input.maxRedemptions ?? null,
        validFrom: input.validFrom ?? null,
        validUntil: input.validUntil ?? null,
        updatedAt: new Date(),
      })
      .where(eq(vouchers.id, input.id))
    return { id: input.id }
  }),

  setActive: adminProcedure
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(vouchers)
        .set({ active: input.active, updatedAt: new Date() })
        .where(and(eq(vouchers.id, input.id), IS_PLATFORM))
        .returning({ id: vouchers.id })
      if (result.length === 0) throw new TRPCError({ code: 'NOT_FOUND' })
      return { ok: true as const }
    }),

  // Admin can email any voucher, including an organizer's, since the platform
  // operator may need to act on their behalf.
  send: adminProcedure
    .input(voucherSendInput)
    .mutation(async ({ ctx, input }) => {
      return sendVoucherCode(ctx.db, {
        input,
        ownerId: null,
        anyOwner: true,
      })
    }),
})

export type AdminVouchersRouter = typeof adminVouchersRouter

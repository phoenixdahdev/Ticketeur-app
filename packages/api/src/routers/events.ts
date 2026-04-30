import { TRPCError } from '@trpc/server'
import { and, desc, eq, ilike, inArray, sql } from 'drizzle-orm'
import { tasks } from '@trigger.dev/sdk'
import { z } from 'zod'

import {
  events,
  eventVendors,
  externalVendorInvites,
  orders,
  ticketTiers,
  user,
} from '@ticketur/db'
import { env } from '@ticketur/env/core'

import { createTRPCRouter, organizerProcedure } from '../trpc'
import { newId } from '../lib/ids'
import { logActivity } from '../lib/activity'

const eventStatusEnum = z.enum(['draft', 'in-review', 'upcoming', 'archived'])

const ticketTierInput = z.object({
  name: z.string().trim().min(1),
  quantity: z.number().int().min(1),
  // priceMinor: amount in minor units (e.g., kobo)
  priceMinor: z.number().int().min(0),
})

const createEventInput = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(10),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().trim().min(1),
  bannerUrl: z.string().nullable().optional(),
  features: z.array(z.string().trim()).default([]),
  tiers: z.array(ticketTierInput).min(1),
  assignedVendorIds: z.array(z.string()).default([]),
  externalInvites: z
    .array(
      z.object({
        businessName: z.string().trim().min(1),
        contactName: z.string().trim().min(1),
        email: z.email(),
        phone: z.string().trim().min(1),
      })
    )
    .default([]),
  status: eventStatusEnum.default('in-review'),
})

const listInput = z.object({
  tab: z.enum(['all', 'upcoming', 'in-review', 'draft', 'archived']).default('all'),
  q: z.string().default(''),
  sort: z.enum(['name', 'date', 'location', 'status', 'sales']).default('date'),
  dir: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
})

export const eventsRouter = createTRPCRouter({
  // ─── Mutations ────────────────────────────────────────────────────────────

  create: organizerProcedure
    .input(createEventInput)
    .mutation(async ({ ctx, input }) => {
      const eventId = newId('evt')

      await ctx.db.transaction(async (tx) => {
        await tx.insert(events).values({
          id: eventId,
          organizerId: ctx.session.user.id,
          title: input.title,
          description: input.description,
          eventDate: input.date,
          eventTime: input.time,
          location: input.location,
          bannerUrl: input.bannerUrl ?? null,
          features: input.features,
          status: input.status,
        })

        if (input.tiers.length > 0) {
          await tx.insert(ticketTiers).values(
            input.tiers.map((tier, idx) => ({
              id: newId('tier'),
              eventId,
              name: tier.name,
              quantity: tier.quantity,
              priceMinor: tier.priceMinor,
              sortOrder: idx,
            }))
          )
        }

        if (input.assignedVendorIds.length > 0) {
          // Filter to vendors that actually exist + have vendor role
          const validVendors = await tx
            .select({ id: user.id })
            .from(user)
            .where(
              and(
                inArray(user.id, input.assignedVendorIds),
                eq(user.role, 'vendor')
              )
            )

          if (validVendors.length > 0) {
            await tx.insert(eventVendors).values(
              validVendors.map((v) => ({
                id: newId('evnd'),
                eventId,
                vendorId: v.id,
                status: 'invited' as const,
              }))
            )
          }
        }

        if (input.externalInvites.length > 0) {
          // For each external invite: ensure a vendor user account exists
          // (creating a pending one if needed), then link via eventVendors.
          // We still record the original invite payload (incl. phone) in
          // externalVendorInvites so the organizer can see who they invited.
          await tx.insert(externalVendorInvites).values(
            input.externalInvites.map((inv) => ({
              id: newId('einv'),
              eventId,
              businessName: inv.businessName,
              contactName: inv.contactName,
              email: inv.email,
              phone: inv.phone,
            }))
          )

          for (const inv of input.externalInvites) {
            const existing = await tx
              .select({
                id: user.id,
                role: user.role,
                vendorApprovalStatus: user.vendorApprovalStatus,
              })
              .from(user)
              .where(eq(user.email, inv.email))
              .limit(1)

            let vendorId: string

            if (existing[0]) {
              vendorId = existing[0].id
              // Promote existing accounts to vendor (still pending) if they
              // weren't a vendor yet. Don't downgrade approved vendors.
              if (existing[0].role !== 'vendor') {
                await tx
                  .update(user)
                  .set({
                    role: 'vendor',
                    vendorApprovalStatus: 'pending',
                    businessName: inv.businessName,
                  })
                  .where(eq(user.id, vendorId))
              }
            } else {
              // Stub vendor account; they'll set a password via the
              // forgot-password / sign-up flow we send in the invite email.
              vendorId = newId('usr')
              const now = new Date()
              await tx.insert(user).values({
                id: vendorId,
                name: inv.contactName,
                email: inv.email,
                emailVerified: false,
                role: 'vendor',
                vendorApprovalStatus: 'pending',
                businessName: inv.businessName,
                createdAt: now,
                updatedAt: now,
              })
            }

            // Link to this event (idempotent: skip if already linked).
            const alreadyLinked = await tx
              .select({ id: eventVendors.id })
              .from(eventVendors)
              .where(
                and(
                  eq(eventVendors.eventId, eventId),
                  eq(eventVendors.vendorId, vendorId)
                )
              )
              .limit(1)

            if (!alreadyLinked[0]) {
              await tx.insert(eventVendors).values({
                id: newId('evnd'),
                eventId,
                vendorId,
                status: 'invited',
              })
            }
          }
        }
      })

      // Fire invite emails outside the transaction. Failures here must not
      // roll back the event creation — the organizer can resend invites later.
      if (input.externalInvites.length > 0) {
        const baseUrl =
          env.BETTER_AUTH_URL ??
          process.env.NEXT_PUBLIC_APP_URL ??
          'http://localhost:3000'

        for (const inv of input.externalInvites) {
          const signupUrl = `${baseUrl}/sign-up?invite=vendor&email=${encodeURIComponent(inv.email)}`
          void tasks.trigger('send-vendor-invite', {
            email: inv.email,
            businessName: inv.businessName,
            contactName: inv.contactName,
            organizerName: ctx.session.user.name,
            eventTitle: input.title,
            signupUrl,
          })
        }
      }

      await logActivity(ctx, {
        organizerId: ctx.session.user.id,
        type: 'event.created',
        eventId,
        payload: { title: input.title },
      })

      return { id: eventId }
    }),

  archive: organizerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const found = await ctx.db
        .select({ id: events.id, organizerId: events.organizerId, title: events.title })
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)
      const ev = found[0]
      if (!ev) throw new TRPCError({ code: 'NOT_FOUND' })
      if (ev.organizerId !== ctx.session.user.id && ctx.session.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.db
        .update(events)
        .set({ status: 'archived', updatedAt: new Date() })
        .where(eq(events.id, input.id))

      await logActivity(ctx, {
        organizerId: ev.organizerId,
        type: 'event.archived',
        eventId: ev.id,
        payload: { title: ev.title },
      })

      return { id: ev.id }
    }),

  delete: organizerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const found = await ctx.db
        .select({ id: events.id, organizerId: events.organizerId, title: events.title })
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)
      const ev = found[0]
      if (!ev) throw new TRPCError({ code: 'NOT_FOUND' })
      if (ev.organizerId !== ctx.session.user.id && ctx.session.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      await ctx.db.delete(events).where(eq(events.id, input.id))

      await logActivity(ctx, {
        organizerId: ev.organizerId,
        type: 'event.deleted',
        eventId: null,
        payload: { title: ev.title, eventId: ev.id },
      })

      return { id: ev.id }
    }),

  // ─── Queries ──────────────────────────────────────────────────────────────

  list: organizerProcedure.input(listInput).query(async ({ ctx, input }) => {
    const organizerId = ctx.session.user.id

    const filters = [eq(events.organizerId, organizerId)]
    if (input.tab !== 'all') filters.push(eq(events.status, input.tab))
    if (input.q.trim().length > 0) {
      filters.push(ilike(events.title, `%${input.q.trim()}%`))
    }

    // Aggregate sold/total per event
    const soldExpr = sql<number>`COALESCE(SUM(${ticketTiers.sold}), 0)::int`.as('sold')
    const totalExpr = sql<number>`COALESCE(SUM(${ticketTiers.quantity}), 0)::int`.as('total')

    const orderBy = (() => {
      const dir = input.dir === 'asc' ? sql`ASC` : sql`DESC`
      switch (input.sort) {
        case 'name':
          return sql`${events.title} ${dir}`
        case 'location':
          return sql`${events.location} ${dir}`
        case 'status':
          return sql`${events.status} ${dir}`
        case 'sales':
          return sql`${soldExpr} ${dir}`
        case 'date':
        default:
          return sql`${events.eventDate} ${dir}`
      }
    })()

    const rows = await ctx.db
      .select({
        id: events.id,
        title: events.title,
        eventDate: events.eventDate,
        location: events.location,
        status: events.status,
        sold: soldExpr,
        total: totalExpr,
      })
      .from(events)
      .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
      .where(and(...filters))
      .groupBy(events.id)
      .orderBy(orderBy)
      .limit(input.pageSize)
      .offset((input.page - 1) * input.pageSize)

    const totalCountRows = await ctx.db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(events)
      .where(and(...filters))

    return {
      rows,
      total: totalCountRows[0]?.count ?? 0,
      page: input.page,
      pageSize: input.pageSize,
    }
  }),

  byId: organizerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)
      const ev = found[0]
      if (!ev) return null
      if (ev.organizerId !== ctx.session.user.id && ctx.session.user.role !== 'admin') {
        return null
      }

      const tiers = await ctx.db
        .select()
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, ev.id))
        .orderBy(ticketTiers.sortOrder)

      const vendors = await ctx.db
        .select({
          id: eventVendors.id,
          status: eventVendors.status,
          vendor: {
            id: user.id,
            businessName: user.businessName,
            businessCategory: user.businessCategory,
            businessDescription: user.businessDescription,
            image: user.image,
          },
        })
        .from(eventVendors)
        .innerJoin(user, eq(user.id, eventVendors.vendorId))
        .where(eq(eventVendors.eventId, ev.id))

      const externalInvites = await ctx.db
        .select()
        .from(externalVendorInvites)
        .where(eq(externalVendorInvites.eventId, ev.id))

      const totals = await ctx.db
        .select({
          sold: sql<number>`COALESCE(SUM(${ticketTiers.sold}), 0)::int`,
          total: sql<number>`COALESCE(SUM(${ticketTiers.quantity}), 0)::int`,
          revenueMinor: sql<number>`COALESCE(SUM(${ticketTiers.sold} * ${ticketTiers.priceMinor}), 0)::int`,
        })
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, ev.id))

      const totalsRow = totals[0] ?? { sold: 0, total: 0, revenueMinor: 0 }

      const ordersTotal = await ctx.db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(orders)
        .where(and(eq(orders.eventId, ev.id), eq(orders.status, 'paid')))

      return {
        event: ev,
        tiers,
        vendors,
        externalInvites,
        sold: totalsRow.sold,
        total: totalsRow.total,
        revenueMinor: totalsRow.revenueMinor,
        ordersCount: ordersTotal[0]?.count ?? 0,
      }
    }),
})

export type EventsRouter = typeof eventsRouter

import { and, asc, desc, eq, ilike, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'

import {
  events,
  eventVendors,
  externalVendorInvites,
  ticketTiers,
  user,
} from '@ticketur/db'

import { createTRPCRouter, vendorProcedure } from '../../trpc'

const listInput = z.object({
  tab: z.enum(['all', 'upcoming', 'past']).default('all'),
  q: z.string().default(''),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(4),
})

export const vendorEventsRouter = createTRPCRouter({
  list: vendorProcedure.input(listInput).query(async ({ ctx, input }) => {
    const vendorId = ctx.session.user.id
    const today = new Date().toISOString().slice(0, 10)

    const filters = [eq(eventVendors.vendorId, vendorId)]
    // Multi-day events: still upcoming while today <= end_date (or event_date if no end).
    if (input.tab === 'upcoming') {
      filters.push(sql`COALESCE(${events.endDate}, ${events.eventDate}) >= ${today}`)
    }
    if (input.tab === 'past') {
      filters.push(sql`COALESCE(${events.endDate}, ${events.eventDate}) < ${today}`)
    }
    if (input.q.trim().length > 0) {
      filters.push(ilike(events.title, `%${input.q.trim()}%`))
    }

    const rows = await ctx.db
      .select({
        id: events.id,
        title: events.title,
        eventDate: events.eventDate,
        endDate: events.endDate,
        eventTime: events.eventTime,
        location: events.location,
        bannerUrl: events.bannerUrl,
        status: events.status,
      })
      .from(eventVendors)
      .innerJoin(events, eq(events.id, eventVendors.eventId))
      .where(and(...filters))
      .orderBy(desc(events.eventDate))
      .limit(input.pageSize)
      .offset((input.page - 1) * input.pageSize)

    const totalCountRows = await ctx.db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(eventVendors)
      .innerJoin(events, eq(events.id, eventVendors.eventId))
      .where(and(...filters))

    const allCountRows = await ctx.db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(eventVendors)
      .innerJoin(events, eq(events.id, eventVendors.eventId))
      .where(eq(eventVendors.vendorId, vendorId))

    return {
      rows,
      total: totalCountRows[0]?.count ?? 0,
      allCount: allCountRows[0]?.count ?? 0,
      page: input.page,
      pageSize: input.pageSize,
    }
  }),

  byId: vendorProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const vendorId = ctx.session.user.id

      // Vendor must be assigned to this event
      const link = await ctx.db
        .select({ id: eventVendors.id })
        .from(eventVendors)
        .where(
          and(
            eq(eventVendors.eventId, input.id),
            eq(eventVendors.vendorId, vendorId)
          )
        )
        .limit(1)

      if (!link[0] && ctx.session.user.role !== 'admin') {
        return null
      }

      const found = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1)
      const event = found[0]
      if (!event) return null

      // Sibling assigned vendors (incl. this one) for the "Assigned Vendors" grid
      const siblings = await ctx.db
        .select({
          id: eventVendors.id,
          vendorId: eventVendors.vendorId,
          businessName: user.businessName,
          businessCategory: user.businessCategory,
          businessDescription: user.businessDescription,
          vendorTagline: user.vendorTagline,
          image: user.image,
        })
        .from(eventVendors)
        .innerJoin(user, eq(user.id, eventVendors.vendorId))
        .where(eq(eventVendors.eventId, event.id))

      const externalInvites = await ctx.db
        .select({
          id: externalVendorInvites.id,
          businessName: externalVendorInvites.businessName,
        })
        .from(externalVendorInvites)
        .where(eq(externalVendorInvites.eventId, event.id))

      const tiers = await ctx.db
        .select({
          id: ticketTiers.id,
          quantity: ticketTiers.quantity,
        })
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, event.id))

      const totalCapacity = tiers.reduce((sum, t) => sum + t.quantity, 0)

      return {
        event,
        vendors: siblings,
        externalInvites,
        currentVendorId: vendorId,
        totalCapacity,
      }
    }),
})

export type VendorEventsRouter = typeof vendorEventsRouter

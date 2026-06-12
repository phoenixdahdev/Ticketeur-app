import { and, asc, desc, eq, ilike, ne, sql } from 'drizzle-orm'
import { z } from 'zod'

import { events, eventVendors, ticketTiers, user } from '@ticketur/db'

import { createTRPCRouter, publicProcedure } from '../../trpc'

// Active bans hide the user. Permanent bans (banExpires null) and unexpired
// temp bans hide; expired temp bans fall through. Mirrors the vendor router
// filter so banned organizers/vendors stop appearing on public surfaces.
const notCurrentlyBanned = sql`(${user.banned} IS NOT TRUE OR (${user.banExpires} IS NOT NULL AND ${user.banExpires} < NOW()))`

// Multi-day events stay visible while in progress: an event is "still
// happening" if its end_date (or event_date for single-day) is today or
// later. Caller passes an ISO YYYY-MM-DD `today`.
function stillRunning(today: string) {
  return sql`COALESCE(${events.endDate}, ${events.eventDate}) >= ${today}`
}

const listInput = z.object({
  q: z.string().default(''),
  category: z.string().default('all'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(12),
})

export const publicEventsRouter = createTRPCRouter({
  list: publicProcedure.input(listInput).query(async ({ ctx, input }) => {
    const today = new Date().toISOString().slice(0, 10)

    const filters = [eq(events.status, 'upcoming'), stillRunning(today)]
    if (input.q.trim().length > 0) {
      filters.push(ilike(events.title, `%${input.q.trim()}%`))
    }
    // Note: events table has no category column yet; reserved for future use.
    void input.category

    const minPriceExpr = sql<number>`COALESCE(MIN(${ticketTiers.priceMinor}), 0)::int`.as(
      'minPrice'
    )

    const rows = await ctx.db
      .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        eventDate: events.eventDate,
        endDate: events.endDate,
        eventTime: events.eventTime,
        location: events.location,
        bannerUrl: events.bannerUrl,
        minPrice: minPriceExpr,
      })
      .from(events)
      .innerJoin(user, eq(user.id, events.organizerId))
      .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
      .where(and(...filters, notCurrentlyBanned))
      .groupBy(events.id)
      .orderBy(asc(events.eventDate))
      .limit(input.pageSize)
      .offset((input.page - 1) * input.pageSize)

    const totalCountRows = await ctx.db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(events)
      .innerJoin(user, eq(user.id, events.organizerId))
      .where(and(...filters, notCurrentlyBanned))

    return {
      rows,
      total: totalCountRows[0]?.count ?? 0,
      page: input.page,
      pageSize: input.pageSize,
    }
  }),

  featured: publicProcedure.query(async ({ ctx }) => {
    const today = new Date().toISOString().slice(0, 10)

    const minPriceExpr = sql<number>`COALESCE(MIN(${ticketTiers.priceMinor}), 0)::int`.as(
      'minPrice'
    )

    const rows = await ctx.db
      .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        eventDate: events.eventDate,
        endDate: events.endDate,
        eventTime: events.eventTime,
        location: events.location,
        bannerUrl: events.bannerUrl,
        minPrice: minPriceExpr,
      })
      .from(events)
      .innerJoin(user, eq(user.id, events.organizerId))
      .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
      .where(
        and(eq(events.status, 'upcoming'), stillRunning(today), notCurrentlyBanned)
      )
      .groupBy(events.id)
      .orderBy(desc(events.createdAt))
      .limit(3)

    return rows
  }),

  // Other upcoming events to surface on the detail page. Excludes the
  // current event; future iteration could match on category / location.
  similar: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const today = new Date().toISOString().slice(0, 10)
      const minPriceExpr = sql<number>`COALESCE(MIN(${ticketTiers.priceMinor}), 0)::int`.as(
        'minPrice'
      )

      const rows = await ctx.db
        .select({
          id: events.id,
          slug: events.slug,
          title: events.title,
          eventDate: events.eventDate,
          endDate: events.endDate,
          location: events.location,
          bannerUrl: events.bannerUrl,
          minPrice: minPriceExpr,
        })
        .from(events)
        .innerJoin(user, eq(user.id, events.organizerId))
        .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
        .where(
          and(
            ne(events.id, input.id),
            eq(events.status, 'upcoming'),
            stillRunning(today),
            notCurrentlyBanned
          )
        )
        .groupBy(events.id)
        .orderBy(asc(events.eventDate))
        .limit(3)

      return rows
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await ctx.db
        .select({ event: events })
        .from(events)
        .innerJoin(user, eq(user.id, events.organizerId))
        .where(
          and(
            eq(events.slug, input.slug),
            eq(events.status, 'upcoming'),
            notCurrentlyBanned
          )
        )
        .limit(1)
      const event = found[0]?.event
      if (!event) return null

      const tiers = await ctx.db
        .select()
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, event.id))
        .orderBy(asc(ticketTiers.priceMinor), asc(ticketTiers.sortOrder))

      const vendors = await ctx.db
        .select({
          id: eventVendors.id,
          status: eventVendors.status,
          vendorId: user.id,
          businessName: user.businessName,
          businessCategory: user.businessCategory,
          businessDescription: user.businessDescription,
          tagline: user.vendorTagline,
          image: user.image,
        })
        .from(eventVendors)
        .innerJoin(user, eq(user.id, eventVendors.vendorId))
        .where(and(eq(eventVendors.eventId, event.id), notCurrentlyBanned))

      const minPrice = tiers.reduce(
        (min, t) => (min === null || t.priceMinor < min ? t.priceMinor : min),
        null as number | null
      )

      return {
        event,
        tiers,
        vendors,
        minPriceMinor: minPrice ?? 0,
      }
    }),
})

export type PublicEventsRouter = typeof publicEventsRouter

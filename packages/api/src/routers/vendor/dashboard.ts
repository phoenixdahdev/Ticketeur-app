import { and, asc, eq, sql } from 'drizzle-orm'

import { events, eventVendors, user } from '@ticketur/db'

import { createTRPCRouter, vendorProcedure } from '../../trpc'

const REQUIRED_FIELDS = [
  'businessName',
  'businessCategory',
  'businessDescription',
  'vendorTagline',
  'vendorLocation',
  'image',
  'vendorBannerUrl',
  'vendorExpertise',
  'vendorFocus',
  'vendorExperience',
] as const

function profileCompletion(
  row: Partial<Record<(typeof REQUIRED_FIELDS)[number], string | null>>
) {
  let filled = 0
  for (const key of REQUIRED_FIELDS) {
    const value = row[key]
    if (typeof value === 'string' && value.trim().length > 0) filled += 1
  }
  return Math.round((filled / REQUIRED_FIELDS.length) * 100)
}

export const vendorDashboardRouter = createTRPCRouter({
  stats: vendorProcedure.query(async ({ ctx }) => {
    const vendorId = ctx.session.user.id
    const today = new Date().toISOString().slice(0, 10)

    const counts = await ctx.db
      .select({
        total: sql<number>`COUNT(*)::int`,
        upcoming: sql<number>`COUNT(*) FILTER (WHERE COALESCE(${events.endDate}, ${events.eventDate}) >= ${today} AND ${events.status} = 'upcoming')::int`,
        past: sql<number>`COUNT(*) FILTER (WHERE COALESCE(${events.endDate}, ${events.eventDate}) < ${today})::int`,
      })
      .from(eventVendors)
      .innerJoin(events, eq(events.id, eventVendors.eventId))
      .where(eq(eventVendors.vendorId, vendorId))

    const profileRow = await ctx.db
      .select({
        businessName: user.businessName,
        businessCategory: user.businessCategory,
        businessDescription: user.businessDescription,
        vendorTagline: user.vendorTagline,
        vendorLocation: user.vendorLocation,
        image: user.image,
        vendorBannerUrl: user.vendorBannerUrl,
        vendorExpertise: user.vendorExpertise,
        vendorFocus: user.vendorFocus,
        vendorExperience: user.vendorExperience,
      })
      .from(user)
      .where(eq(user.id, vendorId))
      .limit(1)

    const c = counts[0] ?? { total: 0, upcoming: 0, past: 0 }
    return {
      totalEvents: c.total,
      upcomingEvents: c.upcoming,
      pastEvents: c.past,
      profileCompletion: profileCompletion(profileRow[0] ?? {}),
    }
  }),

  upcomingEvents: vendorProcedure.query(async ({ ctx }) => {
    const vendorId = ctx.session.user.id
    const today = new Date().toISOString().slice(0, 10)

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
      .where(
        and(
          eq(eventVendors.vendorId, vendorId),
          sql`COALESCE(${events.endDate}, ${events.eventDate}) >= ${today}`
        )
      )
      .orderBy(asc(events.eventDate))
      .limit(4)

    return rows
  }),
})

export type VendorDashboardRouter = typeof vendorDashboardRouter

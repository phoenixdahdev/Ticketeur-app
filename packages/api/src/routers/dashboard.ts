import { and, desc, eq, sql } from 'drizzle-orm'

import { activityLog, events, ticketTiers } from '@ticketur/db'

import { createTRPCRouter, organizerProcedure } from '../trpc'

export const dashboardRouter = createTRPCRouter({
  stats: organizerProcedure.query(async ({ ctx }) => {
    const organizerId = ctx.session.user.id

    const eventCounts = await ctx.db
      .select({
        total: sql<number>`COUNT(*)::int`,
        published: sql<number>`COUNT(*) FILTER (WHERE ${events.status} = 'upcoming')::int`,
      })
      .from(events)
      .where(eq(events.organizerId, organizerId))

    const ticketTotals = await ctx.db
      .select({
        sold: sql<number>`COALESCE(SUM(${ticketTiers.sold}), 0)::int`,
        revenueMinor: sql<number>`COALESCE(SUM(${ticketTiers.sold} * ${ticketTiers.priceMinor}), 0)::bigint`,
      })
      .from(ticketTiers)
      .innerJoin(events, eq(events.id, ticketTiers.eventId))
      .where(eq(events.organizerId, organizerId))

    const counts = eventCounts[0] ?? { total: 0, published: 0 }
    const tickets = ticketTotals[0] ?? { sold: 0, revenueMinor: 0n }

    return {
      totalEvents: counts.total,
      publishedEvents: counts.published,
      ticketsSold: tickets.sold,
      revenueMinor: Number(tickets.revenueMinor),
    }
  }),

  topEvents: organizerProcedure.query(async ({ ctx }) => {
    const organizerId = ctx.session.user.id

    const soldExpr = sql<number>`COALESCE(SUM(${ticketTiers.sold}), 0)::int`.as('sold')
    const totalExpr = sql<number>`COALESCE(SUM(${ticketTiers.quantity}), 0)::int`.as('total')

    const rows = await ctx.db
      .select({
        id: events.id,
        title: events.title,
        status: events.status,
        sold: soldExpr,
        total: totalExpr,
      })
      .from(events)
      .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
      .where(eq(events.organizerId, organizerId))
      .groupBy(events.id)
      .orderBy(desc(soldExpr))
      .limit(3)

    return rows
  }),

  recentActivity: organizerProcedure.query(async ({ ctx }) => {
    const organizerId = ctx.session.user.id

    const rows = await ctx.db
      .select({
        id: activityLog.id,
        type: activityLog.type,
        eventId: activityLog.eventId,
        payload: activityLog.payload,
        createdAt: activityLog.createdAt,
      })
      .from(activityLog)
      .where(eq(activityLog.organizerId, organizerId))
      .orderBy(desc(activityLog.createdAt))
      .limit(10)

    return rows
  }),
})

export type DashboardRouter = typeof dashboardRouter

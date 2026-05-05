import { desc, eq, or, sql } from 'drizzle-orm'

import { events, orders, ticketTiers, tickets } from '@ticketur/db'

import { createTRPCRouter, protectedProcedure } from '../../trpc'

export const accountTicketsRouter = createTRPCRouter({
  // Lists every paid order belonging to the signed-in user — matched on
  // either the explicit buyerId or the email captured at checkout (handles
  // guest purchases that auto-link on signup).
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const userEmail = ctx.session.user.email

    const ticketCount =
      sql<number>`(SELECT COUNT(*) FROM ${tickets} WHERE ${tickets.orderId} = ${orders.id})::int`.as(
        'ticket_count'
      )

    const rows = await ctx.db
      .select({
        id: orders.id,
        status: orders.status,
        quantity: orders.quantity,
        subtotalMinor: orders.subtotalMinor,
        feeMinor: orders.feeMinor,
        totalMinor: orders.totalMinor,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
        ticketsPdfUrl: orders.ticketsPdfUrl,
        ticketCount,
        event: {
          id: events.id,
          title: events.title,
          eventDate: events.eventDate,
          endDate: events.endDate,
          eventTime: events.eventTime,
          location: events.location,
          bannerUrl: events.bannerUrl,
          status: events.status,
        },
        tier: {
          id: ticketTiers.id,
          name: ticketTiers.name,
        },
      })
      .from(orders)
      .innerJoin(events, eq(events.id, orders.eventId))
      .innerJoin(ticketTiers, eq(ticketTiers.id, orders.tierId))
      .where(or(eq(orders.buyerId, userId), eq(orders.buyerEmail, userEmail)))
      .orderBy(desc(orders.createdAt))

    return rows
  }),
})

export type AccountTicketsRouter = typeof accountTicketsRouter

import { and, eq, sql } from 'drizzle-orm'

import { db, events, orders, ticketTiers, tickets } from '@ticketur/db'

// PDF generation lives in the api package so both the FW webhook (paid) and
// the public.checkout.start mutation (free) can reach it.
export {
  generateAndStoreTicketsPdf,
  ticketUrl,
} from '@ticketur/api/lib/tickets-pdf'

export type OrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof loadOrderById>>
>

export async function loadOrderById(orderId: string) {
  const rows = await db
    .select({
      order: orders,
      event: events,
      tier: ticketTiers,
    })
    .from(orders)
    .innerJoin(events, eq(events.id, orders.eventId))
    .innerJoin(ticketTiers, eq(ticketTiers.id, orders.tierId))
    .where(eq(orders.id, orderId))
    .limit(1)
  return rows[0] ?? null
}

export async function loadTicketsForOrder(orderId: string) {
  return db
    .select()
    .from(tickets)
    .where(eq(tickets.orderId, orderId))
    .orderBy(tickets.createdAt)
}

// Idempotent: if tickets already exist for this order it's a no-op.
// Increments tier.sold by quantity in the same call.
export async function fulfillOrder({
  orderId,
  flwTransactionId,
}: {
  orderId: string
  flwTransactionId?: string | null
}) {
  return db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)
    if (!order) return null

    if (order.status === 'paid') {
      // Already fulfilled — no-op (webhook + return page can both arrive)
      return order
    }

    // Bump tier.sold and confirm we still have stock.
    const updated = await tx
      .update(ticketTiers)
      .set({ sold: sql`${ticketTiers.sold} + ${order.quantity}` })
      .where(
        and(
          eq(ticketTiers.id, order.tierId),
          sql`${ticketTiers.sold} + ${order.quantity} <= ${ticketTiers.quantity}`
        )
      )
      .returning({ id: ticketTiers.id })

    if (updated.length === 0) {
      // Stock disappeared between checkout and fulfillment. Mark failed.
      await tx
        .update(orders)
        .set({ status: 'failed' })
        .where(eq(orders.id, order.id))
      throw new Error('Stock no longer available for this tier')
    }

    // One ticket row per unit purchased.
    const ticketRows = Array.from({ length: order.quantity }).map(() => ({
      id: `tkt_${crypto.randomUUID()}`,
      orderId: order.id,
      eventId: order.eventId,
      tierId: order.tierId,
      code: crypto.randomUUID().replace(/-/g, ''),
    }))
    if (ticketRows.length > 0) {
      await tx.insert(tickets).values(ticketRows)
    }

    await tx
      .update(orders)
      .set({
        status: 'paid',
        paidAt: new Date(),
        flwTransactionId: flwTransactionId ?? order.flwTransactionId ?? null,
      })
      .where(eq(orders.id, order.id))

    return { ...order, status: 'paid' as const }
  })
}

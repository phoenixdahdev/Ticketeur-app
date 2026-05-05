import { and, eq, sql } from 'drizzle-orm'
import { tasks } from '@trigger.dev/sdk'

import { db, events, orders, ticketTiers, tickets } from '@ticketur/db'

import { formatEventDate } from '@/lib/event-display'

// PDF generation lives in the api package so both the FW webhook (paid) and
// the public.checkout.start mutation (free) can reach it.
export {
  generateAndStoreTicketsPdf,
  ticketUrl,
} from '@ticketur/api/lib/tickets-pdf'

import { generateAndStoreTicketsPdf as _genPdf } from '@ticketur/api/lib/tickets-pdf'

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
//
// Returns `justFulfilled: true` only when this call did the pending→paid
// transition. Side-effect callers (email, PDF) should gate on that flag so
// the work runs exactly once even when the FW webhook + return page both
// race in to fulfill.
export async function fulfillOrder({
  orderId,
  flwTransactionId,
}: {
  orderId: string
  flwTransactionId?: string | null
}): Promise<{
  order: typeof orders.$inferSelect
  justFulfilled: boolean
} | null> {
  return db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)
    if (!order) return null

    if (order.status === 'paid') {
      // Already fulfilled — no-op (webhook + return page can both arrive)
      return { order, justFulfilled: false }
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

    const paidAt = new Date()
    await tx
      .update(orders)
      .set({
        status: 'paid',
        paidAt,
        flwTransactionId: flwTransactionId ?? order.flwTransactionId ?? null,
      })
      .where(eq(orders.id, order.id))

    return {
      order: {
        ...order,
        status: 'paid' as const,
        paidAt,
        flwTransactionId:
          flwTransactionId ?? order.flwTransactionId ?? null,
      },
      justFulfilled: true,
    }
  })
}

/**
 * Generate the PDF + dispatch the confirmation email for a paid order.
 * Both the FW webhook and the /checkout/return page call this — guarded
 * by `justFulfilled` from `fulfillOrder` so it runs exactly once.
 */
export async function notifyOrderFulfilled({
  orderId,
  baseUrl,
}: {
  orderId: string
  baseUrl: string
}) {
  const head = await loadOrderById(orderId)
  if (!head) return

  let pdfUrl: string | null = null
  try {
    pdfUrl = await _genPdf({ orderId, baseUrl })
  } catch (err) {
    console.error('PDF generation failed', err)
  }

  const firstName =
    (head.order.buyerName || head.order.buyerEmail || 'there').split(' ')[0] ??
    'there'

  void tasks.trigger('send-ticket-confirmation', {
    email: head.order.buyerEmail,
    firstName,
    eventTitle: head.event.title,
    eventDate: formatEventDate(head.event.eventDate, head.event.endDate),
    eventTime: head.event.eventTime,
    eventLocation: head.event.location,
    ticketTier: head.tier.name,
    quantity: head.order.quantity,
    ticketsUrl: `${baseUrl}/tickets/${head.order.id}`,
    pdfUrl: pdfUrl ?? undefined,
    pdfFilename: pdfUrl ? `${head.event.title}-tickets.pdf` : undefined,
  })
}

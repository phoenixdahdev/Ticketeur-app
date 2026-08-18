import { randomUUID } from 'node:crypto'

import { and, asc, eq, sql } from 'drizzle-orm'
import { tasks } from '@trigger.dev/sdk'

import {
  db,
  events,
  orderItems,
  orders,
  ticketTiers,
  tickets,
} from '@ticketur/db'

import { formatEventDateRange } from './dates'
import { generateAndStoreTicketsPdf, ticketUrl } from './tickets-pdf'

// Re-exported so callers get the whole order/fulfillment surface from one
// module (the PDF helpers live in tickets-pdf for import-cycle reasons).
export { generateAndStoreTicketsPdf, ticketUrl }

// The tier ran out of stock between checkout and minting. Thrown by
// mintOrderTickets so each caller can react in its own way (checkout surfaces
// a CONFLICT to the buyer; fulfillment marks the order failed).
export class TicketStockError extends Error {
  constructor(public readonly tierName?: string) {
    super('Ticket stock no longer available')
    this.name = 'TicketStockError'
  }
}

// The tx handle drizzle hands to `db.transaction(async (tx) => …)`.
type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

// The one guarded ticket-minting path, shared by the free checkout flow and
// paid fulfillment. For each line it bumps tier.sold with a conditional update
// (`sold + qty <= quantity`) so two concurrent claims can't oversell — a zero-
// row result means the tier just sold out — then mints one ticket row per unit.
// Must run inside a transaction so the sold-bump and the ticket rows commit
// together with the caller's other writes.
export async function mintOrderTickets(
  tx: DbTransaction,
  args: {
    orderId: string
    eventId: string
    lines: { tierId: string; quantity: number; tierName?: string }[]
  }
): Promise<void> {
  const ticketRows: {
    id: string
    orderId: string
    eventId: string
    tierId: string
    code: string
  }[] = []

  for (const line of args.lines) {
    const updated = await tx
      .update(ticketTiers)
      .set({ sold: sql`${ticketTiers.sold} + ${line.quantity}` })
      .where(
        and(
          eq(ticketTiers.id, line.tierId),
          sql`${ticketTiers.sold} + ${line.quantity} <= ${ticketTiers.quantity}`
        )
      )
      .returning({ id: ticketTiers.id })
    if (updated.length === 0) {
      throw new TicketStockError(line.tierName)
    }
    for (let i = 0; i < line.quantity; i += 1) {
      ticketRows.push({
        id: `tkt_${randomUUID()}`,
        orderId: args.orderId,
        eventId: args.eventId,
        tierId: line.tierId,
        code: randomUUID().replace(/-/g, ''),
      })
    }
  }

  if (ticketRows.length > 0) {
    await tx.insert(tickets).values(ticketRows)
  }
}

export type OrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof loadOrderById>>
>

export async function loadOrderById(orderId: string) {
  const rows = await db
    .select({
      order: orders,
      event: events,
    })
    .from(orders)
    .innerJoin(events, eq(events.id, orders.eventId))
    .where(eq(orders.id, orderId))
    .limit(1)
  return rows[0] ?? null
}

// Line items for an order — one row per tier, cheapest first for stable
// display. Each line snapshots the tier name + unit price at purchase time.
export async function loadOrderItems(orderId: string) {
  return db
    .select({
      id: orderItems.id,
      tierId: orderItems.tierId,
      tierName: orderItems.tierName,
      unitPriceMinor: orderItems.unitPriceMinor,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .orderBy(asc(orderItems.unitPriceMinor))
}

export type OrderItemRow = Awaited<ReturnType<typeof loadOrderItems>>[number]

// Tickets for an order, each carrying its own tier name (an order can span
// several tiers, so a single tier lookup per order is no longer correct).
export async function loadTicketsForOrder(orderId: string) {
  return db
    .select({
      id: tickets.id,
      orderId: tickets.orderId,
      eventId: tickets.eventId,
      tierId: tickets.tierId,
      tierName: ticketTiers.name,
      code: tickets.code,
      checkedIn: tickets.checkedIn,
      checkedInAt: tickets.checkedInAt,
      createdAt: tickets.createdAt,
    })
    .from(tickets)
    .leftJoin(ticketTiers, eq(ticketTiers.id, tickets.tierId))
    .where(eq(tickets.orderId, orderId))
    .orderBy(tickets.createdAt)
}

// Idempotent: if the order is already paid it's a no-op.
// Bumps tier.sold per line and mints tickets per line in the same call.
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

    const items = await tx
      .select({
        tierId: orderItems.tierId,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))

    try {
      await mintOrderTickets(tx, {
        orderId: order.id,
        eventId: order.eventId,
        lines: items,
      })
    } catch (err) {
      if (err instanceof TicketStockError) {
        // Stock disappeared between checkout and fulfillment. Mark failed.
        await tx
          .update(orders)
          .set({ status: 'failed' })
          .where(eq(orders.id, order.id))
        throw new Error(
          'Stock no longer available for one of the selected tiers'
        )
      }
      throw err
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
        flwTransactionId: flwTransactionId ?? order.flwTransactionId ?? null,
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

  const items = await loadOrderItems(orderId)

  let pdfUrl: string | null = null
  try {
    pdfUrl = await generateAndStoreTicketsPdf({ orderId, baseUrl })
  } catch (err) {
    console.error('PDF generation failed', err)
  }

  const firstName =
    (head.order.buyerName || head.order.buyerEmail || 'there').split(' ')[0] ??
    'there'
  // "2× VIP, 1× General" — summary for the subject/fallback field.
  const summaryLabel = items
    .map((i) => `${i.quantity}× ${i.tierName}`)
    .join(', ')

  void tasks.trigger('send-ticket-confirmation', {
    email: head.order.buyerEmail,
    firstName,
    eventTitle: head.event.title,
    eventDate: formatEventDateRange(head.event.eventDate, head.event.endDate),
    eventTime: head.event.eventTime,
    eventLocation: head.event.location,
    ticketTier: summaryLabel || 'Ticket',
    items: items.map((i) => ({ tierName: i.tierName, quantity: i.quantity })),
    quantity: head.order.quantity,
    ticketsUrl: `${baseUrl}/tickets/${head.order.id}`,
    pdfUrl: pdfUrl ?? undefined,
    pdfFilename: pdfUrl ? `${head.event.title}-tickets.pdf` : undefined,
  })
}

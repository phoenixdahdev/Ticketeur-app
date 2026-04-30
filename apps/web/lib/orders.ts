import { put } from '@vercel/blob'
import { and, eq, sql } from 'drizzle-orm'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

import { db, events, orders, ticketTiers, tickets } from '@ticketur/db'

import { formatEventDate } from '@/lib/event-display'

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

export function ticketUrl(baseUrl: string, code: string) {
  return `${baseUrl}/tickets/code/${code}`
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

export async function generateAndStoreTicketsPdf({
  orderId,
  baseUrl,
}: {
  orderId: string
  baseUrl: string
}): Promise<string | null> {
  const head = await loadOrderById(orderId)
  if (!head) return null
  const ticketRows = await loadTicketsForOrder(orderId)
  if (ticketRows.length === 0) return null

  const pdf = await renderTicketsPdf({
    orderId,
    eventTitle: head.event.title,
    eventDate: formatEventDate(head.event.eventDate),
    eventTime: head.event.eventTime,
    eventLocation: head.event.location,
    tierName: head.tier.name,
    buyerName: head.order.buyerName || 'Guest',
    tickets: ticketRows.map((t) => ({
      code: t.code,
      url: ticketUrl(baseUrl, t.code),
    })),
  })

  const blob = await put(
    `tickets/${orderId}.pdf`,
    pdf,
    { access: 'public', contentType: 'application/pdf', allowOverwrite: true }
  )

  await db
    .update(orders)
    .set({ ticketsPdfUrl: blob.url })
    .where(eq(orders.id, orderId))

  return blob.url
}

async function renderTicketsPdf(input: {
  orderId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  tierName: string
  buyerName: string
  tickets: { code: string; url: string }[]
}): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 48 })
  const chunks: Buffer[] = []
  doc.on('data', (chunk) => chunks.push(chunk as Buffer))
  const done = new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  )

  for (let i = 0; i < input.tickets.length; i += 1) {
    const ticket = input.tickets[i]!
    if (i > 0) doc.addPage()

    doc
      .fontSize(20)
      .fillColor('#7433FF')
      .text('Ticketeur', { continued: false })
    doc.moveDown(0.3)
    doc.fontSize(28).fillColor('#0F0F12').text(input.eventTitle)
    doc.moveDown(0.5)

    doc.fontSize(12).fillColor('#4B4B57')
    doc.text(`${input.eventDate}  •  ${input.eventTime}`)
    doc.text(input.eventLocation)
    doc.moveDown(1)

    const qrPng = await QRCode.toBuffer(ticket.url, {
      width: 320,
      margin: 1,
    })
    doc.image(qrPng, { fit: [240, 240], align: 'center' })

    doc.moveDown(1)
    doc.fontSize(10).fillColor('#6b7280')
    doc.text(`Ticket ${i + 1} of ${input.tickets.length}`, { align: 'center' })
    doc.text(`Tier: ${input.tierName}`, { align: 'center' })
    doc.text(`Holder: ${input.buyerName}`, { align: 'center' })
    doc.text(`Code: ${ticket.code}`, { align: 'center' })
  }

  doc.end()
  return done
}

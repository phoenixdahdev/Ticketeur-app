import { put } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

import { formatEventDateRange } from './dates'

import { db, events, orders, ticketTiers, tickets } from '@ticketur/db'

export function ticketUrl(baseUrl: string, code: string) {
  return `${baseUrl}/tickets/code/${code}`
}

// Generate a tickets PDF and store it on blob storage.
//
// Without `recipientEmail` this renders every ticket on the order (the "For
// Myself" case) and records the URL on orders.ticketsPdfUrl. With it, the PDF
// is scoped to one attendee's tickets (the "For Multiple" case, where each
// recipient is emailed their own PDF) and stored under a per-recipient key,
// leaving orders.ticketsPdfUrl for the buyer-facing combined copy.
export async function generateAndStoreTicketsPdf({
  orderId,
  baseUrl,
  recipientEmail,
}: {
  orderId: string
  baseUrl: string
  recipientEmail?: string
}): Promise<string | null> {
  const [head] = await db
    .select({
      order: orders,
      event: events,
    })
    .from(orders)
    .innerJoin(events, eq(events.id, orders.eventId))
    .where(eq(orders.id, orderId))
    .limit(1)
  if (!head) return null

  // Each ticket carries its own tier (an order can span several tiers), so we
  // resolve the tier per ticket rather than once for the whole order.
  const ticketRows = await db
    .select({
      id: tickets.id,
      code: tickets.code,
      createdAt: tickets.createdAt,
      tierName: ticketTiers.name,
      recipientName: tickets.recipientName,
    })
    .from(tickets)
    .leftJoin(ticketTiers, eq(ticketTiers.id, tickets.tierId))
    .where(
      recipientEmail
        ? and(
            eq(tickets.orderId, orderId),
            eq(tickets.recipientEmail, recipientEmail)
          )
        : eq(tickets.orderId, orderId)
    )
    .orderBy(tickets.createdAt)
  if (ticketRows.length === 0) return null

  const pdf = await renderTicketsPdf({
    eventTitle: head.event.title,
    eventDate: formatEventDateRange(head.event.eventDate, head.event.endDate, {
      weekday: true,
    }),
    eventTime: head.event.eventTime,
    eventLocation: head.event.location,
    tickets: ticketRows.map((t) => ({
      code: t.code,
      url: ticketUrl(baseUrl, t.code),
      tierName: t.tierName ?? 'General',
      holderName: t.recipientName || head.order.buyerName || 'Guest',
    })),
  })

  const key = recipientEmail
    ? `tickets/${orderId}/${recipientEmail.replace(/[^a-z0-9]+/gi, '-')}.pdf`
    : `tickets/${orderId}.pdf`
  const blob = await put(key, pdf, {
    access: 'public',
    contentType: 'application/pdf',
    allowOverwrite: true,
  })

  // Only the combined (buyer) PDF is recorded on the order.
  if (!recipientEmail) {
    await db
      .update(orders)
      .set({ ticketsPdfUrl: blob.url })
      .where(eq(orders.id, orderId))
  }

  return blob.url
}

async function renderTicketsPdf(input: {
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  tickets: {
    code: string
    url: string
    tierName: string
    holderName: string
  }[]
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

    doc.fontSize(20).fillColor('#7433FF').text('Ticketeur')
    doc.moveDown(0.3)
    doc.fontSize(28).fillColor('#0F0F12').text(input.eventTitle)
    doc.moveDown(0.5)

    doc.fontSize(12).fillColor('#4B4B57')
    doc.text(`${input.eventDate}  •  ${input.eventTime}`)
    doc.text(input.eventLocation)
    doc.moveDown(1)

    const qrPng = await QRCode.toBuffer(ticket.url, { width: 320, margin: 1 })
    doc.image(qrPng, { fit: [240, 240], align: 'center' })

    doc.moveDown(1)
    doc.fontSize(10).fillColor('#6b7280')
    doc.text(`Ticket ${i + 1} of ${input.tickets.length}`, { align: 'center' })
    doc.text(`Tier: ${ticket.tierName}`, { align: 'center' })
    doc.text(`Holder: ${ticket.holderName}`, { align: 'center' })
    doc.text(`Code: ${ticket.code}`, { align: 'center' })
  }

  doc.end()
  return done
}

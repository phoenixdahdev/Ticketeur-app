import { put } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

import { db, events, orders, ticketTiers, tickets } from '@ticketur/db'

export function ticketUrl(baseUrl: string, code: string) {
  return `${baseUrl}/tickets/code/${code}`
}

export async function generateAndStoreTicketsPdf({
  orderId,
  baseUrl,
}: {
  orderId: string
  baseUrl: string
}): Promise<string | null> {
  const [head] = await db
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
  if (!head) return null

  const ticketRows = await db
    .select()
    .from(tickets)
    .where(eq(tickets.orderId, orderId))
    .orderBy(tickets.createdAt)
  if (ticketRows.length === 0) return null

  const pdf = await renderTicketsPdf({
    eventTitle: head.event.title,
    eventDate: formatDate(head.event.eventDate),
    eventTime: head.event.eventTime,
    eventLocation: head.event.location,
    tierName: head.tier.name,
    buyerName: head.order.buyerName || 'Guest',
    tickets: ticketRows.map((t) => ({
      code: t.code,
      url: ticketUrl(baseUrl, t.code),
    })),
  })

  const blob = await put(`tickets/${orderId}.pdf`, pdf, {
    access: 'public',
    contentType: 'application/pdf',
    allowOverwrite: true,
  })

  await db
    .update(orders)
    .set({ ticketsPdfUrl: blob.url })
    .where(eq(orders.id, orderId))

  return blob.url
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

async function renderTicketsPdf(input: {
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
    doc.text(`Tier: ${input.tierName}`, { align: 'center' })
    doc.text(`Holder: ${input.buyerName}`, { align: 'center' })
    doc.text(`Code: ${ticket.code}`, { align: 'center' })
  }

  doc.end()
  return done
}

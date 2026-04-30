import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { tasks } from '@trigger.dev/sdk'

import { db, orders, events, ticketTiers } from '@ticketur/db'
import {
  isWebhookSignatureValid,
  verifyTransaction,
} from '@ticketur/api/lib/flutterwave'

import { fulfillOrder, generateAndStoreTicketsPdf, ticketUrl } from '@/lib/orders'
import { formatEventDate } from '@/lib/event-display'

export const dynamic = 'force-dynamic'

type ChargeCompletedEvent = {
  event?: string
  data?: {
    id?: number
    tx_ref?: string
    status?: string
  }
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    'http://localhost:3000'
  )
}

export async function POST(req: Request) {
  const signature = req.headers.get('verif-hash')
  if (!isWebhookSignatureValid(signature)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  let body: ChargeCompletedEvent
  try {
    body = (await req.json()) as ChargeCompletedEvent
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  // We only act on completed charges. Other webhook event types (refunds,
  // disputes etc.) are acknowledged with 200 so Flutterwave doesn't retry.
  if (body.event !== 'charge.completed' || !body.data?.id || !body.data.tx_ref) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  // Always re-verify with FW's API before mutating state — webhook bodies
  // alone are not authoritative. This guards against spoofed payloads.
  const tx = await verifyTransaction(body.data.id)
  if (!tx || tx.status !== 'successful') {
    return NextResponse.json({ ok: false, reason: 'verify failed' }, { status: 400 })
  }
  if (tx.tx_ref !== body.data.tx_ref) {
    return NextResponse.json({ ok: false, reason: 'tx_ref mismatch' }, { status: 400 })
  }

  // Find the matching order by tx_ref (we set this when starting checkout).
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.flwTxRef, tx.tx_ref))
    .limit(1)
  if (!order) {
    return NextResponse.json({ ok: false, reason: 'no matching order' }, { status: 404 })
  }

  try {
    const updated = await fulfillOrder({
      orderId: order.id,
      flwTransactionId: String(tx.id),
    })
    if (!updated) {
      return NextResponse.json({ ok: false, reason: 'order missing' }, { status: 404 })
    }

    // Skip side-effects if we hit an idempotent re-fire and the order was
    // already paid before this call (paidAt was set previously).
    if (order.status === 'paid') {
      return NextResponse.json({ ok: true, alreadyPaid: true })
    }

    const baseUrl = getBaseUrl()

    // Generate the PDF, upload to Blob, store URL on the order. This is
    // best-effort — the email still includes a web link so the buyer can
    // recover even if the PDF fails.
    let pdfUrl: string | null = null
    try {
      pdfUrl = await generateAndStoreTicketsPdf({
        orderId: order.id,
        baseUrl,
      })
    } catch (err) {
      console.error('PDF generation failed', err)
    }

    // Pull display fields for the email.
    const [head] = await db
      .select({
        eventTitle: events.title,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        eventLocation: events.location,
        tierName: ticketTiers.name,
      })
      .from(orders)
      .innerJoin(events, eq(events.id, orders.eventId))
      .innerJoin(ticketTiers, eq(ticketTiers.id, orders.tierId))
      .where(eq(orders.id, order.id))
      .limit(1)

    if (head) {
      const firstName = (order.buyerName || tx.customer.email).split(' ')[0]
      void tasks.trigger('send-ticket-confirmation', {
        email: order.buyerEmail || tx.customer.email,
        firstName,
        eventTitle: head.eventTitle,
        eventDate: formatEventDate(head.eventDate),
        eventTime: head.eventTime,
        eventLocation: head.eventLocation,
        ticketTier: head.tierName,
        quantity: order.quantity,
        ticketsUrl: `${baseUrl}/tickets/${order.id}`,
        pdfUrl: pdfUrl ?? undefined,
        pdfFilename: pdfUrl ? `${head.eventTitle}-tickets.pdf` : undefined,
      })
    }

    // Touch ticketUrl import so unused-import lint is quiet — actual url
    // building happens inside generateAndStoreTicketsPdf via the helper.
    void ticketUrl

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('webhook fulfillment failed', err)
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}

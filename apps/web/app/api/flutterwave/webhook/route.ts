import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db, orders } from '@ticketur/db'
import {
  isWebhookSignatureValid,
  verifyTransaction,
} from '@ticketur/api/lib/flutterwave'

import { fulfillOrder, notifyOrderFulfilled } from '@/lib/orders'

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
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.flwTxRef, tx.tx_ref))
    .limit(1)
  if (!order) {
    return NextResponse.json({ ok: false, reason: 'no matching order' }, { status: 404 })
  }

  try {
    const result = await fulfillOrder({
      orderId: order.id,
      flwTransactionId: String(tx.id),
    })
    if (!result) {
      return NextResponse.json({ ok: false, reason: 'order missing' }, { status: 404 })
    }

    // Email + PDF only when this call did the pending→paid transition.
    // The /checkout/return page may have already fulfilled the order if the
    // customer beat the webhook back to our domain.
    if (result.justFulfilled) {
      await notifyOrderFulfilled({ orderId: order.id, baseUrl: getBaseUrl() })
    }

    return NextResponse.json({
      ok: true,
      alreadyFulfilled: !result.justFulfilled,
    })
  } catch (err) {
    console.error('webhook fulfillment failed', err)
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}

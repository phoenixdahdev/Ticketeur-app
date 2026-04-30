import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { Button } from '@ticketur/ui/components/button'
import { db, orders } from '@ticketur/db'
import { verifyTransaction } from '@ticketur/api/lib/flutterwave'

import { fulfillOrder, notifyOrderFulfilled } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Checkout',
}

type SP = Promise<{
  status?: string | string[]
  tx_ref?: string | string[]
  transaction_id?: string | string[]
}>

function pickFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: SP
}) {
  const sp = await searchParams
  const status = pickFirst(sp.status)
  const txRef = pickFirst(sp.tx_ref)
  const transactionId = pickFirst(sp.transaction_id)

  // Customer cancelled or payment failed at FW. Surface a recoverable
  // message and let them try again from the event page.
  if (status === 'cancelled' || status === 'failed' || !txRef) {
    return (
      <FailedScreen reason={status === 'cancelled' ? 'cancelled' : 'failed'} />
    )
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.flwTxRef, txRef))
    .limit(1)
  if (!order) return <FailedScreen reason="missing" />

  // Belt-and-braces: the webhook should have already fulfilled this order,
  // but in case the user beat the webhook back to our domain we re-verify
  // and fulfill ourselves. Idempotent inside the helper — only the path
  // that did the pending→paid transition fires the email + PDF.
  if (order.status !== 'paid' && transactionId) {
    const tx = await verifyTransaction(transactionId)
    if (tx && tx.status === 'successful' && tx.tx_ref === txRef) {
      try {
        const result = await fulfillOrder({
          orderId: order.id,
          flwTransactionId: String(tx.id),
        })
        if (result?.justFulfilled) {
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ??
            process.env.BETTER_AUTH_URL ??
            'http://localhost:3000'
          await notifyOrderFulfilled({ orderId: order.id, baseUrl })
        }
      } catch {
        // fall through — show pending screen
      }
    }
  }

  redirect(`/tickets/${order.id}`)
}

function FailedScreen({ reason }: { reason: 'cancelled' | 'failed' | 'missing' }) {
  const message =
    reason === 'cancelled'
      ? 'Looks like you cancelled the payment. No charge was made.'
      : reason === 'missing'
        ? "We couldn't find that order — the link may have expired."
        : 'Your payment did not go through. Please try again or use a different card.'
  return (
    <section className="mx-auto flex w-full max-w-180 flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
      <p className="text-destructive text-xs font-bold tracking-[0.2em] uppercase">
        Payment {reason === 'cancelled' ? 'cancelled' : 'incomplete'}
      </p>
      <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-4xl">
        {reason === 'cancelled'
          ? 'No problem, we held nothing'
          : "We couldn't complete your purchase"}
      </h1>
      <p className="text-muted-foreground text-sm leading-7">{message}</p>
      <Button asChild size="xl">
        <Link href="/events">Browse events</Link>
      </Button>
    </section>
  )
}

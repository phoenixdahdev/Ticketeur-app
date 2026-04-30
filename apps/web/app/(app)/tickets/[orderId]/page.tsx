import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode'

import { Button } from '@ticketur/ui/components/button'

import {
  loadOrderById,
  loadTicketsForOrder,
  ticketUrl,
} from '@/lib/orders'
import { formatEventDate } from '@/lib/event-display'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your tickets',
  description: 'View and present your Ticketeur event tickets.',
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    'http://localhost:3000'
  )
}

export default async function OrderTicketsPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const head = await loadOrderById(orderId)
  if (!head) notFound()

  if (head.order.status !== 'paid') {
    return (
      <section className="mx-auto flex w-full max-w-180 flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
        <p className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
          Awaiting payment
        </p>
        <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          We haven&apos;t confirmed this purchase yet
        </h1>
        <p className="text-muted-foreground text-sm leading-7">
          If you just paid, please give it a moment and refresh. If the
          problem persists, contact support.
        </p>
        <Button asChild size="xl">
          <Link href={`/events/${head.event.id}`}>Back to event</Link>
        </Button>
      </section>
    )
  }

  const ticketRows = await loadTicketsForOrder(orderId)
  const baseUrl = getBaseUrl()
  const qrs = await Promise.all(
    ticketRows.map(async (t) => ({
      id: t.id,
      code: t.code,
      dataUrl: await QRCode.toDataURL(ticketUrl(baseUrl, t.code), {
        width: 320,
        margin: 1,
      }),
    }))
  )

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-10 md:px-10 md:py-16">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          Confirmed
        </p>
        <h1 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-4xl">
          {head.event.title}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {formatEventDate(head.event.eventDate)} · {head.event.eventTime}
        </p>
        <p className="text-muted-foreground text-sm">
          {head.event.location}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 text-center md:flex-row md:justify-center">
        {head.order.ticketsPdfUrl ? (
          <Button asChild size="xl">
            <a href={head.order.ticketsPdfUrl} target="_blank" rel="noreferrer">
              Download PDF
            </a>
          </Button>
        ) : null}
        <Button asChild size="xl" variant="outline">
          <Link href={`/events/${head.event.id}`}>Event details</Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {qrs.map((t, idx) => (
          <article
            key={t.id}
            className="border-border bg-card flex flex-col items-center gap-4 rounded-2xl border p-6 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.dataUrl}
              alt={`Ticket ${idx + 1} QR`}
              className="size-56"
            />
            <div className="flex flex-col items-center gap-1">
              <p className="text-foreground text-sm font-bold">
                Ticket {idx + 1} of {qrs.length}
              </p>
              <p className="text-muted-foreground text-xs">
                {head.tier.name}
              </p>
              <p className="text-muted-foreground font-mono text-[10px]">
                {t.code}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import { getBaseUrl } from '@ticketur/api/lib/base-url'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { eq } from 'drizzle-orm'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { db, tickets } from '@ticketur/db'
import {
  loadOrderById,
  loadTicketsForOrder,
  ticketUrl,
} from '@ticketur/api/lib/orders'

import { formatEventDate } from '@/lib/event-display'
import { TicketStub } from '@/components/sections/tickets/ticket-stub'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your ticket',
  description: 'View and present your Ticketeur event ticket.',
}

// Per-ticket landing — the URL encoded in each QR code and sent to each
// attendee. It shows only the scanned attendee's ticket(s), never the rest of
// the order (a group attendee must not see other people's tickets or the
// buyer's receipt). The buyer's own confirmation lives at /tickets/[orderId].
export default async function TicketByCodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  const [ticket] = await db
    .select({
      orderId: tickets.orderId,
      recipientEmail: tickets.recipientEmail,
    })
    .from(tickets)
    .where(eq(tickets.code, code))
    .limit(1)
  if (!ticket) notFound()

  const head = await loadOrderById(ticket.orderId)
  if (!head) notFound()

  const all = await loadTicketsForOrder(ticket.orderId)
  // Scope to this recipient's tickets. Tickets with no recipient (legacy / a
  // self order resolved by code) fall back to just the scanned ticket.
  const scoped = ticket.recipientEmail
    ? all.filter((t) => t.recipientEmail === ticket.recipientEmail)
    : all.filter((t) => t.code === code)
  if (scoped.length === 0) notFound()

  const baseUrl = getBaseUrl()
  const qrs = await Promise.all(
    scoped.map(async (t) => ({
      id: t.id,
      code: t.code,
      tierName: t.tierName ?? 'General',
      holderName: t.recipientName || head.order.buyerName || 'Guest',
      dataUrl: await QRCode.toDataURL(ticketUrl(baseUrl, t.code), {
        width: 320,
        margin: 1,
      }),
    }))
  )

  const eventDate = formatEventDate(head.event.eventDate, head.event.endDate)

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 md:gap-8 md:px-10 md:py-12">
      <Link
        href={`/events/${head.event.slug}`}
        className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" strokeWidth={2} />
        Event details
      </Link>

      <article className="border-border bg-card relative isolate flex flex-col overflow-hidden rounded-3xl border shadow-sm">
        <div className="bg-muted relative h-40 w-full md:h-52">
          {head.event.bannerUrl ? (
            <Image
              src={head.event.bannerUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 900px, 100vw"
              className="object-cover"
              unoptimized={head.event.bannerUrl.startsWith('data:')}
            />
          ) : (
            <div className="from-primary/30 via-primary/15 to-background absolute inset-0 bg-linear-to-br" />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"
          />
          <h1 className="font-heading absolute inset-x-5 bottom-5 text-2xl font-bold tracking-tight text-white md:inset-x-7 md:bottom-7 md:text-3xl">
            {head.event.title}
          </h1>
        </div>
        <dl className="border-border/60 divide-border/60 grid grid-cols-1 divide-y border-t md:grid-cols-3 md:divide-x md:divide-y-0">
          <KeyDetail icon={Calendar03Icon} label="Date" value={eventDate} />
          <KeyDetail icon={Clock01Icon} label="Time" value={head.event.eventTime} />
          <KeyDetail icon={Location01Icon} label="Location" value={head.event.location} />
        </dl>
      </article>

      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
            {qrs.length === 1 ? 'Your ticket' : `Your ${qrs.length} tickets`}
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm">
            Show the QR code at the gate
          </p>
        </div>
        <div className="flex flex-col gap-4 md:gap-5">
          {qrs.map((t, idx) => (
            <TicketStub
              key={t.id}
              index={idx}
              total={qrs.length}
              code={t.code}
              qrDataUrl={t.dataUrl}
              tierName={t.tierName}
              holderName={t.holderName}
              eventTitle={head.event.title}
              eventDate={eventDate}
              eventTime={head.event.eventTime}
            />
          ))}
        </div>
      </section>
    </section>
  )
}

function KeyDetail({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]['icon']
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 md:px-6 md:py-5">
      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
        <HugeiconsIcon icon={icon} className="size-4" strokeWidth={1.8} />
      </span>
      <div className={cn('flex min-w-0 flex-col')}>
        <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
          {label}
        </span>
        <span className="text-foreground truncate text-sm font-semibold md:text-base">
          {value}
        </span>
      </div>
    </div>
  )
}

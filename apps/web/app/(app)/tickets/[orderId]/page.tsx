import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download01Icon,
  Location01Icon,
  Mail01Icon,
  ReceiptDollarIcon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import {
  loadOrderById,
  loadTicketsForOrder,
  ticketUrl,
} from '@/lib/orders'
import { formatEventDate, formatNaira } from '@/lib/event-display'

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

function eventStanding(eventDate: string): 'upcoming' | 'today' | 'past' {
  const today = new Date().toISOString().slice(0, 10)
  if (eventDate === today) return 'today'
  if (eventDate < today) return 'past'
  return 'upcoming'
}

function shortCode(code: string): string {
  return code.slice(0, 4).toUpperCase() + ' ' + code.slice(4, 8).toUpperCase()
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
          <Link href={`/events/${head.event.slug}`}>Back to event</Link>
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

  const standing = eventStanding(head.event.eventDate)
  const standingMeta = {
    upcoming: {
      label: 'Confirmed — upcoming',
      tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
    today: {
      label: 'Live today',
      tone: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    },
    past: {
      label: 'Past event',
      tone: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300',
    },
  }[standing]

  const paidAt = head.order.paidAt ?? head.order.createdAt
  const paidWhen = new Date(paidAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 md:gap-8 md:px-10 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/events/${head.event.slug}`}
          className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-4"
            strokeWidth={2}
          />
          Event details
        </Link>
        {head.order.ticketsPdfUrl ? (
          <Button asChild variant="outline" size="default">
            <a
              href={head.order.ticketsPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="gap-2"
            >
              <HugeiconsIcon
                icon={Download01Icon}
                className="size-4"
                strokeWidth={2}
              />
              Download PDF
            </a>
          </Button>
        ) : null}
      </div>

      {/* Event hero — banner + status pill + title + key details */}
      <article className="border-border bg-card relative isolate flex flex-col overflow-hidden rounded-3xl border shadow-sm">
        <div className="bg-muted relative h-44 w-full md:h-56">
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
            <div className="bg-linear-to-br from-primary/30 via-primary/15 to-background absolute inset-0" />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"
          />
          <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2 md:inset-x-7 md:bottom-7">
            <span
              className={cn(
                'inline-flex w-fit items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-700 uppercase shadow-sm',
                standing === 'past' && 'text-zinc-700',
                standing === 'today' && 'text-amber-700'
              )}
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-3.5"
                strokeWidth={2.2}
              />
              {standingMeta.label}
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
              {head.event.title}
            </h1>
          </div>
        </div>

        <dl className="grid grid-cols-1 divide-y border-t md:grid-cols-3 md:divide-x md:divide-y-0 md:border-t border-border/60 divide-border/60">
          <KeyDetail
            icon={Calendar03Icon}
            label="Date"
            value={formatEventDate(head.event.eventDate, head.event.endDate)}
          />
          <KeyDetail
            icon={Clock01Icon}
            label="Time"
            value={head.event.eventTime}
          />
          <KeyDetail
            icon={Location01Icon}
            label="Location"
            value={head.event.location}
          />
        </dl>
      </article>

      {/* Tickets — one styled "ticket stub" per row with perforated edges */}
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
              tierName={head.tier.name}
              holderName={head.order.buyerName || 'Guest'}
              eventTitle={head.event.title}
              eventDate={formatEventDate(head.event.eventDate, head.event.endDate)}
              eventTime={head.event.eventTime}
            />
          ))}
        </div>
      </section>

      {/* Order summary — receipt-like block with subtotal + fee + total */}
      <section
        aria-labelledby="order-summary-heading"
        className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 md:p-6"
      >
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <HugeiconsIcon
              icon={ReceiptDollarIcon}
              className="size-4"
              strokeWidth={1.8}
            />
          </span>
          <h2
            id="order-summary-heading"
            className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg"
          >
            Order summary
          </h2>
        </div>

        <dl className="border-border/60 grid grid-cols-2 gap-y-3 border-t pt-4 text-sm md:grid-cols-3">
          <Definition label="Order ID" value={head.order.id} mono />
          <Definition label="Purchased" value={paidWhen} />
          <Definition label="Tier" value={head.tier.name} />
          <Definition label="Quantity" value={String(head.order.quantity)} />
          <Definition
            label="Buyer"
            value={head.order.buyerName || head.order.buyerEmail}
          />
          <Definition
            label="Email"
            value={head.order.buyerEmail}
            icon={Mail01Icon}
          />
        </dl>

        <div className="border-border/60 flex flex-col gap-1.5 border-t pt-4 text-sm">
          <Row
            label="Subtotal"
            value={formatNaira(head.order.subtotalMinor)}
          />
          {head.order.feeMinor > 0 ? (
            <Row
              label="Service fee"
              value={formatNaira(head.order.feeMinor)}
            />
          ) : null}
          <div className="flex items-baseline justify-between gap-3 pt-1">
            <span className="font-heading text-foreground text-base font-semibold">
              Total paid
            </span>
            <span className="font-heading text-primary text-xl font-bold md:text-2xl">
              {head.order.totalMinor === 0
                ? 'Free'
                : formatNaira(head.order.totalMinor)}
            </span>
          </div>
        </div>
      </section>

      {/* Day-of-event reminders */}
      <aside className="border-primary/20 bg-primary/5 dark:bg-primary/10 flex flex-col gap-2 rounded-2xl border px-5 py-4 text-sm md:flex-row md:items-start md:gap-3 md:px-6">
        <span className="bg-primary text-primary-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-full">
          <HugeiconsIcon
            icon={Ticket01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-foreground font-semibold">On the day of the event</p>
          <p className="text-muted-foreground leading-6">
            Bring a valid ID and have this page (or the PDF) ready to scan at
            the gate. Each QR code is single-entry — keep them for yourself.
          </p>
        </div>
      </aside>
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
      <div className="flex min-w-0 flex-col">
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

function TicketStub({
  index,
  total,
  code,
  qrDataUrl,
  tierName,
  holderName,
  eventTitle,
  eventDate,
  eventTime,
}: {
  index: number
  total: number
  code: string
  qrDataUrl: string
  tierName: string
  holderName: string
  eventTitle: string
  eventDate: string
  eventTime: string
}) {
  return (
    <article className="border-border bg-card relative isolate flex flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      {/* main stub */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {tierName}
            </span>
            <span className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
              {eventTitle}
            </span>
          </div>
          <span className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
            {index + 1} / {total}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Definition label="Holder" value={holderName} />
          <Definition label="Date" value={eventDate} />
          <Definition label="Time" value={eventTime} />
        </div>

        <div className="border-border/60 flex flex-col gap-1 border-t pt-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Ticket code
            </span>
            <span className="text-foreground font-mono text-sm font-bold tracking-widest">
              {shortCode(code)}
            </span>
          </div>
          <p className="text-muted-foreground text-xs md:text-right">
            Single-entry · scan at gate
          </p>
        </div>
      </div>

      {/* perforation */}
      <div
        aria-hidden
        className="border-border/60 relative hidden w-px md:block"
      >
        <div className="bg-background absolute -top-2 -left-2 size-4 rounded-full border" />
        <div className="bg-background absolute -bottom-2 -left-2 size-4 rounded-full border" />
      </div>
      <div
        aria-hidden
        className="border-border/60 relative h-px w-full border-t border-dashed md:hidden"
      >
        <div className="bg-background absolute -top-2 -left-2 size-4 rounded-full border" />
        <div className="bg-background absolute -top-2 -right-2 size-4 rounded-full border" />
      </div>

      {/* QR side */}
      <div className="bg-background flex flex-col items-center justify-center gap-2 px-6 py-5 md:w-56 md:py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`Ticket ${index + 1} QR code`}
          className="size-40 md:size-44"
        />
        <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          Scan to verify
        </p>
      </div>
    </article>
  )
}

function Definition({
  label,
  value,
  mono,
  icon,
}: {
  label: string
  value: string
  mono?: boolean
  icon?: Parameters<typeof HugeiconsIcon>[0]['icon']
}) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </span>
      <span
        className={cn(
          'text-foreground inline-flex items-center gap-1.5 truncate text-sm font-semibold',
          mono && 'font-mono text-xs'
        )}
      >
        {icon ? (
          <HugeiconsIcon icon={icon} className="size-3.5" strokeWidth={1.8} />
        ) : null}
        <span className="truncate">{value}</span>
      </span>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  )
}

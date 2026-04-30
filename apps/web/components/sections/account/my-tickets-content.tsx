'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import type { RouterOutputs } from '@ticketur/api'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download01Icon,
  Location01Icon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import { useTRPC } from '@/lib/trpc'
import { formatEventDate, formatNaira } from '@/lib/event-display'

const PLACEHOLDER = '/hero-bg.png'

type Standing = 'upcoming' | 'today' | 'past'

function eventStanding(eventDate: string): Standing {
  const today = new Date().toISOString().slice(0, 10)
  if (eventDate === today) return 'today'
  if (eventDate < today) return 'past'
  return 'upcoming'
}

const STANDING_TONE: Record<Standing, string> = {
  upcoming:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  today: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  past: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300',
}

const STANDING_LABEL: Record<Standing, string> = {
  upcoming: 'Upcoming',
  today: 'Live today',
  past: 'Past',
}

export function MyTicketsContent() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.account.tickets.list.queryOptions()
  )

  const orders = data ?? []
  const upcoming = orders.filter(
    (o) => eventStanding(o.event.eventDate) !== 'past'
  )
  const past = orders.filter(
    (o) => eventStanding(o.event.eventDate) === 'past'
  )

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8 md:gap-8 md:px-10 md:py-12">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[32px]">
          My tickets
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Every ticket you&apos;ve booked on Ticketeur, ready to scan at the
          gate.
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-36 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {upcoming.length > 0 ? (
            <Group title="Upcoming">
              <div className="flex flex-col gap-4">
                {upcoming.map((order) => (
                  <TicketRow key={order.id} order={order} />
                ))}
              </div>
            </Group>
          ) : null}
          {past.length > 0 ? (
            <Group title="Past">
              <div className="flex flex-col gap-4">
                {past.map((order) => (
                  <TicketRow key={order.id} order={order} />
                ))}
              </div>
            </Group>
          ) : null}
        </>
      )}
    </section>
  )
}

function Group({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

type OrderRow = NonNullable<
  Awaited<
    ReturnType<
      ReturnType<typeof useTRPC>['account']['tickets']['list']['queryOptions']
    >['queryFn']
  >
>[number]

function TicketRow({ order }: { order: OrderRow }) {
  const standing = eventStanding(order.event.eventDate)
  const isPaid = order.status === 'paid'

  return (
    <Link
      href={`/tickets/${order.id}`}
      className={cn(
        'group border-border bg-card hover:border-primary/40 hover:shadow-md focus-visible:ring-primary/40 flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all outline-none focus-visible:ring-2 sm:flex-row',
        !isPaid && 'opacity-70'
      )}
    >
      <div className="bg-muted relative h-36 shrink-0 sm:h-auto sm:w-44">
        <Image
          src={order.event.bannerUrl ?? PLACEHOLDER}
          alt=""
          fill
          sizes="(min-width: 640px) 176px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized={Boolean(order.event.bannerUrl?.startsWith('data:'))}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span
              className={cn(
                'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                STANDING_TONE[standing]
              )}
            >
              {isPaid ? (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="size-3"
                  strokeWidth={2.4}
                />
              ) : null}
              {isPaid ? STANDING_LABEL[standing] : 'Pending payment'}
            </span>
            <h3 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
              {order.event.title}
            </h3>
          </div>
          <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
            <HugeiconsIcon
              icon={Ticket01Icon}
              className="size-3"
              strokeWidth={2}
            />
            {order.ticketCount > 0 ? order.ticketCount : order.quantity} ×{' '}
            {order.tier.name}
          </span>
        </div>

        <ul className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1.5 text-xs sm:text-sm">
          <Meta icon={Calendar03Icon} value={formatEventDate(order.event.eventDate)} />
          <Meta icon={Clock01Icon} value={order.event.eventTime} />
          <Meta icon={Location01Icon} value={order.event.location} />
        </ul>

        <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <span className="text-muted-foreground text-xs">
            {order.totalMinor === 0
              ? 'Free ticket'
              : `Paid ${formatNaira(order.totalMinor)}`}
            {order.paidAt
              ? ` · ${new Date(order.paidAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}`
              : ''}
          </span>
          <div className="flex items-center gap-3">
            {order.ticketsPdfUrl ? (
              <span
                className="text-muted-foreground inline-flex items-center gap-1 text-xs"
                aria-hidden
              >
                <HugeiconsIcon
                  icon={Download01Icon}
                  className="size-3.5"
                  strokeWidth={1.8}
                />
                PDF ready
              </span>
            ) : null}
            <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold transition-colors">
              View ticket
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function Meta({
  icon,
  value,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]['icon']
  value: string
}) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <HugeiconsIcon icon={icon} className="size-3.5" strokeWidth={1.8} />
      {value}
    </li>
  )
}

function EmptyState() {
  return (
    <div className="border-border bg-muted/30 flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-10 text-center">
      <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
        <HugeiconsIcon
          icon={Ticket01Icon}
          className="size-6"
          strokeWidth={1.6}
        />
      </span>
      <h2 className="font-heading text-foreground text-lg font-bold tracking-tight">
        No tickets yet
      </h2>
      <p className="text-muted-foreground max-w-md text-sm leading-6">
        Browse upcoming events and grab a ticket. They&apos;ll show up here so
        you can pull them up at the gate.
      </p>
      <Button asChild size="xl" className="mt-2">
        <Link href="/events">Browse events</Link>
      </Button>
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Input } from '@ticketur/ui/components/input'

import { useTRPC } from '@/lib/trpc'
import { formatEventDate } from '@/lib/event-display'

const TAB_VALUES = ['all', 'upcoming', 'past'] as const
type TabValue = (typeof TAB_VALUES)[number]

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
]

const PAGE_SIZE = 4

type ServerEvent = {
  id: string
  title: string
  eventDate: string
  endDate: string | null
  eventTime: string
  location: string
  bannerUrl: string | null
  status: string
}

type DerivedStatus = 'live' | 'upcoming' | 'past'

const STATUS_LABEL: Record<DerivedStatus, string> = {
  live: '• LIVE',
  upcoming: 'Upcoming',
  past: 'Past',
}

const STATUS_TONE: Record<DerivedStatus, string> = {
  live: 'text-emerald-700 dark:text-emerald-400',
  upcoming: 'text-primary',
  past: 'text-muted-foreground',
}

function deriveStatus(
  eventDate: string,
  endDate: string | null,
  serverStatus: string
): DerivedStatus {
  const today = new Date().toISOString().slice(0, 10)
  const lastDay = endDate ?? eventDate
  // Multi-day events are "live" while today falls inside the run.
  if (today >= eventDate && today <= lastDay) return 'live'
  if (lastDay < today) return 'past'
  if (serverStatus === 'upcoming') return 'upcoming'
  return 'upcoming'
}

export function VendorEventsContent() {
  const trpc = useTRPC()

  const [params, setParams] = useQueryStates(
    {
      tab: parseAsStringLiteral(TAB_VALUES).withDefault('all'),
      q: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  )

  const listQuery = useQuery(
    trpc.vendor.events.list.queryOptions({
      tab: params.tab,
      q: params.q,
      page: params.page,
      pageSize: PAGE_SIZE,
    })
  )

  const data = listQuery.data
  const rows = data?.rows ?? []
  const total = data?.total ?? 0
  const allCount = data?.allCount ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = Math.min(Math.max(params.page, 1), totalPages)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex shrink-0 flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          All Events
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          View all assigned professional engagements.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div
            role="tablist"
            aria-label="Filter events"
            className="border-border/60 -mx-1 flex items-center gap-1 overflow-x-auto border-b px-1 pb-px [scrollbar-width:none] md:flex-1 [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((t) => {
              const active = params.tab === t.value
              const showCount = t.value === 'all'
              return (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => void setParams({ tab: t.value, page: 1 })}
                  className={cn(
                    'relative inline-flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors md:text-base',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t.label}
                  {showCount ? (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {allCount}
                    </span>
                  ) : null}
                  {active ? (
                    <motion.span
                      layoutId="vendor-events-tab-indicator"
                      className="bg-primary absolute right-0 -bottom-px left-0 h-0.5 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
              strokeWidth={1.8}
            />
            <Input
              type="search"
              value={params.q}
              onChange={(e) =>
                void setParams({ q: e.target.value || null, page: 1 })
              }
              placeholder="Search"
              aria-label="Search events"
              className="h-10 w-full pl-9"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {listQuery.isLoading ? (
            <div className="border-border/60 bg-background flex flex-col items-center justify-center gap-2 rounded-2xl border p-10 text-center">
              <p className="text-muted-foreground text-sm">Loading events…</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="border-border/60 bg-background flex flex-col items-center justify-center gap-2 rounded-2xl border p-10 text-center">
              <p className="text-muted-foreground text-sm">
                {params.q || params.tab !== 'all'
                  ? 'No events match your filters.'
                  : 'No events assigned to you yet.'}
              </p>
            </div>
          ) : (
            rows.map((ev) => <VendorEventRow key={ev.id} ev={ev} />)
          )}
        </div>

        <Pagination
          total={total}
          current={current}
          totalPages={totalPages}
          rowCount={rows.length}
          onPage={(p) => void setParams({ page: p })}
        />
      </div>
    </div>
  )
}

function VendorEventRow({ ev }: { ev: ServerEvent }) {
  const status = deriveStatus(ev.eventDate, ev.endDate, ev.status)
  return (
    <article className="border-border/60 bg-background flex flex-col gap-0 overflow-hidden rounded-2xl border shadow-sm shadow-black/[0.02] sm:flex-row sm:items-stretch">
      <div className="bg-muted relative h-32 shrink-0 sm:h-auto sm:w-36">
        <Image
          src={ev.bannerUrl ?? '/hero-bg.png'}
          alt={ev.title}
          fill
          sizes="(min-width: 640px) 144px, 100vw"
          className="object-cover"
          unoptimized={Boolean(ev.bannerUrl?.startsWith('data:'))}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className={cn('text-xs font-bold uppercase', STATUS_TONE[status])}>
              {STATUS_LABEL[status]}
            </span>
            <h3 className="text-foreground text-base font-bold tracking-tight md:text-lg">
              {ev.title}
            </h3>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col gap-1 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Calendar03Icon}
              className="size-3.5"
              strokeWidth={1.8}
            />
            {formatEventDate(ev.eventDate, ev.endDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Clock01Icon}
              className="size-3.5"
              strokeWidth={1.8}
            />
            {ev.eventTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Location01Icon}
              className="size-3.5"
              strokeWidth={1.8}
            />
            {ev.location}
          </span>
        </div>
        <Link
          href={`/vendor/events/${ev.id}`}
          className="text-primary text-xs font-semibold hover:underline sm:text-sm"
        >
          View details
        </Link>
      </div>
    </article>
  )
}

function Pagination({
  total,
  current,
  totalPages,
  rowCount,
  onPage,
}: {
  total: number
  current: number
  totalPages: number
  rowCount: number
  onPage: (page: number) => void
}) {
  const visibleRange = useMemo(() => {
    const max = 3
    if (totalPages <= max) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (current <= 2) return [1, 2, 3]
    if (current >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }
    return [current - 1, current, current + 1]
  }, [current, totalPages])

  return (
    <div className="flex shrink-0 flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
      <p className="text-muted-foreground text-xs sm:text-sm">
        {total === 0
          ? 'No events'
          : `Showing ${rowCount} of ${total} events`}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton
          aria-label="Previous page"
          disabled={current <= 1}
          onClick={() => onPage(current - 1)}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </PageButton>
        {visibleRange.map((p) => (
          <PageButton
            key={p}
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            active={p === current}
            onClick={() => onPage(p)}
          >
            {p}
          </PageButton>
        ))}
        <PageButton
          aria-label="Next page"
          disabled={current >= totalPages}
          onClick={() => onPage(current + 1)}
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </PageButton>
      </nav>
    </div>
  )
}

function PageButton({
  active,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'border-border/60 inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-muted',
        className
      )}
    >
      {children}
    </button>
  )
}

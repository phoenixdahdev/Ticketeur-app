'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreVerticalIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Input } from '@ticketur/ui/components/input'

import {
  listAdminEvents,
  type AdminEventRow,
  type AdminEventStatus,
} from '@/lib/mock-events'
import { formatShortDate as formatDate } from '@/lib/date'

const STATUS_TABS = ['all', 'published', 'archived', 'flagged'] as const
type StatusTab = (typeof STATUS_TABS)[number]

const TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'published', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'flagged', label: 'Flagged' },
]

const SORT_FIELDS = ['date', 'sales', 'name'] as const
type SortField = (typeof SORT_FIELDS)[number]

const DIR_VALUES = ['asc', 'desc'] as const
type SortDir = (typeof DIR_VALUES)[number]

const TOTAL = 24_512

const STATUS_LABEL: Record<AdminEventStatus, string> = {
  published: 'Published',
  archived: 'Archived',
  flagged: 'Flagged',
}

const STATUS_TONE: Record<AdminEventStatus, string> = {
  published: 'text-emerald-600',
  archived: 'bg-muted text-muted-foreground px-2.5 py-1 rounded-md',
  flagged: 'bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md',
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function EventsContent() {
  const [params, setParams] = useQueryStates(
    {
      tab: parseAsStringLiteral(STATUS_TABS).withDefault('all'),
      q: parseAsString.withDefault(''),
      sort: parseAsStringLiteral(SORT_FIELDS).withDefault('date'),
      dir: parseAsStringLiteral(DIR_VALUES).withDefault('desc'),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  )

  const rows = useMemo(() => {
    let list = listAdminEvents()
    if (params.tab !== 'all') {
      list = list.filter((e) => e.status === params.tab)
    }
    if (params.q) {
      const q = params.q.toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organizerName.toLowerCase().includes(q) ||
          e.reference.toLowerCase().includes(q)
      )
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0
      switch (params.sort) {
        case 'date':
          cmp = a.date.localeCompare(b.date)
          break
        case 'name':
          cmp = a.title.localeCompare(b.title)
          break
        case 'sales':
          cmp = a.sold / a.total - b.sold / b.total
          break
      }
      return params.dir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [params.tab, params.q, params.sort, params.dir])

  const totalPages = 3
  const current = Math.min(Math.max(params.page, 1), totalPages)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div
          role="tablist"
          aria-label="Filter events"
          className="border-border/60 -mx-1 flex items-center gap-1 overflow-x-auto border-b px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => {
            const active = params.tab === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => void setParams({ tab: t.value, page: 1 })}
                className={cn(
                  'relative shrink-0 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors md:text-base',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
                {active ? (
                  <motion.span
                    layoutId="admin-events-tab-indicator"
                    className="bg-primary absolute right-0 -bottom-px left-0 h-0.5 rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
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
          <select
            value={`${params.sort}:${params.dir}`}
            onChange={(e) => {
              const [sort, dir] = e.target.value.split(':') as [
                SortField,
                SortDir,
              ]
              void setParams({ sort, dir, page: 1 })
            }}
            aria-label="Sort by"
            className="border-border/60 bg-background text-foreground hover:bg-muted/50 focus-visible:ring-primary/40 inline-flex h-10 items-center rounded-md border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2"
          >
            <option value="date:desc">Sort by — Newest</option>
            <option value="date:asc">Sort by — Oldest</option>
            <option value="name:asc">Sort by — Name (A→Z)</option>
            <option value="sales:desc">Sort by — Sales (high)</option>
            <option value="sales:asc">Sort by — Sales (low)</option>
          </select>
        </div>
      </div>

      <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[860px] table-auto">
            <thead className="bg-primary/5">
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                <th className="px-5 py-4 text-left">Event Name</th>
                <th className="px-5 py-4 text-left">Organizer</th>
                <th className="px-5 py-4 text-left">Date</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Ticket Sales</th>
                <th className="px-5 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      No events match your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => <Row key={row.id} row={row} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        total={TOTAL}
        shown={rows.length}
        current={current}
        totalPages={totalPages}
        onPage={(p) => void setParams({ page: p })}
      />
    </div>
  )
}

function Row({ row }: { row: AdminEventRow }) {
  const pct =
    row.total > 0 ? Math.min(100, Math.round((row.sold / row.total) * 100)) : 0
  return (
    <tr className="hover:bg-muted/40 text-sm transition-colors">
      <td className="px-5 py-4">
        <Link
          href={`/events/${row.id}`}
          className="flex items-center gap-3"
        >
          <Image
            src={row.thumbnailUrl}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-foreground hover:text-primary font-semibold transition-colors">
              {row.title}
            </span>
            <span className="text-muted-foreground text-xs">
              ID: {row.reference}
            </span>
          </div>
        </Link>
      </td>
      <td className="text-foreground px-5 py-4 whitespace-nowrap">
        {row.organizerName}
      </td>
      <td className="text-foreground px-5 py-4 whitespace-nowrap">
        {formatDate(row.date)}
      </td>
      <td className="px-5 py-4">
        <span
          className={cn(
            'inline-flex items-center text-xs font-medium whitespace-nowrap',
            STATUS_TONE[row.status]
          )}
        >
          {STATUS_LABEL[row.status]}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex min-w-[180px] flex-col gap-1.5">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              {formatNumber(row.sold)} / {formatNumber(row.total)} sold
            </span>
            <span className="text-foreground font-semibold">{pct}%</span>
          </div>
          <div className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-foreground absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <button
          type="button"
          aria-label="Row actions"
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
        >
          <HugeiconsIcon
            icon={MoreVerticalIcon}
            className="size-4"
            strokeWidth={1.8}
          />
        </button>
      </td>
    </tr>
  )
}

function Pagination({
  total,
  shown,
  current,
  totalPages,
  onPage,
}: {
  total: number
  shown: number
  current: number
  totalPages: number
  onPage: (page: number) => void
}) {
  const visibleRange = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (current <= 2) return [1, 2, 3]
    if (current >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }
    return [current - 1, current, current + 1]
  }, [current, totalPages])

  return (
    <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
      <p className="text-muted-foreground text-xs sm:text-sm">
        Showing {shown} of {total.toLocaleString('en-US')} events
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
          : 'text-foreground hover:bg-muted'
      )}
    >
      {children}
    </button>
  )
}

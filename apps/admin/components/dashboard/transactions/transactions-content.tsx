'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Input } from '@ticketur/ui/components/input'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'

import { listMockTransactions } from '@/lib/mock-transactions'
import { formatShortDate } from '@/lib/date'

const SORT_FIELDS = ['date', 'amount', 'fee'] as const
type SortField = (typeof SORT_FIELDS)[number]

const DIR_VALUES = ['asc', 'desc'] as const
type SortDir = (typeof DIR_VALUES)[number]

const TOTAL_TXNS = 24_512

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

export function TransactionsContent() {
  const [params, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      sort: parseAsStringLiteral(SORT_FIELDS).withDefault('date'),
      dir: parseAsStringLiteral(DIR_VALUES).withDefault('desc'),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  )

  const rows = useMemo(() => {
    let list = listMockTransactions()
    if (params.q) {
      const q = params.q.toLowerCase()
      list = list.filter(
        (t) =>
          t.attendeeName.toLowerCase().includes(q) ||
          t.eventName.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q)
      )
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0
      switch (params.sort) {
        case 'date':
          cmp = a.date.localeCompare(b.date)
          break
        case 'amount':
          cmp = a.amount - b.amount
          break
        case 'fee':
          cmp = a.fee - b.fee
          break
      }
      return params.dir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [params.q, params.sort, params.dir])

  const totalPages = 3
  const current = Math.min(Math.max(params.page, 1), totalPages)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative w-full">
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
            aria-label="Search transactions"
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
          className="border-border/60 bg-background text-foreground hover:bg-muted/50 focus-visible:ring-primary/40 inline-flex h-10 shrink-0 items-center rounded-md border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 md:w-44"
        >
          <option value="date:desc">Sort by — Newest</option>
          <option value="date:asc">Sort by — Oldest</option>
          <option value="amount:desc">Sort by — Amount (high)</option>
          <option value="amount:asc">Sort by — Amount (low)</option>
          <option value="fee:desc">Sort by — Fee (high)</option>
          <option value="fee:asc">Sort by — Fee (low)</option>
        </select>
      </div>

      <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[860px] table-auto">
            <thead className="bg-primary/5">
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                <th className="px-5 py-4 text-left">User</th>
                <th className="px-5 py-4 text-left">Event</th>
                <th className="px-5 py-4 text-left">Ticket Tier (Qty)</th>
                <th className="px-5 py-4 text-left">Amount</th>
                <th className="px-5 py-4 text-left">Fee</th>
                <th className="px-5 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      No transactions match your search.
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/40 text-sm transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/transactions/${tx.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="border-border/60 size-10 shrink-0 border">
                          {tx.attendeeAvatarUrl ? (
                            <AvatarImage
                              asChild
                              src={tx.attendeeAvatarUrl}
                              alt=""
                            >
                              <Image
                                src={tx.attendeeAvatarUrl}
                                alt=""
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </AvatarImage>
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(tx.attendeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            {tx.reference}
                          </span>
                          <span className="text-foreground hover:text-primary font-semibold transition-colors">
                            {tx.attendeeName}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="text-foreground px-5 py-4">{tx.eventName}</td>
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {tx.tier} ({tx.qty})
                    </td>
                    <td className="text-foreground px-5 py-4 font-semibold whitespace-nowrap">
                      {formatNaira(tx.amount)}
                    </td>
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {formatNaira(tx.fee)}
                    </td>
                    <td className="text-muted-foreground px-5 py-4 whitespace-nowrap">
                      {formatShortDate(tx.date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        total={TOTAL_TXNS}
        shown={rows.length}
        current={current}
        totalPages={totalPages}
        onPage={(p) => void setParams({ page: p })}
      />
    </div>
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

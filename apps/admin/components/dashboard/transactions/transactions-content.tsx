'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
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
  ArrowUp01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Input } from '@ticketur/ui/components/input'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'

import { useTRPC } from '@/lib/trpc'
import { formatShortDate } from '@/lib/date'

const SORT_FIELDS = ['date', 'amount', 'fee'] as const
type SortField = (typeof SORT_FIELDS)[number]

const DIR_VALUES = ['asc', 'desc'] as const
type SortDir = (typeof DIR_VALUES)[number]

const PAGE_SIZE = 10

// Order amounts come from the API in minor units (kobo).
function formatNaira(minor: number) {
  return `₦${(minor / 100).toLocaleString('en-NG')}`
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
  const trpc = useTRPC()

  const [params, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      sort: parseAsStringLiteral(SORT_FIELDS).withDefault('date'),
      dir: parseAsStringLiteral(DIR_VALUES).withDefault('desc'),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  )

  const listQuery = useQuery(
    trpc.admin.transactions.list.queryOptions({
      q: params.q,
      sort: params.sort,
      dir: params.dir,
      page: params.page,
      pageSize: PAGE_SIZE,
    })
  )

  const rows = listQuery.data?.rows ?? []
  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = Math.min(Math.max(params.page, 1), totalPages)

  const handleSort = useCallback(
    (field: SortField) => {
      void setParams((prev) => ({
        sort: field,
        dir:
          prev.sort === field && prev.dir === 'asc'
            ? ('desc' as SortDir)
            : ('asc' as SortDir),
        page: 1,
      }))
    },
    [setParams]
  )

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
      </div>

      <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[860px] table-auto">
            <thead className="bg-primary/5">
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase select-none">
                <th className="px-5 py-4 text-left">User</th>
                <th className="px-5 py-4 text-left">Event</th>
                <th className="px-5 py-4 text-left">Ticket Tier (Qty)</th>
                <SortableHeader
                  field="amount"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Amount
                </SortableHeader>
                <SortableHeader
                  field="fee"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Fee
                </SortableHeader>
                <SortableHeader
                  field="date"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Date
                </SortableHeader>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {listQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      Loading transactions…
                    </p>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      {params.q
                        ? 'No transactions match your search.'
                        : 'No transactions yet.'}
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
        total={total}
        shown={rows.length}
        current={current}
        totalPages={totalPages}
        onPage={(p) => void setParams({ page: p })}
      />
    </div>
  )
}

function SortableHeader({
  field,
  sort,
  dir,
  onSort,
  children,
}: {
  field: SortField
  sort: SortField
  dir: SortDir
  onSort: (field: SortField) => void
  children: React.ReactNode
}) {
  const active = sort === field
  return (
    <th className="px-5 py-4 text-left">
      <button
        type="button"
        onClick={() => onSort(field)}
        aria-sort={
          active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'
        }
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors',
          active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span>{children}</span>
        {active ? (
          <HugeiconsIcon
            icon={dir === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
            className="size-3.5"
            strokeWidth={2.2}
          />
        ) : null}
      </button>
    </th>
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

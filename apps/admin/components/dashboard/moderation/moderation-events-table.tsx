'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Tick02Icon,
  CancelCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

import type { PendingEvent } from '@/lib/mock-moderation'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function ModerationEventsTable({ rows }: { rows: PendingEvent[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[760px] table-auto">
            <thead className="bg-primary/5">
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                <th className="px-5 py-4 text-left">Event Name</th>
                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-left">Date Registered</th>
                <th className="px-5 py-4 text-left">Organizer Name</th>
                <th className="px-5 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      No pending event applications.
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/40 text-sm transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/moderation/event/${row.id}`}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={row.thumbnailUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-full object-cover"
                        />
                        <span className="text-foreground hover:text-primary font-semibold transition-colors">
                          {row.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase">
                        {row.category}
                      </span>
                    </td>
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {formatDate(row.registeredAt)}
                    </td>
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {row.organizerName}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <ActionPill tone="success" label="Approve">
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            className="size-4"
                            strokeWidth={2}
                          />
                        </ActionPill>
                        <ActionPill tone="danger" label="Reject">
                          <HugeiconsIcon
                            icon={CancelCircleIcon}
                            className="size-4"
                            strokeWidth={1.8}
                          />
                        </ActionPill>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationStub total={rows.length} />
    </div>
  )
}

function ActionPill({
  tone,
  label,
  children,
}: {
  tone: 'success' | 'danger'
  label: string
  children: React.ReactNode
}) {
  const styles = {
    success: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
    danger: 'bg-rose-50 text-rose-500 hover:bg-rose-100',
  }[tone]
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-7 w-9 items-center justify-center rounded-md transition-colors ${styles}`}
    >
      {children}
    </button>
  )
}

function PaginationStub({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
      <p className="text-muted-foreground text-xs sm:text-sm">
        Showing {total} of {total === 0 ? 0 : 18} events
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton aria-label="Previous page" disabled>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </PageButton>
        <PageButton active>1</PageButton>
        <PageButton>2</PageButton>
        <PageButton>3</PageButton>
        <PageButton aria-label="Next page">
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

'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'

import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { toDate } from '@/lib/date'

type ActivityItem = RouterOutputs['admin']['overview']['recentActivity'][number]

function relativeTime(iso: string) {
  const d = toDate(iso)
  if (!d) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

function getInitials(text: string) {
  return (
    text
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

function renderMessage(item: ActivityItem) {
  if (item.kind === 'vendor-registered') {
    // Highlight the role word.
    const message = item.message
    const idx = message.lastIndexOf('Vendor')
    if (idx >= 0) {
      return (
        <>
          {message.slice(0, idx)}
          <span className="font-semibold">Vendor</span>
        </>
      )
    }
  }
  return item.message
}

export function RecentActivity() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.admin.overview.recentActivity.queryOptions()
  )

  return (
    <section
      aria-label="Recent activity"
      className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02] md:p-6"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
          Recent Activity
        </h2>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-muted size-10 shrink-0 animate-pulse rounded-full" />
              <div className="flex flex-1 flex-col gap-1">
                <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                <div className="bg-muted h-3 w-1/4 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No recent activity yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {data.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.avatarUrl ? (
                <Image
                  src={item.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {getInitials(item.message)}
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-foreground text-sm">{renderMessage(item)}</p>
                <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                  {relativeTime(item.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

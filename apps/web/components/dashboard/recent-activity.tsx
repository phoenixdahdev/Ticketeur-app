'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  AddCircleIcon,
  Money01Icon,
  ArchiveIcon,
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

import { useTRPC } from '@/lib/trpc'

type ActivityTone = 'blue' | 'green' | 'orange' | 'purple' | 'red'

const toneStyles: Record<ActivityTone, string> = {
  blue: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  green:
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  orange:
    'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  purple: 'bg-primary/10 text-primary',
  red: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
}

const TYPE_META: Record<
  string,
  { icon: IconSvgElement; tone: ActivityTone; label: (title: string) => string }
> = {
  'event.created': {
    icon: AddCircleIcon,
    tone: 'blue',
    label: (t) => `You created ${t}`,
  },
  'event.updated': {
    icon: Edit02Icon,
    tone: 'purple',
    label: (t) => `Draft updated: ${t}`,
  },
  'event.archived': {
    icon: ArchiveIcon,
    tone: 'orange',
    label: (t) => `Event ${t} has been archived`,
  },
  'event.published': {
    icon: CheckmarkCircle02Icon,
    tone: 'green',
    label: (t) => `Event ${t} is now live`,
  },
  'event.deleted': {
    icon: Delete02Icon,
    tone: 'red',
    label: (t) => `Deleted event: ${t}`,
  },
  'order.placed': {
    icon: Money01Icon,
    tone: 'green',
    label: (t) => `Tickets sold for ${t}`,
  },
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'JUST NOW'
  if (mins < 60) return `${mins} MIN${mins > 1 ? 'S' : ''} AGO`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} HOUR${hrs > 1 ? 'S' : ''} AGO`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'YESTERDAY'
  if (days < 7) return `${days} DAYS AGO`
  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
    })
    .toUpperCase()
}

export function RecentActivity() {
  const trpc = useTRPC()
  const { data: items = [], isLoading } = useQuery(
    trpc.org.dashboard.recentActivity.queryOptions()
  )

  return (
    <section
      aria-labelledby="recent-activity-heading"
      className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02] md:p-6"
    >
      <h2
        id="recent-activity-heading"
        className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl"
      >
        Recent Activity
      </h2>
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <div className="bg-muted h-10 animate-pulse rounded-lg" />
          <div className="bg-muted h-10 animate-pulse rounded-lg" />
          <div className="bg-muted h-10 animate-pulse rounded-lg" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
          No activity yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((a) => {
            const meta = TYPE_META[a.type] ?? TYPE_META['event.updated']!
            const title =
              (a.payload as { title?: string } | null)?.title ?? 'an event'
            const text = meta.label(title)
            const Body = (
              <>
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-xl',
                    toneStyles[meta.tone]
                  )}
                >
                  <HugeiconsIcon
                    icon={meta.icon}
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-foreground text-sm leading-snug">{text}</p>
                  <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    {relativeTime(new Date(a.createdAt))}
                  </p>
                </div>
              </>
            )
            return (
              <li key={a.id} className="flex items-start gap-3">
                {a.eventId ? (
                  <Link
                    href={`/org/events/${a.eventId}`}
                    className="hover:bg-muted/60 -m-1.5 flex flex-1 items-start gap-3 rounded-lg p-1.5 transition-colors"
                  >
                    {Body}
                  </Link>
                ) : (
                  <div className="flex flex-1 items-start gap-3">{Body}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@ticketur/ui/lib/utils'

import { useTRPC } from '@/lib/trpc'
import { initialsFromTitle } from '@/lib/event-display'
import { STATUS_LABEL, STATUS_TONE, type EventStatus } from '@/lib/org-events'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function TopEventsTable() {
  const trpc = useTRPC()
  const { data: events = [], isLoading } = useQuery(
    trpc.org.dashboard.topEvents.queryOptions()
  )

  return (
    <section
      aria-labelledby="top-events-heading"
      className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02] md:p-6"
    >
      <div className="flex items-center justify-between">
        <h2
          id="top-events-heading"
          className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl"
        >
          Top Performing Events
        </h2>
        <Link
          href="/org/events"
          className="text-primary text-xs font-semibold hover:underline md:text-sm"
        >
          View All Events
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <div className="bg-muted h-12 animate-pulse rounded-lg" />
          <div className="bg-muted h-12 animate-pulse rounded-lg" />
          <div className="bg-muted h-12 animate-pulse rounded-lg" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No events yet — create your first one.
        </p>
      ) : (
        <>
          <table className="hidden w-full table-auto md:table">
            <thead>
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                <th className="py-3 pr-4 text-left">Event</th>
                <th className="px-4 py-3 text-left">Ticket Sales</th>
                <th className="py-3 pl-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {events.map((ev) => {
                const pct =
                  ev.total > 0
                    ? Math.min(100, Math.round((ev.sold / ev.total) * 100))
                    : 0
                const status = ev.status as EventStatus
                return (
                  <tr key={ev.id} className="text-sm">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          {initialsFromTitle(ev.title)}
                        </div>
                        <Link
                          href={`/org/events/${ev.id}`}
                          className="text-foreground hover:text-primary font-medium"
                        >
                          {ev.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <span>
                            {formatNumber(ev.sold)} / {formatNumber(ev.total)} sold
                          </span>
                          <span className="text-foreground font-semibold">
                            {pct}%
                          </span>
                        </div>
                        <div className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-foreground absolute inset-y-0 left-0 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pl-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                          STATUS_TONE[status]
                        )}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <ul className="flex flex-col gap-4 md:hidden">
            {events.map((ev) => {
              const pct =
                ev.total > 0
                  ? Math.min(100, Math.round((ev.sold / ev.total) * 100))
                  : 0
              const status = ev.status as EventStatus
              return (
                <li
                  key={ev.id}
                  className="border-border/60 flex flex-col gap-3 rounded-xl border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                        {initialsFromTitle(ev.title)}
                      </div>
                      <Link
                        href={`/org/events/${ev.id}`}
                        className="text-foreground text-sm font-medium"
                      >
                        {ev.title}
                      </Link>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium',
                        STATUS_TONE[status]
                      )}
                    >
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>
                        {formatNumber(ev.sold)} / {formatNumber(ev.total)} sold
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
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}

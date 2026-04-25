import Link from 'next/link'

import { cn } from '@ticketur/ui/lib/utils'

type EventStatus = 'upcoming' | 'archived'

type EventRow = {
  id: string
  name: string
  initials: string
  sold: number
  total: number
  status: EventStatus
}

const EVENTS: EventRow[] = [
  {
    id: '1',
    name: 'Synthwave Summer Night 2024',
    initials: 'SN',
    sold: 1240,
    total: 2000,
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Tech Connect Global Summit',
    initials: 'TC',
    sold: 350,
    total: 500,
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'Jazz Under The Stars 2023',
    initials: 'JZ',
    sold: 800,
    total: 800,
    status: 'archived',
  },
]

const statusStyles: Record<EventStatus, string> = {
  upcoming:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  archived: 'bg-muted text-muted-foreground',
}

const statusLabel: Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  archived: 'Archived',
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function TopEventsTable() {
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

      <table className="hidden w-full table-auto md:table">
        <thead>
          <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            <th className="py-3 pr-4 text-left">Event</th>
            <th className="px-4 py-3 text-left">Ticket Sales</th>
            <th className="py-3 pl-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-border/60 divide-y">
          {EVENTS.map((ev) => {
            const pct = Math.round((ev.sold / ev.total) * 100)
            return (
              <tr key={ev.id} className="text-sm">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                      {ev.initials}
                    </div>
                    <span className="text-foreground font-medium">
                      {ev.name}
                    </span>
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
                      statusStyles[ev.status]
                    )}
                  >
                    {statusLabel[ev.status]}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <ul className="flex flex-col gap-4 md:hidden">
        {EVENTS.map((ev) => {
          const pct = Math.round((ev.sold / ev.total) * 100)
          return (
            <li
              key={ev.id}
              className="border-border/60 flex flex-col gap-3 rounded-xl border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {ev.initials}
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {ev.name}
                  </span>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    statusStyles[ev.status]
                  )}
                >
                  {statusLabel[ev.status]}
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
    </section>
  )
}

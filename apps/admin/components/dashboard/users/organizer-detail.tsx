'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

import { cn } from '@ticketur/ui/lib/utils'
import type { RouterOutputs } from '@ticketur/api'

import { ProfileActions } from '@/components/dashboard/users/profile-actions'
import { formatShortDate as formatDate } from '@/lib/date'

type OrganizerDetail = Extract<
  RouterOutputs['admin']['users']['byId'],
  { role: 'organizer' }
>

const PORTFOLIO_TABS = ['all', 'active', 'archived', 'flagged'] as const
type PortfolioTab = (typeof PORTFOLIO_TABS)[number]

const TABS: { value: PortfolioTab; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'flagged', label: 'Flagged' },
]

const STATUS_TONE = {
  active: 'text-emerald-600',
  archived: 'bg-muted text-muted-foreground px-2.5 py-1 rounded-md',
  flagged: 'bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md',
} as const

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

// Revenue is summed in minor units; format to display naira.
function formatNaira(minor: number) {
  return `₦${(minor / 100).toLocaleString('en-NG')}`
}

export function OrganizerDetailView({ user }: { user: OrganizerDetail }) {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(PORTFOLIO_TABS).withDefault('all')
  )

  const events = useMemo(() => {
    if (tab === 'all') return user.events
    return user.events.filter((e) => e.status === tab)
  }, [tab, user.events])

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Profile card */}
      <section className="border-border/60 bg-background flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="bg-foreground border-border/60 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border md:size-24">
              {user.logoUrl ? (
                <Image
                  src={user.logoUrl}
                  alt=""
                  width={96}
                  height={96}
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <span className="text-emerald-600 text-xs font-semibold">
              {user.status === 'active'
                ? 'Active'
                : user.status === 'suspended'
                ? 'Suspended'
                : 'Disabled'}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
            <div className="flex flex-col items-center gap-1 md:items-start">
              <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
                {user.name}
              </h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
            <div className="flex flex-col gap-1 md:flex-row md:gap-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-semibold">
                  Date Joined
                </span>
                <span className="text-muted-foreground text-sm">
                  {formatDate(user.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <ProfileActions
              userId={user.id}
              userName={user.name}
              status={user.status}
            />
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SimpleStat label="Total Events Organized" value={formatNumber(user.totalEvents)} />
        <SimpleStat
          label="Active/Archived/Flagged"
          value={`${user.activeCount}/${user.archivedCount}/${user.flaggedCount}`}
        />
        <SimpleStat label="Total Ticket sold" value={formatNumber(user.totalSold)} />
        <SimpleStat label="Total Revenue" value={formatNaira(user.totalRevenue)} />
      </section>

      {/* Event portfolio */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
            Event Portfolio
          </h3>
          <div
            role="tablist"
            aria-label="Filter events"
            className="bg-muted/50 -mx-1 flex shrink-0 items-center gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((t) => {
              const active = tab === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => void setTab(t.value)}
                  className={cn(
                    'relative shrink-0 px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="organizer-portfolio-pill"
                      className="bg-primary absolute inset-0 rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  <span className="relative">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[760px] table-auto">
              <thead className="bg-primary/5">
                <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  <th className="px-5 py-4 text-left">Event Name</th>
                  <th className="px-5 py-4 text-left">Category</th>
                  <th className="px-5 py-4 text-left">Date</th>
                  <th className="px-5 py-4 text-left">Ticket Sales</th>
                  <th className="px-5 py-4 text-left">Status</th>
                  <th className="px-5 py-4 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <p className="text-muted-foreground text-sm">
                        No events match this filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  events.map((row) => {
                    const pct =
                      row.total > 0
                        ? Math.min(100, Math.round((row.sold / row.total) * 100))
                        : 0
                    return (
                      <tr key={row.id} className="text-sm">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={row.thumbnailUrl}
                              alt=""
                              width={40}
                              height={40}
                              className="size-10 shrink-0 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="text-foreground font-semibold">
                                {row.eventName}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                ID: {row.eventId}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase">
                            {row.category}
                          </span>
                        </td>
                        <td className="text-foreground px-5 py-4 whitespace-nowrap">
                          {formatDate(row.date)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex min-w-[160px] flex-col gap-1.5">
                            <div className="text-muted-foreground flex items-center justify-between text-xs">
                              <span>
                                {formatNumber(row.sold)}/{formatNumber(row.total)} sold
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
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center text-xs font-medium whitespace-nowrap',
                              STATUS_TONE[row.status]
                            )}
                          >
                            {capitalize(row.status)}
                          </span>
                        </td>
                        <td className="text-foreground px-5 py-4 font-semibold whitespace-nowrap">
                          {formatNaira(row.revenue)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function SimpleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-1 rounded-2xl border p-5">
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
        {value}
      </span>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Calendar03Icon,
  CalendarCheckOut02Icon,
  Clock04Icon,
  UserCircle02Icon,
} from '@hugeicons/core-free-icons'

import { useTRPC } from '@/lib/trpc'
import { formatEventDateRange } from '@/lib/date'
import { formatWeekday } from '@/lib/event-display'

import { VendorStatCard } from '@/components/vendor/stat-card'
import { VendorEventCard } from '@/components/vendor/event-card'
import type { VendorEvent } from '@/lib/vendor-events'

export function VendorOverviewContent({
  vendorName = 'Vendor',
}: {
  vendorName?: string
}) {
  const trpc = useTRPC()

  const statsQuery = useQuery(trpc.vendor.dashboard.stats.queryOptions())
  const upcomingQuery = useQuery(
    trpc.vendor.dashboard.upcomingEvents.queryOptions()
  )

  const stats = statsQuery.data
  const upcoming = (upcomingQuery.data ?? []).map(serverToCard)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Hello, {vendorName}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your event assignments and profile.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <VendorStatCard
          label="Total Events"
          value={pad2(stats?.totalEvents ?? 0)}
          icon={Calendar03Icon}
          tone="purple"
        />
        <VendorStatCard
          label="Upcoming Events"
          value={pad2(stats?.upcomingEvents ?? 0)}
          icon={CalendarCheckOut02Icon}
          tone="purple"
          pill="Active"
          pillTone="green"
        />
        <VendorStatCard
          label="Past Events"
          value={pad2(stats?.pastEvents ?? 0)}
          icon={Clock04Icon}
          tone="purple"
          pill="History"
          pillTone="orange"
        />
        <VendorStatCard
          label={
            (stats?.profileCompletion ?? 0) >= 100
              ? 'Profile Complete'
              : 'Profile Incomplete'
          }
          value={`${stats?.profileCompletion ?? 0}%`}
          icon={UserCircle02Icon}
          tone="purple"
          pill={
            (stats?.profileCompletion ?? 0) >= 100 ? 'Up to date' : 'Update Required'
          }
          pillTone={(stats?.profileCompletion ?? 0) >= 100 ? 'green' : 'red'}
          progress={stats?.profileCompletion ?? 0}
        />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
            Upcoming Assigned Events
          </h2>
          <Link
            href="/vendor/events"
            className="text-primary text-xs font-semibold hover:underline md:text-sm"
          >
            View All Events
          </Link>
        </div>

        {upcomingQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="bg-muted h-32 animate-pulse rounded-2xl" />
            <div className="bg-muted h-32 animate-pulse rounded-2xl" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="border-border/60 bg-background flex flex-col items-center justify-center gap-2 rounded-2xl border p-10 text-center">
            <p className="text-muted-foreground text-sm">
              No upcoming events yet — organizers will assign you here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {upcoming.map((ev) => (
              <VendorEventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

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

function serverToCard(ev: ServerEvent): VendorEvent {
  const d = new Date(`${ev.eventDate}T00:00:00`)
  const formattedDate = Number.isNaN(d.getTime())
    ? ev.eventDate
    : formatEventDateRange(ev.eventDate, ev.endDate)
  const today = new Date().toISOString().slice(0, 10)
  // Use end_date when present so multi-day events stay "upcoming" until they finish.
  const lastDay = ev.endDate ?? ev.eventDate
  const computedStatus =
    lastDay < today ? 'past' : ev.status === 'upcoming' ? 'upcoming' : 'upcoming'
  return {
    id: ev.id,
    title: ev.title,
    date: formattedDate,
    dateMs: Number.isNaN(d.getTime()) ? 0 : d.getTime(),
    time: ev.eventTime,
    location: ev.location,
    venue: ev.location,
    weekday: Number.isNaN(d.getTime()) ? '' : formatWeekday(ev.eventDate),
    category: 'MUSIC',
    status: computedStatus as VendorEvent['status'],
    image: ev.bannerUrl ?? '/hero-bg.png',
    description: '',
    features: [],
  }
}

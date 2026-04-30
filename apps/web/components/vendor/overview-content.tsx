import Link from 'next/link'
import {
  Calendar03Icon,
  CalendarCheckOut02Icon,
  Clock04Icon,
  UserCircle02Icon,
} from '@hugeicons/core-free-icons'

import { VendorStatCard } from '@/components/vendor/stat-card'
import { VendorEventCard } from '@/components/vendor/event-card'
import {
  VENDOR_EVENTS,
  VENDOR_STATS,
  type VendorEvent,
} from '@/lib/vendor-events'

export function VendorOverviewContent({
  vendorName = 'Tasty Bites',
}: {
  vendorName?: string
}) {
  const upcoming: VendorEvent[] = VENDOR_EVENTS.slice(0, 4)

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
          value={String(VENDOR_STATS.totalEvents).padStart(2, '0')}
          icon={Calendar03Icon}
          tone="purple"
        />
        <VendorStatCard
          label="Upcoming Events"
          value={String(VENDOR_STATS.upcomingEvents).padStart(2, '0')}
          icon={CalendarCheckOut02Icon}
          tone="purple"
          pill="Active"
          pillTone="green"
        />
        <VendorStatCard
          label="Past Events"
          value={String(VENDOR_STATS.pastEvents).padStart(2, '0')}
          icon={Clock04Icon}
          tone="purple"
          pill="History"
          pillTone="orange"
        />
        <VendorStatCard
          label="Profile Incomplete"
          value={`${VENDOR_STATS.profileCompletion}%`}
          icon={UserCircle02Icon}
          tone="purple"
          pill="Update Required"
          pillTone="red"
          progress={VENDOR_STATS.profileCompletion}
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {upcoming.map((ev) => (
            <VendorEventCard key={ev.id} event={ev} />
          ))}
        </div>
      </section>
    </div>
  )
}

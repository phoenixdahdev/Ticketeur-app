import type { Metadata } from 'next'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'

import { OverviewStats } from '@/components/dashboard/overview-stats'
import { TopEventsTable } from '@/components/dashboard/top-events-table'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Monitor your events and ticket sales at a glance.',
}

export default function OrgDashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Monitor your events and ticket sales at a glance.
          </p>
        </div>
        <Button size="xl" asChild className="w-full md:w-auto">
          <Link href="/org/create-event" className="gap-2">
            <HugeiconsIcon
              icon={PlusSignIcon}
              className="size-5"
              strokeWidth={2}
            />
            Create Event
          </Link>
        </Button>
      </header>

      <OverviewStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopEventsTable />
        </div>
        <RecentActivity />
      </div>
    </div>
  )
}

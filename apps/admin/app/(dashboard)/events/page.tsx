import type { Metadata } from 'next'

import { EventsStats } from '@/components/dashboard/events/events-stats'
import { EventsContent } from '@/components/dashboard/events/events-content'

export const metadata: Metadata = {
  title: 'Events',
}

export default function EventsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Event Management
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Monitor, moderate and manage all event activations.
        </p>
      </header>

      <EventsStats />

      <EventsContent />
    </div>
  )
}

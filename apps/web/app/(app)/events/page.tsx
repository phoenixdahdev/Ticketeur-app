import type { Metadata } from 'next'

import { EventsPageHeader } from '@/components/sections/events/events-page-header'
import { FeaturedEvents } from '@/components/sections/events/featured-events'
import { EventsGridSection } from '@/components/sections/events/events-grid-section'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Discover verified events from trusted organisers. Secure tickets, guaranteed entry.',
}

export default function EventsPage() {
  return (
    <>
      <EventsPageHeader />
      <FeaturedEvents />
      <EventsGridSection />
    </>
  )
}

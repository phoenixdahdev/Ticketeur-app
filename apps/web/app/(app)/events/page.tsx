import type { Metadata } from 'next'

import { EventsPageHeader } from '@/components/sections/events/events-page-header'
import { FeaturedEvents } from '@/components/sections/events/featured-events'
import { EventsGridSection } from '@/components/sections/events/events-grid-section'
import { getServerTRPC, HydrateClient } from '@/lib/trpc-server'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Discover verified events from trusted organisers. Secure tickets, guaranteed entry.',
}

// PAGE_SIZE mirrors the grid section's constant so the prefetched default-page
// key matches the client query on first load. Filtered/paged navigations are
// client-side (nuqs shallow routing) and fetch on demand as before.
const GRID_PAGE_SIZE = 6

export default async function EventsPage() {
  const { trpc, queryClient } = await getServerTRPC()
  await Promise.all([
    queryClient.prefetchQuery(trpc.public.events.featured.queryOptions()),
    queryClient.prefetchQuery(
      // Must mirror the grid's default query input exactly — including `tab` —
      // or the key won't match and the client refetches after hydration.
      trpc.public.events.list.queryOptions({
        tab: 'upcoming',
        q: '',
        page: 1,
        pageSize: GRID_PAGE_SIZE,
      })
    ),
  ])

  return (
    <HydrateClient>
      <EventsPageHeader />
      <FeaturedEvents />
      <EventsGridSection />
    </HydrateClient>
  )
}

import type { Metadata } from 'next'

import { VendorListSection } from '@/components/sections/vendors/vendor-list-section'
import { getServerTRPC, HydrateClient } from '@/lib/trpc-server'

export const metadata: Metadata = {
  title: 'All Vendors',
  description:
    "Browse Ticketeur's curated roster of event professionals — from catering to audio/visual, security, and entertainment.",
}

// Mirrors the list section's defaults so the first-load key matches; filtered
// navigations fetch client-side (nuqs shallow routing) as before.
const LIST_PAGE_SIZE = 8

export default async function VendorListPage() {
  const { trpc, queryClient } = await getServerTRPC()
  await queryClient.prefetchQuery(
    trpc.public.vendors.list.queryOptions({
      q: '',
      category: 'all',
      location: '',
      minRating: 0,
      page: 1,
      pageSize: LIST_PAGE_SIZE,
    })
  )

  return (
    <HydrateClient>
      <VendorListSection />
    </HydrateClient>
  )
}

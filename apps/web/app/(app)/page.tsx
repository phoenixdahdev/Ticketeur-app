import { Hero } from '@/components/sections/hero'
import { DiscoverEvents } from '@/components/sections/discover-events'
import { FeaturedVendors } from '@/components/sections/featured-vendors'
import { PartnerWithUs } from '@/components/sections/partner-with-us'
import { BuiltOnTrust } from '@/components/sections/built-on-trust'
import { getServerTRPC, HydrateClient } from '@/lib/trpc-server'

export default async function Home() {
  // Prefetch the data the (client) sections below read, so they hydrate
  // instead of fetching after JS loads.
  const { trpc, queryClient } = await getServerTRPC()
  await Promise.all([
    queryClient.prefetchQuery(trpc.public.events.featured.queryOptions()),
    queryClient.prefetchQuery(trpc.public.vendors.featured.queryOptions()),
  ])

  return (
    <HydrateClient>
      <Hero />
      <DiscoverEvents />
      <FeaturedVendors />
      <PartnerWithUs />
      <BuiltOnTrust />
    </HydrateClient>
  )
}

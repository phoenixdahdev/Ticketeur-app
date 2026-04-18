import { Hero } from '@/components/sections/hero'
import { DiscoverEvents } from '@/components/sections/discover-events'
import { FeaturedVendors } from '@/components/sections/featured-vendors'
import { PartnerWithUs } from '@/components/sections/partner-with-us'
import { BuiltOnTrust } from '@/components/sections/built-on-trust'

export default function Home() {
  return (
    <>
      <Hero />
      <DiscoverEvents />
      <FeaturedVendors />
      <PartnerWithUs />
      <BuiltOnTrust />
    </>
  )
}

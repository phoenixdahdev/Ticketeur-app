import type { Metadata } from 'next'

import { VendorsCta } from '@/components/sections/vendors/vendors-cta'
import { VendorsFeatures } from '@/components/sections/vendors/vendors-features'
import { VendorsHero } from '@/components/sections/vendors/vendors-hero'
import { VendorsHowItWorks } from '@/components/sections/vendors/vendors-how-it-works'
import { VendorsModerated } from '@/components/sections/vendors/vendors-moderated'

export const metadata: Metadata = {
  title: 'For Vendors',
  description:
    'Grow your business with Ticketeur — join an elite community of verified vendors and showcase your brand at the most exclusive events.',
}

export default function VendorsPage() {
  return (
    <>
      <VendorsHero />
      <VendorsFeatures />
      <VendorsHowItWorks />
      <VendorsModerated />
      <VendorsCta />
    </>
  )
}

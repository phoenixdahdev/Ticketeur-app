import type { Metadata } from 'next'

import { VendorListSection } from '@/components/sections/vendors/vendor-list-section'

export const metadata: Metadata = {
  title: 'All Vendors',
  description:
    "Browse Ticketur's curated roster of event professionals — from catering to audio/visual, security, and entertainment.",
}

export default function VendorListPage() {
  return <VendorListSection />
}

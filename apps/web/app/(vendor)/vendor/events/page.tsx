import type { Metadata } from 'next'

import { VendorEventsContent } from '@/components/vendor/events-content'

export const metadata: Metadata = {
  title: 'Events',
  description: 'View all assigned professional engagements.',
}

export default function VendorEventsPage() {
  return <VendorEventsContent />
}

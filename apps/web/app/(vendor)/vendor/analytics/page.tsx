import type { Metadata } from 'next'

import { VendorAnalyticsContent } from '@/components/vendor/analytics/analytics-content'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Track your business performance on Ticketeur.',
}

export default function VendorAnalyticsPage() {
  return <VendorAnalyticsContent />
}

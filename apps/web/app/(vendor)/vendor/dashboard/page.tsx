import type { Metadata } from 'next'

import { getSession } from '@/lib/auth'
import { VendorOverviewContent } from '@/components/vendor/overview-content'

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Manage your event assignments and profile.',
}

type VendorUserExtras = {
  businessName?: string | null
}

export default async function VendorDashboardPage() {
  const session = await getSession()
  const u = (session?.user ?? {}) as unknown as VendorUserExtras
  const name = u.businessName ?? session?.user.name ?? 'Vendor'

  return <VendorOverviewContent vendorName={name} />
}

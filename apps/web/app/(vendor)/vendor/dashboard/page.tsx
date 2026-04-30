import type { Metadata } from 'next'

import { getSession } from '@/lib/auth'
import { VendorOverviewContent } from '@/components/vendor/overview-content'

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Manage your event assignments and profile.',
}

export default async function VendorDashboardPage() {
  const session = await getSession()
  const name =
    (session?.user as unknown as { businessName?: string | null } | undefined)
      ?.businessName ??
    session?.user.name ??
    'Vendor'

  return <VendorOverviewContent vendorName={name} />
}

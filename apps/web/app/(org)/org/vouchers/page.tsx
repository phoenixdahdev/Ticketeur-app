import type { Metadata } from 'next'

import { OrgVouchersContent } from '@/components/dashboard/org-vouchers-content'

export const metadata: Metadata = {
  title: 'Vouchers',
  description: 'Create and manage discount codes for your events.',
}

export default function OrgVouchersPage() {
  return <OrgVouchersContent />
}

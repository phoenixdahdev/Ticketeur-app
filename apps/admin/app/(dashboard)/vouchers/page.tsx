import type { Metadata } from 'next'

import { AdminVouchersContent } from '@/components/dashboard/vouchers/admin-vouchers-content'

export const metadata: Metadata = {
  title: 'Vouchers',
}

export default function VouchersPage() {
  return <AdminVouchersContent />
}

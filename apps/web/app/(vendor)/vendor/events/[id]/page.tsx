import type { Metadata } from 'next'

import { VendorEventDetail } from '@/components/vendor/event-detail'

type RouteParams = Promise<{ id: string }>

export const metadata: Metadata = {
  title: 'Event',
  description: 'Event assignment on Ticketeur.',
}

export default async function VendorEventDetailPage({
  params,
}: {
  params: RouteParams
}) {
  const { id } = await params
  return <VendorEventDetail id={id} />
}

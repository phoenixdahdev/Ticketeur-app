import type { Metadata } from 'next'

import { EventDetail } from '@/components/dashboard/event-detail'

type RouteParams = Promise<{ id: string }>

export const metadata: Metadata = {
  title: 'Event',
  description: 'Manage event on Ticketeur.',
}

export default async function OrgEventDetailPage({
  params,
}: {
  params: RouteParams
}) {
  const { id } = await params
  return <EventDetail id={id} />
}

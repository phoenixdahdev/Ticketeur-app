import type { Metadata } from 'next'

import { EditEventContent } from '@/components/dashboard/edit-event/content'

type RouteParams = Promise<{ id: string }>

export const metadata: Metadata = {
  title: 'Edit Event',
  description: 'Update your event details and ticketing on Ticketeur.',
}

export default async function OrgEventEditPage({
  params,
}: {
  params: RouteParams
}) {
  const { id } = await params
  return <EditEventContent id={id} />
}

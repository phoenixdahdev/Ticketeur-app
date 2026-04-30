import type { Metadata } from 'next'

import { EventDetailContent } from '@/components/sections/event-detail/event-detail-content'

export async function generateMetadata({
  params,
}: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Event',
    description: `Event ${id} on Ticketeur.`,
  }
}

export default async function EventDetailPage({
  params,
}: PageProps<'/events/[id]'>) {
  const { id } = await params
  return <EventDetailContent id={id} />
}

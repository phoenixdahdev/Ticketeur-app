import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { findEventById } from '@/lib/org-events'
import { EventDetail } from '@/components/dashboard/event-detail'

type RouteParams = Promise<{ id: string }>

export async function generateMetadata({
  params,
}: {
  params: RouteParams
}): Promise<Metadata> {
  const { id } = await params
  const event = findEventById(id)
  return {
    title: event?.name ?? 'Event',
    description: event
      ? `Manage ${event.name} on Ticketeur.`
      : 'Event not found.',
  }
}

export default async function OrgEventDetailPage({
  params,
}: {
  params: RouteParams
}) {
  const { id } = await params
  const event = findEventById(id)
  if (!event) notFound()
  return <EventDetail event={event} />
}

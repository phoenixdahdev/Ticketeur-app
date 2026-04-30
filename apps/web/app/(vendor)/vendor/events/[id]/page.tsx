import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { findVendorEvent } from '@/lib/vendor-events'
import { VendorEventDetail } from '@/components/vendor/event-detail'

type RouteParams = Promise<{ id: string }>

export async function generateMetadata({
  params,
}: {
  params: RouteParams
}): Promise<Metadata> {
  const { id } = await params
  const event = findVendorEvent(id)
  return {
    title: event?.title ?? 'Event',
    description: event
      ? `${event.title} on Ticketeur.`
      : 'Event not found.',
  }
}

export default async function VendorEventDetailPage({
  params,
}: {
  params: RouteParams
}) {
  const { id } = await params
  const event = findVendorEvent(id)
  if (!event) notFound()
  return <VendorEventDetail event={event} />
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAdminEvent } from '@/lib/mock-events'
import { BackButton } from '@/components/dashboard/users/back-button'
import { AdminEventDetailView } from '@/components/dashboard/events/event-detail'

export async function generateMetadata({
  params,
}: PageProps<'/events/[id]'>): Promise<Metadata> {
  const { id } = await params
  const event = getAdminEvent(id)
  return { title: event?.title ?? 'Event' }
}

export default async function AdminEventDetailPage({
  params,
}: PageProps<'/events/[id]'>) {
  const { id } = await params
  const event = getAdminEvent(id)
  if (!event) notFound()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Event Management
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Monitor, moderate and manage all event activations.
        </p>
      </header>

      <BackButton label="Back to Events" />

      <AdminEventDetailView event={event} />
    </div>
  )
}

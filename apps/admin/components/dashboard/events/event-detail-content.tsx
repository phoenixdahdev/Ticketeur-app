'use client'

import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { useTRPC } from '@/lib/trpc'
import { BackButton } from '@/components/dashboard/users/back-button'
import { AdminEventDetailView } from '@/components/dashboard/events/event-detail'
import { EventActions } from '@/components/dashboard/events/event-actions'

export function EventDetailContent({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.admin.events.byId.queryOptions({ id })
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-muted h-9 w-32 animate-pulse rounded-md" />
        <div className="bg-muted aspect-[1360/360] w-full animate-pulse rounded-2xl" />
        <div className="bg-muted h-64 animate-pulse rounded-2xl" />
        <div className="bg-muted h-40 animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (isError || !data) {
    notFound()
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <BackButton label="Back to Events" />
        <EventActions
          eventId={data.id}
          eventTitle={data.title}
          status={data.status}
        />
      </div>
      <AdminEventDetailView event={data} />
    </>
  )
}

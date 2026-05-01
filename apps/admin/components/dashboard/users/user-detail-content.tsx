'use client'

import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { useTRPC } from '@/lib/trpc'
import { BackButton } from '@/components/dashboard/users/back-button'
import { AttendeeDetailView } from '@/components/dashboard/users/attendee-detail'
import { OrganizerDetailView } from '@/components/dashboard/users/organizer-detail'
import { VendorDetailView } from '@/components/dashboard/users/vendor-detail'

const ROLE_BACK_LABEL: Record<'attendee' | 'organizer' | 'vendor', string> = {
  attendee: 'Back to Attendees',
  organizer: 'Back to Organizers',
  vendor: 'Back to Vendors',
}

export function UserDetailContent({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.admin.users.byId.queryOptions({ id })
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-muted h-9 w-32 animate-pulse rounded-md" />
        <div className="bg-muted h-72 animate-pulse rounded-2xl" />
        <div className="bg-muted h-64 animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (isError || !data) {
    notFound()
  }

  return (
    <>
      <BackButton label={ROLE_BACK_LABEL[data.role]} />
      {data.role === 'attendee' ? (
        <AttendeeDetailView user={data} />
      ) : data.role === 'organizer' ? (
        <OrganizerDetailView user={data} />
      ) : (
        <VendorDetailView user={data} />
      )}
    </>
  )
}

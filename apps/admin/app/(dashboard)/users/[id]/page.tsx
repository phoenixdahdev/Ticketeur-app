import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMockUser } from '@/lib/mock-users'
import { BackButton } from '@/components/dashboard/users/back-button'
import { AttendeeDetailView } from '@/components/dashboard/users/attendee-detail'
import { OrganizerDetailView } from '@/components/dashboard/users/organizer-detail'
import { VendorDetailView } from '@/components/dashboard/users/vendor-detail'

const ROLE_BACK_LABEL: Record<'attendee' | 'organizer' | 'vendor', string> = {
  attendee: 'Back to Attendees',
  organizer: 'Back to Organizers',
  vendor: 'Back to Vendors',
}

export async function generateMetadata({
  params,
}: PageProps<'/users/[id]'>): Promise<Metadata> {
  const { id } = await params
  const user = getMockUser(id)
  return { title: user?.name ?? 'User' }
}

export default async function UserDetailPage({
  params,
}: PageProps<'/users/[id]'>) {
  const { id } = await params
  const user = getMockUser(id)
  if (!user) notFound()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          User Management
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Govern permissions, verify identities, and monitor access.
        </p>
      </header>

      <BackButton label={ROLE_BACK_LABEL[user.role]} />

      {user.role === 'attendee' ? (
        <AttendeeDetailView user={user} />
      ) : user.role === 'organizer' ? (
        <OrganizerDetailView user={user} />
      ) : (
        <VendorDetailView user={user} />
      )}
    </div>
  )
}

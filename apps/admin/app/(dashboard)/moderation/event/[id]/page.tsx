import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPendingEvent } from '@/lib/mock-moderation'
import { BackButton } from '@/components/dashboard/users/back-button'
import { EventModDetail } from '@/components/dashboard/moderation/event-mod-detail'

export async function generateMetadata({
  params,
}: PageProps<'/moderation/event/[id]'>): Promise<Metadata> {
  const { id } = await params
  const event = getPendingEvent(id)
  return { title: event ? `Review ${event.title}` : 'Event review' }
}

export default async function EventModerationPage({
  params,
}: PageProps<'/moderation/event/[id]'>) {
  const { id } = await params
  const event = getPendingEvent(id)
  if (!event) notFound()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Admin Moderations &amp; Approvals
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Review pending applications and security-flagged content
        </p>
      </header>

      <BackButton label="Back" />

      <EventModDetail event={event} />
    </div>
  )
}

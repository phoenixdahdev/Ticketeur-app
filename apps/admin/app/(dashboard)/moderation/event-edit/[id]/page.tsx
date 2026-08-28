import type { Metadata } from 'next'

import { EventEditDetailContent } from '@/components/dashboard/moderation/event-edit-detail-content'

export async function generateMetadata({
  params,
}: PageProps<'/moderation/event-edit/[id]'>): Promise<Metadata> {
  const { id } = await params
  return { title: `Edit review ${id.slice(0, 8)}` }
}

export default async function EventEditModerationPage({
  params,
}: PageProps<'/moderation/event-edit/[id]'>) {
  const { id } = await params

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Review event changes
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          The current version stays live until you approve these changes.
        </p>
      </header>

      <EventEditDetailContent id={id} />
    </div>
  )
}

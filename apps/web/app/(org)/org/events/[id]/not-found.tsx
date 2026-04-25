import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar03Icon,
  PlusSignIcon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'

export default function OrgEventNotFound() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <span className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full md:size-20">
        <HugeiconsIcon
          icon={Calendar03Icon}
          className="size-8 md:size-10"
          strokeWidth={1.6}
        />
      </span>

      <div className="flex flex-col gap-2">
        <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          404 — Event not found
        </p>
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          We couldn&apos;t find that event
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-sm leading-6 md:text-base">
          The event you&apos;re looking for might have been deleted or the link
          is wrong. Head back to your events list or create a new one.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="xl" asChild>
          <Link href="/org/events" className="gap-2">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="size-4"
              strokeWidth={2}
            />
            Back to events
          </Link>
        </Button>
        <Button size="xl" variant="outline" asChild>
          <Link href="/org/create-event" className="gap-2">
            <HugeiconsIcon
              icon={PlusSignIcon}
              className="size-4"
              strokeWidth={2}
            />
            Create Event
          </Link>
        </Button>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar03Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'

export default function EventNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-180 flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
      <span className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-full md:size-24">
        <HugeiconsIcon
          icon={Calendar03Icon}
          className="size-10 md:size-12"
          strokeWidth={1.6}
        />
      </span>

      <div className="flex flex-col gap-3">
        <p className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
          404 — Event not found
        </p>
        <h1 className="font-heading text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl">
          We couldn&apos;t find that event
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-base leading-7">
          The event you&apos;re looking for may have ended, been removed, or
          the link could be wrong. Browse what&apos;s coming up next on
          Ticketeur.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="xl" asChild>
          <Link href="/events" className="gap-2">
            Discover events
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4"
              strokeWidth={2}
            />
          </Link>
        </Button>
        <Button size="xl" variant="outline" asChild>
          <Link href="/" className="gap-2">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="size-4"
              strokeWidth={2}
            />
            Back to home
          </Link>
        </Button>
      </div>
    </section>
  )
}

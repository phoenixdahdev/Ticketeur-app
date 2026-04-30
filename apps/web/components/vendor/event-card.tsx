import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar03Icon,
  Location01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

import type { VendorEvent } from '@/lib/vendor-events'

const CATEGORY_TONE: Record<string, string> = {
  MUSIC: 'bg-muted text-muted-foreground',
  TECH: 'bg-muted text-muted-foreground',
  ART: 'bg-muted text-muted-foreground',
  FASHION: 'bg-muted text-muted-foreground',
  FOOD: 'bg-muted text-muted-foreground',
}

export function VendorEventCard({ event }: { event: VendorEvent }) {
  return (
    <article className="border-border/60 bg-background flex flex-col gap-0 overflow-hidden rounded-2xl border shadow-sm shadow-black/[0.02] sm:flex-row">
      <div className="bg-muted relative h-32 shrink-0 sm:h-auto sm:w-32">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 640px) 128px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 items-start gap-3 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="text-foreground text-base font-bold tracking-tight">
            {event.title}
          </h3>
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Calendar03Icon}
                className="size-3.5"
                strokeWidth={1.8}
              />
              {event.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Location01Icon}
                className="size-3.5"
                strokeWidth={1.8}
              />
              {event.location}
            </span>
          </div>
          <Link
            href={`/vendor/events/${event.id}`}
            className="text-primary text-xs font-semibold hover:underline sm:text-sm"
          >
            View details
          </Link>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
            CATEGORY_TONE[event.category] ?? 'bg-muted text-muted-foreground'
          )}
        >
          {event.category}
        </span>
      </div>
    </article>
  )
}

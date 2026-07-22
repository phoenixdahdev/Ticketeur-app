'use client'

import type { JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Location01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

export type VendorEventCard = {
  id: string
  slug: string
  tag: string
  date: string
  title: string
  description: string
  location: string
  attendees: string
  imageUrl: string
}

// Real event data has no category/type column yet, so `tag` is always
// 'Event' — that falls through to the muted fallback below. The tone map
// stays in place for when event categories ship.
const TAG_TONES: Record<string, string> = {
  Tech: 'bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e40af]/20',
  Music: 'bg-[#fce7f3] text-[#be185d] dark:bg-[#be185d]/20',
  Workshop: 'bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20',
}

export function VendorEventsTab({
  upcoming,
  past,
}: {
  upcoming: VendorEventCard[]
  past: VendorEventCard[]
}): JSX.Element {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <EventSection
        headingId="upcoming-events-heading"
        title="Upcoming Events"
        events={upcoming}
        emptyTitle="No Upcoming Events Yet"
        emptyDescription="This vendor hasn't announced any upcoming events yet — check back soon."
      />
      <EventSection
        headingId="past-events-heading"
        title="Past Events Served"
        events={past}
        emptyTitle="No Past Events Yet"
        emptyDescription="This vendor's past event history will show up here once available."
      />
    </div>
  )
}

function EventSection({
  headingId,
  title,
  events,
  emptyTitle,
  emptyDescription,
}: {
  headingId: string
  title: string
  events: VendorEventCard[]
  emptyTitle: string
  emptyDescription: string
}) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h2
        id={headingId}
        className="font-heading text-foreground text-2xl font-semibold"
      >
        {title}
      </h2>

      {events.length === 0 ? (
        <div className="border-border bg-muted/20 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
          <p className="font-heading text-foreground text-lg font-semibold">
            {emptyTitle}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {events.map((event, i) => (
            <EventListItem key={event.id} event={event} index={i} />
          ))}
        </ul>
      )}
    </section>
  )
}

function EventListItem({
  event,
  index,
}: {
  event: VendorEventCard
  index: number
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg md:flex-row md:items-center md:gap-5 md:p-5"
      >
        <div className="relative aspect-[160/120] w-full shrink-0 overflow-hidden rounded-xl bg-muted md:aspect-auto md:h-[120px] md:w-[180px]">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(min-width: 768px) 180px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span
              className={cn(
                'inline-flex rounded px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
                TAG_TONES[event.tag] ?? 'bg-muted text-muted-foreground'
              )}
            >
              {event.tag}
            </span>
            <span className="text-xs font-medium text-muted-foreground md:text-sm">
              {event.date}
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
          )}
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground md:text-sm">
            <li className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Location01Icon}
                className="size-4"
                strokeWidth={1.6}
              />
              {event.location}
            </li>
            {event.attendees && (
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  className="size-4"
                  strokeWidth={1.6}
                />
                {event.attendees}
              </li>
            )}
          </ul>
        </div>
      </Link>
    </motion.li>
  )
}

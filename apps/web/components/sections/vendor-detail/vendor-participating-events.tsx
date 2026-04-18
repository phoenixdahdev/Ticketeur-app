'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Location01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import type { VendorRecord } from '@/lib/vendors'

type Event = NonNullable<VendorRecord['participatingEvents']>[number]

const TAG_TONES: Record<string, string> = {
  Tech: 'bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e40af]/20',
  Music: 'bg-[#fce7f3] text-[#be185d] dark:bg-[#be185d]/20',
  Workshop: 'bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20',
}

export function VendorParticipatingEvents({
  events,
}: {
  events: Event[]
}) {
  if (events.length === 0) return null

  return (
    <section
      aria-labelledby="participating-events-title"
      className="w-full px-5 py-10 md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:gap-8">
        <motion.h2
          id="participating-events-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Participating Events
        </motion.h2>

        <ul className="flex flex-col gap-4">
          {events.map((event, i) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -2 }}
            >
              <Link
                href={`/events/${event.id}`}
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
                        TAG_TONES[event.tag] ??
                          'bg-muted text-muted-foreground'
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
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground md:text-sm">
                    <li className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        className="size-4"
                        strokeWidth={1.6}
                      />
                      {event.location}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={UserGroupIcon}
                        className="size-4"
                        strokeWidth={1.6}
                      />
                      {event.attendees}
                    </li>
                  </ul>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

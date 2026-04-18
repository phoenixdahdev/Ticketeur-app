'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

import { EventCard, type EventCardProps } from '@/components/cards/event-card'

const EVENTS: (EventCardProps & { id: string })[] = [
  {
    id: 'lagos-fest-2026',
    title: 'Lagos Fest 2026',
    category: 'Music',
    price: '₦10,000',
    date: '2026-07-15',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    href: '/events/lagos-fest-2026',
  },
  {
    id: 'gtco-2026',
    title: 'GTCO 2026',
    category: 'Fashion',
    price: '₦20,000',
    date: '2026-08-15',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    href: '/events/gtco-2026',
  },
  {
    id: 'jobberman-tech-event',
    title: 'Jobberman tech event',
    category: 'Tech',
    price: '₦10,000',
    date: '2026-07-15',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    overlayBadge: 'Tech Event',
    href: '/events/jobberman-tech-event',
  },
]

export function DiscoverEvents() {
  return (
    <section
      aria-label="Discover Events"
      className="w-full px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end"
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]">
              Discover Events
            </h2>
            <p className="text-muted-foreground text-base">
              Hand-picked experiences you can&apos;t miss
            </p>
          </div>
          <Link
            href="/events"
            className="group text-primary hover:text-primary-hover inline-flex items-center gap-2 text-base font-medium transition-colors"
          >
            View all
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12">
          {EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

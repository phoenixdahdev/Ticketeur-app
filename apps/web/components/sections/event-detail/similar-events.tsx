'use client'

import { motion } from 'motion/react'

import {
  SmallEventCard,
  type SmallEventCardProps,
} from '@/components/cards/small-event-card'

const SIMILAR: (SmallEventCardProps & { id: string })[] = [
  {
    id: 'lagos-fest-2026-sim',
    title: 'Lagos Fest 2026',
    category: 'Music',
    status: 'upcoming',
    price: '₦10,000',
    date: '2026-07-15',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
    href: '/events/lagos-fest-2026',
  },
  {
    id: 'asake-money-concert',
    title: 'Asake (Mr Money) Concert',
    category: 'Music',
    status: 'upcoming',
    price: '₦20,000',
    date: '2026-08-20',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=800&q=80',
    href: '/events/asake-money-concert',
  },
  {
    id: 'big-wiz-live-lagos',
    title: 'Big Wiz Live in Lagos',
    category: 'Music',
    status: 'upcoming',
    price: '₦10,000',
    date: '2026-09-10',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
    href: '/events/big-wiz-live-lagos',
  },
]

export function SimilarEvents() {
  return (
    <section aria-label="Similar events" className="w-full px-5 md:px-10">
      <div className="mx-auto max-w-[1440px] py-10 md:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-foreground mb-6 text-2xl font-semibold tracking-tight"
        >
          Similar Events
        </motion.h2>
        <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-8 [&::-webkit-scrollbar]:hidden">
          {SIMILAR.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-[85%] shrink-0 snap-start sm:w-auto"
            >
              <SmallEventCard {...event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

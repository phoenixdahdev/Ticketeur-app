'use client'

import { motion } from 'motion/react'

import {
  FeaturedEventCard,
  type FeaturedEventCardProps,
} from '@/components/cards/featured-event-card'

const FEATURED: (FeaturedEventCardProps & { id: string })[] = [
  {
    id: 'lagos-fest-2026',
    title: 'Lagos Fest 2026',
    price: '₦10,000',
    date: '2026-07-15',
    location: 'Victoria Island, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    badge: { label: 'Trending', tone: 'green' },
    href: '/events/lagos-fest-2026',
  },
  {
    id: 'future-tech-summit',
    title: 'Future Tech Summit',
    price: '₦5,000',
    date: '2026-10-21',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    badge: { label: 'Hot Seller', tone: 'blue' },
    href: '/events/future-tech-summit',
  },
  {
    id: 'modern-art-expo',
    title: 'Modern Art Expo',
    price: 'Free Entry',
    date: '2026-09-04',
    location: 'Mawuri, Abuja',
    imageUrl:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
    badge: { label: 'Free', tone: 'gray' },
    href: '/events/modern-art-expo',
  },
]

export function FeaturedEvents() {
  return (
    <section aria-label="Featured Events" className="w-full px-5 md:px-10">
      <div className="mx-auto max-w-360 py-10 md:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-foreground mb-6 text-2xl font-semibold tracking-tight md:text-2xl"
        >
          Featured Events
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-8.75">
          {FEATURED.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <FeaturedEventCard {...event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

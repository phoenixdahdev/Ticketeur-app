'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'

import { SmallEventCard } from '@/components/cards/small-event-card'
import { useTRPC } from '@/lib/trpc'
import { formatNaira } from '@/lib/event-display'

const PLACEHOLDER = '/hero-bg.png'

export function SimilarEvents({ eventId }: { eventId: string }) {
  const trpc = useTRPC()
  const { data: events = [], isLoading } = useQuery(
    trpc.public.events.similar.queryOptions({ id: eventId })
  )

  if (!isLoading && events.length === 0) return null

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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-72 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-8 [&::-webkit-scrollbar]:hidden">
            {events.map((event, i) => (
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
                <SmallEventCard
                  id={event.id}
                  title={event.title}
                  category=""
                  status="upcoming"
                  price={
                    event.minPrice > 0 ? formatNaira(event.minPrice) : 'Free'
                  }
                  date={event.eventDate}
                  location={event.location}
                  imageUrl={event.bannerUrl ?? PLACEHOLDER}
                  href={`/events/${event.id}`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

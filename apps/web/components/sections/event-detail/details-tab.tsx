'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'

import type { EventDetailData } from '@/components/sections/event-detail/types'

export function DetailsTab({ event }: { event: EventDetailData }) {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <section aria-labelledby="about-heading" className="flex flex-col gap-4">
        <h2
          id="about-heading"
          className="font-heading text-2xl font-semibold text-foreground"
        >
          About the Event
        </h2>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-[#484848] md:text-base dark:text-muted-foreground">
          {event.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="flex flex-col gap-4"
      >
        <h2
          id="features-heading"
          className="font-heading text-2xl font-semibold text-foreground"
        >
          Features
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:flex md:flex-wrap md:gap-6">
          {event.features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: i * 0.05,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#d4c0ff] bg-[#f1ebff] px-6 py-6 md:min-w-[155px] dark:border-primary/30 dark:bg-primary/10"
            >
              <HugeiconsIcon
                icon={feature.icon}
                className="size-[30px] text-primary"
                strokeWidth={1.8}
              />
              <span className="text-center text-sm font-semibold text-[#282828] md:text-base dark:text-foreground">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

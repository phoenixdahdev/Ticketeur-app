'use client'

import { motion } from 'motion/react'

export function EventsPageHeader() {
  return (
    <section
      aria-labelledby="events-page-title"
      className="w-full px-5 md:px-10 lg:px-10"
    >
      <div className="mx-auto max-w-[1440px] pt-10 pb-6 md:pt-14 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2.5"
        >
          <h1
            id="events-page-title"
            className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]"
          >
            Discover Events
          </h1>
          <p className="font-heading text-muted-foreground text-base font-medium md:text-lg">
            The most secure and moderated event marketplace. Verified tickets,
            guaranteed entry.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

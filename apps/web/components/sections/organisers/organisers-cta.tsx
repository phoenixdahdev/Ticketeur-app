'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

import { Button } from '@ticketur/ui/components/button'

export function OrganisersCta() {
  return (
    <section
      aria-labelledby="organisers-cta-title"
      className="w-full px-5 py-20 md:px-10 md:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 text-center md:gap-8"
      >
        <h2
          id="organisers-cta-title"
          className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]"
        >
          Ready to host your next masterpiece?
        </h2>
        <p className="font-heading text-muted-foreground max-w-[680px] text-base leading-relaxed md:text-xl md:font-normal">
          Join thousands of professional organizers who trust Ticketur for their
          most important events.
        </p>
        <Button size="xl" asChild className="w-fit">
          <Link href="/organizers/new">Organize an Event</Link>
        </Button>
      </motion.div>
    </section>
  )
}

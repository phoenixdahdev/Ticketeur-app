'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

import { Button } from '@ticketur/ui/components/button'

export function VendorsCta() {
  return (
    <section
      aria-labelledby="vendors-cta-title"
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
          id="vendors-cta-title"
          className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-[40px] md:leading-[1.15]"
        >
          Ready to take your business to the next stage?
        </h2>
        <p className="max-w-[680px] text-base leading-relaxed text-muted-foreground md:text-lg">
          Apply today to join our elite vendor community and get discovered by
          top-tier event organisers.
        </p>
        <Button size="xl" asChild className="w-fit">
          <Link href="/vendors/apply">Join as a Vendor</Link>
        </Button>
      </motion.div>
    </section>
  )
}

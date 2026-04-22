'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'

import { Button } from '@ticketur/ui/components/button'

export function OrganisersHero() {
  return (
    <section
      aria-labelledby="organisers-hero-title"
      className="w-full px-5 pt-10 pb-12 md:px-10 md:pt-16 md:pb-20"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14 lg:gap-[57px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 md:gap-12"
        >
          <div className="flex flex-col gap-6">
            <h1
              id="organisers-hero-title"
              className="font-heading text-foreground text-4xl leading-[1.1] font-bold tracking-tight md:text-[52px] md:leading-[1.05] lg:text-[60px]"
            >
              Empower Your Events with{' '}
              <span className="text-primary">Ticketeur</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
              Host your next event with confidence. Access a secure, moderated
              marketplace designed for professional organisers to manage
              ticketing and vendors flawlessly.
            </p>
          </div>
          <Button size="xl" asChild className="w-fit">
            <Link href="/organizers/new">Organize an Event</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="bg-muted relative aspect-[768/516] w-full overflow-hidden rounded-[20px]"
        >
          <Image
            src="/organiser-image.png"
            alt="Professional organisers at work"
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}

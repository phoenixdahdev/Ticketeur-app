'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, LockIcon } from '@hugeicons/core-free-icons'

import { AnimatedShield } from './animated-shield'

const BULLETS = [
  'Manual brand verification for every application',
  'Curated marketplace to maintain brand integrity',
  'Transparent communication with organizers',
] as const

export function VendorsModerated() {
  return (
    <section
      aria-labelledby="vendors-moderated-title"
      className="w-full bg-[#f1ebff] px-5 py-16 md:px-10 md:py-24 dark:bg-[oklch(0.22_0.04_288)]"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 md:gap-8"
        >
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-primary text-primary-foreground inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase"
          >
            <HugeiconsIcon
              icon={LockIcon}
              className="size-3.5"
              strokeWidth={2}
            />
            Secure Marketplace
          </motion.span>

          <div className="flex flex-col gap-5">
            <h2
              id="vendors-moderated-title"
              className="font-heading dark:text-foreground text-3xl font-bold tracking-tight text-[#282828] md:text-[40px] md:leading-[1.15]"
            >
              A Moderated Ecosystem for Quality Brands
            </h2>
            <p className="dark:text-muted-foreground text-sm leading-relaxed text-[#484848] md:text-base">
              Ticketeur is not an open-for-all directory. We pride ourselves on
              manual moderation and brand verification. Every vendor on our
              platform meets strict quality guidelines, ensuring that organizers
              and attendees interact with only the most professional businesses.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {BULLETS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: 0.15 + i * 0.08,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3"
              >
                <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-3.5"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="dark:text-foreground text-sm font-medium text-[#282828] md:text-base">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="relative mx-auto flex w-full max-w-[360px] items-center justify-center md:max-w-none">
          <AnimatedShield className="w-full max-w-[320px] md:max-w-[380px]" />
        </div>
      </div>
    </section>
  )
}

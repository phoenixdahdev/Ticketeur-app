'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { LockIcon, Tick01Icon, UserIcon } from '@hugeicons/core-free-icons'

const BULLETS = [
  'Verified Professional Accounts',
  'Anti-Fraud Protection',
  'Escrow-Style Payments',
  'Direct Organizer Support',
] as const

type MetricCard = {
  icon: IconSvgElement
  title: string
  description: string
  fill: number
}

const METRICS: MetricCard[] = [
  {
    icon: UserIcon,
    title: 'Identity Verification',
    description: '100% of hosts are verified',
    fill: 1,
  },
  {
    icon: LockIcon,
    title: 'Secure Transactions',
    description: 'SSL encrypted payment gateway',
    fill: 1,
  },
]

export function OrganisersTrust() {
  return (
    <section
      aria-labelledby="organisers-trust-title"
      className="w-full bg-[#f1ebff] px-5 py-16 md:px-10 md:py-24 dark:bg-[oklch(0.22_0.04_288)]"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 md:gap-10"
        >
          <div className="flex flex-col gap-5">
            <h2
              id="organisers-trust-title"
              className="font-heading dark:text-foreground text-3xl font-bold tracking-tight text-[#282828] md:text-[40px] md:leading-[1.15]"
            >
              Built on a Foundation of Trust
            </h2>
            <p className="font-heading dark:text-muted-foreground text-sm leading-relaxed text-[#484848] md:text-lg md:font-normal">
              Unlike other open marketplaces, Ticketeur is a moderated platform.
              Every organiser, vendor, and event is vetted to ensure high
              quality and prevent fraudulent activities. We protect your
              reputation and your revenue.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            {BULLETS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3"
              >
                <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon
                    icon={Tick01Icon}
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            delay: 0.1,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="dark:bg-card flex flex-col gap-6 rounded-3xl border border-[#c6c6c6] bg-white p-6 md:gap-7 md:p-8 dark:border-white/10"
        >
          {METRICS.map((metric, i) => (
            <div key={metric.title} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="text-primary dark:bg-primary/15 flex size-10 items-center justify-center rounded-full bg-[#f1ebff]">
                  <HugeiconsIcon
                    icon={metric.icon}
                    className="size-5"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-foreground text-base font-semibold">
                    {metric.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {metric.description}
                  </span>
                </div>
              </div>
              <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.fill * 100}%` }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    delay: 0.3 + i * 0.15,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

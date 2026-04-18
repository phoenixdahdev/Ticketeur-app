'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  Analytics01Icon,
  SecurityCheckIcon,
  ToolsIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

type Feature = {
  icon: IconSvgElement
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: ToolsIcon,
    title: 'Effortless Management',
    description:
      'Advanced tools to list, track, and manage every event detail with total ease and clarity.',
  },
  {
    icon: SecurityCheckIcon,
    title: 'Secure Ticketing',
    description:
      'Prevent overselling with our high-integrity, moderated ticketing system designed for scale.',
  },
  {
    icon: UserGroupIcon,
    title: 'Vendor Integration',
    description:
      'Easily assign registered vendors from our verified pool for your specific event needs.',
  },
  {
    icon: Analytics01Icon,
    title: 'Real-time Analytics',
    description:
      'Track ticket sales velocity and vendor participation metrics as they happen with live dashboards.',
  },
]

export function OrganisersFeatures() {
  return (
    <section
      aria-labelledby="organisers-features-title"
      className="w-full px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2.5 md:mx-auto md:max-w-[640px] md:text-center"
        >
          <h2
            id="organisers-features-title"
            className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]"
          >
            Key Features for Organizers
          </h2>
          <p className="text-muted-foreground text-base">
            Everything you need to manage successful events and reliable vendors
            in one centralized platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="bg-card hover:border-primary/30 dark:hover:border-primary/40 flex flex-col gap-10 rounded-[15px] border border-[#c6c6c6] p-6 transition-colors dark:border-white/10"
            >
              <div className="text-primary dark:bg-primary/15 flex size-[62px] items-center justify-center rounded-[10px] bg-[#f1ebff]">
                <HugeiconsIcon
                  icon={feature.icon}
                  className="size-[30px]"
                  strokeWidth={1.8}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="font-heading text-foreground text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

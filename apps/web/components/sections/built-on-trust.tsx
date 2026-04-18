'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  QrCode01Icon,
  SecurityCheckIcon,
  Shield01Icon,
} from '@hugeicons/core-free-icons'

type TrustItem = {
  icon: IconSvgElement
  title: string
  description: string
}

const ITEMS: TrustItem[] = [
  {
    icon: SecurityCheckIcon,
    title: 'Verified Organisers',
    description:
      'Every event host undergoes a rigorous verification process to prevent fraud and ensure event quality.',
  },
  {
    icon: QrCode01Icon,
    title: 'Secure Digital Tickets',
    description:
      'Tickets are issued as unique encrypted digital tokens that can’t be duplicated or stolen.',
  },
  {
    icon: Shield01Icon,
    title: 'Buyer Protection',
    description:
      'Our marketplace ensures that every transaction is secure and every ticket is 100% authentic.',
  },
]

export function BuiltOnTrust() {
  return (
    <section
      aria-label="Built on Trust"
      className="bg-background w-full px-5 py-16 md:px-10 md:py-20"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2.5 md:mx-auto md:max-w-[640px] md:text-center"
        >
          <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]">
            Built on Trust
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            We prioritize safety at every step. Our moderated marketplace
            ensures every ticket is authentic and every transaction is secure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-20">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                delay: 0.08 + i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-start gap-4 md:items-center md:gap-10 md:text-center"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 360, damping: 18 }}
                className="text-primary dark:bg-primary/15 flex size-[62px] items-center justify-center rounded-[10px] bg-[#f1ebff]"
              >
                <HugeiconsIcon
                  icon={item.icon}
                  className="size-[30px]"
                  strokeWidth={1.8}
                />
              </motion.div>
              <div className="flex flex-col gap-2.5">
                <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight md:text-xl">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

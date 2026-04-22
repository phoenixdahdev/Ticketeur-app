'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

import {
  VendorCard,
  type VendorCardProps,
} from '@/components/cards/vendor-card'

const VENDORS: (VendorCardProps & { id: string })[] = [
  {
    id: 'gourmet-delights',
    name: 'Gourmet Delights',
    description:
      'Premium catering services specializing in international fusion cuisine.',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    href: '/vendors/gourmet-delights',
  },
  {
    id: 'liquid-dreams',
    name: 'Liquid Dreams',
    description:
      'Experience our signature "Neon Mule" and other molecular mixology delights.',
    imageUrl:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    href: '/vendors/liquid-dreams',
  },
  {
    id: 'glow-threads',
    name: 'Glow Threads',
    description:
      'Exclusive LED-integrated apparel and limited edition artist collaborations.',
    imageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80',
    href: '/vendors/glow-threads',
  },
  {
    id: 'prism-arts',
    name: 'Prism Arts',
    description:
      'Browse and purchase unique digital collectibles and interactive physical pieces.',
    imageUrl:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80',
    href: '/vendors/prism-arts',
  },
]

export function FeaturedVendors() {
  return (
    <section
      aria-label="Featured Vendors"
      className="border-border bg-background w-full border-t px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end"
        >
          <div className="flex max-w-[560px] flex-col gap-2">
            <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.15]">
              Our Featured Vendors
            </h2>
            <p className="text-muted-foreground text-base">
              Top-rated professionals providing world-class services for events
            </p>
          </div>
          <Link
            href="/vendors/list"
            className="group text-primary hover:text-primary-hover inline-flex items-center gap-2 text-base font-medium transition-colors"
          >
            View all
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {VENDORS.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <VendorCard {...vendor} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

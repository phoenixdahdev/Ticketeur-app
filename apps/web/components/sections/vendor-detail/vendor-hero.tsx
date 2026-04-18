'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft02Icon,
  Calendar03Icon,
  Location01Icon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons'

import type { VendorRecord } from '@/lib/vendors'

export function VendorHero({
  vendor,
  bannerUrl,
}: {
  vendor: VendorRecord
  bannerUrl?: string
}) {
  const banner =
    bannerUrl ??
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80'

  return (
    <section
      aria-label="Vendor hero"
      className="w-full px-5 pt-4 md:px-10 md:pt-6"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:gap-8">
        <Link
          href="/vendors/list"
          aria-label="Back to all vendors"
          className="inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            className="size-6"
            strokeWidth={1.8}
          />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
        >
          <div className="relative aspect-[1360/360] w-full overflow-hidden rounded-[20px] bg-muted md:aspect-[1360/320]">
            <Image
              src={banner}
              alt=""
              fill
              priority
              sizes="(min-width: 1440px) 1360px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-4 -mt-16 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-lg md:mx-8 md:-mt-20 md:flex-row md:items-center md:gap-6 md:p-6"
          >
            <div className="relative size-[96px] shrink-0 overflow-hidden rounded-xl bg-muted md:size-[120px]">
              <Image
                src={vendor.imageUrl}
                alt={vendor.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {vendor.name}
                </h1>
                <span className="inline-flex rounded bg-[#f1f1f1] px-2 py-1 text-xs font-semibold tracking-wider text-[#6d6d6d] uppercase dark:bg-white/10 dark:text-muted-foreground">
                  {vendor.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                {vendor.shortDescription}
              </p>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="size-4"
                    strokeWidth={1.6}
                  />
                  {vendor.location}
                </li>
                <li className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    className="size-4"
                    strokeWidth={1.6}
                  />
                  Partner since {vendor.partnerSince}
                </li>
                <li className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Ticket01Icon}
                    className="size-4"
                    strokeWidth={1.6}
                  />
                  {vendor.hostedEvents} Hosted Events
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

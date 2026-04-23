'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkBadge02Icon,
  Diamond01Icon,
  InformationCircleIcon,
  Location01Icon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons'

import type { ParticipatingVendor } from '@/components/sections/event-detail/vendor-data'

export function VendorDetailView({
  vendor,
  onBack,
}: {
  vendor: ParticipatingVendor
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-primary hover:text-primary-hover font-medium transition-colors"
        >
          Vendors
        </button>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="text-muted-foreground size-4"
          strokeWidth={2}
        />
        <span className="text-foreground font-semibold">{vendor.name}</span>
      </nav>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 md:flex-row md:items-center md:gap-6 md:p-6"
      >
        <div className="bg-muted relative size-[120px] shrink-0 overflow-hidden rounded-xl md:size-[140px]">
          <Image
            src={vendor.imageUrl}
            alt={vendor.name}
            fill
            sizes="140px"
            className="object-cover"
          />
          {vendor.certified ? (
            <div className="bg-primary text-primary-foreground absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full shadow-md">
              <HugeiconsIcon
                icon={CheckmarkBadge02Icon}
                className="size-4"
                strokeWidth={2}
              />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-3xl">
              {vendor.name}
            </h2>
            <span className="dark:text-muted-foreground inline-flex rounded bg-[#f1f1f1] px-2 py-1 text-xs font-semibold tracking-wider text-[#6d6d6d] uppercase dark:bg-white/10">
              {vendor.category}
            </span>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            {vendor.shortDescription}
          </p>
          <ul className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
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
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 md:gap-6 md:p-6"
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="text-primary size-5"
            strokeWidth={1.8}
          />
          <h3 className="font-heading text-foreground text-lg font-semibold md:text-xl">
            About the Vendor
          </h3>
        </div>
        <div className="text-muted-foreground flex flex-col gap-4 text-sm leading-relaxed md:text-base">
          {vendor.fullDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="border-border grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3 sm:gap-4">
          <Stat label="Expertise" value={vendor.expertise} />
          <Stat label="Focus" value={vendor.focus} />
          <Stat label="Experience" value={vendor.experience} />
        </div>
      </motion.section>

      {(vendor.certified || vendor.premium) && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.16,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="border-primary/20 dark:bg-primary/10 dark:border-primary/30 flex flex-col gap-4 rounded-2xl border bg-[#f1ebff] p-5 md:gap-5 md:p-6"
        >
          <h3 className="font-heading text-foreground text-lg font-semibold">
            Vendor Quality
          </h3>
          <ul className="flex flex-col gap-3">
            {vendor.certified ? (
              <QualityItem
                icon={CheckmarkBadge02Icon}
                title="Certified Partner"
                description="Fully vetted and verified by the Ticketeur platform."
              />
            ) : null}
            {vendor.premium ? (
              <QualityItem
                icon={Diamond01Icon}
                title="Premium Tier"
                description="Consistent delivery of high-quality event experiences."
              />
            ) : null}
          </ul>
        </motion.section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="dark:bg-primary/10 flex flex-col gap-1 rounded-xl bg-[#f1ebff] px-4 py-3">
      <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  )
}

function QualityItem({
  icon,
  title,
  description,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]['icon']
  title: string
  description: string
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="bg-primary/15 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
        <HugeiconsIcon icon={icon} className="size-4" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground font-semibold">{title}</span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </div>
    </li>
  )
}

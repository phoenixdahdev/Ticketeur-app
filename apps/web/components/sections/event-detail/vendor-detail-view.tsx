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
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Vendors
        </button>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4 text-muted-foreground"
          strokeWidth={2}
        />
        <span className="font-semibold text-foreground">{vendor.name}</span>
      </nav>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center md:gap-6 md:p-6"
      >
        <div className="relative size-[120px] shrink-0 overflow-hidden rounded-xl bg-muted md:size-[140px]">
          <Image
            src={vendor.imageUrl}
            alt={vendor.name}
            fill
            sizes="140px"
            className="object-cover"
          />
          {vendor.certified ? (
            <div className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
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
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {vendor.name}
            </h2>
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
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:gap-6 md:p-6"
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="size-5 text-primary"
            strokeWidth={1.8}
          />
          <h3 className="font-heading text-lg font-semibold text-foreground md:text-xl">
            About the Vendor
          </h3>
        </div>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {vendor.fullDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3 sm:gap-4">
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
          className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-[#f1ebff] p-5 md:gap-5 md:p-6 dark:bg-primary/10 dark:border-primary/30"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Vendor Quality
          </h3>
          <ul className="flex flex-col gap-3">
            {vendor.certified ? (
              <QualityItem
                icon={CheckmarkBadge02Icon}
                title="Certified Partner"
                description="Fully vetted and verified by the Ticketur platform."
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
    <div className="flex flex-col gap-1 rounded-xl bg-[#f1ebff] px-4 py-3 dark:bg-primary/10">
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-semibold text-foreground">{value}</span>
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
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <HugeiconsIcon icon={icon} className="size-4" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </li>
  )
}

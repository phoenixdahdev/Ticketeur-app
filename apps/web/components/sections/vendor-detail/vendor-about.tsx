'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkBadge02Icon,
  Diamond01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons'

import type { VendorRecord } from '@/lib/vendors'

export function VendorAbout({ vendor }: { vendor: VendorRecord }) {
  return (
    <section
      aria-labelledby="vendor-about-title"
      className="w-full px-5 py-10 md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:gap-6 md:p-6"
        >
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              className="size-5 text-primary"
              strokeWidth={1.8}
            />
            <h2
              id="vendor-about-title"
              className="font-heading text-lg font-semibold text-foreground md:text-xl"
            >
              About the Vendor
            </h2>
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
        </motion.div>

        {(vendor.certified || vendor.premium) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              delay: 0.1,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-[#f1ebff] p-5 md:gap-5 md:p-6 dark:border-primary/30 dark:bg-primary/10"
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
          </motion.div>
        )}
      </div>
    </section>
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

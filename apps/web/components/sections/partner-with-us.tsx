'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  CheckmarkBadge02Icon,
  DeliveryTruck01Icon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'

type PartnerCardProps = {
  icon: IconSvgElement
  title: string
  description: string
  cta: {
    label: string
    href: string
    variant: 'default' | 'outline-primary'
  }
  delay: number
}

function PartnerCard({
  icon,
  title,
  description,
  cta,
  delay,
}: PartnerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="dark:bg-card flex flex-1 flex-col gap-4 rounded-2xl border border-[#ededed] bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg md:gap-[23px] md:px-4 md:py-6 dark:border-white/10 dark:shadow-none dark:hover:shadow-[0_0_0_1px_var(--primary)]"
    >
      <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg md:size-[30px] md:bg-transparent">
        <HugeiconsIcon
          icon={icon}
          className="size-6 md:size-[30px]"
          strokeWidth={1.6}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-heading dark:text-foreground text-lg font-semibold tracking-tight text-[#1e1e1e] md:text-xl">
          {title}
        </h3>
        <p className="dark:text-muted-foreground text-sm leading-relaxed text-[#484848] md:text-base">
          {description}
        </p>
      </div>
      <Button
        size="xl"
        variant={cta.variant}
        asChild
        className="mt-auto w-full"
      >
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </motion.div>
  )
}

export function PartnerWithUs() {
  return (
    <section
      aria-label="Partner with us"
      className="w-full bg-[#f1ebff] px-5 py-16 md:px-10 md:py-24 dark:bg-[oklch(0.22_0.04_288)]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-stretch gap-10 md:flex-row md:items-center md:gap-12 lg:gap-[53px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 md:flex-1 md:gap-10"
        >
          <div className="flex flex-col gap-2.5 md:max-w-[483px]">
            <h2 className="font-heading dark:text-foreground text-2xl font-bold tracking-tight text-[#282828] md:text-[40px] md:leading-[1.2]">
              Partner with Us
            </h2>
            <p className="dark:text-muted-foreground font-sans text-sm font-medium text-[#484848] md:text-base md:font-normal">
              Whether you&rsquo;re organizing an event or providing essential
              services for events. Ticketur gives you the tools to grow and
              manage your business securely.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:gap-[19px]">
            <PartnerCard
              icon={Ticket01Icon}
              title="For Organisers"
              description="Create events, manage ticket inventory, and track real-time sales data."
              cta={{
                label: 'Organize an event',
                href: '/organizers',
                variant: 'default',
              }}
              delay={0.1}
            />
            <PartnerCard
              icon={DeliveryTruck01Icon}
              title="For Vendors"
              description="Reach thousands of event planners looking for food, sound, lighting, and so on."
              cta={{
                label: 'Join as a Vendor',
                href: '/vendors',
                variant: 'outline-primary',
              }}
              delay={0.2}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            delay: 0.15,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full shrink-0 md:max-w-[700px] md:flex-1"
        >
          <div className="relative aspect-[700/600] w-full overflow-hidden rounded-2xl">
            <Image
              src="/partner-image.png"
              alt="Partners connecting"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              delay: 0.5,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="dark:bg-card absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-[#f1f5f9] bg-white p-2 shadow-md md:bottom-6 md:left-6 md:gap-2.5 md:rounded-2xl md:p-4 dark:border-white/10 dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] md:size-10">
              <HugeiconsIcon
                icon={CheckmarkBadge02Icon}
                className="size-4 text-[#24ba59] md:size-6"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col">
              <span className="dark:text-foreground text-xs font-semibold text-[#1e1e1e] md:text-sm">
                500+ Active Partners
              </span>
              <span className="dark:text-muted-foreground text-[10px] text-[#6d6d6d] md:text-xs">
                Trusted worldwide
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon, Location01Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { formatLongDate } from '@/lib/date'

export type BadgeTone = 'green' | 'blue' | 'gray' | 'purple' | 'amber'

export type FeaturedEventCardProps = {
  id?: string
  title: string
  price: string
  date: string | Date
  location: string
  imageUrl: string
  badge?: { label: string; tone?: BadgeTone }
  href?: string
  className?: string
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  green: 'bg-[#24ba59]/15 text-[#24ba59]',
  blue: 'bg-[#135bec]/15 text-[#135bec]',
  gray: 'bg-[#ededed] text-[#484848] dark:bg-white/10 dark:text-muted-foreground',
  purple: 'bg-primary/12 text-primary',
  amber: 'bg-[#f59e0b]/15 text-[#b45309]',
}

export function FeaturedEventCard({
  title,
  price,
  date,
  location,
  imageUrl,
  badge,
  href = '#',
  className,
}: FeaturedEventCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'group border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-xl',
        className
      )}
    >
      <div className="bg-muted relative aspect-[430/221] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 430px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          {badge ? (
            <span
              className={cn(
                'inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium tracking-wider uppercase',
                TONE_CLASSES[badge.tone ?? 'green']
              )}
            >
              {badge.label}
            </span>
          ) : (
            <span />
          )}
          <span className="font-heading text-primary text-lg font-bold">
            {price}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-foreground text-xl font-bold tracking-tight">
            {title}
          </h3>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <HugeiconsIcon
              icon={Calendar03Icon}
              className="size-4 shrink-0"
              strokeWidth={1.6}
            />
            <span>{formatLongDate(date)}</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <HugeiconsIcon
              icon={Location01Icon}
              className="size-4 shrink-0"
              strokeWidth={1.6}
            />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <Button
          variant="outline-primary"
          size="xl"
          asChild
          className="mt-auto w-full"
        >
          <Link href={href}>Buy Ticket</Link>
        </Button>
      </div>
    </motion.article>
  )
}

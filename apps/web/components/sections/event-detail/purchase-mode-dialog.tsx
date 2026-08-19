'use client'

import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Location01Icon,
  UserIcon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

import { cn } from '@ticketur/ui/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@ticketur/ui/components/dialog'

export type PurchaseMode = 'self' | 'group'

// The modal that opens from any "Buy Ticket" entry point: the buyer picks
// whether they're buying for themselves (quick, single) or for multiple
// attendees (bulk, each ticket emailed to a different person).
export function PurchaseModeDialog({
  open,
  onOpenChange,
  event,
  maxGroupTickets = 50,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: {
    title: string
    dateLabel: string
    location: string
    imageUrl: string
  }
  maxGroupTickets?: number
  onSelect: (mode: PurchaseMode) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-2xl flex-col gap-8 p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground text-center text-2xl font-bold md:text-3xl">
            Purchase Mode
          </DialogTitle>
        </DialogHeader>

        {/* Event summary */}
        <div className="flex items-center gap-4">
          <div className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-xl md:size-28">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 className="font-heading text-foreground truncate text-xl font-bold md:text-2xl">
              {event.title}
            </h3>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={Calendar03Icon}
                className="text-primary size-4 shrink-0"
                strokeWidth={1.8}
              />
              <span className="truncate">{event.dateLabel}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={Location01Icon}
                className="text-primary size-4 shrink-0"
                strokeWidth={1.8}
              />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Mode options */}
        <div className="border-border flex flex-col gap-4 border-t pt-6">
          <p className="text-muted-foreground text-center text-sm">
            How would you like to purchase the tickets?
          </p>
          <div className="flex flex-col gap-3">
            <ModeOption
              icon={UserIcon}
              title="For Myself"
              description="Purchase a single ticket for yourself. Quick checkout, ticket sent to your email."
              onClick={() => onSelect('self')}
            />
            <ModeOption
              icon={UserMultiple02Icon}
              title="For Multiple Attendees"
              badge="GROUP"
              hint={`Purchase up to ${maxGroupTickets} tickets`}
              description="Buy tickets in bulk and send each one directly to different people's email address."
              onClick={() => onSelect('group')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ModeOption({
  icon,
  title,
  description,
  badge,
  hint,
  onClick,
}: {
  icon: IconSvgElement
  title: string
  description: string
  badge?: string
  hint?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group border-border hover:border-primary/50 hover:bg-primary/5 flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors md:p-5'
      )}
    >
      <span className="bg-primary/10 text-primary border-primary/30 flex size-10 shrink-0 items-center justify-center rounded-lg border">
        <HugeiconsIcon icon={icon} className="size-5" strokeWidth={1.8} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-heading text-foreground text-base font-semibold">
            {title}
          </span>
          {hint ? (
            <span className="text-muted-foreground text-sm">({hint})</span>
          ) : null}
          {badge ? (
            <span className="bg-primary rounded-full px-2 py-0.5 text-[11px] font-semibold text-white">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </span>
      </span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        className="text-muted-foreground group-hover:text-primary mt-1 size-4 shrink-0 transition-colors"
        strokeWidth={2}
      />
    </button>
  )
}

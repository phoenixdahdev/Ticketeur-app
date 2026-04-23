'use client'

import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Mail01Icon,
  Remove01Icon,
  SecurityCheckIcon,
  ShoppingCart01Icon,
  StarIcon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import type {
  TicketTier,
  TicketTierId,
} from '@/components/sections/event-detail/tickets-tab'
import type { EventDetailData } from '@/components/sections/event-detail/types'

const STATUS_STYLES: Record<TicketTier['status'], string> = {
  'sold-out':
    'bg-[#fef2f2] text-[#dc2626] dark:bg-[#dc2626]/15 before:bg-[#dc2626]',
  available:
    'bg-[#dcfce7] text-[#16a34a] dark:bg-[#16a34a]/15 before:bg-[#16a34a]',
  limited:
    'bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20 before:bg-[#b45309]',
}

const STATUS_LABEL: Record<TicketTier['status'], string> = {
  'sold-out': 'Sold Out',
  available: 'Available',
  limited: 'Limited',
}

const TIER_ICON: Record<TicketTierId, IconSvgElement> = {
  early: Ticket01Icon,
  general: Ticket01Icon,
  vip: StarIcon,
}

const TIER_ICON_BG: Record<TicketTierId, string> = {
  early:
    'bg-[#f1f1f1] text-[#9a9a9a] dark:bg-white/10 dark:text-muted-foreground',
  general: 'bg-[#f1ebff] text-primary dark:bg-primary/15',
  vip: 'bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20',
}

export function TicketSelector({
  event,
  tiers,
  quantities,
  onQuantityChange,
  onCheckout,
}: {
  event: EventDetailData
  tiers: TicketTier[]
  quantities: Record<TicketTierId, number>
  onQuantityChange: (id: TicketTierId, qty: number) => void
  onCheckout: () => void
}) {
  const totalQty = tiers.reduce((sum, t) => sum + (quantities[t.id] ?? 0), 0)
  const subtotal = tiers.reduce(
    (sum, t) => sum + t.price * (quantities[t.id] ?? 0),
    0
  )

  const summary = tiers
    .filter((t) => (quantities[t.id] ?? 0) > 0)
    .map((t) => `${quantities[t.id]}x ${t.name} Ticket`)
    .join(', ')

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-foreground text-2xl font-bold">
          Get Ticket
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Select the best experience for you from this event
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {tiers.map((tier) => {
          const qty = quantities[tier.id] ?? 0
          const isSoldOut = tier.status === 'sold-out'
          const isSelected = qty > 0
          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className={cn(
                'bg-card flex flex-col gap-4 rounded-2xl border p-4 transition-colors md:flex-row md:items-center md:gap-6 md:p-5',
                isSelected ? 'border-primary shadow-sm' : 'border-border',
                isSoldOut && 'opacity-75'
              )}
            >
              <div
                className={cn(
                  'flex size-14 shrink-0 items-center justify-center rounded-lg',
                  TIER_ICON_BG[tier.id]
                )}
              >
                <HugeiconsIcon
                  icon={TIER_ICON[tier.id]}
                  className="size-6"
                  strokeWidth={1.8}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-foreground text-base font-semibold md:text-lg">
                    {tier.name}
                  </h3>
                  <StatusPill status={tier.status} />
                </div>
                <p className="text-muted-foreground text-sm">
                  {tier.description}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-primary text-lg font-bold md:text-xl">
                    {tier.priceDisplay}
                  </span>
                  {tier.remaining ? (
                    <span className="text-muted-foreground text-xs">
                      Only {tier.remaining} left
                    </span>
                  ) : null}
                </div>
              </div>

              <QuantityStepper
                value={qty}
                onChange={(v) => onQuantityChange(tier.id, v)}
                disabled={isSoldOut}
              />
            </motion.div>
          )
        })}
      </div>

      <div className="border-border bg-card relative overflow-hidden rounded-2xl border">
        <div
          aria-hidden
          className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 size-40 rounded-full"
        />
        <div className="flex flex-col gap-5 p-5 md:gap-6 md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-foreground text-lg font-bold md:text-xl">
                Order Summary
              </h3>
              <p className="text-muted-foreground text-sm">
                {totalQty > 0
                  ? summary
                  : 'Select one or more tickets above to see your total.'}
              </p>
            </div>
            <div className="flex flex-col gap-0.5 md:text-right">
              <span className="font-heading text-foreground text-2xl font-bold md:text-3xl">
                ₦{subtotal.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs">
                Excl. taxes &amp; fees
              </span>
            </div>
          </div>

          <ul className="border-border text-muted-foreground flex flex-col gap-2 border-t pt-4 text-sm">
            <li className="flex items-center gap-2">
              <HugeiconsIcon
                icon={SecurityCheckIcon}
                className="text-primary size-4"
                strokeWidth={1.8}
              />
              <span>Secure checkout processed by Ticketeur</span>
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="text-primary size-4"
                strokeWidth={1.8}
              />
              <span>Tickets sent instantly to your email</span>
            </li>
          </ul>

          <Button
            size="xl"
            disabled={totalQty === 0}
            onClick={onCheckout}
            className="w-full gap-2"
          >
            <HugeiconsIcon
              icon={ShoppingCart01Icon}
              className="size-5"
              strokeWidth={1.8}
            />
            Checkout Now
          </Button>
        </div>
      </div>

      <span className="sr-only">{event.title} ticket selection</span>
    </div>
  )
}

function StatusPill({ status }: { status: TicketTier['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold before:block before:size-1.5 before:rounded-full',
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function QuantityStepper({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-3 self-end md:self-center">
      <StepButton
        ariaLabel="Decrease quantity"
        disabled={disabled || value <= 0}
        onClick={() => onChange(value - 1)}
      >
        <HugeiconsIcon icon={Remove01Icon} className="size-4" strokeWidth={2} />
      </StepButton>
      <span
        className={cn(
          'min-w-[1.5rem] text-center text-base font-semibold tabular-nums',
          disabled ? 'text-muted-foreground' : 'text-foreground'
        )}
      >
        {value}
      </span>
      <StepButton
        ariaLabel="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
      >
        <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} />
      </StepButton>
    </div>
  )
}

function StepButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  ariaLabel?: string
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'border-border bg-background text-foreground flex size-9 items-center justify-center rounded-full border transition-colors',
        disabled
          ? 'pointer-events-none opacity-40'
          : 'hover:border-primary hover:text-primary'
      )}
    >
      {children}
    </motion.button>
  )
}

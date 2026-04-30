'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

import { useTRPC } from '@/lib/trpc'
import { formatNaira } from '@/lib/event-display'
import type { EventDetailData } from '@/components/sections/event-detail/types'
import { TicketSelector } from '@/components/sections/event-detail/ticket-selector'
import { CheckoutView } from '@/components/sections/event-detail/checkout-view'

export type TicketTierStatus = 'sold-out' | 'available' | 'limited'

export type TicketTier = {
  id: string
  name: string
  status: TicketTierStatus
  description: string
  // Major-unit price (NGN) for display + checkout math.
  price: number
  priceDisplay: string
  remaining: number
  total: number
}

const STATE_KEYS = {
  step: parseAsStringLiteral(['select', 'checkout']).withDefault('select'),
  tier: parseAsString.withDefault(''),
  qty: parseAsInteger.withDefault(0),
}

function deriveTierStatus(remaining: number, total: number): TicketTierStatus {
  if (remaining <= 0) return 'sold-out'
  // "Limited" when ≤25% remain (or fewer than 20 tickets) — tweak as needed.
  if (remaining <= Math.max(20, Math.floor(total * 0.25))) return 'limited'
  return 'available'
}

export function TicketsTab({ event }: { event: EventDetailData }) {
  const trpc = useTRPC()
  const [state, setState] = useQueryStates(STATE_KEYS, { shallow: true })

  const { data, isLoading } = useQuery(
    trpc.public.events.byId.queryOptions({ id: event.id })
  )

  const tiers: TicketTier[] = (data?.tiers ?? []).map((t) => {
    const remaining = Math.max(0, t.quantity - t.sold)
    return {
      id: t.id,
      name: t.name,
      status: deriveTierStatus(remaining, t.quantity),
      description: '',
      price: t.priceMinor / 100,
      priceDisplay: formatNaira(t.priceMinor),
      remaining,
      total: t.quantity,
    }
  })

  // Single-tier checkout: only one tier can have qty > 0 at a time. Picking
  // a tier zeros any previous selection.
  const setTierQty = (tierId: string, qty: number) => {
    const tier = tiers.find((t) => t.id === tierId)
    if (!tier || tier.status === 'sold-out') return
    const cap = tier.remaining
    const clamped = Math.min(Math.max(0, qty), cap)
    if (clamped === 0 && state.tier === tierId) {
      void setState({ tier: null, qty: null })
      return
    }
    void setState({ tier: tierId, qty: clamped || null })
  }

  const quantities: Record<string, number> = {}
  if (state.tier && state.qty > 0) {
    quantities[state.tier] = state.qty
  }

  const goTo = (step: 'select' | 'checkout') => setState({ step })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (tiers.length === 0) {
    return (
      <div className="border-border bg-muted/20 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
        <p className="font-heading text-foreground text-lg font-semibold">
          Tickets aren&apos;t on sale yet
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Check back soon — the organiser will publish tiers when ready.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {state.step === 'select' ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <TicketSelector
              event={event}
              tiers={tiers}
              quantities={quantities}
              onQuantityChange={setTierQty}
              onCheckout={() => goTo('checkout')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <CheckoutView
              event={event}
              tiers={tiers}
              quantities={quantities}
              onBack={() => goTo('select')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

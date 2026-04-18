'use client'

import { AnimatePresence, motion } from 'motion/react'
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs'

import type { EventDetailData } from '@/components/sections/event-detail/types'
import { TicketSelector } from '@/components/sections/event-detail/ticket-selector'
import { CheckoutView } from '@/components/sections/event-detail/checkout-view'

export type TicketTierId = 'early' | 'general' | 'vip'

export type TicketTier = {
  id: TicketTierId
  name: string
  status: 'sold-out' | 'available' | 'limited'
  description: string
  price: number
  priceDisplay: string
  remaining?: number
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'early',
    name: 'Early Bird',
    status: 'sold-out',
    description: 'Includes standard entry and exclusive event digital poster.',
    price: 5000,
    priceDisplay: '₦5,000',
  },
  {
    id: 'general',
    name: 'General Admission',
    status: 'available',
    description: 'Access to all main stages, food court, and festival grounds.',
    price: 7000,
    priceDisplay: '₦7,000',
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    status: 'limited',
    description:
      'Backstage access, VIP lounge, premium bars, and fast-track entry.',
    price: 15000,
    priceDisplay: '₦15,000',
    remaining: 12,
  },
]

export const TICKET_STATE_KEYS = {
  step: parseAsStringLiteral(['select', 'checkout']).withDefault('select'),
  qty_early: parseAsInteger.withDefault(0),
  qty_general: parseAsInteger.withDefault(0),
  qty_vip: parseAsInteger.withDefault(0),
}

export function TicketsTab({ event }: { event: EventDetailData }) {
  const [state, setState] = useQueryStates(TICKET_STATE_KEYS, {
    shallow: true,
  })

  const quantities: Record<TicketTierId, number> = {
    early: state.qty_early,
    general: state.qty_general,
    vip: state.qty_vip,
  }

  const setQty = (id: TicketTierId, qty: number) => {
    const clamped = Math.max(0, qty)
    if (id === 'early') setState({ qty_early: clamped || null })
    if (id === 'general') setState({ qty_general: clamped || null })
    if (id === 'vip') setState({ qty_vip: clamped || null })
  }

  const goTo = (step: 'select' | 'checkout') => setState({ step })

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
              tiers={TICKET_TIERS}
              quantities={quantities}
              onQuantityChange={setQty}
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
              tiers={TICKET_TIERS}
              quantities={quantities}
              onBack={() => goTo('select')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  CreditCardIcon,
  InformationCircleIcon,
  Shield01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'

import type {
  TicketTier,
  TicketTierId,
} from '@/components/sections/event-detail/tickets-tab'
import type { EventDetailData } from '@/components/sections/event-detail/types'

const SERVICE_FEE = 1000

export function CheckoutView({
  event,
  tiers,
  quantities,
  onBack,
}: {
  event: EventDetailData
  tiers: TicketTier[]
  quantities: Record<TicketTierId, number>
  onBack: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    card: '',
    expiry: '',
    cvv: '',
  })

  const selected = tiers.filter((t) => (quantities[t.id] ?? 0) > 0)
  const subtotal = selected.reduce(
    (sum, t) => sum + t.price * (quantities[t.id] ?? 0),
    0
  )
  const total = subtotal + (subtotal > 0 ? SERVICE_FEE : 0)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-primary hover:text-primary-hover font-medium transition-colors"
        >
          Tickets
        </button>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="text-muted-foreground size-4"
          strokeWidth={2}
        />
        <span className="text-foreground font-semibold">Checkout</span>
      </nav>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-8"
      >
        <div className="flex flex-col gap-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 md:p-6"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={UserIcon}
                className="text-primary size-5"
                strokeWidth={1.8}
              />
              <h2 className="font-heading text-foreground text-lg font-semibold">
                Purchaser Information
              </h2>
            </div>

            <Field label="Full Name" htmlFor="ck-name">
              <Input
                id="ck-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Johnson"
                autoComplete="name"
              />
            </Field>

            <Field
              label="Purchaser Email"
              htmlFor="ck-email"
              helper="Tickets will be sent to this email address."
            >
              <Input
                id="ck-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Phone Number" htmlFor="ck-phone">
              <Input
                id="ck-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 000 000 0000"
                autoComplete="tel"
              />
            </Field>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 md:p-6"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={CreditCardIcon}
                className="text-primary size-5"
                strokeWidth={1.8}
              />
              <h2 className="font-heading text-foreground text-lg font-semibold">
                Payment Method
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-3 dark:border-[#1e40af]/40 dark:bg-[#1e40af]/15">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#135bec] text-white">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  className="size-4"
                  strokeWidth={2}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[#1e3a8a] dark:text-[#93c5fd]">
                  Secure Payment Gateway
                </span>
                <span className="text-xs text-[#1e3a8a]/80 dark:text-[#93c5fd]/80">
                  Your transaction is encrypted and secured.
                </span>
              </div>
            </div>

            <Field label="Card Number" htmlFor="ck-card">
              <div className="relative">
                <Input
                  id="ck-card"
                  inputMode="numeric"
                  value={form.card}
                  onChange={(e) => setForm({ ...form, card: e.target.value })}
                  placeholder="0000 0000 0000 0000"
                  autoComplete="cc-number"
                  className="pr-12"
                />
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2"
                  strokeWidth={1.6}
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry (MM/YY)" htmlFor="ck-exp">
                <Input
                  id="ck-exp"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                />
              </Field>
              <Field label="CVV" htmlFor="ck-cvv">
                <Input
                  id="ck-cvv"
                  inputMode="numeric"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  placeholder="1234"
                  autoComplete="cc-csc"
                />
              </Field>
            </div>
          </motion.section>

          <div className="flex items-start gap-3 rounded-lg border border-[#fde68a] bg-[#fffbeb] p-4 dark:border-[#b45309]/40 dark:bg-[#b45309]/10">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              className="size-5 shrink-0 text-[#b45309] dark:text-[#fbbf24]"
              strokeWidth={1.8}
            />
            <p className="text-sm text-[#92400e] dark:text-[#fbbf24]">
              <strong className="font-semibold">No-Refund Policy:</strong> All
              sales are final. Since Ticketeur is a moderated marketplace for
              community events, we cannot offer refunds once the purchase is
              complete.
            </p>
          </div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.12,
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="border-border bg-card flex flex-col gap-6 rounded-2xl border p-5 md:p-6 lg:sticky lg:top-24 lg:self-start"
        >
          <h2 className="font-heading text-foreground text-lg font-semibold">
            Order Summary
          </h2>

          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Ticket Tier
            </span>
            {selected.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No tickets selected.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {selected.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <span className="font-heading text-foreground text-base font-semibold">
                      {t.name}
                    </span>
                    <span className="font-heading text-primary flex items-baseline gap-1 text-sm font-bold">
                      {t.priceDisplay}
                      <span className="text-muted-foreground text-xs font-medium">
                        ({quantities[t.id]})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-border flex flex-col gap-2 border-t pt-4">
            <Row label="Subtotal" value={`₦${subtotal.toLocaleString()}.00`} />
            <Row
              label="Service Fee"
              value={`₦${subtotal > 0 ? SERVICE_FEE.toLocaleString() : 0}.00`}
            />
          </div>

          <div className="border-border flex items-baseline justify-between gap-4 border-t pt-4">
            <span className="font-heading text-foreground text-base font-semibold md:text-lg">
              Total Amount
            </span>
            <span className="font-heading text-primary text-2xl font-bold md:text-3xl">
              ₦{total.toLocaleString()}
            </span>
          </div>

          <div className="bg-muted/40 dark:bg-muted/20 flex flex-col gap-2 rounded-xl p-4">
            <Button
              type="submit"
              size="xl"
              disabled={selected.length === 0}
              className="w-full"
            >
              Pay Now
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              By completing your purchase, you agree to our{' '}
              <span className="text-primary font-medium">Terms of Service</span>
            </p>
          </div>

          <span className="sr-only">Checkout for {event.title}</span>
        </motion.aside>
      </form>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  helper,
  children,
}: {
  label: string
  htmlFor: string
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-foreground text-sm font-semibold"
      >
        {label}
      </label>
      {children}
      {helper ? (
        <p className="text-muted-foreground text-xs">{helper}</p>
      ) : null}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 text-sm')}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  )
}

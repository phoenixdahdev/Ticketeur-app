import Image from 'next/image'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'

import type { Transaction } from '@/lib/mock-transactions'

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

export function TransactionDetail({ tx }: { tx: Transaction }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="border-border/60 bg-background flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-3xl">
            {tx.reference}
          </h2>
          <p className="text-muted-foreground text-sm">{tx.paidAt}</p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-10">
          <FieldBlock label="Total Amount" value={formatNaira(tx.amount)} />
          <FieldBlock label="Fee" value={formatNaira(tx.fee)} />
          <FieldBlock label="Payment Method" value={tx.paymentMethod} />
        </div>
      </section>

      <section className="border-border/60 bg-background flex flex-col gap-6 rounded-2xl border p-5 md:p-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Attendee Details
          </h3>
          <div className="flex items-center gap-3">
            <Avatar className="border-border/60 size-10 border">
              {tx.attendeeAvatarUrl ? (
                <AvatarImage asChild src={tx.attendeeAvatarUrl} alt="">
                  <Image
                    src={tx.attendeeAvatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </AvatarImage>
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(tx.attendeeName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">
                {tx.attendeeName}
              </span>
              <span className="text-muted-foreground text-xs">
                {tx.attendeeEmail}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Event Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            <FieldBlock label="Event Name" value={tx.eventName} />
            <FieldBlock label="Date" value={formatLongDate(tx.eventDate)} />
            <FieldBlock label="Time" value={tx.eventTime} />
            <FieldBlock label="Location" value={tx.eventLocation} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Ticket Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FieldBlock label="Tier" value={tx.tier} />
            <FieldBlock label="Amount" value={formatNaira(tx.amount)} />
            <FieldBlock label="Quantity" value={tx.qty.toString()} />
          </div>
        </div>
      </section>
    </div>
  )
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-foreground text-sm font-semibold">{label}</span>
      <span className="text-muted-foreground text-sm">{value}</span>
    </div>
  )
}

import Image from 'next/image'
import { format } from 'date-fns'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'
import type { RouterOutputs } from '@ticketur/api'

import { formatWeekdayDate as formatLongDate, toDate } from '@/lib/date'

type Tx = RouterOutputs['admin']['transactions']['byId']

// Order amounts come from the API in minor units (kobo).
function formatNaira(minor: number) {
  return `₦${(minor / 100).toLocaleString('en-NG')}`
}

function formatPaidAt(iso: string) {
  const d = toDate(iso)
  if (!d) return ''
  return format(d, "MMMM d, yyyy 'at' h:mm:ss a")
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

export function TransactionDetail({ tx }: { tx: Tx }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="border-border/60 bg-background flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-3xl">
            {tx.reference}
          </h2>
          <p className="text-muted-foreground text-sm">{formatPaidAt(tx.date)}</p>
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
              {tx.attendee.avatarUrl ? (
                <AvatarImage asChild src={tx.attendee.avatarUrl} alt="">
                  <Image
                    src={tx.attendee.avatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </AvatarImage>
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(tx.attendee.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">
                {tx.attendee.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {tx.attendee.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Event Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            <FieldBlock label="Event Name" value={tx.event.name} />
            <FieldBlock label="Date" value={formatLongDate(tx.event.date)} />
            <FieldBlock label="Time" value={tx.event.time} />
            <FieldBlock label="Location" value={tx.event.location} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Ticket Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FieldBlock label="Tier" value={tx.ticket.tier} />
            <FieldBlock
              label="Amount"
              value={formatNaira(tx.ticket.amount)}
            />
            <FieldBlock label="Quantity" value={tx.ticket.qty.toString()} />
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

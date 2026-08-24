import { TRPCError } from '@trpc/server'
import { tasks } from '@trigger.dev/sdk'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { z } from 'zod'

import type { Database } from '@ticketur/db'
import { events, orders, tickets, vouchers } from '@ticketur/db'

import { getBaseUrl } from './base-url'
import { formatEventDateRange } from './dates'

// One send is capped to match the task's own limit. Anything larger should be
// several deliberate sends, not one accidental blast.
export const MAX_VOUCHER_RECIPIENTS = 200

export const voucherSendInput = z.object({
  id: z.string(),
  recipients: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('emails'),
      emails: z.array(z.email()).min(1).max(MAX_VOUCHER_RECIPIENTS),
    }),
    // Everyone holding a ticket for an event — the loyalty case ("you came to
    // this, here's something off the next one").
    z.object({ kind: z.literal('event-attendees'), eventId: z.string() }),
  ]),
  note: z.string().trim().max(500).optional(),
})

export type VoucherSendInput = z.infer<typeof voucherSendInput>

// Stored value → the label the buyer sees. Percent is basis points
// (2000 → "20% off"); fixed is minor units (150000 → "₦1,500 off").
export function discountLabel(
  discountType: 'percent' | 'fixed',
  discountValue: number
): string {
  return discountType === 'percent'
    ? `${discountValue / 100}% off`
    : `₦${(discountValue / 100).toLocaleString('en-NG')} off`
}

/**
 * Ticket holders for an event, de-duplicated. Uses each ticket's own
 * `recipientEmail` where present so a group order reaches the ten attendees
 * rather than only the one buyer, falling back to the buyer for self orders.
 * Only paid orders count — a pending order is not an attendee.
 */
async function attendeeEmails(
  db: Database,
  eventId: string
): Promise<string[]> {
  const rows = await db
    .selectDistinct({
      email: sql<string>`lower(COALESCE(NULLIF(${tickets.recipientEmail}, ''), ${orders.buyerEmail}))`,
    })
    .from(tickets)
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .where(and(eq(tickets.eventId, eventId), eq(orders.status, 'paid')))

  return rows.map((r) => r.email).filter((e) => e.length > 0)
}

/**
 * Email a voucher code to a set of recipients.
 *
 * `ownerId` scopes the lookup: an organizer id restricts it to that
 * organizer's own vouchers, and null means platform vouchers (admin). Passing
 * `anyOwner` lets an admin send an organizer's voucher too — the platform
 * operator can act on behalf of an organizer, an organizer cannot.
 */
export async function sendVoucherCode(
  db: Database,
  args: {
    input: VoucherSendInput
    ownerId: string | null
    anyOwner?: boolean
  }
): Promise<{ recipients: number }> {
  const { input, ownerId, anyOwner } = args

  const ownerFilter = anyOwner
    ? undefined
    : ownerId === null
      ? isNull(vouchers.organizerId)
      : eq(vouchers.organizerId, ownerId)

  const [voucher] = await db
    .select()
    .from(vouchers)
    .where(
      ownerFilter
        ? and(eq(vouchers.id, input.id), ownerFilter)
        : eq(vouchers.id, input.id)
    )
    .limit(1)
  if (!voucher) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Voucher not found' })
  }
  if (!voucher.active) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Activate the voucher before sending it.',
    })
  }
  if (voucher.validUntil && voucher.validUntil < new Date()) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'This voucher has expired.',
    })
  }

  // Resolve recipients.
  let emails: string[]
  if (input.recipients.kind === 'emails') {
    // Normalise + de-duplicate so the same address is never mailed twice in
    // one send.
    emails = [
      ...new Set(input.recipients.emails.map((e) => e.trim().toLowerCase())),
    ]
  } else {
    const eventId = input.recipients.eventId
    // An organizer may only target their own event. An event-scoped voucher
    // may only be sent to that event's attendees — sending it to another
    // event's list would hand out a code that cannot be redeemed.
    const [ev] = await db
      .select({ id: events.id, organizerId: events.organizerId })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1)
    if (!ev) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' })
    }
    if (!anyOwner && ownerId !== null && ev.organizerId !== ownerId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'That event does not belong to you.',
      })
    }
    if (voucher.eventId && voucher.eventId !== eventId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'This code only works on one event, so it can only be sent to that event’s attendees.',
      })
    }
    emails = await attendeeEmails(db, eventId)
    if (emails.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'That event has no ticket holders to email yet.',
      })
    }
    if (emails.length > MAX_VOUCHER_RECIPIENTS) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `That event has ${emails.length} ticket holders, above the ${MAX_VOUCHER_RECIPIENTS} per-send limit.`,
      })
    }
  }

  // Where "Book now" goes: the scoped event if there is one, else the index.
  const baseUrl = getBaseUrl()
  let eventTitle: string | null = null
  let ctaUrl = `${baseUrl}/events`
  if (voucher.eventId) {
    const [ev] = await db
      .select({ title: events.title, slug: events.slug })
      .from(events)
      .where(eq(events.id, voucher.eventId))
      .limit(1)
    if (ev) {
      eventTitle = ev.title
      ctaUrl = `${baseUrl}/events/${ev.slug}`
    }
  }

  await tasks.trigger('send-voucher-code', {
    emails,
    code: voucher.code,
    discountLabel: discountLabel(voucher.discountType, voucher.discountValue),
    eventTitle,
    // formatEventDateRange takes ISO date strings; validUntil is a timestamp.
    expiresOn: voucher.validUntil
      ? formatEventDateRange(
          voucher.validUntil.toISOString().slice(0, 10),
          null
        )
      : null,
    ctaUrl,
    note: input.note?.trim() ? input.note.trim() : null,
  })

  return { recipients: emails.length }
}

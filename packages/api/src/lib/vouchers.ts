import { and, eq, isNull, or, sql } from 'drizzle-orm'

import type { Database, VoucherDiscountType } from '@ticketur/db'
import { events, vouchers } from '@ticketur/db'

// Why a voucher didn't apply — surfaced to the buyer so the "Apply" UI can
// show a precise message instead of a generic failure.
export type VoucherInvalidReason =
  'not_found' | 'inactive' | 'not_started' | 'expired' | 'maxed'

export type VoucherValidation =
  | {
      ok: true
      voucher: typeof vouchers.$inferSelect
      discountMinor: number
    }
  | { ok: false; reason: VoucherInvalidReason }

/**
 * The discount a voucher yields on a given subtotal, in minor units.
 * `percent` stores basis points (2000 = 20%), matching SERVICE_FEE_BPS;
 * `fixed` stores minor units directly. Never exceeds the subtotal and never
 * goes negative.
 */
export function computeDiscountMinor(
  discountType: VoucherDiscountType,
  discountValue: number,
  subtotalMinor: number
): number {
  if (subtotalMinor <= 0) return 0
  const raw =
    discountType === 'percent'
      ? Math.round((subtotalMinor * discountValue) / 10_000)
      : discountValue
  return Math.max(0, Math.min(raw, subtotalMinor))
}

/**
 * Resolve a voucher code for a checkout on `eventId` and compute its discount.
 *
 * Two owners can supply a code: the event's own organizer, or the platform
 * (an admin-created voucher, `organizerId` NULL, valid on any event). Either
 * may additionally be scoped to a single event or left open to all.
 *
 * Because both owners can mint the same code, up to two rows may match. They
 * are ranked most-specific-first and the winner takes it:
 *
 *   1. the organizer's own code scoped to this event
 *   2. the organizer's own code for all their events
 *   3. a platform code scoped to this event
 *   4. a platform code for all events
 *
 * An organizer's code therefore always beats a platform code of the same name,
 * so a platform-wide promo can never quietly override what an organizer set up
 * for their own event. Validity (active, window, redemption cap) is checked on
 * the winner only — a spent organizer code does not silently fall through to a
 * platform code, which would surprise both the buyer and the organizer.
 */
export async function validateVoucher(
  db: Database,
  args: { eventId: string; code: string; subtotalMinor: number; now?: Date }
): Promise<VoucherValidation> {
  const code = args.code.trim()
  if (!code) return { ok: false, reason: 'not_found' }

  const [event] = await db
    .select({ organizerId: events.organizerId })
    .from(events)
    .where(eq(events.id, args.eventId))
    .limit(1)
  if (!event) return { ok: false, reason: 'not_found' }

  const [voucher] = await db
    .select()
    .from(vouchers)
    .where(
      and(
        // The event's organizer, or the platform (organizerId NULL).
        or(
          eq(vouchers.organizerId, event.organizerId),
          isNull(vouchers.organizerId)
        ),
        sql`lower(${vouchers.code}) = lower(${code})`,
        or(isNull(vouchers.eventId), eq(vouchers.eventId, args.eventId))
      )
    )
    // Owner first (organizer's own before platform), then scope (this event
    // before all-events). Booleans sort false < true, so IS NULL ascending
    // puts the more specific row first.
    .orderBy(
      sql`(${vouchers.organizerId} IS NULL) ASC`,
      sql`(${vouchers.eventId} IS NULL) ASC`
    )
    .limit(1)
  if (!voucher) return { ok: false, reason: 'not_found' }
  if (!voucher.active) return { ok: false, reason: 'inactive' }

  const now = args.now ?? new Date()
  if (voucher.validFrom && now < voucher.validFrom) {
    return { ok: false, reason: 'not_started' }
  }
  if (voucher.validUntil && now > voucher.validUntil) {
    return { ok: false, reason: 'expired' }
  }
  if (
    voucher.maxRedemptions != null &&
    voucher.redeemedCount >= voucher.maxRedemptions
  ) {
    return { ok: false, reason: 'maxed' }
  }

  return {
    ok: true,
    voucher,
    discountMinor: computeDiscountMinor(
      voucher.discountType,
      voucher.discountValue,
      args.subtotalMinor
    ),
  }
}

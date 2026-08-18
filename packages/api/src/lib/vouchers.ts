import { and, eq, isNull, or, sql } from 'drizzle-orm'

import type { Database, VoucherDiscountType } from '@ticketur/db'
import { events, vouchers } from '@ticketur/db'

// Why a voucher didn't apply — surfaced to the buyer so the "Apply" UI can
// show a precise message instead of a generic failure.
export type VoucherInvalidReason =
  | 'not_found'
  | 'inactive'
  | 'not_started'
  | 'expired'
  | 'maxed'

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
 * A code is valid only when it belongs to the event's organizer and is either
 * unscoped (applies to all their events) or scoped to this event — then active,
 * within its validity window, and under its redemption cap. The (organizerId,
 * lower(code)) unique index guarantees at most one match, so there's never
 * ambiguity between an all-events and an event-scoped code.
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
        eq(vouchers.organizerId, event.organizerId),
        sql`lower(${vouchers.code}) = lower(${code})`,
        or(isNull(vouchers.eventId), eq(vouchers.eventId, args.eventId))
      )
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

// Single source of truth for the platform service fee. Both the checkout
// mutation (server) and the checkout summary (client) import these so the
// number shown to the buyer is exactly what gets charged.
//
// All values are in MINOR units (kobo). 100 kobo = ₦1.

// Service fee in basis points (1 bp = 0.01%). 500 bp = 5%.
// Integer math means no float drift on rounding.
export const SERVICE_FEE_BPS = 500

/**
 * Free tickets pass through without a fee. Otherwise we apply
 * `SERVICE_FEE_BPS / 10000` of the subtotal, rounded to the nearest minor
 * unit. Every consumer reads through this function so the fee shown to the
 * buyer is identical to what gets charged.
 */
export function calculateFeeMinor(subtotalMinor: number): number {
  if (subtotalMinor <= 0) return 0
  return Math.round((subtotalMinor * SERVICE_FEE_BPS) / 10_000)
}

export function calculateTotalMinor(subtotalMinor: number): number {
  return subtotalMinor + calculateFeeMinor(subtotalMinor)
}

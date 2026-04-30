// Single source of truth for the platform service fee. Both the checkout
// mutation (server) and the checkout summary (client) import these so the
// number shown to the buyer is exactly what gets charged.
//
// All values are in MINOR units (kobo). 100 kobo = ₦1.

// ₦1,000 flat fee per order.
export const SERVICE_FEE_MINOR = 500_00

/**
 * Free tickets pass through without a fee. Otherwise we apply the flat
 * platform fee. Replace this with a percentage / tiered rule later if
 * pricing changes — every consumer reads through this function.
 */
export function calculateFeeMinor(subtotalMinor: number): number {
  if (subtotalMinor <= 0) return 0
  return SERVICE_FEE_MINOR
}

export function calculateTotalMinor(subtotalMinor: number): number {
  return subtotalMinor + calculateFeeMinor(subtotalMinor)
}

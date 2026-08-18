import { format, isValid, parseISO } from 'date-fns'

// Shared, client-safe date helpers used across the apps' UI. The server-side
// counterpart (email/PDF copy) lives in @ticketur/api/lib/dates and parses bare
// ISO dates differently, so the two are intentionally separate.

// Shown when an event has no date yet (postponed / TBD — eventDate is null).
export const TBD_LABEL = 'TBD'

export function toDate(value: string | Date | null | undefined): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null
  if (!value) return null
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : null
}

export function formatShortDate(
  value: string | Date | null | undefined
): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' && value ? value : TBD_LABEL
  return format(date, 'MMM d, yyyy')
}

export function formatLongDate(
  value: string | Date | null | undefined
): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' && value ? value : TBD_LABEL
  return format(date, 'MMMM d, yyyy')
}

// For events that may span multiple days. Single-day (no end, or end equals
// start) returns "MMM d, yyyy". Same-month range returns "MMM d–d, yyyy".
// Same-year cross-month returns "MMM d – MMM d, yyyy". Cross-year returns
// "MMM d, yyyy – MMM d, yyyy" so the year is unambiguous on each side.
// A null/empty start (TBD event) returns the "TBD" label.
export function formatEventDateRange(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined
): string {
  const startDate = toDate(start)
  if (!startDate) return typeof start === 'string' && start ? start : TBD_LABEL
  const endDate = end ? toDate(end) : null

  if (!endDate || endDate.getTime() === startDate.getTime()) {
    return format(startDate, 'MMM d, yyyy')
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear()
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth()

  if (sameMonth) {
    return `${format(startDate, 'MMM d')}–${format(endDate, 'd, yyyy')}`
  }
  if (sameYear) {
    return `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`
  }
  return `${format(startDate, 'MMM d, yyyy')} – ${format(endDate, 'MMM d, yyyy')}`
}

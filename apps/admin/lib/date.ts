import { differenceInCalendarDays, format } from 'date-fns'

import { TBD_LABEL, toDate } from '@ticketur/ui/lib/dates'

// Shared date helpers live in @ticketur/ui/lib/dates (used by both apps).
// Re-exported here so existing `@/lib/date` imports keep working.
export {
  TBD_LABEL,
  toDate,
  formatShortDate,
  formatLongDate,
  formatEventDateRange,
} from '@ticketur/ui/lib/dates'

export function formatWeekdayDate(
  value: string | Date | null | undefined
): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' && value ? value : TBD_LABEL
  return format(date, 'EEE, MMM d, yyyy')
}

export function formatMonthDay(
  value: string | Date | null | undefined
): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' && value ? value : TBD_LABEL
  return format(date, 'MMM d')
}

// Returns null when there is no date (TBD) so callers can hide any countdown.
export function daysUntil(
  value: string | Date | null | undefined
): number | null {
  const date = toDate(value)
  if (!date) return null
  return Math.max(0, differenceInCalendarDays(date, new Date()))
}

import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
} from 'date-fns'

export function toDate(value: string | Date): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null
  if (!value) return null
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : null
}

export function formatShortDate(value: string | Date): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return format(date, 'MMM d, yyyy')
}

export function formatLongDate(value: string | Date): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return format(date, 'MMMM d, yyyy')
}

export function formatWeekdayDate(value: string | Date): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return format(date, 'EEE, MMM d, yyyy')
}

export function formatMonthDay(value: string | Date): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return format(date, 'MMM d')
}

export function daysUntil(value: string | Date): number {
  const date = toDate(value)
  if (!date) return 0
  return Math.max(0, differenceInCalendarDays(date, new Date()))
}

// For multi-day events. Single-day (no end, or end equals start) returns
// "MMM d, yyyy". Same-month range returns "MMM d–d, yyyy". Same-year cross-
// month returns "MMM d – MMM d, yyyy". Cross-year keeps both years.
export function formatEventDateRange(
  start: string | Date,
  end: string | Date | null | undefined
): string {
  const startDate = toDate(start)
  if (!startDate) return typeof start === 'string' ? start : ''
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

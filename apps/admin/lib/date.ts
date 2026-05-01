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

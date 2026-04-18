import { format, getYear, isValid, parseISO } from 'date-fns'

export function toDate(value: string | Date): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null
  if (!value) return null
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : null
}

export function formatLongDate(value: string | Date): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return format(date, 'MMMM d, yyyy')
}

export function formatShortDate(value: string | Date): string {
  const date = toDate(value)
  if (!date) return typeof value === 'string' ? value : ''
  return format(date, 'MMM d, yyyy')
}

export function toIsoDate(value: Date): string {
  return format(value, 'yyyy-MM-dd')
}

export function currentYear(): number {
  return getYear(new Date())
}

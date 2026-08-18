import { format, getYear } from 'date-fns'

// Shared date helpers live in @ticketur/ui/lib/dates (used by both apps).
// Re-exported here so existing `@/lib/date` imports keep working.
export {
  TBD_LABEL,
  toDate,
  formatShortDate,
  formatLongDate,
  formatEventDateRange,
} from '@ticketur/ui/lib/dates'

export function toIsoDate(value: Date): string {
  return format(value, 'yyyy-MM-dd')
}

export function currentYear(): number {
  return getYear(new Date())
}

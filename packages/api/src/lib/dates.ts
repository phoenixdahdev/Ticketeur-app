import { format } from 'date-fns'

// Server-side event-date formatting for emails, PDFs, and other server output.
// Takes ISO date strings (YYYY-MM-DD) as stored on the event and renders a
// human-readable date or range. A null/empty start (TBD event) renders "TBD".
//
// This is the server counterpart to the app-side range formatter in
// @ticketur/ui/lib/dates — kept separate because it parses the bare ISO date
// at local midnight (matching how the DB stores event dates) and drives email
// and PDF copy, which want long-form dates rather than the compact UI form.
export function formatEventDateRange(
  start: string | null,
  end: string | null,
  opts?: { weekday?: boolean }
): string {
  const pattern = opts?.weekday ? 'EEEE, MMMM d, yyyy' : 'MMMM d, yyyy'
  if (!start) return 'TBD'
  const startDate = new Date(`${start}T00:00:00`)
  if (Number.isNaN(startDate.getTime())) return start
  const startStr = format(startDate, pattern)
  if (!end || end === start) return startStr
  const endDate = new Date(`${end}T00:00:00`)
  if (Number.isNaN(endDate.getTime())) return startStr
  return `${startStr} – ${format(endDate, pattern)}`
}

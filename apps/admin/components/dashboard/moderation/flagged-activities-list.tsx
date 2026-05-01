'use client'

import { Button } from '@ticketur/ui/components/button'

import type { FlaggedActivity } from '@/lib/mock-moderation'

const SUBJECT_LABEL: Record<FlaggedActivity['subjectType'], string> = {
  vendor: 'VENDOR',
  organizer: 'ORGANIZER',
  attendee: 'ATTENDEE',
  event: 'EVENT',
}

const SUSPEND_LABEL: Record<FlaggedActivity['subjectType'], string> = {
  vendor: 'Suspend Vendor',
  organizer: 'Suspend Organizer',
  attendee: 'Suspend Attendee',
  event: 'Suspend Event',
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  })
}

export function FlaggedActivitiesList({ rows }: { rows: FlaggedActivity[] }) {
  return (
    <div className="flex flex-col gap-4">
      {rows.length === 0 ? (
        <div className="border-border/60 bg-background flex min-h-40 items-center justify-center rounded-2xl border p-10">
          <p className="text-muted-foreground text-sm">
            Nothing flagged right now — all clear.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="border-border/60 bg-background relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:p-6"
            >
              <span className="absolute top-4 bottom-4 left-0 w-1 rounded-r-md bg-rose-500" />
              <div className="flex flex-col gap-1 pl-2">
                <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  {SUBJECT_LABEL[row.subjectType]}{' '}
                  <span className="text-muted-foreground/60 mx-2">•</span>
                  {formatShortDate(row.date).toUpperCase()}
                </p>
                <p className="font-heading text-foreground text-lg font-bold">
                  {row.reason}
                </p>
                <p className="text-muted-foreground text-sm">{row.detail}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  className="bg-rose-500 text-white hover:bg-rose-600"
                >
                  {SUSPEND_LABEL[row.subjectType]}
                </Button>
                <Button type="button" variant="outline">
                  Dismiss
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-muted-foreground text-xs sm:text-sm">
        Showing {rows.length} of {rows.length}
      </p>
    </div>
  )
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'
import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { formatMonthDay } from '@/lib/date'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

type FlaggedActivity =
  RouterOutputs['admin']['moderation']['flaggedActivities'][number]
type SubjectType = FlaggedActivity['subjectType']

const SUBJECT_LABEL: Record<SubjectType, string> = {
  vendor: 'VENDOR',
  organizer: 'ORGANIZER',
  attendee: 'ATTENDEE',
  event: 'EVENT',
}

const SUSPEND_LABEL: Record<SubjectType, string> = {
  vendor: 'Suspend Vendor',
  organizer: 'Suspend Organizer',
  attendee: 'Suspend Attendee',
  event: 'Reject Event',
}

export function FlaggedActivitiesList({
  rows,
  loading,
}: {
  rows: FlaggedActivity[]
  loading: boolean
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.flaggedActivities.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.stats.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.users.list.queryKey(),
    })
  }

  const dismissMutation = useMutation(
    trpc.admin.moderation.dismissFlag.mutationOptions({
      onSuccess: () => {
        toast.success('Report dismissed')
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not dismiss', { description: e.message }),
    })
  )

  const suspendMutation = useMutation(
    trpc.admin.moderation.suspendFromFlag.mutationOptions({
      onSuccess: () => {
        toast.success('Subject suspended', {
          description: 'They have been notified by email.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not suspend', { description: e.message }),
    })
  )

  const busy = dismissMutation.isPending || suspendMutation.isPending
  const dialog = useActionDialog()

  async function handleSuspend(row: FlaggedActivity) {
    if (busy) return
    if (row.subjectType === 'event') {
      toast(
        'Event reports are handled via the Events tab — approve or reject the event there.'
      )
      return
    }
    const reason = await dialog.prompt({
      title: `Suspend reported ${row.subjectType}?`,
      description:
        'They will be signed out and emailed the reason. Leave blank to use the report reason.',
      inputLabel: 'Reason (optional)',
      placeholder: row.reason,
      confirmLabel: 'Suspend',
      tone: 'danger',
    })
    if (reason === null) return
    suspendMutation.mutate({ id: row.id, reason })
  }

  async function handleDismiss(row: FlaggedActivity) {
    if (busy) return
    const ok = await dialog.confirm({
      title: 'Dismiss this report?',
      description: 'It will be marked resolved with no action taken.',
      confirmLabel: 'Dismiss',
    })
    if (!ok) return
    dismissMutation.mutate({ id: row.id })
  }

  if (loading) {
    return (
      <div className="border-border/60 bg-background flex min-h-40 items-center justify-center rounded-2xl border p-10">
        <p className="text-muted-foreground text-sm">
          Loading flagged activity…
        </p>
      </div>
    )
  }

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
                  {formatMonthDay(row.date).toUpperCase()}
                </p>
                <p className="font-heading text-foreground text-lg font-bold">
                  {row.reason}
                </p>
                <p className="text-muted-foreground text-sm">{row.detail}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => handleSuspend(row)}
                  className="bg-rose-500 text-white hover:bg-rose-600"
                >
                  {SUSPEND_LABEL[row.subjectType]}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => handleDismiss(row)}
                >
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

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Tick02Icon,
  CancelCircleIcon,
} from '@hugeicons/core-free-icons'

import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { formatShortDate as formatDate } from '@/lib/date'

type PendingEvent =
  RouterOutputs['admin']['moderation']['pendingEvents'][number]

export function ModerationEventsTable({
  rows,
  loading,
}: {
  rows: PendingEvent[]
  loading: boolean
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.pendingEvents.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.stats.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.list.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.stats.queryKey(),
    })
  }

  const approveMutation = useMutation(
    trpc.admin.moderation.approveEvent.mutationOptions({
      onSuccess: () => {
        toast.success('Event approved', {
          description: 'The organizer has been notified by email.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not approve', { description: e.message }),
    })
  )

  const rejectMutation = useMutation(
    trpc.admin.moderation.rejectEvent.mutationOptions({
      onSuccess: () => {
        toast.success('Event rejected', {
          description: 'The organizer has been notified by email.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not reject', { description: e.message }),
    })
  )

  const busy = approveMutation.isPending || rejectMutation.isPending

  function handleApprove(e: PendingEvent) {
    if (busy) return
    approveMutation.mutate({ id: e.id })
  }

  function handleReject(e: PendingEvent) {
    if (busy) return
    const reason = prompt(`Reason for rejecting ${e.title}? (optional)`) ?? ''
    rejectMutation.mutate({ id: e.id, reason })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[760px] table-auto">
            <thead className="bg-primary/5">
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                <th className="px-5 py-4 text-left">Event Name</th>
                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-left">Date Registered</th>
                <th className="px-5 py-4 text-left">Organizer Name</th>
                <th className="px-5 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      Loading pending events…
                    </p>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      No pending event applications.
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/40 text-sm transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/moderation/event/${row.id}`}
                        className="flex items-center gap-3"
                      >
                        {row.thumbnailUrl ? (
                          <Image
                            src={row.thumbnailUrl}
                            alt=""
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                            {row.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-foreground hover:text-primary font-semibold transition-colors">
                          {row.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      {row.category ? (
                        <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase">
                          {row.category}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {formatDate(row.registeredAt)}
                    </td>
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {row.organizerName}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <ActionPill
                          tone="success"
                          label="Approve"
                          disabled={busy}
                          onClick={() => handleApprove(row)}
                        >
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            className="size-4"
                            strokeWidth={2}
                          />
                        </ActionPill>
                        <ActionPill
                          tone="danger"
                          label="Reject"
                          disabled={busy}
                          onClick={() => handleReject(row)}
                        >
                          <HugeiconsIcon
                            icon={CancelCircleIcon}
                            className="size-4"
                            strokeWidth={1.8}
                          />
                        </ActionPill>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-muted-foreground text-xs sm:text-sm">
        Showing {rows.length} of {rows.length}
      </p>
    </div>
  )
}

function ActionPill({
  tone,
  label,
  children,
  disabled,
  onClick,
}: {
  tone: 'success' | 'danger'
  label: string
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  const styles = {
    success: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
    danger: 'bg-rose-50 text-rose-500 hover:bg-rose-100',
  }[tone]
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-7 w-9 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { MoreVerticalIcon } from '@hugeicons/core-free-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ticketur/ui/components/dropdown-menu'
import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

type AdminEventStatus =
  RouterOutputs['admin']['events']['list']['rows'][number]['status']

export function EventRowActions({
  eventId,
  eventTitle,
  status,
}: {
  eventId: string
  eventTitle: string
  status: AdminEventStatus
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const dialog = useActionDialog()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.list.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.stats.queryKey(),
    })
  }

  const suspend = useMutation(
    trpc.admin.events.suspend.mutationOptions({
      onSuccess: () => {
        toast.success('Event suspended', {
          description: 'It is now hidden from the public site.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not suspend', { description: e.message }),
    })
  )

  const unsuspend = useMutation(
    trpc.admin.events.unsuspend.mutationOptions({
      onSuccess: () => {
        toast.success('Event restored', {
          description: 'It is live on the public site again.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not restore', { description: e.message }),
    })
  )

  const remove = useMutation(
    trpc.admin.events.remove.mutationOptions({
      onSuccess: () => {
        toast.success('Event deleted')
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not delete', { description: e.message }),
    })
  )

  const busy = suspend.isPending || unsuspend.isPending || remove.isPending

  async function handleSuspend() {
    const ok = await dialog.confirm({
      title: `Suspend ${eventTitle}?`,
      description:
        'The event is hidden from the public site and ticket sales stop until you restore it.',
      confirmLabel: 'Suspend',
      tone: 'warning',
    })
    if (ok) suspend.mutate({ id: eventId })
  }

  async function handleRestore() {
    const ok = await dialog.confirm({
      title: `Restore ${eventTitle}?`,
      description:
        'The event is published and visible on the public site again.',
      confirmLabel: 'Restore',
      tone: 'success',
    })
    if (ok) unsuspend.mutate({ id: eventId })
  }

  async function handleDelete() {
    const ok = await dialog.confirm({
      title: `Delete ${eventTitle}?`,
      description:
        'This permanently removes the event and its ticket tiers, orders and vendor links. This cannot be undone.',
      confirmLabel: 'Delete',
      tone: 'danger',
    })
    if (ok) remove.mutate({ id: eventId })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Row actions"
        disabled={busy}
        className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-50"
      >
        <HugeiconsIcon
          icon={MoreVerticalIcon}
          className="size-4"
          strokeWidth={1.8}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {status === 'published' ? (
          <DropdownMenuItem onSelect={handleSuspend}>Suspend</DropdownMenuItem>
        ) : null}
        {status === 'suspended' ? (
          <DropdownMenuItem onSelect={handleRestore}>Restore</DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

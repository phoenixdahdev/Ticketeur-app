'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'
import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

type AdminEventStatus = RouterOutputs['admin']['events']['byId']['status']

type Props = {
  eventId: string
  eventTitle: string
  status: AdminEventStatus
}

export function EventActions({ eventId, eventTitle, status }: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const dialog = useActionDialog()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.byId.queryKey({ id: eventId }),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.list.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.events.stats.queryKey(),
    })
  }

  const suspendMutation = useMutation(
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

  const unsuspendMutation = useMutation(
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

  const busy = suspendMutation.isPending || unsuspendMutation.isPending

  async function handleSuspend() {
    const ok = await dialog.confirm({
      title: `Suspend ${eventTitle}?`,
      description:
        'The event is hidden from the public site and ticket sales stop until you restore it.',
      confirmLabel: 'Suspend',
      tone: 'warning',
    })
    if (!ok) return
    suspendMutation.mutate({ id: eventId })
  }

  async function handleUnsuspend() {
    const ok = await dialog.confirm({
      title: `Restore ${eventTitle}?`,
      description: 'The event is published and visible on the public site again.',
      confirmLabel: 'Restore',
      tone: 'success',
    })
    if (!ok) return
    unsuspendMutation.mutate({ id: eventId })
  }

  if (status === 'suspended') {
    return (
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={handleUnsuspend}
        className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
      >
        Restore event
      </Button>
    )
  }

  // Only a live (published) event can be suspended. Archived events are
  // already off the public site, so no action is offered there.
  if (status === 'published') {
    return (
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={handleSuspend}
        className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
      >
        Suspend event
      </Button>
    )
  }

  return null
}

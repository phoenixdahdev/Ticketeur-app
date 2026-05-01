'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'
import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

type UserStatus = RouterOutputs['admin']['users']['byId']['status']

type Props = {
  userId: string
  userName: string
  status: UserStatus
}

export function ProfileActions({ userId, userName, status }: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.users.byId.queryKey({ id: userId }),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.users.list.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.users.stats.queryKey(),
    })
  }

  const suspendMutation = useMutation(
    trpc.admin.users.suspend.mutationOptions({
      onSuccess: () => {
        toast.success('User suspended', {
          description: 'They have been notified by email.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not suspend', { description: e.message }),
    })
  )

  const disableMutation = useMutation(
    trpc.admin.users.disable.mutationOptions({
      onSuccess: () => {
        toast.success('User disabled', {
          description: 'They have been notified by email.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not disable', { description: e.message }),
    })
  )

  const reactivateMutation = useMutation(
    trpc.admin.users.reactivate.mutationOptions({
      onSuccess: () => {
        toast.success('User reactivated', {
          description: 'They have been notified by email.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not reactivate', { description: e.message }),
    })
  )

  const removeMutation = useMutation(
    trpc.admin.users.remove.mutationOptions({
      onSuccess: () => {
        toast.success('User removed', {
          description: 'A removal email has been sent.',
        })
        invalidate()
      },
      onError: (e) =>
        toast.error('Could not remove', { description: e.message }),
    })
  )

  const busy =
    suspendMutation.isPending ||
    disableMutation.isPending ||
    reactivateMutation.isPending ||
    removeMutation.isPending

  const dialog = useActionDialog()

  async function handleSuspend() {
    const reason = await dialog.prompt({
      title: `Suspend ${userName}`,
      description:
        'They will be signed out and emailed the reason. Suspensions expire after 30 days.',
      inputLabel: 'Reason (optional)',
      placeholder: 'e.g. Multiple policy violations',
      confirmLabel: 'Suspend',
      tone: 'warning',
    })
    if (reason === null) return
    suspendMutation.mutate({ id: userId, reason })
  }

  async function handleDisable() {
    const reason = await dialog.prompt({
      title: `Disable ${userName}`,
      description:
        'Their account is permanently locked. They will be signed out and emailed the reason.',
      inputLabel: 'Reason (optional)',
      placeholder: 'e.g. Repeated abuse',
      confirmLabel: 'Disable',
      tone: 'danger',
    })
    if (reason === null) return
    disableMutation.mutate({ id: userId, reason })
  }

  async function handleReactivate() {
    const ok = await dialog.confirm({
      title: `Reactivate ${userName}?`,
      description:
        'Their ban will be cleared and they will be emailed that they can sign in again.',
      confirmLabel: 'Reactivate',
      tone: 'success',
    })
    if (!ok) return
    reactivateMutation.mutate({ id: userId })
  }

  async function handleRemove() {
    const ok = await dialog.confirm({
      title: `Remove ${userName}?`,
      description:
        'This permanently deletes their account, sessions, and tickets. They will be emailed a removal notice.',
      confirmLabel: 'Remove',
      tone: 'danger',
    })
    if (!ok) return
    removeMutation.mutate({ id: userId })
  }

  if (status === 'disabled') {
    return (
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleRemove}
          className="border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          Delete
        </Button>
      </div>
    )
  }

  if (status === 'suspended') {
    return (
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleReactivate}
          className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Reactivate
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleDisable}
          className="border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          Disable
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={handleSuspend}
        className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
      >
        Suspend
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={handleDisable}
        className="border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        Disable
      </Button>
    </div>
  )
}

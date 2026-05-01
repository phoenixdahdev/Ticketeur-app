'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'

import { useTRPC } from '@/lib/trpc'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

type Props = {
  kind: 'vendor' | 'event'
  id: string
  name: string
  redirectTo?: string
}

export function ApproveRejectActions({
  kind,
  id,
  name,
  redirectTo = '/moderation',
}: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.pendingVendors.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.pendingEvents.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.stats.queryKey(),
    })
    if (kind === 'vendor') {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.moderation.vendorById.queryKey({ id }),
      })
    } else {
      queryClient.invalidateQueries({
        queryKey: trpc.admin.moderation.eventById.queryKey({ id }),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.admin.events.list.queryKey(),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.admin.events.stats.queryKey(),
      })
    }
  }

  const approveVendorMut = useMutation(
    trpc.admin.moderation.approveVendor.mutationOptions({
      onSuccess: () => {
        toast.success('Vendor approved', {
          description: 'They have been notified by email.',
        })
        invalidate()
        router.push(redirectTo)
      },
      onError: (e) =>
        toast.error('Could not approve', { description: e.message }),
    })
  )

  const rejectVendorMut = useMutation(
    trpc.admin.moderation.rejectVendor.mutationOptions({
      onSuccess: () => {
        toast.success('Vendor rejected', {
          description: 'They have been notified by email.',
        })
        invalidate()
        router.push(redirectTo)
      },
      onError: (e) =>
        toast.error('Could not reject', { description: e.message }),
    })
  )

  const approveEventMut = useMutation(
    trpc.admin.moderation.approveEvent.mutationOptions({
      onSuccess: () => {
        toast.success('Event approved', {
          description: 'The organizer has been notified by email.',
        })
        invalidate()
        router.push(redirectTo)
      },
      onError: (e) =>
        toast.error('Could not approve', { description: e.message }),
    })
  )

  const rejectEventMut = useMutation(
    trpc.admin.moderation.rejectEvent.mutationOptions({
      onSuccess: () => {
        toast.success('Event rejected', {
          description: 'The organizer has been notified by email.',
        })
        invalidate()
        router.push(redirectTo)
      },
      onError: (e) =>
        toast.error('Could not reject', { description: e.message }),
    })
  )

  const busy =
    approveVendorMut.isPending ||
    rejectVendorMut.isPending ||
    approveEventMut.isPending ||
    rejectEventMut.isPending

  const dialog = useActionDialog()

  async function handleApprove() {
    const ok = await dialog.confirm({
      title:
        kind === 'vendor' ? `Approve ${name}?` : `Approve "${name}"?`,
      description:
        kind === 'vendor'
          ? 'They will be notified by email and become bookable for events.'
          : 'It will go live and the organizer will be notified by email.',
      confirmLabel: 'Approve',
      tone: 'success',
    })
    if (!ok) return
    if (kind === 'vendor') approveVendorMut.mutate({ id })
    else approveEventMut.mutate({ id })
  }

  async function handleReject() {
    const reason = await dialog.prompt({
      title:
        kind === 'vendor' ? `Reject ${name}?` : `Reject "${name}"?`,
      description:
        kind === 'vendor'
          ? 'They will be emailed the reason and can update + resubmit their profile.'
          : 'The event moves back to drafts and the organizer gets emailed the reason.',
      inputLabel: 'Reason (optional)',
      placeholder: 'What needs to change before this can be approved?',
      confirmLabel: 'Reject',
      tone: 'danger',
    })
    if (reason === null) return
    if (kind === 'vendor') rejectVendorMut.mutate({ id, reason })
    else rejectEventMut.mutate({ id, reason })
  }

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
      <Button
        type="button"
        size="lg"
        disabled={busy}
        onClick={handleApprove}
        className="bg-emerald-500 text-white hover:bg-emerald-600"
      >
        Approve
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        disabled={busy}
        onClick={handleReject}
        className="border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        Reject
      </Button>
    </div>
  )
}

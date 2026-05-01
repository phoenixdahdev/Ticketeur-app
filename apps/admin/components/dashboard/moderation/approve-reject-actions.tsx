'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@ticketur/ui/components/button'

import { useTRPC } from '@/lib/trpc'

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

  function handleApprove() {
    if (kind === 'vendor') approveVendorMut.mutate({ id })
    else approveEventMut.mutate({ id })
  }

  function handleReject() {
    const reason = prompt(`Reason for rejecting ${name}? (optional)`) ?? ''
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

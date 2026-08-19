'use client'

import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useTRPC } from '@/lib/trpc'

function reasonMessage(reason: string): string {
  switch (reason) {
    case 'expired':
      return 'This voucher has expired.'
    case 'maxed':
      return 'This voucher has reached its redemption limit.'
    case 'not_started':
      return 'This voucher is not active yet.'
    case 'inactive':
      return 'This voucher is no longer active.'
    default:
      return 'That code is not valid for this event.'
  }
}

// Shared voucher state for both the self and group checkout views: input +
// applied discount, server validation, and auto-reset when the subtotal
// changes so a stale discount can't linger. The returned `discountMinor` is
// clamped to the current subtotal; the server re-validates at checkout.
export function useVoucher(eventId: string, subtotalMinor: number) {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [applied, setApplied] = useState<{
    code: string
    discountMinor: number
  } | null>(null)

  useEffect(() => {
    setApplied(null)
  }, [subtotalMinor])

  const validate = useMutation(
    trpc.public.vouchers.validate.mutationOptions({
      onSuccess: (res) => {
        if (res.ok) {
          setApplied({ code: res.code, discountMinor: res.discountMinor })
          setOpen(false)
          toast.success(`Voucher ${res.code} applied`)
        } else {
          toast.error('Voucher not applied', {
            description: reasonMessage(res.reason),
          })
        }
      },
      onError: (err) =>
        toast.error('Could not check that voucher', {
          description: err.message,
        }),
    })
  )

  return {
    open,
    setOpen,
    input,
    setInput,
    applied,
    code: applied?.code ?? null,
    isChecking: validate.isPending,
    discountMinor: applied
      ? Math.min(applied.discountMinor, subtotalMinor)
      : 0,
    apply() {
      const code = input.trim()
      if (code) validate.mutate({ eventId, code, subtotalMinor })
    },
    remove() {
      setApplied(null)
      setInput('')
      setOpen(false)
    },
  }
}

export type VoucherState = ReturnType<typeof useVoucher>

'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Tag01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'
import { Input } from '@ticketur/ui/components/input'

import type { VoucherState } from '@/components/sections/event-detail/use-voucher'

// The "Have a voucher?" control in the Order Summary — collapsed link →
// code input → applied state. Purely presentational; state lives in useVoucher.
export function VoucherField({
  voucher,
  discount,
  disabled,
}: {
  voucher: VoucherState
  discount: number
  disabled?: boolean
}) {
  if (voucher.applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/40 dark:bg-emerald-500/15">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            strokeWidth={2}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Voucher {voucher.code} applied!
            </span>
            <span className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
              You saved ₦{discount.toLocaleString()} 🎉
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={voucher.remove}
          className="text-destructive text-xs font-semibold hover:underline"
        >
          Remove
        </button>
      </div>
    )
  }

  if (voucher.open) {
    return (
      <div className="flex items-start gap-2">
        <Input
          value={voucher.input}
          onChange={(e) => voucher.setInput(e.target.value)}
          placeholder="Voucher code"
          aria-label="Voucher code"
          disabled={voucher.isChecking || disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              voucher.apply()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={voucher.apply}
          disabled={!voucher.input.trim() || voucher.isChecking}
        >
          {voucher.isChecking ? 'Checking…' : 'Apply'}
        </Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => voucher.setOpen(true)}
      className="text-primary hover:text-primary-hover inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
    >
      <HugeiconsIcon icon={Tag01Icon} className="size-4" strokeWidth={1.8} />
      Have a voucher?
    </button>
  )
}

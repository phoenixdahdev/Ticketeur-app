'use client'

import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'

export function BackButton({ label }: { label: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-foreground hover:text-primary -ml-1 inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-medium transition-colors md:text-base"
    >
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        className="size-5"
        strokeWidth={2}
      />
      {label}
    </button>
  )
}

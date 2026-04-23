import { HugeiconsIcon } from '@hugeicons/react'
import { Loading03Icon } from '@hugeicons/core-free-icons'

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-84px)] items-center justify-center px-6">
      <div className="text-muted-foreground flex flex-col items-center gap-3">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="text-primary size-8 animate-spin"
          strokeWidth={1.8}
        />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  )
}

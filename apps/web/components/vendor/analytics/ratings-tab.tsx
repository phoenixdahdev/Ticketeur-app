'use client'

import type { AnalyticsRange } from './shared'

// Filled in by Phase 4.
export function AnalyticsRatingsTab({ range }: { range: AnalyticsRange }) {
  return (
    <div
      data-period={range.period}
      className="border-border/60 bg-background text-muted-foreground flex min-h-40 items-center justify-center rounded-2xl border border-dashed p-10 text-sm"
    >
      Ratings &amp; reviews coming together…
    </div>
  )
}

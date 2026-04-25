import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

import { cn } from '@ticketur/ui/lib/utils'

export type StatTone = 'purple' | 'green' | 'blue' | 'orange'

const toneStyles: Record<StatTone, string> = {
  purple: 'bg-primary/10 text-primary',
  green:
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  blue: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  orange:
    'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
}

export function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: IconSvgElement
  tone: StatTone
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02]">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-xl',
          toneStyles[tone]
        )}
      >
        <HugeiconsIcon icon={icon} className="size-5" strokeWidth={1.8} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <p className="font-heading text-foreground text-3xl font-bold tracking-tight md:text-[32px]">
          {value}
        </p>
      </div>
    </div>
  )
}

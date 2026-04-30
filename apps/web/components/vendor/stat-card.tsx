import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

import { cn } from '@ticketur/ui/lib/utils'

export type VendorStatTone = 'purple' | 'green' | 'blue' | 'orange' | 'red'

const toneStyles: Record<VendorStatTone, string> = {
  purple: 'bg-primary/10 text-primary',
  green:
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  blue: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  orange:
    'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
}

const pillTone: Record<VendorStatTone, string> = {
  purple: 'bg-primary/10 text-primary',
  green:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
  orange:
    'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
}

export function VendorStatCard({
  label,
  value,
  icon,
  tone,
  pill,
  pillTone: pTone,
  progress,
}: {
  label: string
  value: string
  icon: IconSvgElement
  tone: VendorStatTone
  pill?: string
  pillTone?: VendorStatTone
  progress?: number
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-4 shadow-sm shadow-black/[0.02] md:p-5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex size-9 items-center justify-center rounded-xl md:size-10',
            toneStyles[tone]
          )}
        >
          <HugeiconsIcon
            icon={icon}
            className="size-4 md:size-5"
            strokeWidth={1.8}
          />
        </div>
        {pill ? (
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
              pillTone[pTone ?? tone]
            )}
          >
            {pill}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium md:text-sm">
          {label}
        </p>
        <p className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          {value}
        </p>
        {typeof progress === 'number' ? (
          <div className="bg-muted relative mt-2 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

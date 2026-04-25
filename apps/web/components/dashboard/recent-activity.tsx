import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  AddCircleIcon,
  Money01Icon,
  ArchiveIcon,
  Edit02Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

type ActivityTone = 'blue' | 'green' | 'orange' | 'purple'

type Activity = {
  id: string
  text: string
  time: string
  icon: IconSvgElement
  tone: ActivityTone
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    text: 'You created Lagos Tech Fest',
    time: '2 HOURS AGO',
    icon: AddCircleIcon,
    tone: 'blue',
  },
  {
    id: '2',
    text: '50 tickets sold for Summer Vibes Concert',
    time: '5 HOURS AGO',
    icon: Money01Icon,
    tone: 'green',
  },
  {
    id: '3',
    text: 'Event Retro Night Rewind has been archived',
    time: 'YESTERDAY',
    icon: ArchiveIcon,
    tone: 'orange',
  },
  {
    id: '4',
    text: 'Draft updated: Foodie Festival',
    time: '2 DAYS AGO',
    icon: Edit02Icon,
    tone: 'purple',
  },
]

const toneStyles: Record<ActivityTone, string> = {
  blue: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  green:
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  orange:
    'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  purple: 'bg-primary/10 text-primary',
}

export function RecentActivity() {
  return (
    <section
      aria-labelledby="recent-activity-heading"
      className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02] md:p-6"
    >
      <h2
        id="recent-activity-heading"
        className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl"
      >
        Recent Activity
      </h2>
      <ul className="flex flex-col gap-4">
        {ACTIVITIES.map((a) => (
          <li key={a.id} className="flex items-start gap-3">
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-xl',
                toneStyles[a.tone]
              )}
            >
              <HugeiconsIcon
                icon={a.icon}
                className="size-4"
                strokeWidth={1.8}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-foreground text-sm leading-snug">{a.text}</p>
              <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                {a.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

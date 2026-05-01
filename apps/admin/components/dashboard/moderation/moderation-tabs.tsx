'use client'

import { motion } from 'motion/react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

import { cn } from '@ticketur/ui/lib/utils'

import { ModerationVendorsTable } from '@/components/dashboard/moderation/moderation-vendors-table'
import { ModerationEventsTable } from '@/components/dashboard/moderation/moderation-events-table'
import { FlaggedActivitiesList } from '@/components/dashboard/moderation/flagged-activities-list'
import type {
  PendingVendor,
  PendingEvent,
  FlaggedActivity,
} from '@/lib/mock-moderation'

const TABS = ['vendors', 'events', 'flagged'] as const
type Tab = (typeof TABS)[number]

const TAB_LABELS: Record<Tab, string> = {
  vendors: 'Vendors',
  events: 'Events',
  flagged: 'Flagged Activities',
}

export function ModerationTabs({
  vendors,
  events,
  flagged,
}: {
  vendors: PendingVendor[]
  events: PendingEvent[]
  flagged: FlaggedActivity[]
}) {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(TABS).withDefault('vendors')
  )

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Moderation queue"
        className="bg-background -mx-1 flex shrink-0 items-center gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => {
          const active = tab === t
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => void setTab(t)}
              className={cn(
                'border-border/60 relative shrink-0 rounded-full border px-6 py-2 text-sm font-semibold whitespace-nowrap transition-colors md:px-7 md:py-2.5 md:text-base',
                active
                  ? 'text-primary-foreground border-transparent'
                  : 'text-foreground/80 hover:text-foreground'
              )}
            >
              {active ? (
                <motion.span
                  layoutId="moderation-tab-pill"
                  className="bg-primary absolute inset-0 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              ) : null}
              <span className="relative">{TAB_LABELS[t]}</span>
            </button>
          )
        })}
      </div>

      <div>
        {tab === 'vendors' ? (
          <ModerationVendorsTable rows={vendors} />
        ) : tab === 'events' ? (
          <ModerationEventsTable rows={events} />
        ) : (
          <FlaggedActivitiesList rows={flagged} />
        )}
      </div>
    </div>
  )
}

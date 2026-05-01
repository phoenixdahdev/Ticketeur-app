import { Calendar03Icon } from '@hugeicons/core-free-icons'

import { ADMIN_EVENT_STATS } from '@/lib/mock-events'
import { StatCard } from '@/components/dashboard/stat-card'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function EventsStats() {
  return (
    <section
      aria-label="Event stats"
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      <StatCard
        label="Total Events"
        value={formatNumber(ADMIN_EVENT_STATS.total)}
        icon={Calendar03Icon}
        tone="purple"
      />
      <StatCard
        label="Active"
        value={formatNumber(ADMIN_EVENT_STATS.active)}
        icon={Calendar03Icon}
        tone="purple"
      />
      <StatCard
        label="Archived"
        value={formatNumber(ADMIN_EVENT_STATS.archived)}
        icon={Calendar03Icon}
        tone="purple"
      />
      <FlaggedStat value={formatNumber(ADMIN_EVENT_STATS.flagged)} />
    </section>
  )
}

function FlaggedStat({ value }: { value: string }) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02]">
      <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
        <span className="font-heading text-sm font-bold">!</span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm font-medium">Flagged</p>
        <p className="font-heading text-3xl font-bold tracking-tight text-rose-500 md:text-[32px]">
          {value}
        </p>
      </div>
    </div>
  )
}

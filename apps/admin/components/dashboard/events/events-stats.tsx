'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar03Icon } from '@hugeicons/core-free-icons'

import { useTRPC } from '@/lib/trpc'
import { StatCard } from '@/components/dashboard/stat-card'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function EventsStats() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.admin.events.stats.queryOptions())

  return (
    <section
      aria-label="Event stats"
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      <StatCard
        label="Total Events"
        value={data ? formatNumber(data.total) : '—'}
        icon={Calendar03Icon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Active"
        value={data ? formatNumber(data.active) : '—'}
        icon={Calendar03Icon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Archived"
        value={data ? formatNumber(data.archived) : '—'}
        icon={Calendar03Icon}
        tone="purple"
        loading={isLoading}
      />
      <FlaggedStat
        value={data ? formatNumber(data.flagged) : '—'}
        loading={isLoading}
      />
    </section>
  )
}

function FlaggedStat({
  value,
  loading,
}: {
  value: string
  loading?: boolean
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02]">
      <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
        <span className="font-heading text-sm font-bold">!</span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm font-medium">Flagged</p>
        {loading ? (
          <div className="bg-muted h-8 w-24 animate-pulse rounded-md" />
        ) : (
          <p className="font-heading text-3xl font-bold tracking-tight text-rose-500 md:text-[32px]">
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { UserMultiple02Icon } from '@hugeicons/core-free-icons'

import { useTRPC } from '@/lib/trpc'
import { StatCard } from '@/components/dashboard/stat-card'

// Stats are summed in minor units (kobo); convert to naira on display.
function formatNaira(minor: number) {
  return `₦${(minor / 100).toLocaleString('en-NG')}`
}

export function TransactionsStats() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.admin.transactions.stats.queryOptions()
  )

  return (
    <section
      aria-label="Financial overview"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl"
    >
      <StatCard
        label="Total Revenue"
        value={data ? formatNaira(data.totalRevenue) : '—'}
        icon={UserMultiple02Icon}
        tone="blue"
        loading={isLoading}
      />
      <StatCard
        label="Total platform fees"
        value={data ? formatNaira(data.totalFees) : '—'}
        icon={UserMultiple02Icon}
        tone="blue"
        loading={isLoading}
      />
    </section>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import {
  UserMultiple02Icon,
  Calendar03Icon,
  MoneyBag02Icon,
  Notebook01Icon,
} from '@hugeicons/core-free-icons'

import { useTRPC } from '@/lib/trpc'
import { StatCard } from '@/components/dashboard/stat-card'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

// Revenue is summed in minor units (kobo).
function formatNaira(minor: number) {
  return `₦${(minor / 100).toLocaleString('en-NG')}`
}

export function OverviewStats() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.admin.overview.stats.queryOptions()
  )

  return (
    <section
      aria-label="Platform stats"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
    >
      <StatCard
        label="Total Users"
        value={data ? formatNumber(data.totalUsers) : '—'}
        icon={UserMultiple02Icon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Total Events"
        value={data ? formatNumber(data.totalEvents) : '—'}
        icon={Calendar03Icon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Total Revenue"
        value={data ? formatNaira(data.totalRevenueMinor) : '—'}
        icon={MoneyBag02Icon}
        tone="green"
        loading={isLoading}
      />
      <StatCard
        label="Pending Approvals"
        value={data ? formatNumber(data.pendingApprovals) : '—'}
        icon={Notebook01Icon}
        tone="orange"
        badge={data && data.pendingApprovals > 0 ? 'Urgent' : undefined}
        loading={isLoading}
      />
    </section>
  )
}

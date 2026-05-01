'use client'

import { useQuery } from '@tanstack/react-query'
import {
  UserMultiple02Icon,
  UserGroupIcon,
  Calendar03Icon,
  Store01Icon,
} from '@hugeicons/core-free-icons'

import { useTRPC } from '@/lib/trpc'
import { StatCard } from '@/components/dashboard/stat-card'

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function UsersStats() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.admin.users.stats.queryOptions())

  return (
    <section
      aria-label="User stats"
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      <StatCard
        label="Total Users"
        value={data ? formatNumber(data.total) : '—'}
        icon={UserMultiple02Icon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Attendees"
        value={data ? formatNumber(data.attendees) : '—'}
        icon={UserGroupIcon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Organizers"
        value={data ? formatNumber(data.organizers) : '—'}
        icon={Calendar03Icon}
        tone="purple"
        loading={isLoading}
      />
      <StatCard
        label="Vendors"
        value={data ? formatNumber(data.vendors) : '—'}
        icon={Store01Icon}
        tone="purple"
        loading={isLoading}
      />
    </section>
  )
}

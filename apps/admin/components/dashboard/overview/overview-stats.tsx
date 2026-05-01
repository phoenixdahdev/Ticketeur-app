import {
  UserMultiple02Icon,
  Calendar03Icon,
  MoneyBag02Icon,
  Notebook01Icon,
} from '@hugeicons/core-free-icons'

import { StatCard } from '@/components/dashboard/stat-card'

export function OverviewStats() {
  return (
    <section
      aria-label="Platform stats"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
    >
      <StatCard
        label="Total Users"
        value="24,512"
        icon={UserMultiple02Icon}
        tone="purple"
      />
      <StatCard
        label="Total Events"
        value="4,100"
        icon={Calendar03Icon}
        tone="purple"
      />
      <StatCard
        label="Total Revenue"
        value="₦7,348,845"
        icon={MoneyBag02Icon}
        tone="green"
      />
      <StatCard
        label="Pending Approvals"
        value="42"
        icon={Notebook01Icon}
        tone="orange"
        badge="Urgent"
      />
    </section>
  )
}

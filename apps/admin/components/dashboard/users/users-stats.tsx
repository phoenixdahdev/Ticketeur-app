import {
  UserMultiple02Icon,
  UserGroupIcon,
  Calendar03Icon,
  Store01Icon,
} from '@hugeicons/core-free-icons'

import { StatCard } from '@/components/dashboard/stat-card'

export function UsersStats() {
  return (
    <section
      aria-label="User stats"
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      <StatCard
        label="Total Users"
        value="24,512"
        icon={UserMultiple02Icon}
        tone="purple"
      />
      <StatCard
        label="Attendees"
        value="15,894"
        icon={UserGroupIcon}
        tone="purple"
      />
      <StatCard
        label="Organizers"
        value="5,410"
        icon={Calendar03Icon}
        tone="purple"
      />
      <StatCard
        label="Vendors"
        value="3,200"
        icon={Store01Icon}
        tone="purple"
      />
    </section>
  )
}

import { UserMultiple02Icon } from '@hugeicons/core-free-icons'

import { StatCard } from '@/components/dashboard/stat-card'
import {
  TX_TOTAL_REVENUE,
  TX_TOTAL_FEES,
} from '@/lib/mock-transactions'

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

export function TransactionsStats() {
  return (
    <section
      aria-label="Financial overview"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl"
    >
      <StatCard
        label="Total Revenue"
        value={formatNaira(TX_TOTAL_REVENUE)}
        icon={UserMultiple02Icon}
        tone="blue"
      />
      <StatCard
        label="Total platform fees"
        value={formatNaira(TX_TOTAL_FEES)}
        icon={UserMultiple02Icon}
        tone="blue"
      />
    </section>
  )
}

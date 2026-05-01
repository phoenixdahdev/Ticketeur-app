import type { Metadata } from 'next'

import { TransactionsStats } from '@/components/dashboard/transactions/transactions-stats'
import { TransactionsContent } from '@/components/dashboard/transactions/transactions-content'

export const metadata: Metadata = {
  title: 'Transactions',
}

export default function TransactionsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Transactions
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Audit and manage the financial flows.
        </p>
      </header>

      <TransactionsStats />

      <TransactionsContent />
    </div>
  )
}

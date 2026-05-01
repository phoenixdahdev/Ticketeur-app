import type { Metadata } from 'next'

import { TransactionDetailContent } from '@/components/dashboard/transactions/transaction-detail-content'

export async function generateMetadata({
  params,
}: PageProps<'/transactions/[id]'>): Promise<Metadata> {
  const { id } = await params
  return { title: `TXN-${id.slice(0, 8).toUpperCase()}` }
}

export default async function TransactionDetailPage({
  params,
}: PageProps<'/transactions/[id]'>) {
  const { id } = await params

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

      <TransactionDetailContent id={id} />
    </div>
  )
}

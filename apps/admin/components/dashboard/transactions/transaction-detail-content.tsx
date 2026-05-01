'use client'

import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { useTRPC } from '@/lib/trpc'
import { BackButton } from '@/components/dashboard/users/back-button'
import { TransactionDetail } from '@/components/dashboard/transactions/transaction-detail'

export function TransactionDetailContent({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.admin.transactions.byId.queryOptions({ id })
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-muted h-9 w-32 animate-pulse rounded-md" />
        <div className="bg-muted h-40 animate-pulse rounded-2xl" />
        <div className="bg-muted h-72 animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (isError || !data) {
    notFound()
  }

  return (
    <>
      <BackButton label="Back" />
      <TransactionDetail tx={data} />
    </>
  )
}

import type { Metadata } from 'next'

import { getServerTRPC, HydrateClient } from '@/lib/trpc-server'
import { VendorDetailContent } from '@/components/sections/vendor-detail/vendor-detail-content'

export async function generateMetadata({
  params,
}: PageProps<'/vendors/[id]'>): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Vendor',
    description: `Vendor profile ${id} on Ticketeur.`,
  }
}

export default async function VendorDetailPage({
  params,
}: PageProps<'/vendors/[id]'>) {
  const { id } = await params
  const { trpc, queryClient } = await getServerTRPC()
  await queryClient.prefetchQuery(
    trpc.public.vendors.byId.queryOptions({ id })
  )
  return (
    <HydrateClient>
      <VendorDetailContent id={id} />
    </HydrateClient>
  )
}

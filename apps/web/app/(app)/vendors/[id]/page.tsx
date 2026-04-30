import type { Metadata } from 'next'

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
  return <VendorDetailContent id={id} />
}

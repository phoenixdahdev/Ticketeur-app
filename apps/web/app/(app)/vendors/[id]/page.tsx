import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { VendorAbout } from '@/components/sections/vendor-detail/vendor-about'
import { VendorHero } from '@/components/sections/vendor-detail/vendor-hero'
import { VendorParticipatingEvents } from '@/components/sections/vendor-detail/vendor-participating-events'
import { VENDORS } from '@/lib/vendors'

export async function generateMetadata({
  params,
}: PageProps<'/vendors/[id]'>): Promise<Metadata> {
  const { id } = await params
  const vendor = VENDORS.find((v) => v.id === id)
  if (!vendor) return { title: 'Vendor' }
  return {
    title: vendor.name,
    description: vendor.shortDescription,
  }
}

export default async function VendorDetailPage({
  params,
}: PageProps<'/vendors/[id]'>) {
  const { id } = await params
  const vendor = VENDORS.find((v) => v.id === id)
  if (!vendor) notFound()

  return (
    <>
      <VendorHero vendor={vendor} />
      <VendorAbout vendor={vendor} />
      <VendorParticipatingEvents events={vendor.participatingEvents ?? []} />
    </>
  )
}

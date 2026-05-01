import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPendingVendor } from '@/lib/mock-moderation'
import { BackButton } from '@/components/dashboard/users/back-button'
import { VendorModDetail } from '@/components/dashboard/moderation/vendor-mod-detail'

export async function generateMetadata({
  params,
}: PageProps<'/moderation/vendor/[id]'>): Promise<Metadata> {
  const { id } = await params
  const vendor = getPendingVendor(id)
  return { title: vendor ? `Review ${vendor.name}` : 'Vendor review' }
}

export default async function VendorModerationPage({
  params,
}: PageProps<'/moderation/vendor/[id]'>) {
  const { id } = await params
  const vendor = getPendingVendor(id)
  if (!vendor) notFound()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Admin Moderations &amp; Approvals
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Review pending applications and security-flagged content
        </p>
      </header>

      <BackButton label="Back" />

      <VendorModDetail vendor={vendor} />
    </div>
  )
}

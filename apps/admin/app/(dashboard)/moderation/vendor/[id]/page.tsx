import type { Metadata } from 'next'

import { VendorModDetailContent } from '@/components/dashboard/moderation/vendor-mod-detail-content'

export async function generateMetadata({
  params,
}: PageProps<'/moderation/vendor/[id]'>): Promise<Metadata> {
  const { id } = await params
  return { title: `Vendor review ${id.slice(0, 8)}` }
}

export default async function VendorModerationPage({
  params,
}: PageProps<'/moderation/vendor/[id]'>) {
  const { id } = await params

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

      <VendorModDetailContent id={id} />
    </div>
  )
}

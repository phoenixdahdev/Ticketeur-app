import type { Metadata } from 'next'

import { ModerationTabs } from '@/components/dashboard/moderation/moderation-tabs'

export const metadata: Metadata = {
  title: 'Moderation',
}

export default function ModerationPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Admin Moderation &amp; Approvals
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Review pending applications and security-flagged content
        </p>
      </header>

      <ModerationTabs />
    </div>
  )
}

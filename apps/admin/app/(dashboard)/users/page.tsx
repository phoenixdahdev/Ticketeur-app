import type { Metadata } from 'next'

import { UsersStats } from '@/components/dashboard/users/users-stats'
import { UsersContent } from '@/components/dashboard/users/users-content'

export const metadata: Metadata = {
  title: 'Users',
}

export default function UsersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          User Management
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Govern permissions, verify identities, and monitor access.
        </p>
      </header>

      <UsersStats />

      <UsersContent />
    </div>
  )
}

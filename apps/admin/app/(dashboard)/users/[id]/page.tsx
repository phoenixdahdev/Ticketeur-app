import type { Metadata } from 'next'

import { UserDetailContent } from '@/components/dashboard/users/user-detail-content'

export async function generateMetadata({
  params,
}: PageProps<'/users/[id]'>): Promise<Metadata> {
  const { id } = await params
  return { title: `User ${id.slice(0, 8)}` }
}

export default async function UserDetailPage({
  params,
}: PageProps<'/users/[id]'>) {
  const { id } = await params

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

      <UserDetailContent id={id} />
    </div>
  )
}

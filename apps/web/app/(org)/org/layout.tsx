import { requireRole } from '@/lib/auth'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireRole(['organizer', 'admin'])

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
    >
      {children}
    </DashboardShell>
  )
}

import { requireRole } from '@/lib/auth'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { VENDOR_SIDEBAR_CONFIG } from '@/components/dashboard/sidebar'

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireRole(['vendor', 'admin'])

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
      config={VENDOR_SIDEBAR_CONFIG}
    >
      {children}
    </DashboardShell>
  )
}

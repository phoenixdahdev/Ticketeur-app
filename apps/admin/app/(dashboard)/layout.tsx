import { AdminShell } from '@/components/dashboard/admin-shell'
import { getSession } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()
  const user = session?.user

  return (
    <AdminShell
      user={{
        name: user?.name ?? 'Admin',
        email: user?.email ?? '',
        image: user?.image ?? null,
      }}
    >
      {children}
    </AdminShell>
  )
}

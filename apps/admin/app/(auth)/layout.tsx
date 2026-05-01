import { Suspense } from 'react'

import { AdminAuthHeader } from '@/components/layout/admin-auth-header'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AdminAuthHeader />
      <Suspense>{children}</Suspense>
    </>
  )
}

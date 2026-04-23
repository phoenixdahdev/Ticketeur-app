import { Suspense } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { GoToTop } from '@/components/misc/go-to-top'
import { LayoutProvider } from '@/components/layout/provider'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LayoutProvider>
      <SiteHeader />
      <Suspense>
        <main className="min-h-[calc(100vh-84px)]">{children}</main>
      </Suspense>
      <SiteFooter />
      <GoToTop />
    </LayoutProvider>
  )
}

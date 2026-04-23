import { Suspense } from 'react'

import { SiteHeaderWithSession } from '@/components/layout/site-header-with-session'
import { SiteHeaderSkeleton } from '@/components/layout/site-header-skeleton'
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
      <Suspense fallback={<SiteHeaderSkeleton />}>
        <SiteHeaderWithSession />
      </Suspense>
      <main className="min-h-[calc(100vh-84px)]">{children}</main>
      <SiteFooter />
      <GoToTop />
    </LayoutProvider>
  )
}

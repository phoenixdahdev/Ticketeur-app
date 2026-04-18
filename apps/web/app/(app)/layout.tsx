import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-84px)]">{children}</main>
      <SiteFooter />
    </>
  )
}

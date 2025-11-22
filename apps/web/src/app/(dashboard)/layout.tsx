import Header from '@/components/dashboard/header'
import SideBar from '@/components/dashboard/sidebar'
import MobileSidebar from '@/components/dashboard/mobile-sidebar'
import { Suspense } from 'react'
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col lg:flex-row lg:gap-2 lg:pt-[22px] lg:pr-[21px] lg:pl-[21px]">
      <SideBar />
      <MobileSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <Suspense>
          <main className="flex-1 overflow-auto p-4 font-sans">{children}</main>
        </Suspense>
      </div>
    </div>
  )
}

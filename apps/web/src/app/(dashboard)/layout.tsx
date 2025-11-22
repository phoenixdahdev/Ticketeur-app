import Header from '@/components/dashboard/header'
import SideBar from '@/components/dashboard/sidebar'
import MobileSidebar from '@/components/dashboard/mobile-sidebar'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col lg:flex-row lg:gap-2 lg:pt-[22px] lg:pr-[21px] lg:pl-[21px]">
      {/* Desktop Sidebar */}
      <SideBar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header (responsive for mobile and desktop) */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

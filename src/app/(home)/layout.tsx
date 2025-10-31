import SideBar from './components/sidebar'
import Header from './components/header'
import MobileSidebar from './components/mobile-sidebar'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col lg:flex-row lg:w-[1500px] lg:gap-2 lg:pt-[22px] lg:pr-[21px] lg:pl-[21px]">
      {/* Desktop Sidebar */}
      <SideBar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (responsive for mobile and desktop) */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

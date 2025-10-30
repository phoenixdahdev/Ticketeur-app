import Top from '../../../components/layout/header'
import SideBar from '../../../components/layout/sidebar'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row p-5">
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden md:block md:w-64 lg:w-72">
        <SideBar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background sticky top-0 z-10">
          <Top />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto ">{children}</main>
      </div>
    </div>
  )
}

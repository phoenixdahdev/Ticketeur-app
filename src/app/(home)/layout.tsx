import SideBar from './components/sidebar'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen md:flex md:w-[1500px] md:gap-2 md:pt-[22px] md:pr-[21px] md:pl-[21px]">
      <SideBar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

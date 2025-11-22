'use client'

import Image from 'next/image'
import { Menu } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useSidebar } from './use-sidebar'

export default function Header() {
  const { data: session } = useSession()
  const { toggle } = useSidebar()

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-[#F9F2FE] lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Image src="/logo.png" alt="Ticketeur Logo" width={100} height={38} />

          <button
            onClick={toggle}
            className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>
      <header className="sticky top-0 z-40 hidden w-full bg-white lg:block">
        <div className="flex h-20 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Hello {session?.user?.first_name || 'User'}{' '}
              {session?.user?.last_name || ''}
            </h1>
          </div>
        </div>
      </header>
    </>
  )
}

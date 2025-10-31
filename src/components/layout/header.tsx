'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { MobileNav } from '~/components/layout/mobile-nav'
import { Button } from '~/components/ui/button'
import { Menu, X } from 'lucide-react'

const Top = () => {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen((k) => !k)
  return (
    <div className="font-trap flex items-center justify-between text-lg font-bold lg:text-2xl">
      Hi {session?.user?.first_name} {session?.user?.last_name}
      <button
        // variant={'outline'}
        onClick={toggle}
        // size={'sm'}
        className="border-0  px-0 shadow-none lg:hidden h-6 w-6"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {open && <MobileNav toggle={toggle} />}
    </div>
  )
}

export default Top

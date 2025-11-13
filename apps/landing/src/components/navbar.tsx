'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@useticketeur/ui/lib/utils'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'z-50 w-full py-4 transition-all duration-300',
        isScrolled
          ? 'fixed top-0 right-0 left-0 backdrop-blur-sm'
          : 'relative bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center gap-5 lg:gap-10">
        <div className="lg:custom-header-shadow lg:bg-card flex flex-1 items-center justify-between rounded-4xl lg:px-8 lg:py-4 lg:shadow-md lg:backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Link href={'/'}>
              <Image
                src="/logo.svg"
                alt="logo.png"
                width={122}
                height={38}
                className="opacity-90"
              />
            </Link>
          </div>
          <Link
            href="/"
            className="text-secondary hidden font-sans text-xs font-bold md:block"
          >
            Home
          </Link>
        </div>
        {/* <Popup /> */}
      </div>
    </nav>
  )
}

export default Navbar

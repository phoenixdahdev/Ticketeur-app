'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '~/lib/utils'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export const navLinks = [
  { name: 'Dashboard', href: '/dashboard/home' },
  { name: 'My Events', href: '/dashboard/events' },
  { name: 'Analytics', href: '/dashboard/analytics' },
]

const SideBar = () => {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[264px] shrink-0 flex-col justify-between rounded-[24px] bg-[rgba(102,51,255,0.04)] py-8">
      <div>
        <div className="flex w-full items-start justify-start px-6">
          <Image src="/logo.png" alt="Ticketeur Logo" width={132} height={50} />
        </div>

        <nav className="mt-8 flex flex-col space-y-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                // @ts-expect-error next line
                href={link.href}
                className="relative flex items-center px-6 py-2"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute top-0 left-0 h-full w-1 rounded-r bg-black"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Text */}
                <span
                  className={cn(
                    'leading-trim-both text-edge-cap liga-off text-black transition-all duration-200',
                    isActive
                      ? 'text-[15px] leading-6 font-bold tracking-[0.75px]'
                      : 'text-[15px] leading-5 font-normal tracking-[0.75px]'
                  )}
                >
                  {link.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
      <button
        type="button"
        className="mx-6 mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        onClick={() => {
          signOut({ redirectTo: '/login' })
        }}
      >
        <LogOut />
        Logout
      </button>
    </div>
  )
}

export default SideBar

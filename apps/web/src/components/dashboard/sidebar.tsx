'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@useticketeur/ui/lib/utils'

const navLinks = [
  { name: 'Dashboard', href: '/' },
  { name: 'My Events', href: '/events' },
  { name: 'Analytics', href: '/analytics' },
]

const SideBar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = session?.user
  const showOnboardingCTA = !user?.is_verified
  const hasSubmittedDocuments =
    user?.registration_documents && user.registration_documents.length > 0
  const isPending = user?.registration_documents && !user.is_verified

  return (
    <div className="hidden h-full w-[264px] shrink-0 flex-col justify-between rounded-3xl bg-[rgba(102,51,255,0.04)] py-8 lg:flex">
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
      <div className="flex flex-col">
        {showOnboardingCTA && (
          <div className="mx-4 mt-6">
            {!hasSubmittedDocuments || !isPending ? (
              <Link href="/onboarding">
                <div className="cursor-pointer rounded-lg border border-purple-200 bg-purple-100 p-4 transition-colors hover:bg-purple-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-purple-900">
                        Complete Verification
                      </p>
                      <p className="text-xs text-purple-700">
                        Upload your documents to unlock all features
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-blue-900">
                      Under Review
                    </p>
                    <p className="text-xs text-blue-700">
                      Your documents are being reviewed by our team
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
    </div>
  )
}

export default SideBar

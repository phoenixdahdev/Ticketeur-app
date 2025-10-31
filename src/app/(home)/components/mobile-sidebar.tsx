'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, AlertCircle, Clock, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebarStore } from '~/store/sidebar-store'
import { cn } from '~/lib/utils'
import { useEffect } from 'react'

const navLinks = [
  { name: 'Dashboard', href: '/' },
  { name: 'My Events', href: '/events' },
  { name: 'Analytics', href: '/analytics' },
]

export default function MobileSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isOpen, close } = useSidebarStore()

  const user = session?.user
  const showOnboardingCTA = !user?.is_onboarded
  const hasSubmittedDocuments =
    user?.registration_documents && user.registration_documents.length > 0
  const isPending = user?.onboarding_status === 'pending'

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <Image
                  src="/logo.png"
                  alt="Ticketeur Logo"
                  width={120}
                  height={45}
                />
                <button
                  onClick={close}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between overflow-y-auto py-6">
                <div>
                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-1 px-4">
                    {navLinks.map((link, index) => {
                      const isActive =
                        pathname === link.href ||
                        (link.href !== '/' && pathname.startsWith(link.href))

                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            // @ts-expect-error next line
                            href={link.href}
                            className="relative flex items-center rounded-lg px-4 py-3"
                          >
                            {isActive && (
                              <span className="absolute left-0 h-full w-1 rounded-r bg-black" />
                            )}
                            <span
                              className={cn(
                                'text-sm transition-all duration-200',
                                isActive
                                  ? 'font-bold text-black'
                                  : 'font-normal text-gray-600'
                              )}
                            >
                              {link.name}
                            </span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </nav>
                </div>

                <div className="flex flex-col gap-4 px-4">
                  {showOnboardingCTA && (
                    <div className="mx-4 mt-6">
                      {!hasSubmittedDocuments || !isPending ? (
                        <Link href="/onboarding" onClick={close}>
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
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    onClick={() => {
                      signOut({ redirectTo: '/login' })
                      close()
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

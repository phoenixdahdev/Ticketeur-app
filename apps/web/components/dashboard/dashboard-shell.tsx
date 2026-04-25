'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'

import { LogoIcon } from '@ticketur/ui/icons/logo-icon'

import { Sidebar, type SidebarUser } from '@/components/dashboard/sidebar'

export function DashboardShell({
  user,
  children,
}: {
  user: SidebarUser
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  return (
    <div className="bg-muted/40 dark:bg-background flex h-svh flex-col overflow-hidden">
      <aside
        aria-label="Primary"
        className="border-border/60 bg-background hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-[255px] md:flex-col md:border-r"
      >
        <Sidebar user={user} />
      </aside>

      <header className="bg-background sticky top-0 z-30 flex h-18 items-center justify-between px-5 shadow-sm shadow-black/[0.04] md:hidden">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-9 w-auto" />
          <span className="font-heading text-foreground text-xl font-semibold tracking-tight">
            Ticketeur
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="text-foreground hover:bg-muted focus-visible:ring-primary/40 -mr-2 flex size-11 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-6"
            aria-hidden
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              className="bg-background absolute inset-y-0 left-0 flex w-70 max-w-[85%] flex-col shadow-xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 38 }}
            >
              <Sidebar user={user} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:pl-63.75">
        <div className="mx-auto flex min-h-0 w-full flex-1 flex-col px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}

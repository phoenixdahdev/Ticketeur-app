'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { LogoIcon } from '@ticketur/ui/icons/logo-icon'

const NAV_LINKS = [
  { href: '/events', label: 'Find Events' },
  { href: '/organizers', label: 'For Organizers' },
  { href: '/vendors', label: 'For Vendors' },
] as const

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20)
  })

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled && !mobileOpen
            ? 'border-border bg-background/75 backdrop-blur-md'
            : 'bg-background border-transparent'
        )}
      >
        <div className="mx-auto flex h-18 w-full max-w-360 items-center justify-between px-4 md:h-21 md:px-10">
          <Link
            href="/"
            aria-label="Ticketur home"
            className="group flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.06, rotate: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <LogoIcon className="h-9 w-auto md:h-10" />
            </motion.div>
            <span className="font-heading text-foreground text-xl font-semibold tracking-tight md:text-[22px]">
              Ticketur
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 md:flex lg:gap-12"
          >
            <ul className="flex items-center gap-6 lg:gap-12">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-foreground hover:text-primary relative inline-flex text-base font-medium transition-colors"
                  >
                    {link.label}
                    <span className="bg-primary pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 rounded-full transition-[width] duration-300 ease-out group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
            <Button size="xl" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>

          <MenuToggle
            open={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          />
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      aria-expanded={open}
      animate={{
        opacity: open ? 0 : 1,
        scale: open ? 0.7 : 1,
        pointerEvents: open ? 'none' : 'auto',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="focus-visible:ring-primary/40 relative -mr-2 flex size-10 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 md:hidden"
    >
      <span className="bg-foreground absolute left-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1.5 rounded-full" />
      <span className="bg-foreground absolute left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full" />
      <span className="bg-foreground absolute left-1/2 h-0.5 w-6 -translate-x-1/2 translate-y-1.5 rounded-full" />
    </motion.button>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-50 md:hidden"
        >
          <motion.div
            className="bg-background absolute inset-0"
            initial={{ clipPath: 'circle(0% at calc(100% - 36px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 36px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 36px) 40px)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          />

          <div
            aria-hidden
            className="from-primary/10 via-primary/4 pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-linear-to-b to-transparent"
          />

          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
            transition={{
              delay: 0.35,
              type: 'spring',
              stiffness: 320,
              damping: 22,
            }}
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="border-border bg-background text-foreground hover:border-primary hover:text-primary focus-visible:ring-primary/40 absolute top-5 right-5 z-10 flex size-11 items-center justify-center rounded-full border shadow-sm transition-colors outline-none focus-visible:ring-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </motion.button>

          <div className="relative flex h-full flex-col px-6 pt-28 pb-10">
            <nav aria-label="Mobile primary" className="flex-1">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      delay: 0.18 + i * 0.07,
                      duration: 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-border/70 overflow-hidden border-b"
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between py-5"
                    >
                      <span className="font-heading text-foreground group-hover:text-primary text-3xl font-medium tracking-tight transition-colors">
                        {link.label}
                      </span>
                      <motion.span
                        aria-hidden
                        className="text-primary text-2xl"
                        initial={{ x: -8, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3 + i * 0.07,
                          duration: 0.3,
                        }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                delay: 0.18 + NAV_LINKS.length * 0.07,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex flex-col gap-4"
            >
              <Button size="xl" asChild className="w-full">
                <Link href="/signup" onClick={onClose}>
                  Get Started
                </Link>
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  onClick={onClose}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

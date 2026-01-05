'use client'

import { usePathname } from 'next/navigation'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@useticketeur/ui/button'
import { cn } from '@useticketeur/ui/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  // Dynamic values for scroll effects
  const widthResult = useTransform(scrollY, [0, 100], ['90%', '85%'])
  const topResult = useTransform(scrollY, [0, 100], ['24px', '16px'])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20)
  })

  return (
    <>
      <motion.header
        style={{
          width: widthResult,
          top: topResult,
          left: '50%',
          x: '-50%',
        }}
        className="fixed z-50 max-w-6xl"
      >
        <motion.div
          layout
          className={cn(
            'relative flex items-center justify-between rounded-full border px-4 py-3 shadow-xl transition-all duration-300 md:px-6 md:py-4',
            isScrolled || isMobileMenuOpen
              ? 'border-purple-200/40 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60'
              : 'border-transparent bg-white/50 backdrop-blur-md'
          )}
        >
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-1.5 md:h-10 md:w-10">
                {/* Fallback Icon if logo fails, but using Image optimally */}
                <Image
                  src="/logo.svg"
                  alt="Ticketeur Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain brightness-0 invert filter"
                  priority
                />
              </div>
              <span className="ml-2 hidden font-sans text-xl font-bold tracking-tight text-gray-900 md:block">
                Ticketeur
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative text-sm font-medium transition-colors hover:text-purple-600',
                    isActive ? 'text-purple-600' : 'text-gray-600'
                  )}
                >
                  <span>{link.label}</span>
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out group-hover:w-full',
                      isActive ? 'w-full' : 'w-0'
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="ghost"
              className="rounded-full px-5 font-sans text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Sign In
            </Button>
            <Button className="group relative overflow-hidden rounded-full bg-black px-6 py-2 font-sans text-sm font-semibold text-white transition-all hover:bg-gray-900 hover:shadow-lg hover:shadow-purple-500/20">
              <span className="relative z-10 flex items-center gap-2">
                Get Started{' '}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-purple-600 to-pink-600 opacity-20 transition-transform duration-500 group-hover:translate-x-0" />
            </Button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 lg:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 12, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full right-0 left-0 overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl p-3 text-center text-base font-medium text-gray-800 transition-colors hover:bg-purple-50 hover:text-purple-700"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="my-2 h-px bg-gray-100" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-center rounded-xl text-gray-600 hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full justify-center rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20">
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

export default Header

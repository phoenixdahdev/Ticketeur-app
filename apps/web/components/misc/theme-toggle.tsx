'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { HugeiconsIcon } from '@hugeicons/react'
import { Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const next = isDark ? 'light' : 'dark'

  return (
    <motion.button
      type="button"
      aria-label={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'border-border bg-background text-foreground hover:border-primary hover:text-primary relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border transition-colors',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <HugeiconsIcon
            icon={isDark ? Sun02Icon : Moon02Icon}
            className="size-4"
            strokeWidth={1.8}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'

export function SubmitModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="submit-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="bg-background relative z-10 flex w-full max-w-md flex-col items-center gap-5 rounded-2xl p-8 text-center shadow-xl"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-7"
                strokeWidth={2}
              />
            </span>
            <div className="flex flex-col gap-2">
              <h2
                id="submit-modal-title"
                className="font-heading text-foreground text-xl font-bold tracking-tight md:text-2xl"
              >
                Event Submitted for Approval
              </h2>
              <p className="text-muted-foreground text-sm">
                Your event has been submitted for review. An administrator will
                review your listing shortly.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <Button size="xl" asChild className="w-full">
                <Link href="/org/events">View Event Status</Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="w-full">
                <Link href="/org/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@ticketur/ui/components/button'
import {
  EventFilters,
  type FiltersValue,
  emptyFilters,
} from '@/components/sections/events/event-filters'

export function MobileFilterDrawer({
  open,
  onClose,
  values,
  onApply,
}: {
  open: boolean
  onClose: () => void
  values: FiltersValue
  onApply: (next: FiltersValue) => void
}) {
  const [draft, setDraft] = useState<FiltersValue>(values)

  useEffect(() => {
    if (open) setDraft(values)
  }, [open, values])

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

  const patchDraft = (patch: Partial<FiltersValue>) =>
    setDraft((prev) => ({ ...prev, ...patch }))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="filter-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-50 md:hidden"
        >
          <motion.button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="border-border bg-background absolute inset-x-0 bottom-0 flex h-[92vh] flex-col rounded-t-3xl border-t shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.35)]"
          >
            <div className="border-border relative flex items-center justify-between border-b px-6 pt-5 pb-4">
              <div
                aria-hidden
                className="bg-border absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full"
              />
              <h2 className="font-heading text-foreground text-xl font-semibold">
                Filters
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-full transition-colors"
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
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <EventFilters values={draft} onChange={patchDraft} />
            </div>

            <div className="border-border bg-background grid grid-cols-2 gap-3 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline-primary"
                size="xl"
                onClick={() => setDraft(emptyFilters())}
              >
                Clear
              </Button>
              <Button
                type="button"
                size="xl"
                onClick={() => {
                  onApply(draft)
                  onClose()
                }}
              >
                Apply
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

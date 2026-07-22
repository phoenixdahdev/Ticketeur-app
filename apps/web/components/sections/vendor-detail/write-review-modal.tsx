'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'
import { Textarea } from '@ticketur/ui/components/textarea'
import { Input } from '@ticketur/ui/components/input'
import { Field, FieldLabel } from '@ticketur/ui/components/field'

import { useTRPC } from '@/lib/trpc'
import { InteractiveStarRating } from '@/components/sections/vendor-detail/star-rating'

// Figma copy says "Maximum of 250 words" — the public.reviews.submit
// mutation enforces 1500 characters server-side. We show the word-count
// hint for the human-readable guidance but hard-cap (and count) characters,
// since that's the limit actually enforced.
const COMMENT_MAX_CHARS = 1500

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function WriteReviewModal({
  open,
  vendorId,
  initialRating = 0,
  user,
  onClose,
}: {
  open: boolean
  vendorId: string
  initialRating?: number
  // Signed in? Pass their identity — submitted silently, no fields shown.
  // Signed out (null)? The modal collects a name + email of its own.
  user: { name: string; email: string } | null
  onClose: () => void
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [mounted, setMounted] = useState(false)
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  useEffect(() => setMounted(true), [])

  // Reset the draft every time the modal opens, seeded from whatever rating
  // the "Tap to Rate" row was tapped with (0 if opened via the plain
  // "Write a review" button).
  useEffect(() => {
    if (open) {
      setRating(initialRating)
      setComment('')
      setGuestName('')
      setGuestEmail('')
    }
  }, [open, initialRating])

  // Scroll lock + Escape-to-close, copied verbatim from the project's
  // established custom-overlay technique in
  // components/sections/events/mobile-filter-drawer.tsx.
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const submit = useMutation(
    trpc.public.reviews.submit.mutationOptions({
      onSuccess: () => {
        toast.success('Review submitted', {
          description: 'Thanks for sharing your experience.',
        })
        // listByVendor is paginated — invalidate every cached page/vendor
        // variant rather than just the one this tab happens to be on.
        queryClient.invalidateQueries({
          queryKey: trpc.public.reviews.listByVendor.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.public.reviews.summaryByVendor.queryKey({ vendorId }),
        })
        onClose()
      },
      onError: (err) => {
        toast.error('Could not submit review', { description: err.message })
      },
    })
  )

  const trimmedGuestName = guestName.trim()
  const trimmedGuestEmail = guestEmail.trim()
  const guestDetailsValid = user
    ? true
    : trimmedGuestName.length > 0 && EMAIL_PATTERN.test(trimmedGuestEmail)
  const canSubmit = rating >= 1 && guestDetailsValid && !submit.isPending

  function handleSubmit() {
    if (!canSubmit) return
    submit.mutate({
      vendorId,
      rating,
      comment,
      ...(user
        ? {}
        : { reviewerName: trimmedGuestName, reviewerEmail: trimmedGuestEmail }),
    })
  }

  // This tab renders inside the vendor profile tab shell's animated
  // `motion.div` (vendor-profile-tabs.tsx), which keeps a non-default
  // `transform` applied even at rest — that makes it a containing block for
  // `position: fixed` descendants, so an un-portaled overlay here would be
  // clipped/positioned against the tab panel instead of the viewport.
  // Portaling to <body> sidesteps that. `mounted` guards against SSR, where
  // `document` doesn't exist.
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="write-review-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="write-review-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="border-border bg-background relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border p-6 shadow-xl md:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2
                  id="write-review-modal-title"
                  className="font-heading text-foreground text-xl font-bold tracking-tight"
                >
                  Write a Review
                </h2>
                <p className="text-muted-foreground text-sm">
                  Share your experience to help other event planners.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-muted-foreground hover:bg-muted hover:text-foreground -mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  className="size-5"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-foreground text-sm font-semibold">
                  Your Rating
                </span>
                <InteractiveStarRating
                  value={rating}
                  onChange={setRating}
                  size="lg"
                />
              </div>

              {!user && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="write-review-guest-name">
                      Your Name
                    </FieldLabel>
                    <Input
                      id="write-review-guest-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe"
                      maxLength={120}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="write-review-guest-email">
                      Your Email
                    </FieldLabel>
                    <Input
                      id="write-review-guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </Field>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="write-review-comment"
                  className="text-foreground text-sm font-semibold"
                >
                  Your Review
                </label>
                <Textarea
                  id="write-review-comment"
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value.slice(0, COMMENT_MAX_CHARS))
                  }
                  maxLength={COMMENT_MAX_CHARS}
                  placeholder="Tell us about your experience working with this vendor…"
                  className="min-h-32 resize-none"
                />
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Maximum of 250 words</span>
                  <span>
                    {comment.length}/{COMMENT_MAX_CHARS}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                size="xl"
                className="w-full"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {submit.isPending ? 'Submitting…' : 'Submit Review'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

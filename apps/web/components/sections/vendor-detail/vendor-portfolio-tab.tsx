'use client'

import { useCallback, useEffect, useState, type JSX } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AlbumNotFound02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Image01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction >= 0 ? -28 : 28 }),
}

export function VendorPortfolioTab({
  images,
}: {
  images: string[]
}): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)

  const openLightbox = (index: number) => {
    setDirection(1)
    setActiveIndex(index)
  }

  const closeLightbox = useCallback(() => setActiveIndex(null), [])

  const showPrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length
    )
  }, [images.length])

  const showNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length
    )
  }, [images.length])

  const goTo = useCallback((next: number) => {
    setActiveIndex((current) => {
      setDirection(current !== null && next < current ? -1 : 1)
      return next
    })
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 md:gap-6 md:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Image01Icon}
              className="text-primary size-5"
              strokeWidth={1.8}
            />
            <h2 className="font-heading text-foreground text-lg font-semibold md:text-xl">
              Portfolio
            </h2>
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            {images.length} Portfolio image{images.length === 1 ? '' : 's'}
          </span>
        </div>

        {images.length === 0 ? (
          <div className="border-border bg-muted/20 flex min-h-72 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-10 text-center">
            <div className="bg-primary/10 text-primary mb-1 flex size-14 items-center justify-center rounded-2xl">
              <HugeiconsIcon
                icon={AlbumNotFound02Icon}
                className="size-7"
                strokeWidth={1.6}
              />
            </div>
            <p className="font-heading text-foreground text-lg font-semibold">
              No Portfolio Available Yet
            </p>
            <p className="text-muted-foreground max-w-sm text-sm">
              This vendor hasn&rsquo;t added any portfolio images yet. Check
              back soon to see their work.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {images.map((src, index) => (
              <motion.button
                key={`${src}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                aria-label={`View portfolio image ${index + 1}`}
                className="group bg-muted relative aspect-square w-full overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Portfolio image ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      <PortfolioLightbox
        images={images}
        index={activeIndex}
        direction={direction}
        onClose={closeLightbox}
        onPrev={showPrev}
        onNext={showNext}
        onSelect={goTo}
      />
    </>
  )
}

function PortfolioLightbox({
  images,
  index,
  direction,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  images: string[]
  index: number | null
  direction: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
}) {
  const open = index !== null

  // `VendorProfileTabs` wraps every tab's content in a `motion.div` that
  // animates `y`/`opacity` on tab switch. Framer Motion leaves an inline
  // `transform` on that ancestor even at rest, which (per the CSS spec)
  // makes it a containing block for `position: fixed` — so a naive
  // `fixed inset-0` overlay nested under it would be sized/positioned
  // against the tab wrapper's box instead of the viewport. Portal to
  // `document.body` to escape it; gate on `mounted` since `document` isn't
  // available during SSR.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Scroll-lock + Escape/arrow-key handling, mirroring the pattern in
  // `mobile-filter-drawer.tsx` (fixed-position body lock that preserves
  // scroll offset, restored on close).
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
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
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
  }, [open, onClose, onPrev, onNext])

  const hasMultiple = images.length > 1
  const activeSrc = index !== null ? images[index] : undefined

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && index !== null && activeSrc !== undefined && (
        <motion.div
          key="portfolio-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
          className="fixed inset-0 z-50"
        >
          <motion.button
            type="button"
            aria-label="Close image viewer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full flex-col"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:top-6 md:right-6"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-5"
                strokeWidth={2}
              />
            </button>

            <div className="relative flex flex-1 items-center justify-center px-4 py-16 md:px-10">
              {hasMultiple && (
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-6"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    className="size-5"
                    strokeWidth={2}
                  />
                </button>
              )}

              <div className="relative h-full max-h-[70vh] w-full max-w-5xl overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSrc}
                      alt={`Portfolio image ${index + 1} of ${images.length}`}
                      fill
                      sizes="(min-width: 768px) 900px, 100vw"
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {hasMultiple && (
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next image"
                  className="absolute top-1/2 right-2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6"
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-5"
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>

            {hasMultiple && (
              <div className="flex flex-col items-center gap-3 pb-6">
                <p className="text-sm font-medium text-white/70">
                  {index + 1} / {images.length}
                </p>
                <div className="flex max-w-full [scrollbar-width:none] gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => onSelect(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        'relative size-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all md:size-14',
                        i === index
                          ? 'border-white opacity-100'
                          : 'border-transparent opacity-50 hover:opacity-80'
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

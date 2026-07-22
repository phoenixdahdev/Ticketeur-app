'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  StarIcon,
} from '@hugeicons/core-free-icons'

import type { RouterOutputs } from '@ticketur/api'
import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import { useTRPC } from '@/lib/trpc'
import { useSession } from '@/lib/auth-client'
import { formatShortDate } from '@/lib/date'
import {
  StarRating,
  InteractiveStarRating,
} from '@/components/sections/vendor-detail/star-rating'
import { WriteReviewModal } from '@/components/sections/vendor-detail/write-review-modal'

const REVIEWS_PAGE_SIZE = 8
const RATING_LEVELS = [5, 4, 3, 2, 1] as const

type ReviewSummary = RouterOutputs['public']['reviews']['summaryByVendor']
type ReviewRow =
  RouterOutputs['public']['reviews']['listByVendor']['rows'][number]

export function VendorReviewsTab({ vendorId }: { vendorId: string }) {
  const trpc = useTRPC()
  const router = useRouter()
  const session = useSession()
  const user = session.data?.user ?? null

  const [page, setPage] = useState(1)
  const [quickRating, setQuickRating] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [initialRating, setInitialRating] = useState(0)

  const summaryQuery = useQuery(
    trpc.public.reviews.summaryByVendor.queryOptions({ vendorId })
  )
  const listQuery = useQuery(
    trpc.public.reviews.listByVendor.queryOptions({
      vendorId,
      page,
      pageSize: REVIEWS_PAGE_SIZE,
    })
  )

  const rows = listQuery.data?.rows ?? []
  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / REVIEWS_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  // Shared by the "Tap to Rate" quick-stars and the plain "Write a review"
  // button. Not signed in? Bounce to login and come straight back here
  // instead of silently opening a modal that would just fail on submit —
  // mirrors the page-level auth-guard convention in
  // app/(app)/account/tickets/page.tsx.
  function openWriteReview(rating: number) {
    setQuickRating(rating)
    if (!user) {
      router.push(`/login?redirect=/vendors/${vendorId}?tab=reviews`)
      return
    }
    setInitialRating(rating)
    setModalOpen(true)
  }

  function closeWriteReview() {
    setModalOpen(false)
    setQuickRating(0)
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-foreground text-lg font-semibold md:text-xl">
            Tap to Rate
          </h2>
          <InteractiveStarRating
            value={quickRating}
            onChange={openWriteReview}
            size="lg"
          />
        </div>
        <Button
          type="button"
          size="xl"
          onClick={() => openWriteReview(0)}
          className="w-full sm:w-auto"
        >
          Write a review
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <RatingsSummaryCard
          summary={summaryQuery.data}
          loading={summaryQuery.isLoading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 md:p-6"
      >
        <h2 className="font-heading text-foreground text-lg font-semibold md:text-xl">
          Reviews{total > 0 ? ` (${total.toLocaleString()})` : ''}
        </h2>

        {listQuery.isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-32 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyReviews />
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}
      </motion.div>

      <WriteReviewModal
        open={modalOpen}
        vendorId={vendorId}
        initialRating={initialRating}
        onClose={closeWriteReview}
      />
    </div>
  )
}

function RatingsSummaryCard({
  summary,
  loading,
}: {
  summary: ReviewSummary | undefined
  loading: boolean
}) {
  const average = summary?.average ?? 0
  const total = summary?.total ?? 0

  return (
    <div className="border-border bg-card flex flex-col gap-6 rounded-2xl border p-5 md:p-6">
      <h2 className="font-heading text-foreground text-lg font-semibold md:text-xl">
        Ratings
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-muted h-28 animate-pulse rounded-xl" />
          <div className="bg-muted h-28 animate-pulse rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
          <div className="border-border flex flex-col items-center gap-1.5 sm:items-start sm:border-r sm:pr-10">
            <span className="font-heading text-foreground text-5xl font-bold tracking-tight">
              {average > 0 ? average.toFixed(1) : '0.0'}
            </span>
            <span className="text-muted-foreground text-sm">out of 5</span>
            <StarRating value={average} size="md" className="mt-1" />
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {total > 0
                ? `Based on ${total.toLocaleString()} review${total === 1 ? '' : 's'}`
                : 'No reviews yet'}
            </span>
          </div>

          <div className="flex flex-col justify-center gap-2.5">
            {RATING_LEVELS.map((star) => {
              const count = summary?.distribution[star] ?? 0
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-muted-foreground flex w-3 shrink-0 items-center text-sm font-medium">
                    {star}
                  </span>
                  <HugeiconsIcon
                    icon={StarIcon}
                    className="text-primary size-3.5 shrink-0"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-6 shrink-0 text-right text-xs">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewRow }) {
  const initial = review.reviewerName.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-semibold">
              {review.reviewerName}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatShortDate(review.createdAt)}
            </span>
          </div>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      {review.comment ? (
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          {review.comment}
        </p>
      ) : null}
    </div>
  )
}

function EmptyReviews() {
  return (
    <div className="border-border bg-muted/30 flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-10 text-center">
      <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
        <HugeiconsIcon icon={StarIcon} className="size-6" strokeWidth={1.6} />
      </span>
      <h3 className="font-heading text-foreground text-lg font-bold tracking-tight">
        No Reviews Yet
      </h3>
      <p className="text-muted-foreground max-w-md text-sm leading-6">
        Be the first to share your experience working with this vendor.
      </p>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const pages = getPageList(page, totalPages)
  return (
    <nav
      aria-label="Reviews pagination"
      className="flex items-center justify-center gap-2 pt-2"
    >
      <PageButton
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        ariaLabel="Previous page"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          className="size-4"
          strokeWidth={2}
        />
      </PageButton>
      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`dots-${i}`}
            className="text-muted-foreground px-1 text-sm"
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            active={p === page}
            onClick={() => onChange(p)}
            ariaLabel={`Page ${p}`}
          >
            {p}
          </PageButton>
        )
      )}
      <PageButton
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        ariaLabel="Next page"
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4"
          strokeWidth={2}
        />
      </PageButton>
    </nav>
  )
}

function PageButton({
  active,
  disabled,
  onClick,
  ariaLabel,
  children,
}: {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  ariaLabel?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:border-primary hover:text-primary',
        disabled && 'pointer-events-none opacity-40'
      )}
    >
      {children}
    </button>
  )
}

function getPageList(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (page > 3) pages.push('…')
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (page < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { StarIcon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

const RATING_MAX = 5
const SIZE_CLASS = { sm: 'size-4', md: 'size-5', lg: 'size-6' } as const

// Read-only display — filled stars up to the rounded rating value.
export function StarRating({
  value,
  size = 'sm',
  className,
}: {
  value: number
  size?: keyof typeof SIZE_CLASS
  className?: string
}) {
  const rounded = Math.round(value)
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-hidden>
      {Array.from({ length: RATING_MAX }, (_, i) => (
        <HugeiconsIcon
          key={i}
          icon={StarIcon}
          className={cn(
            SIZE_CLASS[size],
            i < rounded ? 'text-primary' : 'text-muted-foreground/25'
          )}
          fill={i < rounded ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

// Interactive tap-to-rate control used in the Reviews tab and Write a Review modal.
export function InteractiveStarRating({
  value,
  onChange,
  size = 'lg',
  className,
}: {
  value: number
  onChange: (rating: number) => void
  size?: keyof typeof SIZE_CLASS
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className={cn('flex items-center gap-1', className)}
    >
      {Array.from({ length: RATING_MAX }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= value
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            onClick={() => onChange(starValue)}
            className="p-0.5 transition-transform hover:scale-110 active:scale-95"
          >
            <HugeiconsIcon
              icon={StarIcon}
              className={cn(
                SIZE_CLASS[size],
                filled ? 'text-primary' : 'text-muted-foreground/25'
              )}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}

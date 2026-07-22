'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Location01Icon, StarIcon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

export type VendorFiltersValue = {
  minRating: number
  location: string
}

export function emptyVendorFilters(): VendorFiltersValue {
  return { minRating: 0, location: '' }
}

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const

// Rating + location filter fields for the vendor marketplace directory.
// Mirrors the shape/interaction model of `event-filters.tsx` (a controlled
// `values` + `onChange(patch)` pair) so it can be reused inline in both the
// desktop popover and the mobile bottom-sheet drawer.
export function VendorFilters({
  values,
  onChange,
  className,
}: {
  values: VendorFiltersValue
  onChange: (patch: Partial<VendorFiltersValue>) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <FilterSection title="Minimum rating">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((n) => {
            const active = values.minRating === n
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ minRating: active ? 0 : n })}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  className="size-3.5"
                  fill={active ? 'currentColor' : 'none'}
                  strokeWidth={1.6}
                />
                {n}+
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Location">
        <label className="border-border bg-background focus-within:border-primary flex h-11 items-center gap-2 rounded-lg border px-3">
          <HugeiconsIcon
            icon={Location01Icon}
            className="text-muted-foreground size-4 shrink-0"
            strokeWidth={1.6}
          />
          <input
            type="text"
            value={values.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="City or area"
            className="text-foreground placeholder:text-muted-foreground w-full min-w-0 bg-transparent text-sm outline-none"
          />
        </label>
      </FilterSection>
    </div>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-heading text-foreground text-base font-semibold">
        {title}
      </span>
      {children}
    </div>
  )
}

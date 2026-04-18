'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, Location01Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Checkbox } from '@ticketur/ui/components/checkbox'
import { Calendar } from '@ticketur/ui/components/calendar'
import { Slider } from '@ticketur/ui/components/slider'
import { toDate, toIsoDate } from '@/lib/date'

export const CATEGORIES = ['All', 'Music', 'Fashion', 'Art', 'Tech'] as const
export type Category = (typeof CATEGORIES)[number]

export type FiltersValue = {
  categories: string[]
  date: string
  priceMin: number
  priceMax: number
  location: string
}

export const PRICE_MIN_DEFAULT = 0
export const PRICE_MAX_DEFAULT = 500

export function emptyFilters(): FiltersValue {
  return {
    categories: [],
    date: '',
    priceMin: PRICE_MIN_DEFAULT,
    priceMax: PRICE_MAX_DEFAULT,
    location: '',
  }
}

export function EventFilters({
  values,
  onChange,
  className,
}: {
  values: FiltersValue
  onChange: (patch: Partial<FiltersValue>) => void
  className?: string
}) {
  const selectedDate = toDate(values.date) ?? undefined

  const isAllSelected = values.categories.length === 0

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      onChange({ categories: [] })
      return
    }
    const next = values.categories.includes(cat)
      ? values.categories.filter((c) => c !== cat)
      : [...values.categories, cat]
    onChange({ categories: next })
  }

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <FilterSection title="Categories">
        <div className="flex flex-col gap-2">
          <label className="text-foreground flex cursor-pointer items-center gap-3 text-sm">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={() => toggleCategory('All')}
            />
            <span>All</span>
          </label>
          {CATEGORIES.slice(1).map((cat) => (
            <label
              key={cat}
              className="text-foreground flex cursor-pointer items-center gap-3 text-sm"
            >
              <Checkbox
                checked={values.categories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Date">
        <div className="border-border bg-background w-full overflow-hidden rounded-xl border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => onChange({ date: d ? toIsoDate(d) : '' })}
            captionLayout="dropdown"
            className="w-full"
          />
        </div>
      </FilterSection>

      <FilterSection title="Price range">
        <div className="flex flex-col gap-3 pt-2">
          <Slider
            min={PRICE_MIN_DEFAULT}
            max={PRICE_MAX_DEFAULT}
            step={10}
            value={[values.priceMin, values.priceMax]}
            onValueChange={(v) =>
              onChange({ priceMin: v[0] ?? 0, priceMax: v[1] ?? 500 })
            }
          />
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>${values.priceMin}</span>
            <span>
              $
              {values.priceMax >= PRICE_MAX_DEFAULT
                ? `${PRICE_MAX_DEFAULT}+`
                : values.priceMax}
            </span>
          </div>
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
            placeholder="City"
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
  const [open, setOpen] = useState(true)
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-4 text-left outline-none"
      >
        <span className="font-heading text-foreground text-base font-semibold">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="text-muted-foreground"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className="size-5"
            strokeWidth={1.8}
          />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FilterIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import {
  SmallEventCard,
  type SmallEventCardProps,
} from '@/components/cards/small-event-card'
import {
  EventFilters,
  type FiltersValue,
  PRICE_MAX_DEFAULT,
  PRICE_MIN_DEFAULT,
  emptyFilters,
} from '@/components/sections/events/event-filters'
import {
  EventsToolbar,
  type EventSort,
  type EventTab,
} from '@/components/sections/events/events-toolbar'
import { MobileFilterDrawer } from '@/components/sections/events/mobile-filter-drawer'

const PAGE_SIZE = 6

const EVENTS: (SmallEventCardProps & {
  id: string
  priceNum: number
  tab: EventTab
  category: string
  createdAt: string
})[] = [
  {
    id: 'lagos-fest-2026',
    title: 'Lagos Fest 2026',
    category: 'Music',
    status: 'upcoming',
    price: '₦10,000',
    priceNum: 25,
    date: '2026-10-20',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    href: '/events/lagos-fest-2026',
    tab: 'upcoming',
    createdAt: '2026-02-01',
  },
  {
    id: 'all-stars-charity-sport',
    title: 'All Stars Charity Sport',
    category: 'Sports',
    status: 'upcoming',
    price: 'Free',
    priceNum: 0,
    date: '2026-10-21',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    href: '/events/all-stars-charity-sport',
    tab: 'upcoming',
    createdAt: '2026-02-05',
  },
  {
    id: 'future-tech-summit',
    title: 'Future Tech Summit',
    category: 'Tech',
    status: 'upcoming',
    price: '₦3,000',
    priceNum: 8,
    date: '2026-10-20',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    href: '/events/future-tech-summit',
    tab: 'upcoming',
    createdAt: '2026-02-08',
  },
  {
    id: 'gtco-fashion-week',
    title: 'GTCO Fashion Week',
    category: 'Fashion',
    status: 'upcoming',
    price: 'Free',
    priceNum: 0,
    date: '2026-10-20',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    href: '/events/gtco-fashion-week',
    tab: 'upcoming',
    createdAt: '2026-02-11',
  },
  {
    id: 'lagos-fest-2026-rerun',
    title: 'Lagos Fest 2026',
    category: 'Music',
    status: 'upcoming',
    price: '₦10,000',
    priceNum: 25,
    date: '2026-10-20',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
    href: '/events/lagos-fest-2026-rerun',
    tab: 'upcoming',
    createdAt: '2026-02-14',
  },
  {
    id: 'lagos-fest-2026-encore',
    title: 'Lagos Fest 2026',
    category: 'Music',
    status: 'upcoming',
    price: '₦10,000',
    priceNum: 25,
    date: '2026-10-20',
    location: 'Gbagada, Lagos',
    imageUrl:
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=800&q=80',
    href: '/events/lagos-fest-2026-encore',
    tab: 'upcoming',
    createdAt: '2026-02-17',
  },
  {
    id: 'modern-art-expo',
    title: 'Modern Art Expo',
    category: 'Art',
    status: 'upcoming',
    price: 'Free',
    priceNum: 0,
    date: '2026-09-04',
    location: 'Mawuri, Abuja',
    imageUrl:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80',
    href: '/events/modern-art-expo',
    tab: 'upcoming',
    createdAt: '2026-02-20',
  },
  {
    id: 'past-concert-2025',
    title: 'Afrobeats Classics',
    category: 'Music',
    status: 'past',
    price: '₦8,000',
    priceNum: 20,
    date: '2025-11-12',
    location: 'Eko Convention Centre',
    imageUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
    href: '/events/past-concert-2025',
    tab: 'past',
    createdAt: '2025-09-01',
  },
]

export function EventsGridSection() {
  const [state, setState] = useQueryStates(
    {
      tab: parseAsStringLiteral(['upcoming', 'past']).withDefault('upcoming'),
      q: parseAsString.withDefault(''),
      sort: parseAsStringLiteral([
        'newest',
        'price-asc',
        'price-desc',
        'popular',
      ]).withDefault('newest'),
      categories: parseAsArrayOf(parseAsString).withDefault([]),
      date: parseAsString.withDefault(''),
      priceMin: parseAsInteger.withDefault(PRICE_MIN_DEFAULT),
      priceMax: parseAsInteger.withDefault(PRICE_MAX_DEFAULT),
      location: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: true }
  )

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const filterValues: FiltersValue = {
    categories: state.categories,
    date: state.date,
    priceMin: state.priceMin,
    priceMax: state.priceMax,
    location: state.location,
  }

  const patchFilters = (patch: Partial<FiltersValue>) => {
    setState({ ...patch, page: 1 })
  }

  const activeFilterCount =
    (state.categories.length > 0 ? 1 : 0) +
    (state.date ? 1 : 0) +
    (state.location ? 1 : 0) +
    (state.priceMin > PRICE_MIN_DEFAULT || state.priceMax < PRICE_MAX_DEFAULT
      ? 1
      : 0)

  const filtered = useMemo(() => {
    const q = state.q.trim().toLowerCase()
    let list = EVENTS.filter((e) => e.tab === state.tab)
    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
    }
    if (state.categories.length > 0) {
      list = list.filter((e) => state.categories.includes(e.category))
    }
    if (state.date) {
      list = list.filter((e) => {
        const d =
          typeof e.date === 'string'
            ? e.date
            : e.date.toISOString().slice(0, 10)
        return d === state.date
      })
    }
    if (state.location) {
      const loc = state.location.trim().toLowerCase()
      list = list.filter((e) => e.location.toLowerCase().includes(loc))
    }
    list = list.filter(
      (e) => e.priceNum >= state.priceMin && e.priceNum <= state.priceMax
    )

    const sorted = [...list]
    switch (state.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.priceNum - b.priceNum)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.priceNum - a.priceNum)
        break
      case 'newest':
        sorted.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
        break
      case 'popular':
        break
    }
    return sorted
  }, [state])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(state.page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <section aria-label="All events" className="relative w-full px-5 md:px-10">
      <div className="mx-auto flex max-w-[1440px] gap-10 pb-16 md:pb-20">
        <aside
          aria-label="Filters"
          className="hidden w-[320px] shrink-0 lg:block"
        >
          <div className="sticky top-24">
            <h2 className="font-heading text-foreground mb-6 text-lg font-semibold">
              Filters
            </h2>
            <EventFilters values={filterValues} onChange={patchFilters} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <EventsToolbar
            tab={state.tab}
            onTabChange={(t) => setState({ tab: t, page: 1 })}
            query={state.q}
            onQueryChange={(q) => setState({ q: q || null, page: 1 })}
            sort={state.sort}
            onSortChange={(s) => setState({ sort: s, page: 1 })}
          />

          {pageItems.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <SmallEventCard {...event} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={(p) => setState({ page: p })}
            />
          )}
        </div>
      </div>

      <MobileFloatingFilterButton
        count={activeFilterCount}
        onClick={() => setMobileFilterOpen(true)}
      />

      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        values={filterValues}
        onApply={(next) =>
          setState({
            categories: next.categories.length > 0 ? next.categories : null,
            date: next.date || null,
            priceMin:
              next.priceMin === PRICE_MIN_DEFAULT ? null : next.priceMin,
            priceMax:
              next.priceMax === PRICE_MAX_DEFAULT ? null : next.priceMax,
            location: next.location || null,
            page: 1,
          })
        }
      />
    </section>
  )
}

function EmptyState() {
  return (
    <div className="border-border bg-muted/20 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
      <p className="font-heading text-foreground text-lg font-semibold">
        No events match your filters
      </p>
      <p className="text-muted-foreground mt-1 text-sm">
        Try clearing some filters or searching for something else.
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
  onChange: (p: number) => void
}) {
  const pages = getPageList(page, totalPages)
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-4"
    >
      <PageButton
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
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
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </PageButton>
        )
      )}
      <PageButton
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
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
  children,
  ...props
}: {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:border-primary hover:text-primary',
        disabled && 'pointer-events-none opacity-40'
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function getPageList(page: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | '…')[] = [1]
  if (page > 3) pages.push('…')
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (page < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

function MobileFloatingFilterButton({
  count,
  onClick,
}: {
  count: number
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3, ease: 'easeOut' }}
      whileTap={{ scale: 0.95 }}
      className="bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary-hover fixed right-5 bottom-6 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-xl transition-colors md:right-8 md:bottom-8 lg:hidden"
    >
      <HugeiconsIcon icon={FilterIcon} className="size-4" strokeWidth={2} />
      Filter
      {count > 0 && (
        <span className="text-primary ml-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold">
          {count}
        </span>
      )}
    </motion.button>
  )
}

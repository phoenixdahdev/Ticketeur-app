'use client'

import { AnimatePresence, motion } from 'motion/react'
import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { VendorCard } from '@/components/cards/vendor-card'
import { useTRPC } from '@/lib/trpc'

const CATEGORY_CHIPS = [
  { label: 'All Services', value: 'all' },
  { label: 'Food & Drink', value: 'Food & Drink' },
  { label: 'Beverages', value: 'Beverages' },
  { label: 'Apparel', value: 'Apparel' },
  { label: 'Decor', value: 'Decor' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Merchandise', value: 'Merchandise' },
] as const

const PAGE_SIZE = 8
const VENDOR_PLACEHOLDER = '/vendor-placeholder.png'

export function VendorListSection() {
  const trpc = useTRPC()
  const router = useRouter()
  const [state, setState] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      category: parseAsString.withDefault('all'),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: true, clearOnDefault: true }
  )

  const listQuery = useQuery(
    trpc.public.vendors.list.queryOptions({
      q: state.q,
      category: state.category,
      page: state.page,
      pageSize: PAGE_SIZE,
    })
  )

  const data = listQuery.data
  const total = data?.total ?? 0
  const pageItems = data?.rows ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(state.page, totalPages)

  return (
    <section
      aria-labelledby="vendor-list-title"
      className="w-full px-5 py-10 md:px-10 md:py-16"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2.5"
        >
          <h1
            id="vendor-list-title"
            className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-[40px] md:leading-[1.15]"
          >
            All Vendors
          </h1>
          <p className="text-base text-muted-foreground">
            Connect with the industry&rsquo;s finest event professionals. Every
            vendor is curated to ensure your production is world-class.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 md:flex-row md:items-center"
        >
          <label className="flex h-12 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-4 focus-within:border-primary">
            <HugeiconsIcon
              icon={Search01Icon}
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.6}
            />
            <input
              type="search"
              value={state.q}
              onChange={(e) =>
                setState({ q: e.target.value || null, page: 1 })
              }
              placeholder="Search by name or service specialization..."
              className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground md:text-base"
            />
          </label>
          <Button
            size="default"
            className="h-12 px-8 text-base md:h-12"
            onClick={() => setState({ page: 1 })}
          >
            Search
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          {CATEGORY_CHIPS.map((chip) => {
            const active = state.category === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() =>
                  setState({
                    category: chip.value === 'all' ? null : chip.value,
                    page: 1,
                  })
                }
                className={cn(
                  'relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                {chip.label}
              </button>
            )
          })}
        </motion.div>

        {listQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-muted h-64 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">
              No vendors match your search
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing the search or picking a different category.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {pageItems.map((vendor, i) => (
                <motion.div
                  key={vendor.id + currentPage}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <VendorCard
                    id={vendor.id}
                    name={vendor.businessName ?? 'Vendor'}
                    description={
                      vendor.tagline ??
                      vendor.businessDescription ??
                      vendor.businessCategory ??
                      ''
                    }
                    imageUrl={vendor.image ?? VENDOR_PLACEHOLDER}
                    onClick={() => router.push(`/vendors/${vendor.id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
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
    </section>
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
            className="px-1 text-sm text-muted-foreground"
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

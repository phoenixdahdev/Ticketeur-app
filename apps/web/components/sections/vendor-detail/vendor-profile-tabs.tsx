'use client'

import { AnimatePresence, motion } from 'motion/react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

import { cn } from '@ticketur/ui/lib/utils'

import type { VendorRecord } from '@/lib/vendors'
import {
  VendorAbout,
  type VendorContact,
} from '@/components/sections/vendor-detail/vendor-about'
import { VendorPortfolioTab } from '@/components/sections/vendor-detail/vendor-portfolio-tab'
import { VendorReviewsTab } from '@/components/sections/vendor-detail/vendor-reviews-tab'
import {
  VendorEventsTab,
  type VendorEventCard,
} from '@/components/sections/vendor-detail/vendor-events-tab'

const TABS = ['overview', 'portfolio', 'reviews', 'events'] as const
type TabKey = (typeof TABS)[number]

const TAB_LABELS: Record<TabKey, string> = {
  overview: 'Overview',
  portfolio: 'Portfolio',
  reviews: 'Reviews',
  events: 'Events',
}

export function VendorProfileTabs({
  vendorId,
  vendor,
  contact,
  showcaseImages,
  upcomingEvents,
  pastEvents,
}: {
  vendorId: string
  vendor: VendorRecord
  contact: VendorContact
  showcaseImages: string[]
  upcomingEvents: VendorEventCard[]
  pastEvents: VendorEventCard[]
}) {
  const previousEvents = pastEvents.map((event) => ({
    id: event.id,
    title: event.title,
  }))
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(TABS).withDefault('overview')
  )

  return (
    <section aria-label="Vendor profile" className="w-full px-5 md:px-10">
      <div className="mx-auto max-w-[1440px] pt-6 md:pt-8">
        <div
          role="tablist"
          className="border-border [scrollbar-width:none] overflow-x-auto border-b [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center gap-6 md:gap-8">
            {TABS.map((t) => {
              const active = tab === t
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className={cn(
                    'relative -mb-px shrink-0 px-2 pb-4 text-base font-semibold whitespace-nowrap transition-colors outline-none',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {TAB_LABELS[t]}
                  {active && (
                    <motion.span
                      layoutId="vendor-tab-underline"
                      className="bg-primary absolute inset-x-0 -bottom-px h-[3px] rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-8 pb-10 md:pt-10 md:pb-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === 'overview' && (
                <VendorAbout
                  vendor={vendor}
                  contact={contact}
                  previousEvents={previousEvents}
                />
              )}
              {tab === 'portfolio' && (
                <VendorPortfolioTab images={showcaseImages} />
              )}
              {tab === 'reviews' && <VendorReviewsTab vendorId={vendorId} />}
              {tab === 'events' && (
                <VendorEventsTab upcoming={upcomingEvents} past={pastEvents} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

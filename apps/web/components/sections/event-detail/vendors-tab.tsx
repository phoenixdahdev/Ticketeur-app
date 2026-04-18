'use client'

import { AnimatePresence, motion } from 'motion/react'
import { parseAsString, useQueryState } from 'nuqs'

import { VendorCard } from '@/components/cards/vendor-card'
import { PARTICIPATING_VENDORS } from '@/components/sections/event-detail/vendor-data'
import { VendorDetailView } from '@/components/sections/event-detail/vendor-detail-view'
import type { EventDetailData } from '@/components/sections/event-detail/types'

export function VendorsTab({ event }: { event: EventDetailData }) {
  void event
  const [vendorId, setVendorId] = useQueryState(
    'vendor',
    parseAsString.withDefault('')
  )

  const selected = vendorId
    ? PARTICIPATING_VENDORS.find((v) => v.id === vendorId)
    : undefined

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <VendorDetailView
              vendor={selected}
              onBack={() => setVendorId(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <VendorList onSelect={(id) => setVendorId(id)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VendorList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Participating Vendors
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          Explore our curated selection of local vendors, from food to drinks.
          All vendors accept cashless payments.
        </p>
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-6">
        {PARTICIPATING_VENDORS.map((vendor, i) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              delay: i * 0.08,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-[85%] shrink-0 snap-start sm:w-auto"
          >
            <VendorCard
              id={vendor.id}
              name={vendor.name}
              description={vendor.shortDescription}
              imageUrl={vendor.imageUrl}
              onClick={() => onSelect(vendor.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

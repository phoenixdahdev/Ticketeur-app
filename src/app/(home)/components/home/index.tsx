'use client'

import { useState } from 'react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Search, Plus } from 'lucide-react'
import TabNavigation from './tab-navigation'
import EventsContent from './events-content'
import { useSearch } from '~/hook/use-search'
import FilterDropdowns from './filter-dropdowns'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('explore')
  const { search, setSearch } = useSearch()

  const tabs = [
    { id: 'explore', label: 'Explore Events' },
    { id: 'ongoing', label: 'Ongoing Events' },
    { id: 'past', label: 'Past Events' },
  ]

  return (
    <div className="no-scrollbar mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 md:w-80 md:flex-none">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border-border pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <FilterDropdowns />
          <Button className="w-full text-white md:w-auto" asChild>
            <Link href="/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="font-transforma-sans mt-8 md:mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="no-scrollbar"
          >
            <EventsContent tabId={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

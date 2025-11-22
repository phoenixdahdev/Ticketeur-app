'use client'

import { motion } from 'framer-motion'
import { cn } from '@useticketeur/ui/lib/utils'

interface Tab {
  id: string
  label: string
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function TabNavigation({
  tabs,
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  return (
    <div className="border-border font-transforma-sans border-b">
      <div className="relative flex gap-6 md:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative pb-3 text-sm font-medium transition-colors md:pb-4 md:text-base',
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="bg-foreground absolute right-0 bottom-0 left-0 h-1"
                transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

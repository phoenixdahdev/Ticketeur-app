'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@useticketeur/ui/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
}

interface FormBreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: FormBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground my-3 flex flex-wrap items-center gap-2 text-sm lg:my-5"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex items-center">
            {!isLast ? (
              <>
                <Link
                  href={item.href ?? '#'}
                  className={cn(
                    'hover:text-primary font-inter text-xs font-bold text-[#1E2028] lg:text-sm',
                    item.isCurrent && 'text-primary'
                  )}
                >
                  {item.label}
                </Link>
                <span className="text-muted-foreground ml-2">
                  <ChevronRight className="h-3 w-3 text-[#6b6f8c] opacity-80 lg:h-4 lg:w-4" />
                </span>
              </>
            ) : (
              <span className="font-inter text-xs font-bold text-[#1E2028] lg:text-sm">
                {item.label}
              </span>
            )}
          </div>
        )
      })}

      <span className="text-muted-foreground mx-0">
        <ChevronRight className="h-3 w-3 text-[#6b6f8c] opacity-80 lg:h-4 lg:w-4" />
      </span>
      <span className="font-sans text-xs text-[#A7ACC1] lg:text-sm">
        Current Page
      </span>
    </nav>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkBadge02Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'
import { StarRating } from '@/components/sections/vendor-detail/star-rating'

// Card for the public vendor marketplace directory (/vendors/list). Distinct
// from the shared `VendorCard` (components/cards/vendor-card.tsx) used on the
// homepage and event-detail vendor tab — this one carries the banner-photo +
// rating + location anatomy specific to the marketplace listing and must not
// replace that shared component's other call sites.
export type VendorMarketplaceCardProps = {
  id: string
  name: string
  category: string | null
  description: string
  imageUrl: string
  location: string | null
  avgRating: number | null
  reviewCount: number
  href: string
  className?: string
}

export function VendorMarketplaceCard({
  name,
  category,
  description,
  imageUrl,
  location,
  avgRating,
  reviewCount,
  href,
  className,
}: VendorMarketplaceCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'group border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow duration-300 hover:shadow-lg',
        className
      )}
    >
      <div className="bg-muted relative aspect-video w-full shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="relative">
          {/* Every vendor returned by public.vendors.list is already
              approval-filtered server-side, so the badge always renders.
              Positioned to straddle the photo/content boundary, matching Figma. */}
          <div
            aria-label="Verified vendor"
            className="bg-primary dark:border-background absolute -top-[27px] right-1 flex size-8 items-center justify-center rounded-full border-4 border-white shadow-md"
          >
            <HugeiconsIcon
              icon={CheckmarkBadge02Icon}
              className="size-3.5 text-white"
              strokeWidth={2}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-foreground truncate text-lg font-semibold tracking-tight">
            {name}
          </h3>
          {category ? (
            <span className="dark:text-muted-foreground inline-flex w-fit shrink-0 rounded bg-[#f1f1f1] px-2 py-1.5 text-xs font-semibold tracking-wider text-[#6d6d6d] uppercase dark:bg-white/10">
              {category}
            </span>
          ) : null}
        </div>

        <p className="text-muted-foreground line-clamp-1 text-sm">
          {description}
        </p>

        <div className="flex items-center justify-between gap-2">
          {reviewCount === 0 ? (
            <p className="text-muted-foreground text-sm">No ratings yet</p>
          ) : (
            <div className="flex items-center gap-1.5">
              <StarRating value={avgRating ?? 0} size="sm" />
              <span className="text-foreground text-sm font-semibold">
                {(avgRating ?? 0).toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({reviewCount})
              </span>
            </div>
          )}

          {location ? (
            <span className="text-muted-foreground truncate text-sm">
              {location}
            </span>
          ) : null}
        </div>

        <Button
          variant="outline-primary"
          size="xl"
          asChild
          className="mt-auto w-full"
        >
          <Link href={href}>View Profile</Link>
        </Button>
      </div>
    </motion.article>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

export type VendorCardProps = {
  id?: string
  name: string
  description: string
  imageUrl: string
  href?: string
  className?: string
}

export function VendorCard({
  name,
  description,
  imageUrl,
  href = '#',
  className,
}: VendorCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'group border-border bg-muted/60 dark:bg-muted/40 flex h-full flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-shadow duration-300 hover:shadow-lg',
        className
      )}
    >
      <div className="bg-background relative size-[100px] shrink-0 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="100px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col items-center gap-2.5">
        <h3 className="font-heading text-foreground text-xl font-semibold tracking-tight">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <Button
        variant="outline-primary"
        size="xl"
        asChild
        className="mt-auto w-full"
      >
        <Link href={href}>View Profile</Link>
      </Button>
    </motion.article>
  )
}

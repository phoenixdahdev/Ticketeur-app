import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  UserGroupIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@ticketur/ui/components/button'

export default function VendorNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-180 flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
      <span className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-full md:size-24">
        <HugeiconsIcon
          icon={UserGroupIcon}
          className="size-10 md:size-12"
          strokeWidth={1.6}
        />
      </span>

      <div className="flex flex-col gap-3">
        <p className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
          404 — Vendor not found
        </p>
        <h1 className="font-heading text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl">
          We couldn&apos;t find that vendor
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-base leading-7">
          This vendor profile may have been removed, isn&apos;t verified yet,
          or the link could be wrong. Browse the full directory to discover
          others on Ticketeur.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="xl" asChild>
          <Link href="/vendors/list" className="gap-2">
            Browse all vendors
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4"
              strokeWidth={2}
            />
          </Link>
        </Button>
        <Button size="xl" variant="outline" asChild>
          <Link href="/vendors" className="gap-2">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="size-4"
              strokeWidth={2}
            />
            Back to vendors
          </Link>
        </Button>
      </div>
    </section>
  )
}

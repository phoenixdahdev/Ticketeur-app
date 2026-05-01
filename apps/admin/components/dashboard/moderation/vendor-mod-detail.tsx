import Image from 'next/image'
import Link from 'next/link'

import type { PendingVendor } from '@/lib/mock-moderation'
import { ApproveRejectActions } from '@/components/dashboard/moderation/approve-reject-actions'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function VendorModDetail({ vendor }: { vendor: PendingVendor }) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="border-border/60 bg-background relative flex flex-col gap-6 rounded-2xl border p-5 md:p-6">
        <span className="bg-muted text-foreground absolute top-4 right-4 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase">
          {vendor.category}
        </span>

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
          <div className="bg-foreground border-border/60 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border md:size-24">
            {vendor.logoUrl ? (
              <Image
                src={vendor.logoUrl}
                alt=""
                width={96}
                height={96}
                className="size-full object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {vendor.name}
            </h2>
            <p className="text-muted-foreground text-sm">{vendor.email}</p>
            <div className="mt-3 flex flex-col gap-0.5">
              <span className="text-foreground text-sm font-semibold">
                Date Registered
              </span>
              <span className="text-muted-foreground text-sm">
                {formatDate(vendor.registeredAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-base font-semibold">
            Business Description
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {vendor.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LinkCard
            label="Instagram Link"
            value={vendor.instagramUrl}
            href={vendor.instagramUrl ? `https://${vendor.instagramUrl}` : null}
          />
          <LinkCard
            label="Website Link"
            value={vendor.websiteUrl ?? '--'}
            href={vendor.websiteUrl ? `https://${vendor.websiteUrl}` : null}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Product/Service Showcase
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10 lg:gap-3">
            {vendor.showcase.map((src, i) => (
              <div
                key={i}
                className="bg-foreground relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 10vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ApproveRejectActions />
    </div>
  )
}

function LinkCard({
  label,
  value,
  href,
}: {
  label: string
  value: string | null
  href: string | null
}) {
  const display = value && value.length > 0 ? value : '--'
  return (
    <div className="border-border/60 bg-primary/5 flex flex-col gap-1 rounded-xl border p-4">
      <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </span>
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary text-sm font-medium hover:underline"
        >
          {display}
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">{display}</span>
      )}
    </div>
  )
}

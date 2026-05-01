import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar03Icon,
  Clock01Icon,
  MapsLocation02Icon,
  ArrowUp01Icon,
  CancelCircleIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

import type { AdminEventDetail, AdminEventTier } from '@/lib/mock-events'
import {
  formatWeekdayDate as formatLongDate,
  formatMonthDay as formatShortDate,
  daysUntil,
} from '@/lib/date'

const TIER_BAR: Record<AdminEventTier['status'], string> = {
  'sold-out': 'bg-rose-500',
  active: 'bg-amber-500',
  early: 'bg-orange-500',
}
const TIER_LABEL: Record<AdminEventTier['status'], string> = {
  'sold-out': 'SOLD OUT',
  active: 'ACTIVE',
  early: 'FAST SELLING',
}
const TIER_TONE: Record<AdminEventTier['status'], string> = {
  'sold-out': 'text-rose-500',
  active: 'text-amber-500',
  early: 'text-orange-500',
}

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

export function AdminEventDetailView({ event }: { event: AdminEventDetail }) {
  const pct =
    event.total > 0
      ? Math.min(100, Math.round((event.sold / event.total) * 100))
      : 0

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Banner with overlay title */}
      <div className="relative aspect-[1360/360] w-full overflow-hidden rounded-2xl">
        <Image
          src={event.bannerUrl}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1360px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-2 md:right-8 md:bottom-8 md:left-8">
          <span className="inline-flex w-fit items-center rounded-md bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            {event.status === 'published' ? 'Published' : event.status}
          </span>
          <h2 className="font-heading text-2xl font-bold text-white drop-shadow md:text-4xl">
            {event.title}
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
            ID: {event.reference}
          </p>
        </div>
      </div>

      {/* Description + details */}
      <section className="border-border/60 bg-background flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-base font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {event.description}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">
            Event Details
          </h3>
          <div className="flex flex-wrap gap-3">
            <DetailPill icon={Calendar03Icon} text={formatLongDate(event.date)} />
            <DetailPill icon={Clock01Icon} text={event.eventTime} />
            <DetailPill icon={MapsLocation02Icon} text={event.location} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-foreground text-base font-semibold">Features</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {event.features.map((f, i) => (
              <div
                key={i}
                className="border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-2 rounded-xl border py-5 text-center"
              >
                <HugeiconsIcon
                  icon={f.icon}
                  className="text-primary size-6"
                  strokeWidth={1.8}
                />
                <span className="text-foreground text-xs font-semibold md:text-sm">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue / Sold / Date triple */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-border/60 bg-background flex flex-col gap-1 rounded-2xl border p-5">
          <span className="text-muted-foreground text-sm font-medium">
            Total Revenue
          </span>
          <span className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
            {formatNaira(event.totalRevenue)}
          </span>
          {event.revenueChangePct !== 0 ? (
            <span
              className={cn(
                'mt-1 inline-flex items-center gap-1 text-xs font-semibold',
                event.revenueChangePct > 0
                  ? 'text-emerald-600'
                  : 'text-rose-500'
              )}
            >
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                className={cn(
                  'size-3',
                  event.revenueChangePct < 0 && 'rotate-180'
                )}
                strokeWidth={2.2}
              />
              {Math.abs(event.revenueChangePct)}% from last week
            </span>
          ) : null}
        </div>

        <div className="border-border/60 bg-background flex flex-col gap-2 rounded-2xl border p-5">
          <span className="text-muted-foreground text-sm font-medium">
            Tickets Sold
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
              {event.sold.toLocaleString('en-US')}
            </span>
            <span className="text-muted-foreground text-sm">
              /{event.total.toLocaleString('en-US')}
            </span>
            <span className="text-foreground ml-auto text-sm font-semibold">
              {pct}%
            </span>
          </div>
          <div className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="border-border/60 bg-background flex flex-col gap-1 rounded-2xl border p-5">
          <span className="text-muted-foreground text-sm font-medium">
            Event Date
          </span>
          <span className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
            {formatShortDate(event.date)}
          </span>
          <span className="text-muted-foreground text-xs">
            ({daysUntil(event.date)} days remaining)
          </span>
        </div>
      </section>

      {/* Ticket Tier Sales */}
      <section className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 md:p-6">
        <h3 className="text-foreground text-base font-semibold">Ticket Tier Sales</h3>
        <ul className="divide-border/60 divide-y">
          {event.tiers.map((tier) => (
            <li
              key={tier.id}
              className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-1 h-5 w-1 rounded-full',
                    TIER_BAR[tier.status]
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-semibold">
                    {tier.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {tier.detail}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-6">
                <span className="text-foreground text-sm">
                  {tier.sold}/{tier.total}
                </span>
                <span
                  className={cn(
                    'text-xs font-bold uppercase tracking-wide',
                    TIER_TONE[tier.status]
                  )}
                >
                  {TIER_LABEL[tier.status]}
                </span>
                <span className="text-foreground text-sm font-semibold">
                  ${tier.price.toLocaleString('en-US')}.00
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Assigned vendors */}
      {event.vendors.length > 0 ? (
        <section className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
          <h3 className="text-foreground text-base font-semibold">
            Assigned Vendors
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {event.vendors.map((v) => (
              <div
                key={v.id}
                className="border-border/60 bg-background relative flex flex-col gap-3 overflow-hidden rounded-2xl border"
              >
                <button
                  type="button"
                  aria-label={`Remove ${v.name}`}
                  className="bg-background/90 hover:bg-background text-muted-foreground hover:text-foreground absolute top-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-full backdrop-blur transition-colors"
                >
                  <HugeiconsIcon
                    icon={CancelCircleIcon}
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </button>
                <div className="bg-muted relative aspect-[3/2] w-full">
                  <Image
                    src={v.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      {v.name}
                    </span>
                    <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase">
                      {v.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-3 text-xs">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function DetailPill({
  icon,
  text,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]['icon']
  text: string
}) {
  return (
    <span className="border-primary/30 bg-primary/5 text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
      <HugeiconsIcon
        icon={icon}
        className="text-primary size-4"
        strokeWidth={1.8}
      />
      {text}
    </span>
  )
}

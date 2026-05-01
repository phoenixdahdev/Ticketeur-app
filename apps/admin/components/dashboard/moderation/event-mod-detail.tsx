import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar03Icon,
  Clock01Icon,
  MapsLocation02Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'

import type { PendingEvent, TicketTier } from '@/lib/mock-moderation'
import { ApproveRejectActions } from '@/components/dashboard/moderation/approve-reject-actions'
import {
  formatWeekdayDate as formatDate,
  formatShortDate as formatJoined,
} from '@/lib/date'

const TIER_STATUS_TONE: Record<TicketTier['status'], string> = {
  'sold-out': 'text-rose-500',
  active: 'text-amber-500',
  early: 'text-orange-500',
}

const TIER_STATUS_LABEL: Record<TicketTier['status'], string> = {
  'sold-out': 'SOLD OUT',
  active: 'ACTIVE',
  early: 'EARLY SALES',
}

const TIER_BAR_COLOR: Record<TicketTier['status'], string> = {
  'sold-out': 'bg-rose-500',
  active: 'bg-amber-500',
  early: 'bg-orange-500',
}

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

export function EventModDetail({ event }: { event: PendingEvent }) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="border-border/60 bg-background relative aspect-[1360/360] w-full overflow-hidden rounded-2xl border">
        <Image
          src={event.bannerUrl}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1360px"
          className="object-cover"
          priority
        />
      </div>

      <section className="border-border/60 bg-background flex flex-col gap-2 rounded-2xl border p-5 md:p-6">
        <h3 className="text-foreground text-base font-semibold">Event Name</h3>
        <p className="text-foreground text-base">{event.title}</p>
      </section>

      <section className="border-border/60 bg-background flex flex-col gap-2 rounded-2xl border p-5 md:p-6">
        <h3 className="text-foreground text-base font-semibold">Description</h3>
        <p className="text-muted-foreground text-sm md:text-base">
          {event.description}
        </p>
      </section>

      <section className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
        <h3 className="text-foreground text-base font-semibold">Event Details</h3>
        <div className="flex flex-wrap gap-3">
          <DetailPill icon={Calendar03Icon} text={formatDate(event.eventDate)} />
          <DetailPill icon={Clock01Icon} text={event.eventTime} />
          <DetailPill icon={MapsLocation02Icon} text={event.location} />
        </div>
      </section>

      <section className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
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
      </section>

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
                    TIER_BAR_COLOR[tier.status]
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
                    TIER_STATUS_TONE[tier.status]
                  )}
                >
                  {TIER_STATUS_LABEL[tier.status]}
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {formatNaira(tier.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {event.vendors.length > 0 ? (
        <section className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
          <h3 className="text-foreground text-base font-semibold">
            Assigned Vendors
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {event.vendors.map((v) => (
              <div
                key={v.id}
                className="border-border/60 bg-background flex flex-col gap-3 overflow-hidden rounded-2xl border"
              >
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

      <section className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 md:p-6">
        <h3 className="text-foreground text-base font-semibold">
          Organizer Details
        </h3>
        <div className="flex items-start gap-4">
          <Avatar className="border-border/60 size-16 border">
            {event.organizerAvatarUrl ? (
              <AvatarImage asChild src={event.organizerAvatarUrl} alt="">
                <Image
                  src={event.organizerAvatarUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </AvatarImage>
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
              {getInitials(event.organizerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-foreground text-lg font-bold">
              {event.organizerName}
            </span>
            <span className="text-muted-foreground text-sm">
              {event.organizerEmail}
            </span>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-emerald-600 text-xs font-semibold">
                Active
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-foreground text-xs font-semibold">
                Date Joined
              </span>
              <span className="text-muted-foreground text-xs">
                {formatJoined(event.organizerJoined)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <ApproveRejectActions />
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

import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  Calendar03Icon,
  Clock01Icon,
  MapsLocation02Icon,
  MusicNote03Icon,
  Idea01Icon,
  DrinkIcon,
  UserGroupIcon,
  GameController01Icon,
  StarIcon,
  CameraVideoIcon,
  Briefcase01Icon,
  PaintBoardIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'
import type { RouterOutputs } from '@ticketur/api'

import { ApproveRejectActions } from '@/components/dashboard/moderation/approve-reject-actions'
import {
  formatWeekdayDate as formatDate,
  formatShortDate as formatJoined,
} from '@/lib/date'

type PendingEvent = RouterOutputs['admin']['moderation']['eventById']
type TicketTier = PendingEvent['tiers'][number]

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

const FEATURE_ICONS: Record<string, IconSvgElement> = {
  'Live DJ Sets': MusicNote03Icon,
  'Laser Show': Idea01Icon,
  'Open VIP Bar': DrinkIcon,
  Mascots: UserGroupIcon,
  Games: GameController01Icon,
  'Food & Drink': DrinkIcon,
  Workshops: Briefcase01Icon,
  Networking: UserGroupIcon,
  'Live Music': MusicNote03Icon,
  'Photo Booth': CameraVideoIcon,
  'Art Showcase': PaintBoardIcon,
}

function iconForFeature(label: string): IconSvgElement {
  return FEATURE_ICONS[label] ?? StarIcon
}

// Tier prices come back in minor units (kobo).
function formatNaira(minor: number) {
  return `₦${(minor / 100).toLocaleString('en-NG')}`
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
        {event.bannerUrl ? (
          <Image
            src={event.bannerUrl}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1360px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="from-primary to-primary/70 size-full bg-gradient-to-br" />
        )}
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

      {event.features.length > 0 ? (
        <section className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
          <h3 className="text-foreground text-base font-semibold">Features</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {event.features.map((label) => (
              <div
                key={label}
                className="border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-2 rounded-xl border py-5 text-center"
              >
                <HugeiconsIcon
                  icon={iconForFeature(label)}
                  className="text-primary size-6"
                  strokeWidth={1.8}
                />
                <span className="text-foreground text-xs font-semibold md:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {event.tiers.length > 0 ? (
        <section className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 md:p-6">
          <h3 className="text-foreground text-base font-semibold">
            Ticket Tier Sales
          </h3>
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
      ) : null}

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
                  {v.imageUrl ? (
                    <Image
                      src={v.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary flex size-full items-center justify-center text-2xl font-bold">
                      {v.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      {v.name}
                    </span>
                    {v.category ? (
                      <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase">
                        {v.category}
                      </span>
                    ) : null}
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

      {event.organizer ? (
        <section className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 md:p-6">
          <h3 className="text-foreground text-base font-semibold">
            Organizer Details
          </h3>
          <div className="flex items-start gap-4">
            <Avatar className="border-border/60 size-16 border">
              {event.organizer.image ? (
                <AvatarImage asChild src={event.organizer.image} alt="">
                  <Image
                    src={event.organizer.image}
                    alt=""
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </AvatarImage>
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                {getInitials(event.organizer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-foreground text-lg font-bold">
                {event.organizer.name}
              </span>
              <span className="text-muted-foreground text-sm">
                {event.organizer.email}
              </span>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className={cn(
                    'text-xs font-semibold',
                    event.organizer.status === 'active'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  )}
                >
                  {event.organizer.status === 'active'
                    ? 'Active'
                    : 'Suspended'}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-foreground text-xs font-semibold">
                  Date Joined
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatJoined(event.organizer.joinedAt)}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <ApproveRejectActions kind="event" id={event.id} name={event.title} />
    </div>
  )
}

function DetailPill({
  icon,
  text,
}: {
  icon: IconSvgElement
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

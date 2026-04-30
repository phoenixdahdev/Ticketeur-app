import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  MusicNote03Icon,
  Idea01Icon,
  DrinkIcon,
  UserGroupIcon,
  GameController01Icon,
  CameraVideoIcon,
  Briefcase01Icon,
  PaintBoardIcon,
  StarIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { MarkdownView } from '@ticketur/ui/components/markdown-view'

import {
  type VendorEvent,
  type VendorEventStatus,
} from '@/lib/vendor-events'

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

const STATUS_HERO_BADGE: Record<VendorEventStatus, string> = {
  live: 'bg-emerald-500 text-white',
  upcoming: 'bg-emerald-500 text-white',
  past: 'bg-zinc-700 text-white',
}

const STATUS_HERO_LABEL: Record<VendorEventStatus, string> = {
  live: 'LIVE EVENT',
  upcoming: 'UPCOMING EVENT',
  past: 'PAST EVENT',
}

type AssignedVendor = {
  id: string
  name: string
  category: string
  description: string
  image: string
  isYou?: boolean
}

const ASSIGNED_VENDORS: AssignedVendor[] = [
  {
    id: 'tasty-bites',
    name: 'Tasty Bites',
    category: 'FOOD',
    description:
      'Serving award-winning wagyu sliders and truffle fries throughout the event.',
    image: '/event-detail/tasty-bites.jpg',
    isYou: true,
  },
  {
    id: 'glow-threads',
    name: 'Glow Threads',
    category: 'MERCH',
    description:
      'Exclusive LED-integrated apparel and limited edition artist collaborations.',
    image: '/event-detail/glow-threads.jpg',
  },
  {
    id: 'liquid-dreams',
    name: 'Liquid Dreams',
    category: 'DRINKS',
    description:
      'Experience our signature "Neon Mule" & other molecular delights.',
    image: '/event-detail/liquid-dreams.jpg',
  },
  {
    id: 'prism-arts',
    name: 'Prism Arts',
    category: 'ART',
    description:
      'Browse and purchase unique digital collectibles and interactive physical pieces.',
    image: '/event-detail/prism-arts.jpg',
  },
]

export function VendorEventDetail({ event }: { event: VendorEvent }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="flex shrink-0 flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          All Events
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          View all assigned professional engagements.
        </p>
      </header>

      <div className="flex shrink-0">
        <Link
          href="/vendor/events"
          className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-4"
            strokeWidth={2}
          />
          Back to Events
        </Link>
      </div>

      <div className="relative isolate flex h-[180px] shrink-0 items-end overflow-hidden rounded-2xl md:h-[260px]">
        <Image
          src={event.image}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 900px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/30"
        />
        <div className="relative flex w-full flex-col gap-2 p-5 md:p-7">
          <span
            className={cn(
              'inline-flex w-fit items-center rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase',
              STATUS_HERO_BADGE[event.status]
            )}
          >
            {STATUS_HERO_LABEL[event.status]}
          </span>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            {event.title}
          </h2>
        </div>
      </div>

      <section className="border-border/60 bg-background flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <DetailGroup title="Description">
          <MarkdownView className="text-muted-foreground prose-p:text-muted-foreground">
            {event.description}
          </MarkdownView>
        </DetailGroup>

        <DetailGroup title="Event Details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <DetailItem
              icon={Calendar03Icon}
              primary={`${event.weekday}, ${event.date}`}
            />
            <DetailItem icon={Clock01Icon} primary={event.time} />
            <DetailItem
              icon={Location01Icon}
              primary={event.venue || event.location}
            />
          </div>
        </DetailGroup>

        <DetailGroup title="Features">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {event.features.map((label) => (
              <FeatureCard
                key={label}
                icon={iconForFeature(label)}
                label={label}
              />
            ))}
          </div>
        </DetailGroup>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
          Assigned Vendors
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ASSIGNED_VENDORS.map((v) => (
            <AssignedVendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DetailGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-sm font-bold tracking-tight md:text-base">
        {title}
      </h3>
      {children}
    </div>
  )
}

function DetailItem({
  icon,
  primary,
}: {
  icon: IconSvgElement
  primary: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <HugeiconsIcon
        icon={icon}
        className="text-primary size-5 shrink-0"
        strokeWidth={1.8}
      />
      <span className="text-foreground text-sm font-medium md:text-base">
        {primary}
      </span>
    </div>
  )
}

function FeatureCard({
  icon,
  label,
}: {
  icon: IconSvgElement
  label: string
}) {
  return (
    <div className="bg-primary/5 border-primary/10 flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4">
      <span className="bg-background text-primary flex size-9 items-center justify-center rounded-full">
        <HugeiconsIcon icon={icon} className="size-4" strokeWidth={1.8} />
      </span>
      <span className="text-foreground text-center text-xs font-medium md:text-sm">
        {label}
      </span>
    </div>
  )
}

function AssignedVendorCard({ vendor }: { vendor: AssignedVendor }) {
  const initial = vendor.name.charAt(0).toUpperCase()
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 overflow-hidden rounded-2xl border p-3">
      <div className="bg-primary/10 relative flex h-28 items-center justify-center overflow-hidden rounded-xl">
        <Image
          src={vendor.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 220px, 50vw"
          className="object-cover"
        />
        {vendor.isYou ? (
          <span className="bg-primary absolute top-2 left-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
            YOU
          </span>
        ) : null}
        <span className="bg-primary text-primary-foreground absolute right-2 -bottom-2 inline-flex size-7 items-center justify-center rounded-full text-base font-bold">
          {initial}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-foreground text-sm font-bold">{vendor.name}</p>
          <span className="bg-muted text-muted-foreground inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
            {vendor.category}
          </span>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
          {vendor.description}
        </p>
      </div>
    </div>
  )
}

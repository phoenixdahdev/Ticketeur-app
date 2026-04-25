import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  Edit02Icon,
  PlusSignIcon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  Money01Icon,
  Ticket01Icon,
  CheckmarkCircle02Icon,
  MusicNote03Icon,
  Idea01Icon,
  DrinkIcon,
  UserGroupIcon,
  GameController01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import {
  buildEventDetail,
  STATUS_LABEL,
  type EventStatus,
  type OrgEvent,
  type TicketTier,
  type VendorEntry,
} from '@/lib/org-events'

type FeatureItem = { icon: IconSvgElement; label: string }

const FEATURES: FeatureItem[] = [
  { icon: MusicNote03Icon, label: 'Live DJ Sets' },
  { icon: Idea01Icon, label: 'Laser Show' },
  { icon: DrinkIcon, label: 'Open VIP Bar' },
  { icon: UserGroupIcon, label: 'Mascots' },
  { icon: GameController01Icon, label: 'Games' },
]

const STATUS_HERO_BADGE: Record<EventStatus, string> = {
  upcoming: 'bg-emerald-500 text-white',
  'in-review': 'bg-sky-500 text-white',
  draft: 'bg-amber-500 text-white',
  archived: 'bg-zinc-700 text-white',
}

const STATUS_HERO_LABEL: Record<EventStatus, string> = {
  upcoming: 'UPCOMING EVENT',
  'in-review': 'IN REVIEW',
  draft: 'DRAFT',
  archived: 'ARCHIVED',
}

export function EventDetail({ event }: { event: OrgEvent }) {
  const detail = buildEventDetail(event)
  const showStats =
    event.status === 'upcoming' || event.status === 'archived'
  const showStepper = event.status === 'in-review'
  const showEdit = event.status === 'draft'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="flex shrink-0 flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
            Events
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track, manage and edit your scheduled events
          </p>
        </div>
        <Button size="xl" asChild className="w-full md:w-auto">
          <Link href="/org/events/new" className="gap-2">
            <HugeiconsIcon
              icon={PlusSignIcon}
              className="size-5"
              strokeWidth={2}
            />
            Create Event
          </Link>
        </Button>
      </header>

      <div className="flex shrink-0 items-center justify-between">
        <Link
          href="/org/events"
          className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-4"
            strokeWidth={2}
          />
          Back
        </Link>
        {showEdit ? (
          <Link
            href={`/org/events/${event.id}/edit`}
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              className="size-4"
              strokeWidth={2}
            />
            Edit Event
          </Link>
        ) : null}
      </div>

      {showStepper ? <ReviewStepper /> : null}

      <HeroCard event={event} title={detail.title} code={detail.code} />

      <Section title="Description">
        <p className="text-muted-foreground text-sm leading-7 md:text-base">
          {detail.description}
        </p>
      </Section>

      <Section title="Event Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DetailItem
            icon={Calendar03Icon}
            primary={`${detail.weekday}, ${detail.date}`}
          />
          <DetailItem icon={Clock01Icon} primary={detail.time} />
          <DetailItem icon={Location01Icon} primary={detail.location} />
        </div>
      </Section>

      <Section title="Features">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.label} icon={f.icon} label={f.label} />
          ))}
        </div>
      </Section>

      {showStats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatBlock
            icon={Money01Icon}
            label="Total Revenue"
            value={detail.revenue}
            tone="emerald"
          />
          <SoldStatBlock detail={detail} />
          <DateStatBlock
            date={detail.date}
            ended={detail.hasEnded}
            tone="primary"
          />
        </div>
      ) : null}

      <Section title="Ticket Tier Sales">
        <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
          <ul className="divide-border/60 divide-y">
            {detail.tiers.map((t) => (
              <TicketTierRow key={t.name} tier={t} status={event.status} />
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Assigned Vendors">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detail.vendors.map((v) => (
            <VendorCard key={v.name} vendor={v} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex shrink-0 flex-col gap-3">
      <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
        {title}
      </h2>
      {children}
    </section>
  )
}

function HeroCard({
  event,
  title,
  code,
}: {
  event: OrgEvent
  title: string
  code: string
}) {
  return (
    <div className="relative isolate flex h-[200px] shrink-0 items-end overflow-hidden rounded-2xl md:h-[280px]">
      <Image
        src="/hero-bg.png"
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
          {title}
        </h2>
        <p className="text-xs text-white/70 md:text-sm">ID: {code}</p>
      </div>
    </div>
  )
}

function ReviewStepper() {
  const steps = [
    { label: 'Published', state: 'done' as const },
    { label: 'In - Review', state: 'active' as const },
    { label: 'Approved', state: 'pending' as const },
  ]
  return (
    <div className="border-border/60 bg-background flex shrink-0 flex-col gap-3 rounded-2xl border p-5">
      <div className="relative flex items-center justify-between">
        <div className="bg-border/60 absolute top-1/2 right-4 left-4 h-1 -translate-y-1/2 rounded-full" />
        <div
          aria-hidden
          className="bg-primary absolute top-1/2 left-4 h-1 w-[calc(50%-1rem)] -translate-y-1/2 rounded-full"
        />
        {steps.map((s) => (
          <div
            key={s.label}
            className="relative flex flex-col items-center gap-2"
          >
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-full border-2 transition-colors',
                s.state === 'done' &&
                  'border-primary bg-primary text-primary-foreground',
                s.state === 'active' &&
                  'border-primary bg-primary text-primary-foreground ring-primary/20 ring-4',
                s.state === 'pending' &&
                  'border-border bg-background text-muted-foreground'
              )}
            >
              {s.state === 'done' ? (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="size-4"
                  strokeWidth={2}
                />
              ) : (
                <span className="size-2 rounded-full bg-current" />
              )}
            </span>
            <span
              className={cn(
                'text-xs font-medium md:text-sm',
                s.state === 'pending'
                  ? 'text-muted-foreground'
                  : 'text-foreground'
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
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

function StatBlock({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconSvgElement
  label: string
  value: string
  tone: 'emerald' | 'primary'
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            tone === 'emerald'
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
              : 'bg-primary/10 text-primary'
          )}
        >
          <HugeiconsIcon icon={icon} className="size-4" strokeWidth={1.8} />
        </span>
        <span className="text-muted-foreground text-sm font-medium">
          {label}
        </span>
      </div>
      <p className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
        {value}
      </p>
    </div>
  )
}

function SoldStatBlock({
  detail,
}: {
  detail: ReturnType<typeof buildEventDetail>
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2">
        <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
          <HugeiconsIcon
            icon={Ticket01Icon}
            className="size-4"
            strokeWidth={1.8}
          />
        </span>
        <span className="text-muted-foreground text-sm font-medium">
          Tickets Sold
        </span>
      </div>
      <p className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
        {detail.sold.toLocaleString()}{' '}
        <span className="text-muted-foreground text-sm font-medium">
          / {detail.total.toLocaleString()}
        </span>
      </p>
      <div className="flex items-center gap-2">
        <div className="bg-muted relative h-1.5 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-primary absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${detail.pct}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs font-semibold">
          {detail.pct}%
        </span>
      </div>
    </div>
  )
}

function DateStatBlock({
  date,
  ended,
}: {
  date: string
  ended: boolean
  tone: 'primary'
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2">
        <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
          <HugeiconsIcon
            icon={Calendar03Icon}
            className="size-4"
            strokeWidth={1.8}
          />
        </span>
        <span className="text-muted-foreground text-sm font-medium">
          Event Date
        </span>
      </div>
      <p className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
        {date.replace(/, \d{4}$/, '')}
      </p>
      {ended ? (
        <p className="text-muted-foreground text-xs font-semibold">Ended</p>
      ) : null}
    </div>
  )
}

function TicketTierRow({
  tier,
  status,
}: {
  tier: TicketTier
  status: EventStatus
}) {
  const isInReviewOrDraft = status === 'in-review' || status === 'draft'
  const pct =
    tier.total > 0 ? Math.min(100, Math.round((tier.sold / tier.total) * 100)) : 0
  const soldOut = tier.sold >= tier.total && tier.total > 0
  const almostDone = !soldOut && pct >= 90
  const active = !soldOut && !almostDone && tier.sold > 0

  let badge: { label: string; className: string } | null = null
  if (status === 'archived' || soldOut) {
    badge = {
      label: 'SOLD OUT',
      className:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    }
  } else if (status === 'upcoming') {
    if (almostDone) {
      badge = {
        label: 'ALMOST DONE',
        className:
          'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
      }
    } else if (active) {
      badge = {
        label: 'ACTIVE',
        className:
          'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
      }
    }
  }

  return (
    <li className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:gap-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
          <HugeiconsIcon
            icon={Ticket01Icon}
            className="size-4"
            strokeWidth={1.8}
          />
        </span>
        <div className="flex min-w-0 flex-col">
          <p className="text-foreground text-sm font-semibold">{tier.name}</p>
          <p className="text-muted-foreground text-xs">{tier.tier}</p>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 md:max-w-xs">
        {isInReviewOrDraft ? (
          <span className="text-muted-foreground text-sm">
            {tier.total} available
          </span>
        ) : (
          <>
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {tier.sold}/{tier.total}
            </span>
            <div className="bg-muted relative h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-foreground absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end md:gap-5">
        {badge ? (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider whitespace-nowrap',
              badge.className
            )}
          >
            {badge.label}
          </span>
        ) : (
          <span className="md:hidden" />
        )}
        <span className="text-foreground text-sm font-bold whitespace-nowrap">
          {tier.price}
        </span>
      </div>
    </li>
  )
}

function VendorCard({ vendor }: { vendor: VendorEntry }) {
  const initial = vendor.name.charAt(0)
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 overflow-hidden rounded-2xl border p-3">
      <div className="bg-primary/10 relative flex h-28 items-center justify-center overflow-hidden rounded-xl">
        <span className="font-heading text-primary text-3xl font-bold opacity-60">
          {initial}
        </span>
        <span
          className={cn(
            'absolute top-2 right-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
            vendor.status === 'verified'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
          )}
        >
          {vendor.status}
        </span>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <p className="text-foreground text-sm font-semibold">{vendor.name}</p>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
          {vendor.description}
        </p>
      </div>
    </div>
  )
}

export const _STATUS_LABEL = STATUS_LABEL

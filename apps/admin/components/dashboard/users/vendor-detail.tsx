'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkBadge02Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import type { RouterOutputs } from '@ticketur/api'

import { ProfileActions } from '@/components/dashboard/users/profile-actions'
import { formatShortDate as formatDate } from '@/lib/date'

type VendorDetail = Extract<
  RouterOutputs['admin']['users']['byId'],
  { role: 'vendor' }
>

const HISTORY_TABS = ['all', 'upcoming', 'archived'] as const
type HistoryTab = (typeof HISTORY_TABS)[number]

const TABS: { value: HistoryTab; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'archived', label: 'Archived' },
]

const STATUS_TONE = {
  upcoming: 'text-emerald-600',
  archived: 'bg-muted text-muted-foreground px-2.5 py-1 rounded-md',
} as const

export function VendorDetailView({ user }: { user: VendorDetail }) {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(HISTORY_TABS).withDefault('all')
  )

  const history = useMemo(() => {
    if (tab === 'all') return user.history
    return user.history.filter((row) => row.status === tab)
  }, [tab, user.history])

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Profile card */}
      <section className="border-border/60 bg-background relative flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <span className="bg-muted text-foreground absolute top-4 right-4 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase">
          {user.category}
        </span>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="bg-foreground border-border/60 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border md:size-24">
              {user.logoUrl ? (
                <Image
                  src={user.logoUrl}
                  alt=""
                  width={96}
                  height={96}
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <span className="text-emerald-600 text-xs font-semibold">
              {user.status === 'active'
                ? 'Active'
                : user.status === 'suspended'
                ? 'Suspended'
                : 'Disabled'}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
            <div className="flex flex-col items-center gap-1 md:items-start">
              <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
                {user.name}
              </h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:gap-10">
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-semibold">
                  Date Joined
                </span>
                <span className="text-muted-foreground text-sm">
                  {formatDate(user.joinedAt)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-semibold">
                  Event Participated
                </span>
                <span className="text-muted-foreground text-sm">
                  {user.eventsParticipated}
                </span>
              </div>
              {user.verified ? (
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkBadge02Icon}
                    className="text-primary size-5"
                    strokeWidth={1.8}
                  />
                  <span className="text-muted-foreground text-sm">
                    Verified Vendor
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <ProfileActions />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="flex flex-col gap-2">
        <h3 className="text-foreground text-base font-semibold">
          Business Description
        </h3>
        <p className="text-muted-foreground text-sm md:text-base">
          {user.description}
        </p>
      </section>

      {/* Showcase */}
      <section className="flex flex-col gap-3">
        <h3 className="text-foreground text-base font-semibold">
          Product/Service Showcase
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10 lg:gap-3">
          {user.showcase.map((src, i) => (
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
      </section>

      {/* Links */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LinkCard
          label="Instagram Link"
          value={user.instagramUrl}
          href={
            user.instagramUrl ? `https://${user.instagramUrl}` : null
          }
        />
        <LinkCard
          label="Website Link"
          value={user.websiteUrl ?? '--'}
          href={user.websiteUrl ? `https://${user.websiteUrl}` : null}
        />
      </section>

      {/* Participation history */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
            Participation History
          </h3>
          <div
            role="tablist"
            aria-label="Filter participation"
            className="bg-muted/50 -mx-1 flex shrink-0 items-center gap-1 overflow-x-auto rounded-full p-1 sm:mx-0"
          >
            {TABS.map((t) => {
              const active = tab === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => void setTab(t.value)}
                  className={cn(
                    'relative shrink-0 px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="vendor-history-pill"
                      className="bg-primary absolute inset-0 rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  <span className="relative">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[600px] table-auto">
              <thead className="bg-primary/5">
                <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  <th className="px-5 py-4 text-left">Event Participated</th>
                  <th className="px-5 py-4 text-left">Category</th>
                  <th className="px-5 py-4 text-left">Date</th>
                  <th className="px-5 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <p className="text-muted-foreground text-sm">
                        No participation matches this filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  history.map((row) => (
                    <tr key={row.id} className="text-sm">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={row.thumbnailUrl}
                            alt=""
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-foreground font-semibold">
                              {row.eventName}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              ID: {row.eventId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase">
                          {row.category}
                        </span>
                      </td>
                      <td className="text-foreground px-5 py-4 whitespace-nowrap">
                        {formatDate(row.date)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center text-xs font-medium whitespace-nowrap',
                            STATUS_TONE[row.status]
                          )}
                        >
                          {capitalize(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
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

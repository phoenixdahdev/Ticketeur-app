'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Edit02Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import {
  REGISTERED_VENDORS,
  type CreateEventValues,
} from '@/lib/create-event-schema'

function formatPrice(n: number) {
  return `₦${n.toLocaleString('en-US')}`
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  if (!time) return '—'
  const parts = time.split(':')
  const h = Number(parts[0])
  const m = Number(parts[1])
  if (Number.isNaN(h) || Number.isNaN(m)) return time
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`
}

export function PreviewView({
  values,
  banner,
  onEdit,
  onSubmit,
  onCancel,
  submitting,
}: {
  values: CreateEventValues
  banner: string | null
  onEdit: () => void
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
}) {
  const assigned = REGISTERED_VENDORS.filter((v) =>
    values.assignedVendorIds.includes(v.id)
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="flex shrink-0 flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          Review Event Details
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Please double check all information before submitting for approval.
        </p>
      </header>

      <PreviewCard title="Basic Information" onEdit={onEdit}>
        <div className="flex flex-col gap-4">
          <div className="bg-muted relative h-44 w-full overflow-hidden rounded-xl md:h-56">
            {banner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner}
                alt="Event banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-linear-to-br from-zinc-700 to-zinc-900 absolute inset-0" />
            )}
          </div>
          <FieldRow label="Event Title" value={values.title || '—'} />
          <FieldRow
            label="Event Description"
            value={values.description || '—'}
            multiline
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldRow label="Date" value={formatDate(values.date)} />
            <FieldRow label="Time" value={formatTime(values.time)} />
            <FieldRow label="Location" value={values.location || '—'} />
          </div>
          <FieldRow
            label="Features"
            value={
              values.features.length > 0 ? values.features.join(', ') : '—'
            }
          />
        </div>
      </PreviewCard>

      <PreviewCard title="Ticket Tiers" onEdit={onEdit}>
        <ul className="divide-border/60 divide-y">
          {values.tiers.length === 0 ? (
            <li className="text-muted-foreground py-3 text-sm">
              No ticket tiers added.
            </li>
          ) : (
            values.tiers.map((t, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between md:gap-4"
              >
                <span className="text-foreground text-sm font-semibold">
                  {t.name}
                </span>
                <div className="flex items-center justify-between gap-6 md:gap-12">
                  <span className="text-muted-foreground text-sm">
                    {t.quantity}
                  </span>
                  <span className="text-foreground text-sm font-bold">
                    {formatPrice(t.price)}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </PreviewCard>

      <PreviewCard title="Assigned Vendors" onEdit={onEdit}>
        {assigned.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No vendors assigned yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assigned.map((v) => (
              <PreviewVendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </PreviewCard>

      <div className="flex shrink-0 flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-center md:gap-4">
        <Button
          size="xl"
          className="w-full md:w-64"
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? 'Submitting…' : 'Submit for Approval'}
        </Button>
        <Button
          size="xl"
          variant="outline"
          className="w-full md:w-40"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

function PreviewCard({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <section className="border-border/60 bg-background flex shrink-0 flex-col gap-4 rounded-2xl border p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-foreground text-base font-bold tracking-tight md:text-lg">
          {title}
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <HugeiconsIcon
            icon={Edit02Icon}
            className="size-4"
            strokeWidth={1.8}
          />
          Edit
        </button>
      </div>
      {children}
    </section>
  )
}

function FieldRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {label}
      </p>
      <p
        className={cn(
          'text-foreground text-sm',
          multiline ? 'leading-6' : 'font-medium'
        )}
      >
        {value}
      </p>
    </div>
  )
}

function PreviewVendorCard({
  vendor,
}: {
  vendor: (typeof REGISTERED_VENDORS)[number]
}) {
  return (
    <div className="border-border/60 bg-background flex flex-col gap-3 overflow-hidden rounded-2xl border p-3">
      <div className="bg-primary/10 relative flex h-24 items-center justify-center overflow-hidden rounded-xl">
        <span className="font-heading text-primary text-3xl font-bold opacity-60">
          {vendor.name.charAt(0)}
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

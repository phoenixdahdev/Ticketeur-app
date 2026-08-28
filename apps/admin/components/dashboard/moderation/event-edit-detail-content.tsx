'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Button } from '@ticketur/ui/components/button'

import { useTRPC } from '@/lib/trpc'
import { formatShortDate } from '@/lib/date'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

function naira(minor: number) {
  return minor === 0 ? 'Free' : `₦${(minor / 100).toLocaleString()}`
}

function dateLabel(iso: string | null) {
  return iso ? formatShortDate(iso) : 'TBD'
}

export function EventEditDetailContent({ id }: { id: string }) {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()
  const dialog = useActionDialog()

  const { data, isLoading } = useQuery(
    trpc.admin.moderation.eventEditById.queryOptions({ id })
  )

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.pendingEventEdits.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.moderation.stats.queryKey(),
    })
  }

  const approve = useMutation(
    trpc.admin.moderation.approveEventEdit.mutationOptions({
      onSuccess: () => {
        toast.success('Changes approved', {
          description: 'They are now live and the organizer was emailed.',
        })
        invalidate()
        router.push('/moderation?tab=edits')
      },
      onError: (e) =>
        toast.error('Could not approve', { description: e.message }),
    })
  )
  const reject = useMutation(
    trpc.admin.moderation.rejectEventEdit.mutationOptions({
      onSuccess: () => {
        toast.success('Changes rejected', {
          description: 'The live event is unchanged; the organizer was emailed.',
        })
        invalidate()
        router.push('/moderation?tab=edits')
      },
      onError: (e) =>
        toast.error('Could not reject', { description: e.message }),
    })
  )
  const busy = approve.isPending || reject.isPending

  async function onApprove() {
    if (busy) return
    const ok = await dialog.confirm({
      title: 'Approve these changes?',
      description: 'They will replace the current version on the website.',
      confirmLabel: 'Approve',
      tone: 'success',
    })
    if (ok) approve.mutate({ id })
  }
  async function onReject() {
    if (busy) return
    const reason = await dialog.prompt({
      title: 'Reject these changes?',
      description:
        'The proposed edit is discarded and the current version stays live.',
      inputLabel: 'Reason (optional)',
      placeholder: 'What should the organizer change?',
      confirmLabel: 'Reject',
      tone: 'danger',
    })
    if (reason === null) return
    reject.mutate({ id, reason })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted h-20 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="border-border/60 bg-background flex flex-col items-center gap-4 rounded-2xl border p-10 text-center">
        <p className="text-muted-foreground text-sm">
          No pending changes for this event — it may have been reviewed already.
        </p>
        <Button asChild variant="outline">
          <Link href="/moderation?tab=edits">Back to pending edits</Link>
        </Button>
      </div>
    )
  }

  const { current, proposed } = data
  const keptIds = new Set(
    proposed.tiers.map((t) => t.id).filter(Boolean) as string[]
  )
  const removedTiers = current.tiers.filter((t) => !keptIds.has(t.id))

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/moderation?tab=edits"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" strokeWidth={2} />
        Pending edits
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="font-heading text-foreground text-xl font-bold">
            {proposed.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            by {data.organizerName}
            {data.submittedAt
              ? ` · submitted ${formatShortDate(data.submittedAt)}`
              : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onReject} disabled={busy}>
            Reject
          </Button>
          <Button onClick={onApprove} disabled={busy}>
            Approve changes
          </Button>
        </div>
      </div>

      {/* Field diffs */}
      <div className="border-border/60 bg-background flex flex-col divide-y divide-border/60 rounded-2xl border">
        <DiffField label="Title" before={current.title} after={proposed.title} />
        <DiffField
          label="Date"
          before={dateLabel(current.date)}
          after={dateLabel(proposed.date)}
        />
        <DiffField
          label="End date"
          before={dateLabel(current.endDate)}
          after={dateLabel(proposed.endDate ?? null)}
        />
        <DiffField label="Time" before={current.time} after={proposed.time} />
        <DiffField
          label="Location"
          before={current.location}
          after={proposed.location}
        />
        <DiffField
          label="Description"
          before={current.description}
          after={proposed.description}
          multiline
        />
        <DiffField
          label="Features"
          before={current.features.join(', ') || '—'}
          after={proposed.features.join(', ') || '—'}
        />
        <DiffField
          label="Banner"
          before={current.bannerUrl ? 'Set' : '—'}
          after={proposed.bannerUrl ? 'Set' : '—'}
        />
      </div>

      {/* Tiers diff */}
      <div className="border-border/60 bg-background flex flex-col gap-3 rounded-2xl border p-5">
        <h3 className="font-heading text-foreground text-base font-bold">
          Tickets
        </h3>
        <div className="flex flex-col gap-2">
          {proposed.tiers.map((tier, i) => {
            const currentTier = tier.id
              ? current.tiers.find((c) => c.id === tier.id)
              : undefined
            const status = !currentTier
              ? 'new'
              : currentTier.name !== tier.name ||
                  currentTier.quantity !== tier.quantity ||
                  currentTier.priceMinor !== tier.priceMinor
                ? 'changed'
                : 'unchanged'
            return (
              <div
                key={tier.id ?? `new-${i}`}
                className="border-border/60 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    {tier.name}
                  </span>
                  <TierBadge status={status} />
                </div>
                <div className="text-muted-foreground flex items-center gap-4">
                  {currentTier && status === 'changed' ? (
                    <span className="line-through">
                      {naira(currentTier.priceMinor)} · {currentTier.quantity} qty
                    </span>
                  ) : null}
                  <span className="text-foreground font-medium">
                    {naira(tier.priceMinor)} · {tier.quantity} qty
                  </span>
                </div>
              </div>
            )
          })}
          {removedTiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm dark:border-rose-500/40 dark:bg-rose-500/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold line-through">
                  {tier.name}
                </span>
                <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  Removed
                </span>
              </div>
              <span className="text-muted-foreground">
                {naira(tier.priceMinor)} · {tier.quantity} qty
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DiffField({
  label,
  before,
  after,
  multiline,
}: {
  label: string
  before: string
  after: string
  multiline?: boolean
}) {
  const changed = before !== after
  return (
    <div className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[140px_1fr_1fr] md:gap-4">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          {label}
        </span>
        {changed ? (
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
            Changed
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'text-sm',
          changed ? 'text-muted-foreground' : 'text-foreground',
          multiline ? 'whitespace-pre-wrap' : 'truncate'
        )}
      >
        <span className="text-muted-foreground/70 mr-1 text-[10px] uppercase md:hidden">
          Now:
        </span>
        {changed ? <span className="line-through">{before}</span> : before}
      </div>
      <div
        className={cn(
          'text-foreground text-sm',
          multiline ? 'whitespace-pre-wrap' : 'truncate',
          changed && 'font-semibold'
        )}
      >
        {changed ? (
          <>
            <span className="text-muted-foreground/70 mr-1 text-[10px] uppercase md:hidden">
              New:
            </span>
            {after}
          </>
        ) : (
          <span className="text-muted-foreground/50 md:block hidden">—</span>
        )}
      </div>
    </div>
  )
}

function TierBadge({
  status,
}: {
  status: 'new' | 'changed' | 'unchanged'
}) {
  if (status === 'unchanged') return null
  const styles =
    status === 'new'
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : 'bg-primary/10 text-primary'
  return (
    <span
      className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', styles)}
    >
      {status === 'new' ? 'New' : 'Changed'}
    </span>
  )
}

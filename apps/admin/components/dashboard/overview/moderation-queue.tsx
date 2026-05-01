import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Delete02Icon,
  ViewIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'

type ModerationItem = {
  id: string
  title: string
  reason: string
  reasonLabel: string
  reportedAt: string
  imageUrl: string
}

const ITEMS: ModerationItem[] = [
  {
    id: '1',
    title: 'Lagos Fest 2026',
    reason: 'Flagged for:',
    reasonLabel: 'Fraud Suspicion',
    reportedAt: 'Reported 2h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Tasty Bites',
    reason: 'Request:',
    reasonLabel: 'Vendor Approval',
    reportedAt: 'Reported 5h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'Secret Rooftop Party',
    reason: 'Request:',
    reasonLabel: 'Event Approval',
    reportedAt: 'Reported 5h ago',
    imageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&h=200&fit=crop',
  },
]

export function ModerationQueue() {
  return (
    <section
      aria-label="Moderation queue"
      className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02] md:p-6"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
          Moderation Queue
        </h2>
        <Link
          href="/moderation"
          className="text-primary text-sm font-semibold hover:underline"
        >
          View All
        </Link>
      </header>

      <ul className="flex flex-col">
        {ITEMS.map((item) => (
          <li
            key={item.id}
            className="border-border/60 flex items-center gap-3 border-b py-3 last:border-b-0 last:pb-0 first:pt-0"
          >
            <Image
              src={item.imageUrl}
              alt=""
              width={56}
              height={56}
              className="size-12 shrink-0 rounded-full object-cover md:size-14"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-foreground text-sm font-semibold md:text-base">
                {item.title}
              </p>
              <p className="text-muted-foreground text-xs md:text-sm">
                {item.reason}{' '}
                <span className="text-primary font-medium">
                  {item.reasonLabel}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-muted-foreground hidden text-xs whitespace-nowrap md:block">
                {item.reportedAt}
              </span>
              <div className="flex items-center gap-1.5">
                <ActionPill tone="danger" label="Reject">
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </ActionPill>
                <ActionPill tone="muted" label="View">
                  <HugeiconsIcon
                    icon={ViewIcon}
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </ActionPill>
                <ActionPill tone="success" label="Approve">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-4"
                    strokeWidth={2}
                  />
                </ActionPill>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ActionPill({
  tone,
  label,
  children,
}: {
  tone: 'danger' | 'muted' | 'success'
  label: string
  children: React.ReactNode
}) {
  const styles = {
    danger: 'bg-red-100 text-red-600 hover:bg-red-200',
    muted: 'bg-muted text-foreground hover:bg-muted/80',
    success: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
  }[tone]
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-7 w-9 items-center justify-center rounded-md transition-colors ${styles}`}
    >
      {children}
    </button>
  )
}

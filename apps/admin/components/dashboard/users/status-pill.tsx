import { cn } from '@ticketur/ui/lib/utils'
import type { RouterOutputs } from '@ticketur/api'

type UserStatus = RouterOutputs['admin']['users']['byId']['status']

const LABEL: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  disabled: 'Disabled',
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  incomplete: 'Incomplete',
}

const TONE: Record<UserStatus, string> = {
  active: 'text-emerald-600',
  approved: 'text-emerald-600',
  pending: 'text-amber-600',
  suspended: 'text-rose-600',
  rejected: 'bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md',
  disabled: 'bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md',
  incomplete: 'bg-muted text-muted-foreground px-2.5 py-1 rounded-md',
}

export function StatusPill({
  status,
  className,
}: {
  status: UserStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-semibold whitespace-nowrap',
        TONE[status],
        className
      )}
    >
      {LABEL[status]}
    </span>
  )
}

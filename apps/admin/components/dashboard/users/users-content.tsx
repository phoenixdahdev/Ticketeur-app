'use client'

import { useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Tick02Icon,
  CancelCircleIcon,
  Delete02Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'
import { Input } from '@ticketur/ui/components/input'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'
import type { RouterOutputs } from '@ticketur/api'

import { useTRPC } from '@/lib/trpc'
import { formatShortDate as formatJoined } from '@/lib/date'
import { useActionDialog } from '@/components/dashboard/action-dialog/store'

const ROLE_VALUES = ['all', 'attendee', 'organizer', 'vendor'] as const
type RoleTab = (typeof ROLE_VALUES)[number]

const SORT_FIELDS = ['name', 'role', 'joined', 'status'] as const
type SortField = (typeof SORT_FIELDS)[number]

const DIR_VALUES = ['asc', 'desc'] as const
type SortDir = (typeof DIR_VALUES)[number]

const TABS: { value: RoleTab; label: string }[] = [
  { value: 'all', label: 'All Users' },
  { value: 'attendee', label: 'Attendees' },
  { value: 'organizer', label: 'Organizers' },
  { value: 'vendor', label: 'Vendors' },
]

type UserRow = RouterOutputs['admin']['users']['list']['rows'][number]
type UserStatus = UserRow['status']

const PAGE_SIZE = 10

const STATUS_LABEL: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  disabled: 'Disabled',
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  incomplete: 'Incomplete',
}

const STATUS_TONE: Record<UserStatus, string> = {
  active: 'text-emerald-600',
  approved: 'text-emerald-600',
  pending: 'text-amber-600',
  suspended: 'text-rose-600',
  rejected: 'bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md',
  disabled: 'bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md',
  incomplete: 'bg-muted text-muted-foreground px-2.5 py-1 rounded-md',
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

export function UsersContent() {
  const trpc = useTRPC()

  const [params, setParams] = useQueryStates(
    {
      tab: parseAsStringLiteral(ROLE_VALUES).withDefault('all'),
      q: parseAsString.withDefault(''),
      sort: parseAsStringLiteral(SORT_FIELDS).withDefault('joined'),
      dir: parseAsStringLiteral(DIR_VALUES).withDefault('desc'),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  )

  const queryClient = useQueryClient()

  const listQuery = useQuery(
    trpc.admin.users.list.queryOptions({
      tab: params.tab,
      q: params.q,
      sort: params.sort,
      dir: params.dir,
      page: params.page,
      pageSize: PAGE_SIZE,
    })
  )

  const rows = listQuery.data?.rows ?? []
  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = Math.min(Math.max(params.page, 1), totalPages)

  function invalidateUsers() {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.users.list.queryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: trpc.admin.users.stats.queryKey(),
    })
  }

  const suspendMutation = useMutation(
    trpc.admin.users.suspend.mutationOptions({
      onSuccess: () => {
        toast.success('User suspended', {
          description: 'They have been notified by email.',
        })
        invalidateUsers()
      },
      onError: (e) =>
        toast.error('Could not suspend', { description: e.message }),
    })
  )

  const disableMutation = useMutation(
    trpc.admin.users.disable.mutationOptions({
      onSuccess: () => {
        toast.success('User disabled', {
          description: 'They have been notified by email.',
        })
        invalidateUsers()
      },
      onError: (e) =>
        toast.error('Could not disable', { description: e.message }),
    })
  )

  const reactivateMutation = useMutation(
    trpc.admin.users.reactivate.mutationOptions({
      onSuccess: () => {
        toast.success('User reactivated', {
          description: 'They have been notified by email.',
        })
        invalidateUsers()
      },
      onError: (e) =>
        toast.error('Could not reactivate', { description: e.message }),
    })
  )

  const removeMutation = useMutation(
    trpc.admin.users.remove.mutationOptions({
      onSuccess: () => {
        toast.success('User removed', {
          description: 'A removal email has been sent.',
        })
        invalidateUsers()
      },
      onError: (e) =>
        toast.error('Could not remove', { description: e.message }),
    })
  )

  const isPending =
    suspendMutation.isPending ||
    disableMutation.isPending ||
    reactivateMutation.isPending ||
    removeMutation.isPending

  const dialog = useActionDialog()

  async function handleAction(
    action: 'suspend' | 'disable' | 'reactivate' | 'remove',
    target: UserRow
  ) {
    if (isPending) return

    if (action === 'suspend') {
      const reason = await dialog.prompt({
        title: `Suspend ${target.name}`,
        description:
          'They will be signed out and emailed the reason. Suspensions expire after 30 days.',
        inputLabel: 'Reason (optional)',
        placeholder: 'e.g. Multiple policy violations',
        confirmLabel: 'Suspend',
        tone: 'warning',
      })
      if (reason === null) return
      suspendMutation.mutate({ id: target.id, reason })
      return
    }
    if (action === 'disable') {
      const reason = await dialog.prompt({
        title: `Disable ${target.name}`,
        description:
          'Their account is permanently locked. They will be signed out and emailed the reason.',
        inputLabel: 'Reason (optional)',
        placeholder: 'e.g. Repeated abuse',
        confirmLabel: 'Disable',
        tone: 'danger',
      })
      if (reason === null) return
      disableMutation.mutate({ id: target.id, reason })
      return
    }
    if (action === 'reactivate') {
      const ok = await dialog.confirm({
        title: `Reactivate ${target.name}?`,
        description:
          'Their ban will be cleared and they will be emailed that they can sign in again.',
        confirmLabel: 'Reactivate',
        tone: 'success',
      })
      if (!ok) return
      reactivateMutation.mutate({ id: target.id })
      return
    }
    // remove
    const ok = await dialog.confirm({
      title: `Remove ${target.name}?`,
      description:
        'This permanently deletes their account, sessions, and tickets. They will be emailed a removal notice.',
      confirmLabel: 'Remove',
      tone: 'danger',
    })
    if (!ok) return
    removeMutation.mutate({ id: target.id })
  }

  const handleSort = useCallback(
    (field: SortField) => {
      void setParams((prev) => ({
        sort: field,
        dir:
          prev.sort === field && prev.dir === 'asc'
            ? ('desc' as SortDir)
            : ('asc' as SortDir),
        page: 1,
      }))
    },
    [setParams]
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div
          role="tablist"
          aria-label="Filter users by role"
          className="border-border/60 -mx-1 flex items-center gap-1 overflow-x-auto border-b px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => {
            const active = params.tab === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => void setParams({ tab: t.value, page: 1 })}
                className={cn(
                  'relative shrink-0 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors md:text-base',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
                {active ? (
                  <motion.span
                    layoutId="admin-users-tab-indicator"
                    className="bg-primary absolute right-0 -bottom-px left-0 h-0.5 rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            strokeWidth={1.8}
          />
          <Input
            type="search"
            value={params.q}
            onChange={(e) =>
              void setParams({ q: e.target.value || null, page: 1 })
            }
            placeholder="Search"
            aria-label="Search users"
            className="h-10 w-full pl-9"
          />
        </div>
      </div>

      <div className="border-border/60 bg-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm shadow-black/[0.02]">
        <div className="min-h-0 w-full flex-1 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[760px] table-auto">
            <thead className="bg-primary/5">
              <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase select-none">
                <SortableHeader
                  field="name"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Name
                </SortableHeader>
                <SortableHeader
                  field="role"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Role
                </SortableHeader>
                <SortableHeader
                  field="joined"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Join Date
                </SortableHeader>
                <SortableHeader
                  field="status"
                  sort={params.sort}
                  dir={params.dir}
                  onSort={handleSort}
                >
                  Status
                </SortableHeader>
                <th className="px-5 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {listQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="text-muted-foreground text-sm">
                      Loading users…
                    </p>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="text-muted-foreground text-sm">
                      {params.q || params.tab !== 'all'
                        ? 'No users match your filters.'
                        : 'No users yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((user) => (
                  <UserRowView
                    key={user.id}
                    user={user}
                    busy={isPending}
                    onAction={handleAction}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        total={total}
        shown={rows.length}
        current={current}
        totalPages={totalPages}
        onPage={(p) => void setParams({ page: p })}
      />
    </div>
  )
}

function SortableHeader({
  field,
  sort,
  dir,
  onSort,
  children,
}: {
  field: SortField
  sort: SortField
  dir: SortDir
  onSort: (field: SortField) => void
  children: React.ReactNode
}) {
  const active = sort === field
  return (
    <th className="px-5 py-4 text-left">
      <button
        type="button"
        onClick={() => onSort(field)}
        aria-sort={
          active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'
        }
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors',
          active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span>{children}</span>
        {active ? (
          <HugeiconsIcon
            icon={dir === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
            className="size-3.5"
            strokeWidth={2.2}
          />
        ) : null}
      </button>
    </th>
  )
}

type UserAction = 'suspend' | 'disable' | 'reactivate' | 'remove'

function UserRowView({
  user,
  busy,
  onAction,
}: {
  user: UserRow
  busy: boolean
  onAction: (action: UserAction, target: UserRow) => void
}) {
  return (
    <tr className="hover:bg-muted/40 text-sm transition-colors">
      <td className="px-5 py-4">
        <Link
          href={`/users/${user.id}`}
          className="flex items-center gap-3"
        >
          <Avatar className="border-border/60 size-10 shrink-0 border">
            {user.avatarUrl ? (
              <AvatarImage asChild src={user.avatarUrl} alt="">
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </AvatarImage>
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-foreground hover:text-primary font-semibold transition-colors">
              {user.name}
            </span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </Link>
      </td>
      <td className="text-foreground px-5 py-4 font-semibold uppercase whitespace-nowrap">
        {user.role}
      </td>
      <td className="text-muted-foreground px-5 py-4 whitespace-nowrap">
        {formatJoined(user.joinedAt)}
      </td>
      <td className="px-5 py-4">
        <span
          className={cn(
            'inline-flex items-center text-xs font-medium whitespace-nowrap',
            STATUS_TONE[user.status]
          )}
        >
          {STATUS_LABEL[user.status]}
        </span>
      </td>
      <td className="px-5 py-4">
        <RowActions
          user={user}
          busy={busy}
          onAction={(action) => onAction(action, user)}
        />
      </td>
    </tr>
  )
}

function RowActions({
  user,
  busy,
  onAction,
}: {
  user: UserRow
  busy: boolean
  onAction: (action: UserAction) => void
}) {
  if (user.status === 'disabled') {
    return (
      <div className="flex items-center gap-1">
        <ActionPill
          tone="danger"
          label="Delete"
          disabled={busy}
          onClick={() => onAction('remove')}
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            className="size-4"
            strokeWidth={1.8}
          />
        </ActionPill>
      </div>
    )
  }
  if (user.status === 'suspended') {
    return (
      <div className="flex items-center gap-1.5">
        <ActionPill
          tone="success"
          label="Reactivate"
          disabled={busy}
          onClick={() => onAction('reactivate')}
        >
          <HugeiconsIcon
            icon={Tick02Icon}
            className="size-4"
            strokeWidth={2}
          />
        </ActionPill>
        <ActionPill
          tone="muted"
          label="Disable"
          disabled={busy}
          onClick={() => onAction('disable')}
        >
          <HugeiconsIcon
            icon={CancelCircleIcon}
            className="size-4"
            strokeWidth={1.8}
          />
        </ActionPill>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      <ActionPill
        tone="warning"
        label="Suspend"
        disabled={busy}
        onClick={() => onAction('suspend')}
      >
        <HugeiconsIcon
          icon={CancelCircleIcon}
          className="size-4"
          strokeWidth={1.8}
        />
      </ActionPill>
      <ActionPill
        tone="muted"
        label="Disable"
        disabled={busy}
        onClick={() => onAction('disable')}
      >
        <HugeiconsIcon
          icon={CancelCircleIcon}
          className="size-4"
          strokeWidth={1.8}
        />
      </ActionPill>
    </div>
  )
}

function ActionPill({
  tone,
  label,
  children,
  disabled,
  onClick,
}: {
  tone: 'danger' | 'success' | 'warning' | 'muted'
  label: string
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  const styles = {
    danger: 'bg-red-100 text-red-600 hover:bg-red-200',
    success: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
    warning: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
    muted: 'bg-rose-50 text-rose-500 hover:bg-rose-100',
  }[tone]
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-7 w-9 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        styles
      )}
    >
      {children}
    </button>
  )
}

function Pagination({
  total,
  shown,
  current,
  totalPages,
  onPage,
}: {
  total: number
  shown: number
  current: number
  totalPages: number
  onPage: (page: number) => void
}) {
  const visibleRange = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (current <= 2) return [1, 2, 3]
    if (current >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }
    return [current - 1, current, current + 1]
  }, [current, totalPages])

  return (
    <div className="flex shrink-0 flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
      <p className="text-muted-foreground text-xs sm:text-sm">
        Showing {shown} of {total.toLocaleString('en-US')}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton
          aria-label="Previous page"
          disabled={current <= 1}
          onClick={() => onPage(current - 1)}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </PageButton>
        {visibleRange.map((p) => (
          <PageButton
            key={p}
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            active={p === current}
            onClick={() => onPage(p)}
          >
            {p}
          </PageButton>
        ))}
        <PageButton
          aria-label="Next page"
          disabled={current >= totalPages}
          onClick={() => onPage(current + 1)}
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4"
            strokeWidth={2}
          />
        </PageButton>
      </nav>
    </div>
  )
}

function PageButton({
  active,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'border-border/60 inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-muted'
      )}
    >
      {children}
    </button>
  )
}

import Image from 'next/image'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@ticketur/ui/components/avatar'
import type { RouterOutputs } from '@ticketur/api'

import { ProfileActions } from '@/components/dashboard/users/profile-actions'
import { formatShortDate as formatDate } from '@/lib/date'

type AttendeeDetail = Extract<
  RouterOutputs['admin']['users']['byId'],
  { role: 'attendee' }
>

// Tickets are stored in minor units (kobo). Format to display naira.
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

export function AttendeeDetailView({ user }: { user: AttendeeDetail }) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Profile card */}
      <section className="border-border/60 bg-background flex flex-col gap-5 rounded-2xl border p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="border-border/60 size-20 border md:size-24">
              {user.avatarUrl ? (
                <AvatarImage asChild src={user.avatarUrl} alt="">
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </AvatarImage>
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-emerald-600 text-xs font-semibold">
              {user.status === 'active' ? 'Active' : user.status === 'suspended' ? 'Suspended' : 'Disabled'}
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
              <DetailField label="Date Joined" value={formatDate(user.joinedAt)} />
              <DetailField
                label="Event Attended"
                value={user.eventsAttended.toString()}
              />
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <ProfileActions
              userId={user.id}
              userName={user.name}
              status={user.status}
            />
          </div>
        </div>
      </section>

      {/* Ticket history */}
      <section className="flex flex-col gap-4">
        <h3 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
          Ticket History
        </h3>
        <div className="border-border/60 bg-background overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[680px] table-auto">
              <thead className="bg-primary/5">
                <tr className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  <th className="px-5 py-4 text-left">Event Name</th>
                  <th className="px-5 py-4 text-left">Category</th>
                  <th className="px-5 py-4 text-left">Date</th>
                  <th className="px-5 py-4 text-left">Ticket Tier (Qty)</th>
                  <th className="px-5 py-4 text-left">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {user.ticketHistory.map((row) => (
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
                    <td className="text-foreground px-5 py-4 whitespace-nowrap">
                      {row.tier} ({row.qty})
                    </td>
                    <td className="text-foreground px-5 py-4 font-semibold whitespace-nowrap">
                      {formatNaira(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

function DetailField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-foreground text-sm font-semibold">{label}</span>
      <span className="text-muted-foreground text-sm">{value}</span>
    </div>
  )
}

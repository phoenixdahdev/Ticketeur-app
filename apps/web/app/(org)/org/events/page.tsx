import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Events',
  description: 'Manage the events you host on Ticketeur.',
}

export default function OrgEventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight md:text-[28px]">
          My Events
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage the events you host on Ticketeur.
        </p>
      </header>
      <div className="border-border/60 bg-background flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-2xl border p-8 text-center shadow-sm shadow-black/[0.02]">
        <p className="font-heading text-foreground text-lg font-semibold">
          No events yet
        </p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Once you start creating events, they&apos;ll show up here. The full
          events list is coming soon.
        </p>
      </div>
    </div>
  )
}

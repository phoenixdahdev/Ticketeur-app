import Image from 'next/image'

type Activity = {
  id: string
  message: React.ReactNode
  timestamp: string
  avatarUrl: string
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    message: 'Sarah Jekins joined the platform',
    timestamp: '2 hours ago',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    message: (
      <>
        Estherical bags registered as a <span className="font-semibold">Vendor</span>
      </>
    ),
    timestamp: '5 hours ago',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    message: 'Taiwo James listed an event',
    timestamp: 'Yesterday',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
]

export function RecentActivity() {
  return (
    <section
      aria-label="Recent activity"
      className="border-border/60 bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm shadow-black/[0.02] md:p-6"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
          Recent Activity
        </h2>
      </header>

      <ul className="flex flex-col gap-4">
        {ACTIVITIES.map((a) => (
          <li key={a.id} className="flex items-center gap-3">
            <Image
              src={a.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-foreground text-sm">{a.message}</p>
              <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                {a.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

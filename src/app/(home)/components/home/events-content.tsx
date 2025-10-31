'use client'

import { useSession } from 'next-auth/react'
import { Button } from 'ui/button'

interface EventsContentProps {
  tabId: string
}

export default function EventsContent({ tabId }: EventsContentProps) {
  const { data: session } = useSession()
  const getContent = () => {
    switch (tabId) {
      case 'ongoing':
        return {
          title: 'Your Ongoing Events',
          description:
            'Manage your live events and track attendees in real-time.',
        }
      case 'past':
        return {
          title: 'Your Past Events',
          description:
            'View analytics and insights from your completed events.',
        }
      default:
        return {
          title: `Welcome aboard, ${session?.user?.first_name || 'Organizer'}!`,
          description:
            'Your all-in-one solution to create, manage, and grow your events—online or in person.',
        }
    }
  }

  const content = getContent()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center md:py-20">
      <div className="mb-6 md:mb-8">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full md:h-24 md:w-24">
          <span className="text-4xl md:text-6xl">🤝</span>
        </div>
      </div>

      <h2 className="text-foreground mb-3 text-xl font-bold text-balance md:mb-4 md:text-3xl">
        {content.title}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-sm text-balance md:mb-12 md:text-base">
        {content.description}
      </p>

      <Button>Create Event</Button>
    </div>
  )
}

'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@useticketeur/ui/button'
import { Badge } from '@useticketeur/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@useticketeur/ui/card'
import { useMyEventQuery } from '../../(home)/queries'
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Event } from '@useticketeur/db'

interface EventsContentProps {
  tabId: string
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'published':
      return 'default'
    case 'approved':
      return 'secondary'
    case 'pending_approval':
      return 'outline'
    case 'draft':
      return 'secondary'
    case 'rejected':
      return 'destructive'
    case 'cancelled':
      return 'destructive'
    case 'completed':
      return 'secondary'
    default:
      return 'outline'
  }
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function EventCard({ event }: { event: Event }) {
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {event.banner_image && (
        <div className="h-32 w-full overflow-hidden bg-gray-100">
          <img
            src={event.banner_image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
          <Badge variant={getStatusBadgeVariant(event.status)}>
            {formatStatus(event.status)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {event.description || 'No description'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {startDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {startDate.toDateString() !== endDate.toDateString() && (
              <>
                {' - '}
                {endDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </>
            )}
          </span>
        </div>
        {event.venue_name && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.venue_name}</span>
          </div>
        )}
        {event.max_attendees && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{event.max_attendees} max attendees</span>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link href={`/events/${event.id}/edit`}>Manage</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({
  title,
  description,
  isVerified,
}: {
  title: string
  description: string
  isVerified: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center md:py-20">
      <div className="mb-6 md:mb-8">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full md:h-24 md:w-24">
          <span className="text-4xl md:text-6xl">🤝</span>
        </div>
      </div>

      <h2 className="text-foreground mb-3 text-xl font-bold text-balance md:mb-4 md:text-3xl">
        {title}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md text-sm text-balance md:mb-12 md:text-base">
        {description}
      </p>

      <Button asChild disabled={!isVerified}>
        <Link href="/events/create">Create Event</Link>
      </Button>
    </div>
  )
}

export default function EventsContent({ tabId }: EventsContentProps) {
  const { data: session } = useSession()
  const { data, isLoading } = useMyEventQuery()
  const isVerified = session?.user?.is_verified ?? false

  const events = data?.events || []

  // Filter events based on tab
  const now = new Date()
  const filteredEvents = events.filter((event: Event) => {
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)

    switch (tabId) {
      case 'ongoing':
        // Events that have started but not ended yet
        return startDate <= now && endDate >= now
      case 'past':
        // Events that have ended
        return endDate < now
      default:
        // Upcoming: events that haven't started yet, or all events
        return startDate > now || (startDate <= now && endDate >= now)
    }
  })

  const getEmptyContent = () => {
    switch (tabId) {
      case 'ongoing':
        return {
          title: 'No Ongoing Events',
          description:
            "You don't have any events running right now. Create a new event to get started!",
        }
      case 'past':
        return {
          title: 'No Past Events',
          description:
            "You haven't completed any events yet. Your event history will appear here.",
        }
      default:
        return {
          title: `Welcome aboard, ${session?.user?.first_name || 'Organizer'}!`,
          description:
            'Your all-in-one solution to create, manage, and grow your events—online or in person.',
        }
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (filteredEvents.length === 0) {
    const emptyContent = getEmptyContent()
    return (
      <EmptyState
        title={emptyContent.title}
        description={emptyContent.description}
        isVerified={isVerified}
      />
    )
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {tabId === 'ongoing'
            ? 'Ongoing Events'
            : tabId === 'past'
              ? 'Past Events'
              : 'Your Events'}
        </h2>
        <Button asChild disabled={!isVerified}>
          <Link href="/events/create">Create Event</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

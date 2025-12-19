'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@useticketeur/ui/card'
import { Button } from '@useticketeur/ui/button'
import { Textarea } from '@useticketeur/ui/textarea'
import { Label } from '@useticketeur/ui/label'
import { Badge } from '@useticketeur/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@useticketeur/ui/sheet'
import { toast } from 'sonner'
import {
  getAllEvents,
  getEventDetails,
  approveEvent,
  declineEvent,
} from './action'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Eye,
  Clock,
  Ticket,
  DollarSign,
} from 'lucide-react'
import Image from 'next/image'

type Event = {
  event: {
    id: string
    title: string
    description: string | null
    banner_image: string | null
    venue_name: string | null
    venue_address: string | null
    event_type: string
    status: string
    start_date: Date
    end_date: Date
    max_attendees: number | null
    is_free: boolean | null
    created_at: Date
  }
  organizer: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string
  }
}

type EventDetails = {
  event: any
  organizer: any
  team: any
  sessions: any[]
  ticketTypes: any[]
}

export default function AdminApprovalPage() {
  const queryClient = useQueryClient()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)

  const {
    data: eventsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const result = await getAllEvents()
      if (!result.success) {
        throw new Error(result.error || 'Failed to load events')
      }
      return result.events || []
    },
    refetchOnWindowFocus: false,
  })

  const events = eventsData || []

  const { data: eventDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['event-details', selectedEventId],
    queryFn: async () => {
      if (!selectedEventId) return null

      const result = await getEventDetails(selectedEventId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to load event details')
      }

      return {
        event: result.event!,
        organizer: result.organizer!,
        team: result.team ?? null,
        sessions: result.sessions ?? [],
        ticketTypes: result.ticketTypes ?? [],
      }
    },
    enabled: !!selectedEventId && sheetOpen,
    refetchOnWindowFocus: false,
  })

  const handleViewEvent = (eventId: string) => {
    setSelectedEventId(eventId)
    setSheetOpen(true)
    setShowDeclineForm(false)
    setDeclineReason('')
  }

  const handleApprove = async () => {
    if (!selectedEventId) return

    setProcessing(true)
    const result = await approveEvent(selectedEventId)
    if (result.success) {
      toast.success('Event approved successfully!')
      setSheetOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      await queryClient.invalidateQueries({
        queryKey: ['event-details', selectedEventId],
      })
    } else {
      toast.error(result.error || 'Failed to approve event')
    }
    setProcessing(false)
  }

  const handleDecline = async () => {
    if (!selectedEventId || !declineReason.trim()) {
      toast.error('Please provide a reason for declining')
      return
    }

    setProcessing(true)
    const result = await declineEvent(selectedEventId, declineReason)
    if (result.success) {
      toast.success('Event declined and organizer notified')
      setSheetOpen(false)
      setShowDeclineForm(false)
      setDeclineReason('')
      await queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      await queryClient.invalidateQueries({
        queryKey: ['event-details', selectedEventId],
      })
    } else {
      toast.error(result.error || 'Failed to decline event')
    }
    setProcessing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'bg-yellow-500'
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      case 'published':
        return 'bg-blue-500'
      case 'draft':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase()
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="border-red-500">
          <CardContent className="py-12">
            <div className="text-center">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <p className="mb-2 text-lg font-semibold text-red-500">
                Failed to load events
              </p>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ['admin-events'] })
                }
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Event Approval Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve events submitted for approval
          </p>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-lg">
                  No events pending approval
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {events.map(({ event, organizer }) => (
              <Card
                key={event.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {event.banner_image && (
                      <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={event.banner_image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="mb-1 text-xl font-semibold">
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground mb-2 text-sm">
                            by {organizer.first_name} {organizer.last_name} (
                            {organizer.email})
                          </p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <span>
                            {new Date(event.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="text-muted-foreground h-4 w-4" />
                          <span>{event.venue_name || 'No venue'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span>
                            {event.max_attendees || 'Unlimited'} attendees
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-muted-foreground h-4 w-4" />
                          <span>
                            Submitted{' '}
                            {new Date(event.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleViewEvent(event.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
            {loadingDetails ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : eventDetails ? (
              <>
                <SheetHeader>
                  <SheetTitle>{eventDetails.event.title}</SheetTitle>
                  <SheetDescription>
                    Review event details and take action
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {eventDetails.event.banner_image && (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      <Image
                        src={eventDetails.event.banner_image}
                        alt={eventDetails.event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Event Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">
                          Description
                        </Label>
                        <p className="mt-1">
                          {eventDetails.event.description || 'No description'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">
                            Event Type
                          </Label>
                          <p className="mt-1 capitalize">
                            {eventDetails.event.event_type}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Status
                          </Label>
                          <div className="mt-1">
                            <Badge
                              className={getStatusColor(
                                eventDetails.event.status
                              )}
                            >
                              {getStatusLabel(eventDetails.event.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">
                            Start Date
                          </Label>
                          <p className="mt-1">
                            {new Date(
                              eventDetails.event.start_date
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            End Date
                          </Label>
                          <p className="mt-1">
                            {new Date(
                              eventDetails.event.end_date
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Venue</Label>
                        <p className="mt-1">{eventDetails.event.venue_name}</p>
                        <p className="text-muted-foreground text-sm">
                          {eventDetails.event.venue_address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Organizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">
                        {eventDetails.organizer.first_name}{' '}
                        {eventDetails.organizer.last_name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {eventDetails.organizer.email}
                      </p>
                    </CardContent>
                  </Card>

                  {eventDetails.sessions &&
                    eventDetails.sessions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Sessions ({eventDetails.sessions.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {eventDetails.sessions.map((session) => (
                            <div
                              key={session.id}
                              className="border-primary border-l-2 pl-4"
                            >
                              <p className="font-medium">{session.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {session.description}
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {new Date(session.start_time).toLocaleString()}{' '}
                                -{' '}
                                {new Date(
                                  session.end_time
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                  {eventDetails.ticketTypes &&
                    eventDetails.ticketTypes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Ticket Types ({eventDetails.ticketTypes.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {eventDetails.ticketTypes.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="flex items-start justify-between border-b pb-3 last:border-0"
                            >
                              <div>
                                <p className="font-medium">{ticket.name}</p>
                                <p className="text-muted-foreground text-sm">
                                  {ticket.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="flex items-center gap-1 font-semibold">
                                  <DollarSign className="h-4 w-4" />
                                  {ticket.price}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  <Ticket className="mr-1 inline h-3 w-3" />
                                  {ticket.quantity_available} available
                                </p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                  {eventDetails.event.status === 'pending_approval' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>
                          Approve or decline this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!showDeclineForm ? (
                          <div className="flex gap-4">
                            <Button
                              onClick={handleApprove}
                              disabled={processing}
                              className="flex-1"
                              size="lg"
                            >
                              {processing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-5 w-5" />
                                  Approve Event
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setShowDeclineForm(true)}
                              disabled={processing}
                              variant="destructive"
                              className="flex-1"
                              size="lg"
                            >
                              <XCircle className="mr-2 h-5 w-5" />
                              Decline Event
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="reason">
                                Reason for Declining (will be sent to organizer)
                              </Label>
                              <Textarea
                                id="reason"
                                value={declineReason}
                                onChange={(e) =>
                                  setDeclineReason(e.target.value)
                                }
                                placeholder="Please provide a clear reason for declining this event..."
                                className="mt-2 min-h-30"
                              />
                            </div>
                            <div className="flex gap-4">
                              <Button
                                onClick={handleDecline}
                                disabled={processing || !declineReason.trim()}
                                variant="destructive"
                                className="flex-1"
                              >
                                {processing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  'Confirm Decline'
                                )}
                              </Button>
                              <Button
                                onClick={() => {
                                  setShowDeclineForm(false)
                                  setDeclineReason('')
                                }}
                                disabled={processing}
                                variant="outline"
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {(eventDetails.event.status === 'approved' ||
                    eventDetails.event.status === 'rejected') && (
                    <Card
                      className={`border-2 ${
                        eventDetails.event.status === 'approved'
                          ? 'border-green-500'
                          : 'border-red-500'
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2">
                          {eventDetails.event.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                              <p className="text-lg font-semibold text-green-500">
                                This event has been approved
                              </p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-6 w-6 text-red-500" />
                              <p className="text-lg font-semibold text-red-500">
                                This event has been declined
                              </p>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

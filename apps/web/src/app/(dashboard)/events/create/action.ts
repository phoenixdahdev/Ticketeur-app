'use server'

import { auth } from '@/auth'
import {
  eventQueries,
  eventSessionQueries,
  ticketTypeQueries,
  speakerQueries,
  type NewEvent,
  type NewEventSession,
  type NewTicketType,
  type NewSpeaker,
  type EventType,
} from '@useticketeur/db'
import { revalidatePath } from 'next/cache'

export interface CreateEventInput {
  // Basic Details
  basicDetails: {
    title: string
    description: string
    banner_image: string | null
    event_type: EventType
    start_date: Date | null
    end_date: Date | null
    max_attendees: number | null
    is_free: boolean
  }

  // Venue
  venue: {
    venue_name: string
    venue_address: string
  }

  // Sessions (Agenda)
  sessions: {
    title: string
    description: string | null
    location: string | null
    start_time: Date | null
    end_time: Date | null
    track: string
    speaker_name: string | null
    speaker_image: string | null
  }[]

  // Ticket Types
  ticketTypes: {
    name: string
    description: string | null
    price: string
    quantity_available: number
    max_per_order: number
    sales_start: Date | null
    sales_end: Date | null
    is_active: boolean
    benefits: string[]
  }[]

  // Team Members (not implemented yet - would need user lookup by email)
  members: {
    name: string
    email: string
    role: string
    permissions: string[]
  }[]
}

export type CreateEventResult =
  | { success: true; eventId: string }
  | { success: false; error: string }

export async function createEvent(
  input: CreateEventInput
): Promise<CreateEventResult> {
  try {
    // Get current user
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to create an event' }
    }

    const userId = session.user.id

    // Validate required fields
    if (!input.basicDetails.title) {
      return { success: false, error: 'Event title is required' }
    }
    if (!input.basicDetails.start_date || !input.basicDetails.end_date) {
      return { success: false, error: 'Event start and end dates are required' }
    }

    // 1. Create the event
    const eventData: NewEvent = {
      organizer_id: userId,
      title: input.basicDetails.title,
      description: input.basicDetails.description || null,
      banner_image: input.basicDetails.banner_image,
      event_type: input.basicDetails.event_type,
      status: 'draft',
      start_date: input.basicDetails.start_date,
      end_date: input.basicDetails.end_date,
      max_attendees: input.basicDetails.max_attendees,
      is_free: input.basicDetails.is_free,
      venue_name: input.venue.venue_name || null,
      venue_address: input.venue.venue_address || null,
    }

    const event = await eventQueries.create(eventData)
    if (!event) {
      return { success: false, error: 'Failed to create event' }
    }

    // 2. Create sessions and speakers
    const validSessions = input.sessions.filter(
      (s) => s.title && s.start_time && s.end_time
    )

    if (validSessions.length > 0) {
      const sessionsData: NewEventSession[] = validSessions.map(
        (session, index) => ({
          event_id: event.id,
          title: session.title,
          description: session.description,
          location: session.location || session.track || null,
          start_time: session.start_time!,
          end_time: session.end_time!,
          order: index,
        })
      )

      const createdSessions = await eventSessionQueries.createMany(sessionsData)

      // Create speakers for sessions that have them
      const speakersData: NewSpeaker[] = []
      validSessions.forEach((session, index) => {
        if (session.speaker_name) {
          speakersData.push({
            event_id: event.id,
            session_id: createdSessions[index]?.id || null,
            name: session.speaker_name,
            photo: session.speaker_image,
            order: index,
          })
        }
      })

      if (speakersData.length > 0) {
        await speakerQueries.createMany(speakersData)
      }
    }

    // 3. Create ticket types
    const validTicketTypes = input.ticketTypes.filter((t) => t.name)

    if (validTicketTypes.length > 0) {
      const ticketTypesData: NewTicketType[] = validTicketTypes.map(
        (ticket) => ({
          event_id: event.id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quantity_available: ticket.quantity_available,
          quantity_sold: 0,
          max_per_order: ticket.max_per_order,
          sales_start: ticket.sales_start,
          sales_end: ticket.sales_end,
          is_active: ticket.is_active,
          benefits: ticket.benefits.filter((b) => b.trim() !== ''),
        })
      )

      await ticketTypeQueries.createMany(ticketTypesData)
    }

    // 4. TODO: Handle team members (would need to look up users by email and create event_members)
    // This is complex because we need to:
    // - Look up users by email
    // - Create event_member records
    // - Possibly send invitation emails for non-existing users

    // Revalidate the events page
    revalidatePath('/events')
    revalidatePath('/')

    return { success: true, eventId: event.id }
  } catch (error) {
    console.error('Failed to create event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export async function submitEventForApproval(
  eventId: string
): Promise<CreateEventResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in' }
    }

    // Verify the user owns this event
    const event = await eventQueries.findById(eventId)
    if (!event) {
      return { success: false, error: 'Event not found' }
    }

    if (event.organizer_id !== session.user.id) {
      return { success: false, error: 'You do not have permission to submit this event' }
    }

    await eventQueries.submitForApproval(eventId)

    revalidatePath('/events')
    revalidatePath(`/events/${eventId}`)

    return { success: true, eventId }
  } catch (error) {
    console.error('Failed to submit event for approval:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

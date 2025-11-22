'use server'

import { auth } from '@/auth'
import {
  eventQueries,
  eventSessionQueries,
  ticketTypeQueries,
  speakerQueries,
  eventMemberQueries,
  eventInvitationQueries,
  userQueries,
  type NewEvent,
  type NewEventSession,
  type NewTicketType,
  type NewSpeaker,
  type NewEventMember,
  type NewEventInvitation,
  type EventType,
  type EventMemberRole,
} from '@useticketeur/db'
import { uploadFile } from '@useticketeur/ui/lib/upload'
import { tasks } from '@trigger.dev/sdk'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import { env } from '../../../../../env'

// Admin email for event approval notifications
const ADMIN_EMAIL = 'giftobafaiye@gmail.com'

// Generate a random token for invitations
function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex').slice(0, length)
}

// Convert base64 data URL to File object
function base64ToFile(base64: string, filename: string): File | null {
  try {
    // Check if it's a data URL
    if (!base64.startsWith('data:')) {
      return null
    }

    const parts = base64.split(',')
    const header = parts[0]
    const data = parts[1]
    if (!header || !data) return null

    const mimeMatch = header.match(/data:([^;]+);/)
    const mimeType = mimeMatch?.[1] ?? 'image/jpeg'
    const extension = mimeType.split('/')[1] ?? 'jpg'

    const byteCharacters = atob(data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    return new File([blob], `${filename}.${extension}`, { type: mimeType })
  } catch {
    return null
  }
}

// Upload an image from base64 and return the URL
async function uploadBase64Image(
  base64: string | null,
  filename: string,
  folder: string
): Promise<string | null> {
  if (!base64 || !base64.startsWith('data:')) {
    // If it's already a URL or null, return as-is
    return base64
  }

  const file = base64ToFile(base64, filename)
  if (!file) return null

  const result = await uploadFile(file, filename, { folder })
  return result.success ? result.url ?? null : null
}

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

    // 1. Upload banner image if provided
    const bannerImageUrl = await uploadBase64Image(
      input.basicDetails.banner_image,
      `event-banner-${userId}`,
      'events/banners'
    )

    // 2. Create the event
    const eventData: NewEvent = {
      organizer_id: userId,
      title: input.basicDetails.title,
      description: input.basicDetails.description || null,
      banner_image: bannerImageUrl,
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

    // 3. Create sessions and speakers
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
      for (let index = 0; index < validSessions.length; index++) {
        const session = validSessions[index]
        if (session?.speaker_name) {
          // Upload speaker image if provided
          const speakerPhotoUrl = await uploadBase64Image(
            session.speaker_image ?? null,
            `speaker-${event.id}-${index}`,
            'events/speakers'
          )

          speakersData.push({
            event_id: event.id,
            session_id: createdSessions[index]?.id ?? null,
            name: session.speaker_name,
            photo: speakerPhotoUrl,
            order: index,
          })
        }
      }

      if (speakersData.length > 0) {
        await speakerQueries.createMany(speakersData)
      }
    }

    // 4. Create ticket types
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

    // 5. Handle team members
    const validMembers = input.members.filter((m) => m.email && m.email.trim() !== '')

    if (validMembers.length > 0) {
      const inviterUser = await userQueries.findById(userId)
      const inviterName = inviterUser
        ? `${inviterUser.first_name} ${inviterUser.last_name || ''}`.trim()
        : 'Event Organizer'

      const baseUrl = env.VERCEL_URL || 'http://localhost:3000'
      const eventDate = input.basicDetails.start_date
        ? new Date(input.basicDetails.start_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : undefined

      for (const member of validMembers) {
        // Check if user exists by email
        const existingUser = await userQueries.findByEmail(member.email)

        if (existingUser) {
          // User exists - add them directly as event member
          const memberData: NewEventMember = {
            event_id: event.id,
            user_id: existingUser.id,
            role: (member.role as EventMemberRole) || 'staff',
          }

          // Check if they're not already a member
          const isAlreadyMember = await eventMemberQueries.isEventMember(
            event.id,
            existingUser.id
          )

          if (!isAlreadyMember) {
            await eventMemberQueries.create(memberData)

            // Still send a notification email to let them know they've been added
            await tasks.trigger('send-event-invitation-email', {
              email: member.email,
              inviteeName: existingUser.first_name || member.name,
              inviterName,
              eventName: input.basicDetails.title,
              eventDate,
              role: member.role || 'staff',
              acceptUrl: `${baseUrl}/events/${event.id}`,
              declineUrl: `${baseUrl}/events/${event.id}/leave`,
            })
          }
        } else {
          // User doesn't exist - create invitation
          const token = generateToken(32)
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

          const invitationData: NewEventInvitation = {
            event_id: event.id,
            invited_by: userId,
            email: member.email,
            name: member.name || null,
            role: (member.role as EventMemberRole) || 'staff',
            status: 'pending',
            token,
            expires_at: expiresAt,
          }

          // Check if invitation already exists
          const existingInvitation = await eventInvitationQueries.findByEventAndEmail(
            event.id,
            member.email
          )

          if (!existingInvitation) {
            await eventInvitationQueries.create(invitationData)

            // Send invitation email
            await tasks.trigger('send-event-invitation-email', {
              email: member.email,
              inviteeName: member.name || undefined,
              inviterName,
              eventName: input.basicDetails.title,
              eventDate,
              role: member.role || 'staff',
              acceptUrl: `${baseUrl}/invite/event/${token}`,
              declineUrl: `${baseUrl}/invite/event/${token}?action=decline`,
            })
          }
        }
      }
    }

    // 6. Submit event for approval and notify admin
    await eventQueries.submitForApproval(event.id)

    // Get organizer info for email
    const organizer = await userQueries.findById(userId)
    const organizerName = organizer
      ? `${organizer.first_name} ${organizer.last_name || ''}`.trim()
      : 'Event Organizer'
    const organizerEmail = organizer?.email || 'unknown@example.com'

    const adminBaseUrl = env.VERCEL_URL || 'http://localhost:3000'
    const eventDateFormatted = input.basicDetails.start_date
      ? new Date(input.basicDetails.start_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined

    // Send approval request email to admin
    await tasks.trigger('send-event-approval-request-email', {
      adminEmail: ADMIN_EMAIL,
      eventId: event.id,
      eventName: input.basicDetails.title,
      eventDate: eventDateFormatted,
      organizerName,
      organizerEmail,
      eventDescription: input.basicDetails.description || undefined,
      approvalUrl: `${adminBaseUrl}/admin/events/${event.id}`,
    })

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

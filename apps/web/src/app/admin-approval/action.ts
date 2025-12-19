"use server"

import { eventQueries, eventSessionQueries, ticketTypeQueries } from "@useticketeur/db"
import { tasks } from "@trigger.dev/sdk"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getAllEvents() {
    try {
        // Get all events with organizer info, ordered by creation date
        const result = await eventQueries.findPendingApproval()

        return {
            success: true,
            events: result
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get events"
        }
    }
}

export async function getEventDetails(eventId: string) {
    try {
        const event = await eventQueries.findByIdWithOrganizer(eventId)

        if (!event) {
            return {
                success: false,
                error: "Event not found"
            }
        }

        // Get additional details
        const sessions = await eventSessionQueries.findByEventId(eventId)
        const ticketTypes = await ticketTypeQueries.findByEventId(eventId)

        return {
            success: true,
            event: event.event,
            organizer: event.organizer,
            team: event.team,
            sessions,
            ticketTypes
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get event details"
        }
    }
}

export async function approveEvent(eventId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized"
            }
        }

        const event = await eventQueries.findByIdWithOrganizer(eventId)
        if (!event) {
            return {
                success: false,
                error: "Event not found"
            }
        }

        // Update event status to approved
        await eventQueries.approve(eventId)

        // Send approval email to organizer
        await tasks.trigger('send-event-approved-email', {
            email: event.organizer.email,
            firstName: event.organizer.first_name || 'User',
            eventTitle: event.event.title,
            eventId: eventId,
        })

        // Revalidate the events pages
        revalidatePath('/admin-approval')
        revalidatePath('/events')

        return {
            success: true,
            message: "Event approved successfully"
        }
    } catch (error) {
        console.error('Error approving event:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to approve event"
        }
    }
}

export async function declineEvent(eventId: string, reason: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized"
            }
        }

        const event = await eventQueries.findByIdWithOrganizer(eventId)
        if (!event) {
            return {
                success: false,
                error: "Event not found"
            }
        }

        // Update event status to rejected
        await eventQueries.reject(eventId)

        // Send decline email to organizer with reason
        await tasks.trigger('send-event-declined-email', {
            email: event.organizer.email,
            firstName: event.organizer.first_name || 'User',
            eventTitle: event.event.title,
            eventId: eventId,
            reason: reason,
        })

        // Revalidate the events pages
        revalidatePath('/admin-approval')
        revalidatePath('/events')

        return {
            success: true,
            message: "Event declined and notification sent"
        }
    } catch (error) {
        console.error('Error declining event:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to decline event"
        }
    }
}

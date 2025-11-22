import { eq, and, desc } from 'drizzle-orm'
import { db } from '../drizzle'
import {
  event_invitations,
  type NewEventInvitation,
  type EventInvitationStatus,
} from '../schema/event-invitation'
import { users } from '../schema/user'
import { events } from '../schema/event'

export const eventInvitationQueries = {
  create: async (data: NewEventInvitation) => {
    const [invitation] = await db
      .insert(event_invitations)
      .values(data)
      .returning()
    return invitation
  },

  createMany: async (data: NewEventInvitation[]) => {
    return db.insert(event_invitations).values(data).returning()
  },

  findById: async (id: string) => {
    const [invitation] = await db
      .select()
      .from(event_invitations)
      .where(eq(event_invitations.id, id))
    return invitation
  },

  findByToken: async (token: string) => {
    const [result] = await db
      .select({
        invitation: event_invitations,
        event: events,
        inviter: users,
      })
      .from(event_invitations)
      .innerJoin(events, eq(event_invitations.event_id, events.id))
      .innerJoin(users, eq(event_invitations.invited_by, users.id))
      .where(eq(event_invitations.token, token))
    return result
  },

  findByEventId: async (eventId: string) => {
    return db
      .select({
        invitation: event_invitations,
        invitedUser: users,
      })
      .from(event_invitations)
      .leftJoin(users, eq(event_invitations.invited_user_id, users.id))
      .where(eq(event_invitations.event_id, eventId))
      .orderBy(desc(event_invitations.created_at))
  },

  findByEmail: async (email: string) => {
    return db
      .select({
        invitation: event_invitations,
        event: events,
      })
      .from(event_invitations)
      .innerJoin(events, eq(event_invitations.event_id, events.id))
      .where(eq(event_invitations.email, email))
      .orderBy(desc(event_invitations.created_at))
  },

  findByEventAndEmail: async (eventId: string, email: string) => {
    const [invitation] = await db
      .select()
      .from(event_invitations)
      .where(
        and(
          eq(event_invitations.event_id, eventId),
          eq(event_invitations.email, email)
        )
      )
    return invitation
  },

  findPendingByEmail: async (email: string) => {
    return db
      .select({
        invitation: event_invitations,
        event: events,
        inviter: users,
      })
      .from(event_invitations)
      .innerJoin(events, eq(event_invitations.event_id, events.id))
      .innerJoin(users, eq(event_invitations.invited_by, users.id))
      .where(
        and(
          eq(event_invitations.email, email),
          eq(event_invitations.status, 'pending')
        )
      )
      .orderBy(desc(event_invitations.created_at))
  },

  update: async (id: string, data: Partial<NewEventInvitation>) => {
    const [updated] = await db
      .update(event_invitations)
      .set({ ...data, updated_at: new Date() })
      .where(eq(event_invitations.id, id))
      .returning()
    return updated
  },

  updateStatus: async (id: string, status: EventInvitationStatus) => {
    const respondedAt = status !== 'pending' ? new Date() : null
    return eventInvitationQueries.update(id, {
      status,
      responded_at: respondedAt,
    })
  },

  accept: async (id: string, userId: string) => {
    return eventInvitationQueries.update(id, {
      status: 'accepted',
      invited_user_id: userId,
      responded_at: new Date(),
    })
  },

  decline: async (id: string) => {
    return eventInvitationQueries.updateStatus(id, 'declined')
  },

  expire: async (id: string) => {
    return eventInvitationQueries.updateStatus(id, 'expired')
  },

  delete: async (id: string) => {
    const [deleted] = await db
      .delete(event_invitations)
      .where(eq(event_invitations.id, id))
      .returning()
    return deleted
  },

  deleteByEventId: async (eventId: string) => {
    return db
      .delete(event_invitations)
      .where(eq(event_invitations.event_id, eventId))
      .returning()
  },
}

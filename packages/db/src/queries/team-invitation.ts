import { eq, and, desc, lt } from 'drizzle-orm';
import { db } from '../drizzle';
import { team_invitations, type NewTeamInvitation, type TeamInvitationStatus } from '../schema/team-invitation';
import { teams } from '../schema/team';
import { users } from '../schema/user';

export const teamInvitationQueries = {
    create: async (data: NewTeamInvitation) => {
        const [invitation] = await db.insert(team_invitations).values(data).returning();
        return invitation;
    },

    findById: async (id: string) => {
        const [invitation] = await db.select().from(team_invitations).where(eq(team_invitations.id, id));
        return invitation;
    },

    findByToken: async (token: string) => {
        const [invitation] = await db.select().from(team_invitations).where(eq(team_invitations.token, token));
        return invitation;
    },

    findByEmail: async (email: string) => {
        return db
            .select({
                invitation: team_invitations,
                team: teams,
            })
            .from(team_invitations)
            .innerJoin(teams, eq(team_invitations.team_id, teams.id))
            .where(and(eq(team_invitations.email, email), eq(team_invitations.status, 'pending')))
            .orderBy(desc(team_invitations.created_at));
    },

    findByUserId: async (userId: string) => {
        return db
            .select({
                invitation: team_invitations,
                team: teams,
            })
            .from(team_invitations)
            .innerJoin(teams, eq(team_invitations.team_id, teams.id))
            .where(and(eq(team_invitations.invited_user_id, userId), eq(team_invitations.status, 'pending')))
            .orderBy(desc(team_invitations.created_at));
    },

    findByTeamId: async (teamId: string) => {
        return db
            .select({
                invitation: team_invitations,
                invitedBy: users,
            })
            .from(team_invitations)
            .innerJoin(users, eq(team_invitations.invited_by, users.id))
            .where(eq(team_invitations.team_id, teamId))
            .orderBy(desc(team_invitations.created_at));
    },

    updateStatus: async (id: string, status: TeamInvitationStatus) => {
        const [updated] = await db
            .update(team_invitations)
            .set({
                status,
                responded_at: new Date(),
                updated_at: new Date(),
            })
            .where(eq(team_invitations.id, id))
            .returning();
        return updated;
    },

    accept: async (id: string) => {
        return teamInvitationQueries.updateStatus(id, 'accepted');
    },

    decline: async (id: string) => {
        return teamInvitationQueries.updateStatus(id, 'declined');
    },

    expireOld: async () => {
        return db
            .update(team_invitations)
            .set({ status: 'expired', updated_at: new Date() })
            .where(and(eq(team_invitations.status, 'pending'), lt(team_invitations.expires_at, new Date())))
            .returning();
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(team_invitations).where(eq(team_invitations.id, id)).returning();
        return deleted;
    },
};

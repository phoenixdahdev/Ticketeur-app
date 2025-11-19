import { eq, and } from 'drizzle-orm';
import { db } from '../drizzle';
import { team_members, type NewTeamMember, type TeamMemberRole } from '../schema/team-member';

export const teamMemberQueries = {
    create: async (data: NewTeamMember) => {
        const [member] = await db.insert(team_members).values(data).returning();
        return member;
    },

    findById: async (id: string) => {
        const [member] = await db.select().from(team_members).where(eq(team_members.id, id));
        return member;
    },

    findByTeamAndUser: async (teamId: string, userId: string) => {
        const [member] = await db
            .select()
            .from(team_members)
            .where(and(eq(team_members.team_id, teamId), eq(team_members.user_id, userId)));
        return member;
    },

    findByTeamId: async (teamId: string) => {
        return db.select().from(team_members).where(eq(team_members.team_id, teamId));
    },

    updateRole: async (id: string, role: TeamMemberRole) => {
        const [updated] = await db
            .update(team_members)
            .set({ role, updated_at: new Date() })
            .where(eq(team_members.id, id))
            .returning();
        return updated;
    },

    remove: async (teamId: string, userId: string) => {
        const [deleted] = await db
            .delete(team_members)
            .where(and(eq(team_members.team_id, teamId), eq(team_members.user_id, userId)))
            .returning();
        return deleted;
    },

    isTeamAdmin: async (teamId: string, userId: string) => {
        const member = await teamMemberQueries.findByTeamAndUser(teamId, userId);
        return member && (member.role === 'owner' || member.role === 'admin');
    },

    isTeamOwner: async (teamId: string, userId: string) => {
        const member = await teamMemberQueries.findByTeamAndUser(teamId, userId);
        return member && member.role === 'owner';
    },
};

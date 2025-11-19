import { eq, desc, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { teams, type NewTeam } from '../schema/team';
import { team_members } from '../schema/team-member';
import { users } from '../schema/user';

export const teamQueries = {
    create: async (data: NewTeam) => {
        const [team] = await db.insert(teams).values(data).returning();
        return team;
    },

    findById: async (id: string) => {
        const [team] = await db.select().from(teams).where(eq(teams.id, id));
        return team;
    },

    findByOwnerId: async (ownerId: string) => {
        return db.select().from(teams).where(eq(teams.owner_id, ownerId)).orderBy(desc(teams.created_at));
    },

    findUserTeams: async (userId: string) => {
        return db
            .select({
                team: teams,
                membership: team_members,
            })
            .from(team_members)
            .innerJoin(teams, eq(team_members.team_id, teams.id))
            .where(eq(team_members.user_id, userId))
            .orderBy(desc(teams.created_at));
    },

    update: async (id: string, data: Partial<NewTeam>) => {
        const [updated] = await db
            .update(teams)
            .set({ ...data, updated_at: new Date() })
            .where(eq(teams.id, id))
            .returning();
        return updated;
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(teams).where(eq(teams.id, id)).returning();
        return deleted;
    },

    search: async (query: string) => {
        return db.select().from(teams).where(ilike(teams.name, `%${query}%`)).orderBy(desc(teams.created_at));
    },

    getWithMembers: async (id: string) => {
        const team = await teamQueries.findById(id);
        if (!team) return null;

        const members = await db
            .select({
                member: team_members,
                user: users,
            })
            .from(team_members)
            .innerJoin(users, eq(team_members.user_id, users.id))
            .where(eq(team_members.team_id, id))
            .orderBy(desc(team_members.joined_at));

        return { team, members };
    },
};

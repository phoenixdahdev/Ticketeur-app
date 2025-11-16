import { eq, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { event_categories, type NewEventCategory } from '../schema/event-category';

export const eventCategoryQueries = {
    create: async (data: NewEventCategory) => {
        const [category] = await db.insert(event_categories).values(data).returning();
        return category;
    },

    findById: async (id: string) => {
        const [category] = await db.select().from(event_categories).where(eq(event_categories.id, id));
        return category;
    },

    findBySlug: async (slug: string) => {
        const [category] = await db.select().from(event_categories).where(eq(event_categories.slug, slug));
        return category;
    },

    findAll: async () => {
        return db.select().from(event_categories).orderBy(event_categories.name);
    },

    findActive: async () => {
        return db
            .select()
            .from(event_categories)
            .where(eq(event_categories.is_active, true))
            .orderBy(event_categories.name);
    },

    update: async (id: string, data: Partial<NewEventCategory>) => {
        const [updated] = await db
            .update(event_categories)
            .set({ ...data, updated_at: new Date() })
            .where(eq(event_categories.id, id))
            .returning();
        return updated;
    },

    delete: async (id: string) => {
        const [deleted] = await db.delete(event_categories).where(eq(event_categories.id, id)).returning();
        return deleted;
    },

    search: async (query: string) => {
        return db.select().from(event_categories).where(ilike(event_categories.name, `%${query}%`));
    },

    toggleActive: async (id: string) => {
        const category = await eventCategoryQueries.findById(id);
        if (!category) return null;
        return eventCategoryQueries.update(id, { is_active: !category.is_active });
    },
};

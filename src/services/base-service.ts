import { db } from '~/db/drizzle';
import { AnyPgTable } from 'drizzle-orm/pg-core';
import { eq, isNull, and, isNotNull } from 'drizzle-orm';
import { WithBaseColumns } from '../db/schema/base-table';

export abstract class BaseService<TTable extends WithBaseColumns<AnyPgTable>> {
    protected abstract table: TTable;

    private get cols() {
        return this.table._.columns;
    }

    async softDelete(id: string): Promise<void> {
        await db.update(this.table)
            .set({
                deleted_at: new Date(),
                updated_at: new Date(),
            })
            .where(eq(this.cols.id, id));
    }

    async restore(id: string): Promise<void> {
        await db.update(this.table)
            .set({
                deleted_at: null,
                updated_at: new Date(),
            })
            .where(eq(this.cols.id, id));
    }

    async hardDelete(id: string): Promise<void> {
        await db.delete(this.table)
            .where(eq(this.cols.id, id));
    }

    async getAll(): Promise<TTable['$inferSelect'][]> {
        return await db.select().from(this.table)
            .where(isNull(this.cols.deleted_at));
    }

    async getById(id: string): Promise<TTable['$inferSelect'] | null> {
        const [record] = await db.select().from(this.table)
            .where(and(eq(this.cols.id, id), isNull(this.cols.deleted_at)))
            .limit(1);
        return record ?? null;
    }

    async getAllWithDeleted(): Promise<TTable['$inferSelect'][]> {
        return await db.select().from(this.table);
    }

    async getDeleted(): Promise<TTable['$inferSelect'][]> {
        return await db.select().from(this.table)
            .where(isNotNull(this.cols.deleted_at));
    }

    protected getUpdateTimestamp() {
        return { updated_at: new Date() };
    }
}

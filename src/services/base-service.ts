// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { db } from '~/db/drizzle';
import { AnyPgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';
import { eq, isNull, and, isNotNull, sql } from 'drizzle-orm';
import { WithBaseColumns } from '../db/schema/base-table';

export abstract class BaseService<TTable extends WithBaseColumns<AnyPgTable>> {
    protected abstract table: TTable;

    private get cols() {
        return this.table;
    }

    async softDelete(id: string): Promise<void> {
        const updateData: PgUpdateSetSource<TTable> = {
            deleted_at: sql`${new Date()}`,
            updated_at: sql`${new Date()}`,
        };

        await db.update(this.table)
            .set(updateData)
            .where(eq(this.cols.id, id));
    }

    async restore(id: string): Promise<void> {
        const updateData: PgUpdateSetSource<TTable> = {
            deleted_at: sql`${null}`,
            updated_at: sql`${new Date()}`,
        };

        await db.update(this.table)
            .set(updateData)
            .where(eq(this.cols.id, id));
    }

    async hardDelete(id: string): Promise<void> {
        await db.delete(this.table)
            .where(eq(this.cols.id, id));
    }

    async getAll(): Promise<TTable['$inferSelect'][]> {
        return await db.select()
            .from(this.table)
            .where(isNull(this.cols.deleted_at));
    }

    async getById(id: string): Promise<TTable['$inferSelect'] | null> {
        const [record] = await db.select()
            .from(this.table)
            .where(and(eq(this.cols.id, id), isNull(this.cols.deleted_at)))
            .limit(1);

        return record ?? null;
    }

    async getAllWithDeleted(): Promise<TTable['$inferSelect'][]> {
        return await db.select().from(this.table);
    }

    async getDeleted(): Promise<TTable['$inferSelect'][]> {
        return await db.select()
            .from(this.table)
            .where(isNotNull(this.cols.deleted_at));
    }

    protected getUpdateTimestamp(): PgUpdateSetSource<TTable> {
        return {
            updated_at: sql`${new Date()}`,
        };
    }
}

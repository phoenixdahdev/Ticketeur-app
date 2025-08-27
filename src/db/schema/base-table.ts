import {
    AnyPgTable,
    PgColumnBuilderBase,
    pgTable,
    uuid,
    timestamp,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export abstract class BaseEntity {
    id!: string;
    created_at!: Date;
    updated_at!: Date;
    deleted_at!: Date | null;
}

export function createBaseTable<
    T extends Record<string, PgColumnBuilderBase>
>(
    tableName: string,
    columns: T
) {
    return pgTable(tableName, {
        id: uuid('id').defaultRandom().primaryKey(),
        created_at: timestamp('created_at').defaultNow().notNull(),
        updated_at: timestamp('updated_at').defaultNow().notNull(),
        deleted_at: timestamp('deleted_at'),
        ...columns,
    });
}

export const baseTable = createBaseTable('base', {});

// ✅ Recommended ways to infer types
export type BaseTableRow = typeof baseTable.$inferSelect;
export type BaseTableInsert = typeof baseTable.$inferInsert;

export type BaseTableRow2 = InferSelectModel<typeof baseTable>;
export type BaseTableInsert2 = InferInsertModel<typeof baseTable>;

export type WithBaseColumns<T extends AnyPgTable> =
    T & { _: { row: typeof baseTable.$inferSelect } };

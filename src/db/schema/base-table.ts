import {
    AnyPgTable,
    PgColumnBuilderBase,
    pgTable,
    uuid,
    timestamp,
} from 'drizzle-orm/pg-core';

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

export type BaseTableRow = typeof baseTable.$inferSelect;
export type BaseTableInsert = typeof baseTable.$inferInsert;

export type BaseColumns = {
    id: typeof baseTable.id;
    created_at: typeof baseTable.created_at;
    updated_at: typeof baseTable.updated_at;
    deleted_at: typeof baseTable.deleted_at;
};

export type WithBaseColumns<T extends AnyPgTable> = T & BaseColumns;
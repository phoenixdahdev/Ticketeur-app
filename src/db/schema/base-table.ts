import { Column } from 'drizzle-orm';
import {
    uuid,
    timestamp,
    pgTable,
    AnyPgTable,
    PgColumnBuilderBase
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

export type BaseTableColumns = {
    id: Column<any, any, any>;
    created_at: Column<any, any, any>;
    updated_at: Column<any, any, any>;
    deleted_at: Column<any, any, any>;
};

export type WithBaseColumns<T extends AnyPgTable> =
    T & { _: { columns: BaseTableColumns } };

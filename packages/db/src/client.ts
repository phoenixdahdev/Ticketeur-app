import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '@ticketur/env/core'

import * as schema from './schema'

const sql = postgres(env.DATABASE_URL, { max: 5, idle_timeout: 20 })

export const db = drizzle({ client: sql, schema, casing: 'snake_case' })

export type Database = typeof db

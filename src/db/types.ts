import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import { db } from './client'

export type DbExecutor = typeof db | SQLiteTransaction<any, any, any, any>

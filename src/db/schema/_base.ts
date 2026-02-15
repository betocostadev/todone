import { integer } from 'drizzle-orm/sqlite-core'

export const createdAt = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}

export const updatedAt = {
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
}

export const softDelete = {
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  purgeAfter: integer('purge_after', { mode: 'timestamp' }),
}

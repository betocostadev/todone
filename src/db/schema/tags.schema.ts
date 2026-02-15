import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createdAt, updatedAt } from './_base'

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  title: text('title', { length: 64 }).notNull().unique(),
  ...createdAt,
  ...updatedAt,
})

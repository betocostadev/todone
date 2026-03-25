import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createdAt, softDelete, updatedAt } from './_base'

export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(),

  title: text('title', { length: 64 }).notNull(),

  icon: text('icon'),
  color: text('color'),

  // List position on screen
  position: integer('position').notNull(),

  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),

  ...createdAt,
  ...updatedAt,
  ...softDelete,
})

export type ListSelect = InferSelectModel<typeof lists>
export type ListInsert = InferInsertModel<typeof lists>

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createdAt, updatedAt } from './_base'
import { todos } from './todos.schema'

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),

  todoId: text('todo_id')
    .notNull()
    .references(() => todos.id, { onDelete: 'cascade' }),

  notifyAt: integer('notify_at', { mode: 'timestamp' }).notNull(),
  isExpired: integer('is_expired', { mode: 'boolean' }).default(false),

  ...createdAt,
  ...updatedAt,
})

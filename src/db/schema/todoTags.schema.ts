import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { tags } from './tags.schema'
import { todos } from './todos.schema'

export const todoTags = sqliteTable(
  'todo_tags',
  {
    todoId: text('todo_id')
      .notNull()
      .references(() => todos.id, { onDelete: 'cascade' }),

    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.todoId, table.tagId] }),
  }),
)

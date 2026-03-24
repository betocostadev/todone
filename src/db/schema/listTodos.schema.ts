import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { lists } from './lists.schema'
import { todos } from './todos.schema'

export const listTodos = sqliteTable(
  'list_todos',
  {
    listId: text('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),

    todoId: text('todo_id')
      .notNull()
      .references(() => todos.id, { onDelete: 'cascade' }),

    position: integer('position').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: 'list_todos_pk',
      columns: [table.listId, table.todoId],
    }),
  }),
)

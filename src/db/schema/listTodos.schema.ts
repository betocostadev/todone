import {
  foreignKey,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'
import { lists } from './lists.schema'
import { todos } from './todos.schema'

export const listTodos = sqliteTable(
  'list_todos',
  {
    listId: text('list_id').notNull(),
    todoId: text('todo_id').notNull(),

    position: integer('position').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: 'list_todos_pk',
      columns: [table.listId, table.todoId],
    }),

    listFk: foreignKey({
      columns: [table.listId],
      foreignColumns: [lists.id],
      name: 'list_todos_list_fk',
    }).onDelete('cascade'),

    todoFk: foreignKey({
      columns: [table.todoId],
      foreignColumns: [todos.id],
      name: 'list_todos_todo_fk',
    }).onDelete('cascade'),
  }),
)

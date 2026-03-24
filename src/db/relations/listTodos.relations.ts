import { relations } from 'drizzle-orm'
import { listTodos } from '../schema/listTodos.schema'
import { lists } from '../schema/lists.schema'
import { todos } from '../schema/todos.schema'

// Relations
export const listTodosRelations = relations(listTodos, ({ one }) => ({
  list: one(lists, {
    fields: [listTodos.listId],
    references: [lists.id],
  }),

  todo: one(todos, {
    fields: [listTodos.todoId],
    references: [todos.id],
  }),
}))

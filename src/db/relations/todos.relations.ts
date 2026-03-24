import { relations } from 'drizzle-orm'
import { listTodos } from '../schema/listTodos.schema'
import { notifications } from '../schema/notifications.schema'
import { todos } from '../schema/todos.schema'
import { todoTags } from '../schema/todoTags.schema'

// Relations
export const todosRelations = relations(todos, ({ one, many }) => ({
  parent: one(todos, {
    fields: [todos.parentId],
    references: [todos.id],
  }),

  subtasks: many(todos),

  listTodos: many(listTodos),

  notifications: many(notifications),

  todoTags: many(todoTags),
}))

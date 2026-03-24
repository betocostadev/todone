// Relations
import { relations } from 'drizzle-orm'
import { lists } from '../schema/lists.schema'
import { listTodos } from '../schema/listTodos.schema'

export const listRelations = relations(lists, ({ many }) => ({
  listTodos: many(listTodos),
}))

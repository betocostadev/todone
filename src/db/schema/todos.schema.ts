import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { foreignKey, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createdAt, softDelete, updatedAt } from './_base'

export const todos = sqliteTable(
  'todos',
  {
    id: text('id').primaryKey(),
    // For subtasks
    parentId: text('parent_id'), // nullable by design

    title: text('title', { length: 128 }).notNull(),
    note: text('note', { length: 512 }),

    dueDate: integer('due_date', { mode: 'timestamp' }),
    dueTime: text('due_time'),

    recurrenceType: text('recurrence_type'),
    recurrenceInterval: integer('recurrence_interval'),
    recurrenceWeekdays: text('recurrence_weekdays'),

    ...createdAt,
    ...updatedAt,
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    ...softDelete,
  },
  (table) => ({
    parentFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'todos_parent_fk',
    }).onDelete('cascade'),
  }),
)

export type TodoSelect = InferSelectModel<typeof todos>
export type TodoInsert = InferInsertModel<typeof todos>
export type TodoIdSelect = { todoId: string }

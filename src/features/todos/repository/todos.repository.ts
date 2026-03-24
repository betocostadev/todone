import { db } from '@/db/client'
import { lists } from '@/db/schema/lists.schema'
import { listTodos } from '@/db/schema/listTodos.schema'
import { todos } from '@/db/schema/todos.schema'
import { TODO_NOTE_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from '@/shared/constants'
import { validateMaxLength } from '@/shared/validation/text.validation'
import { and, eq, isNull, max } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const todosRepository = {
  async create(title: string, note?: string, listId?: string) {
    validateMaxLength('Task title', title, TODO_TITLE_MAX_LENGTH)
    validateMaxLength('Task note', note, TODO_NOTE_MAX_LENGTH)

    const id = uuidv4()
    const now = new Date()

    await db.insert(todos).values({
      id,
      title,
      note,
      createdAt: now,
    })

    let targetListId = listId

    // Get List or use Default list (Inbox)
    if (!targetListId) {
      const inbox = await db
        .select()
        .from(lists)
        .where(and(eq(lists.isSystem, true), isNull(lists.deletedAt)))

      if (!inbox.length) {
        throw new Error('Inbox list not found')
      }

      targetListId = inbox[0].id
    }

    // Next position in List
    const result = await db
      .select({ maxPosition: max(listTodos.position) })
      .from(listTodos)
      .where(eq(listTodos.listId, targetListId))

    const nextPosition = (result[0]?.maxPosition ?? -1) + 1

    // Insert pivot
    await db.insert(listTodos).values({
      listId: targetListId,
      todoId: id,
      position: nextPosition,
    })

    return id
  },

  async moveToList(todoId: string, toListId: string) {
    // get current list
    const current = await db
      .select()
      .from(listTodos)
      .where(eq(listTodos.todoId, todoId))

    if (!current.length) {
      throw new Error('Todo not linked to any list')
    }

    const fromListId = current[0].listId

    if (fromListId === toListId) return

    // remove from pivot
    await db
      .delete(listTodos)
      .where(
        and(eq(listTodos.todoId, todoId), eq(listTodos.listId, fromListId)),
      )

    const result = await db
      .select({ maxPosition: max(listTodos.position) })
      .from(listTodos)
      .where(eq(listTodos.listId, toListId))

    const nextPosition = (result[0]?.maxPosition ?? -1) + 1

    // insert new pivot
    await db.insert(listTodos).values({
      listId: toListId,
      todoId,
      position: nextPosition,
    })
  },

  async getAll() {
    return await db.select().from(todos)
  },

  async getTodosInList(listId: string, tx?: any) {
    const executor = tx ?? db

    return executor.select().from(listTodos).where(eq(listTodos.listId, listId))
  },

  async insertPivot(todoId: string, listId: string, tx?: any) {
    const executor = tx ?? db

    const result = await executor
      .select({ maxPosition: max(listTodos.position) })
      .from(listTodos)
      .where(eq(listTodos.listId, listId))

    const nextPosition = (result[0]?.maxPosition ?? -1) + 1

    await executor.insert(listTodos).values({
      todoId,
      listId,
      position: nextPosition,
    })
  },

  async deletePivot(todoId: string, listId: string, tx?: any) {
    const executor = tx ?? db
    await executor
      .delete(listTodos)
      .where(eq(listTodos.todoId, todoId), eq(listTodos.listId, listId))
  },
}

// db.query.todos.findMany({
//   with: {
//     listTodos: true,
//     notifications: true,
//   },
// })

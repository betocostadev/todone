import { DomainError } from '@/core/errors/DomainError'
import { db, listTodos, TodoIdSelect } from '@/db'
import { and, eq, inArray, max, sql } from 'drizzle-orm'
import { listsRepository } from '../repository/lists.repository'

export const listsService = {
  async deleteList(listId: string) {
    const list = await listsRepository.getById(listId)
    console.log('list to delete: ', list.title)

    if (!list) {
      throw new DomainError('List not found')
    }

    if (list.isSystem) {
      throw new DomainError('Cannot delete system list')
    }

    // Inbox is default list
    const inbox = await listsRepository.getInbox()
    console.log('Inbox')
    console.log(inbox)

    // Business rule: tasks from deleted list should be moved to inbox list
    if (!inbox) {
      throw new DomainError('Inbox not found')
    }

    // get todos already at "Inbox"
    await db.transaction(async (tx) => {
      const inboxTodos = await tx
        .select({ todoId: listTodos.todoId })
        .from(listTodos)
        .where(eq(listTodos.listId, inbox.id))

      const inboxTodoIds = inboxTodos.map((t: TodoIdSelect) => t.todoId)

      // delete duplicates from deleted list
      if (inboxTodoIds.length > 0) {
        await tx
          .delete(listTodos)
          .where(
            and(
              eq(listTodos.listId, listId),
              inArray(listTodos.todoId, inboxTodoIds),
            ),
          )
      }

      // get max position of inbox
      const result = await tx
        .select({ maxPosition: max(listTodos.position) })
        .from(listTodos)
        .where(eq(listTodos.listId, inbox.id))

      const offset = (result[0]?.maxPosition ?? -1) + 1

      // move remaining with position offset
      await tx
        .update(listTodos)
        .set({
          listId: inbox.id,
          position: sql`${listTodos.position} + ${offset}`,
        })
        .where(eq(listTodos.listId, listId))

      // soft delete list
      await listsRepository.softDelete(listId, tx)
    })

    // Deprecated - Test only removal
    // Replaced for batch operation
    // await db.transaction(async (tx) => {
    //   const todos = await todosRepository.getTodosInList(listId, tx)

    //   for (const pivot of todos) {
    //     await todosRepository.insertPivot(pivot.todo_id, inbox.id, tx)

    //     await todosRepository.deletePivot(pivot.todo_id, listId, tx)
    //   }

    //   await listsRepository.softDelete(listId, tx)
    // })
  },
}

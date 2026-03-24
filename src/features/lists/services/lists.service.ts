import { db } from '@/db'
import { todosRepository } from '@/features/todos/repository/todos.repository'
import { listsRepository } from '../repository/lists.repository'

export const listsService = {
  async deleteList(listId: string) {
    const list = await listsRepository.getById(listId)

    if (!list) {
      throw new Error('List not found')
    }

    if (list.isSystem) {
      throw new Error('Cannot delete system list')
    }

    const inbox = await listsRepository.getInbox()

    // Inbox is default list
    // tasks from deleted list should be moved to inbox list
    if (!inbox) {
      throw new Error('Inbox not found')
    }

    await db.transaction(async (tx) => {
      const todos = await todosRepository.getTodosInList(listId, tx)

      for (const pivot of todos) {
        await todosRepository.insertPivot(pivot.todo_id, inbox.id, tx)

        await todosRepository.deletePivot(pivot.todo_id, listId, tx)
      }

      await listsRepository.softDelete(listId, tx)
    })
  },
}

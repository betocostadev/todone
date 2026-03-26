import { DomainError } from '@/core/errors/DomainError'
import { db, listTodos, TodoIdSelect } from '@/db'
import { LIST_TITLE_MAX_LENGTH } from '@/shared/constants'
import { validateMaxLength } from '@/shared/validation/text.validation'
import { and, eq, inArray, max, sql } from 'drizzle-orm'
import { listsRepository } from '../repository/lists.repository'

export const listsService = {
  async getAllLists() {
    return listsRepository.getAll()
  },

  async getInboxList() {
    const result = listsRepository.getInbox()

    if (!result) {
      throw new DomainError('Inbox List not found', 'LIST_INBOX_NOT_FOUND')
    }
    return result
  },

  async getListById(id: string) {
    const result = listsRepository.getById(id)

    if (!result) {
      throw new DomainError('List not found', 'LIST_WITH_PROVIDED_ID_MISSING')
    }
    return result
  },

  async createList(title: string, icon?: string, color?: string) {
    validateMaxLength('List title', title, LIST_TITLE_MAX_LENGTH)

    if (!title.trim()) {
      throw new DomainError('List title is required', 'LIST_TITLE_EMPTY')
    }

    return listsRepository.create(title, icon, color)
  },

  async deleteList(listId: string) {
    const list = await this.getListById(listId)

    if (list.isSystem) {
      throw new DomainError(
        'Cannot delete system list',
        'LIST_SYSTEM_DELETE_ERROR',
      )
    }

    // Inbox is default list
    // Business rule: tasks from deleted list should be moved to inbox list
    const inbox = await this.getInboxList()

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

      // delete list
      await listsRepository.delete(listId, tx)
    })
  },
}

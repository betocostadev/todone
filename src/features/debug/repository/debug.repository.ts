import { db } from '@/db/client'
import { ensureInbox } from '@/db/init'
import { lists } from '@/db/schema/lists.schema'
import { listTodos } from '@/db/schema/listTodos.schema'
import { notifications } from '@/db/schema/notifications.schema'
import { tags } from '@/db/schema/tags.schema'
import { todos } from '@/db/schema/todos.schema'
import { todoTags } from '@/db/schema/todoTags.schema'

export const debugRepository = {
  async getRawData() {
    const allLists = await db.select().from(lists)
    const allTodos = await db.select().from(todos)
    const allListTodos = await db.select().from(listTodos)
    const allTags = await db.select().from(tags)
    const allNotifications = await db.select().from(notifications)
    const allTodoTags = await db.select().from(todoTags)

    return {
      lists: allLists,
      todos: allTodos,
      listTodos: allListTodos,
      tags: allTags,
      notifications: allNotifications,
      todoTags: allTodoTags,
    }
  },

  async clearAll() {
    await db.transaction(async (tx) => {
      await tx.delete(todoTags)
      await tx.delete(notifications)
      await tx.delete(tags)
      await tx.delete(listTodos)
      await tx.delete(todos)
      await tx.delete(lists)
    })

    await ensureInbox()
  },
}

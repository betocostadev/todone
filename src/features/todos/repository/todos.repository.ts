import { db } from '@/db/client'
import { todos } from '@/db/schema/todos.schema'
import { TODO_NOTE_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from '@/shared/constants'
import { validateMaxLength } from '@/shared/validation/text.validation'
import { v4 as uuidv4 } from 'uuid'

export const todosRepository = {
  async create(title: string, note: string) {
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

    return id
  },

  async getAll() {
    return await db.select().from(todos)
  },
}

import { db } from '@/db'
import { lists } from '@/db/schema/lists.schema'
import type { DbExecutor } from '@/db/types'
import { and, eq, isNull, max } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const listsRepository = {
  async create(title: string, icon?: string, color?: string) {
    if (!title.trim()) {
      throw new Error('List title is required')
    }

    const id = uuidv4()
    const now = new Date()

    const result = await db
      .select({ maxPosition: max(lists.position) })
      .from(lists)
      .where(isNull(lists.deletedAt))

    const nextPosition = (result[0]?.maxPosition ?? -1) + 1

    await db.insert(lists).values({
      id,
      title,
      icon,
      color,
      position: nextPosition,
      isPinned: false,
      isSystem: false,
      createdAt: now,
    })

    return id
  },

  async getAll() {
    return await db.select().from(lists).where(isNull(lists.deletedAt))
  },

  async getById(id: string) {
    const result = await db.select().from(lists).where(eq(lists.id, id))
    return result[0] ?? null
  },

  async getInbox() {
    const result = await db
      .select()
      .from(lists)
      .where(and(eq(lists.isSystem, true), isNull(lists.deletedAt)))
    return result[0] ?? null
  },

  async softDelete(id: string, tx?: DbExecutor) {
    const executor = tx ?? db

    await executor
      .update(lists)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(lists.id, id))
  },

  async getMaxPosition(tx?: any) {
    const executor = tx ?? db

    const result = await executor
      .select({ maxPosition: max(lists.position) })
      .from(lists)
      .where(isNull(lists.deletedAt))

    return result[0]?.maxPosition ?? -1
  },
}

// db.query.lists.findMany({
//   with: {
//     listTodos: true,
//   },
// })

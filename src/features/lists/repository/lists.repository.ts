import { db } from '@/db'
import { lists } from '@/db/schema/lists.schema'
import type { DbExecutor } from '@/db/types'
import { eq, max } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const listsRepository = {
  async create(title: string, icon?: string, color?: string) {
    const id = uuidv4()
    const now = new Date()

    const maxPosition = await this.getMaxPositionGlobal()

    const nextPosition = maxPosition + 1

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

  // async update

  async getAll() {
    return await db.select().from(lists)
  },

  async getById(id: string) {
    const result = await db.select().from(lists).where(eq(lists.id, id))
    return result[0] ?? null
  },

  async getInbox() {
    const result = await db.select().from(lists).where(eq(lists.isSystem, true))
    return result[0] ?? null
  },

  async delete(id: string, tx?: DbExecutor) {
    const executor = tx ?? db

    await executor.delete(lists).where(eq(lists.id, id))
  },

  async getMaxPosition(tx?: any) {
    const executor = tx ?? db

    const result = await executor
      .select({ maxPosition: max(lists.position) })
      .from(lists)

    return result[0]?.maxPosition ?? -1
  },

  async getMaxPositionGlobal(tx?: any) {
    const executor = tx ?? db
    const result = await executor
      .select({ maxPosition: max(lists.position) })
      .from(lists)

    return result[0]?.maxPosition ?? -1
  },
}

// db.query.lists.findMany({
//   with: {
//     listTodos: true,
//   },
// })

import { db } from '@/db'
import { lists } from '@/db/schema/lists.schema'
import { isNull, max } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const listsRepository = {
  async create(title: string, icon?: string, color?: string) {
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
    return await db.select().from(lists)
  },
}

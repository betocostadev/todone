import { db } from '@/db'
import { lists } from '@/db/schema/lists.schema'

export const listsRepository = {
  async getAll() {
    return await db.select().from(lists)
  },
}

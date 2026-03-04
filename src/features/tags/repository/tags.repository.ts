import { db } from '@/db'
import { tags } from '@/db/schema/tags.schema'
import { TAG_TITLE_MAX_LENGTH } from '@/shared/constants'
import { validateMaxLength } from '@/shared/validation/text.validation'
import { v4 as uuidv4 } from 'uuid'

export const tagsRepository = {
  async create(title: string) {
    validateMaxLength('Tag title', title, TAG_TITLE_MAX_LENGTH)

    const id = uuidv4()
    const now = new Date()

    try {
      await db.insert(tags).values({
        id,
        title,
        createdAt: now,
      })
    } catch (error: any) {
      if (error?.message?.includes('UNIQUE')) {
        throw new Error('Tag already exists')
      }

      throw error
    }

    return id
  },

  async getAll() {
    return await db.select().from(tags)
  },
}

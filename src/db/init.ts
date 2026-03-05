import { lists } from '@/db/schema/lists.schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from './client'

export async function ensureInbox() {
  const existing = await db.select().from(lists).where(eq(lists.isSystem, true))

  if (existing.length > 0) return

  const now = new Date()

  await db.insert(lists).values({
    id: uuidv4(),
    title: 'Inbox',
    icon: 'tray',
    color: '#3b82f6',
    position: 0,
    isPinned: false,
    isSystem: true,
    createdAt: now,
  })
}

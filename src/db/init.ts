import { lists } from '@/db/schema/lists.schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from './client'

export async function initDb() {
  async function ensureInbox() {
    const existing = await db
      .select()
      .from(lists)
      .where(eq(lists.isSystem, true))

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

  // TODOS
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      parent_id TEXT,
      title TEXT NOT NULL,
      note TEXT,
      due_date INTEGER,
      due_time TEXT,
      recurrence_type TEXT,
      recurrence_interval INTEGER,
      recurrence_weekdays TEXT,
      completed_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER,
      deleted_at INTEGER,
      purge_after INTEGER,
      FOREIGN KEY (parent_id) REFERENCES todos(id) ON DELETE CASCADE
    );
  `)

  // LISTS
  db.run(`
    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      position INTEGER NOT NULL,
      is_pinned INTEGER DEFAULT 0,
      is_system INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER,
      deleted_at INTEGER,
      purge_after INTEGER
    );
  `)

  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS lists_title_unique
    ON lists(title);
  `)

  // LIST_TODOS (pivot)
  db.run(`
    CREATE TABLE IF NOT EXISTS list_todos (
      list_id TEXT NOT NULL,
      todo_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      PRIMARY KEY (list_id, todo_id),
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
    );
  `)

  // TAGS
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      updated_at INTEGER
    );
  `)

  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS tags_title_unique
    ON tags(title);
  `)

  // NOTIFICATIONS
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY NOT NULL,
      todo_id TEXT NOT NULL,
      notify_at INTEGER NOT NULL,
      is_expired INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER,
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
    );
  `)

  // Join TODO_TAGS
  db.run(`
    CREATE TABLE IF NOT EXISTS todo_tags (
      todo_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (todo_id, tag_id),
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `)

  await ensureInbox()
}

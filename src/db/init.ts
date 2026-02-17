import { db } from './client'
export async function initDb() {
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
      created_at INTEGER NOT NULL,
      updated_at INTEGER,
      completed_at INTEGER,
      deleted_at INTEGER,
      purge_after INTEGER,
      FOREIGN KEY (parent_id) REFERENCES todos(id) ON DELETE CASCADE
    );
  `)

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

  db.run(`
    CREATE TABLE IF NOT EXISTS todo_tags (
      todo_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (todo_id, tag_id),
      FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `)
}

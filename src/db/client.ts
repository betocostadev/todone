import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

const sqlite = SQLite.openDatabaseSync('todone.db')

// IMPORTANT
sqlite.execSync?.(`PRAGMA foreign_keys = ON`)

export const db = drizzle(sqlite)

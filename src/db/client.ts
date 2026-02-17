import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

const sqlite = SQLite.openDatabaseSync('todone.db')

export const db = drizzle(sqlite)

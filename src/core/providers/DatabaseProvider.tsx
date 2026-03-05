import { db } from '@/db/client'
import { ensureInbox } from '@/db/init'
import migrations from '@/db/migrations/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { PropsWithChildren, useEffect } from 'react'

export function DatabaseProvider({ children }: PropsWithChildren) {
  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
    if (!success) return

    ensureInbox()
  }, [success])

  if (error) {
    console.error('Migration error', error)
    return null
  }

  if (!success) {
    return null
  }

  return children
}

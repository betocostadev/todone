import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
  migrations: {
    prefix: 'timestamp',
  },
} satisfies Config

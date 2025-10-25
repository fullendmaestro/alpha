import { drizzle } from 'drizzle-orm/better-sqlite3'

const db = drizzle(process.env.DATABASE_URL)

const result = await db.execute('select 1')

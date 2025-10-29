import { Hono } from 'hono'
import type { ServerEnv } from '../types'

const app = new Hono<ServerEnv>()

app.get('/', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/db', async (c) => {
  try {
    const db = c.get('db')
    // Simple query to check database connection
    const result = db.run('SELECT 1')
    return c.json({ status: 'ok', database: 'connected' })
  } catch (error: any) {
    return c.json({ status: 'error', message: error.message }, 500)
  }
})

export default app

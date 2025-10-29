import { Context } from 'hono'
import type { Database } from '@/db'

export interface ServerEnv {
  Variables: {
    db: Database
    userId?: string
  }
}

export type ServerContext = Context<ServerEnv>

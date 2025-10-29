import { SqliteSaver } from '@langchain/langgraph-checkpoint-sqlite'
import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const CHECKPOINT_DB_PATH = './data/checkpoints.db'

// Ensure the data directory exists
const dbDir = dirname(CHECKPOINT_DB_PATH)
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

// Create SQLite connection for checkpointer
const checkpointDb = new Database(CHECKPOINT_DB_PATH)

// Enable WAL mode for better concurrency
checkpointDb.pragma('journal_mode = WAL')

// Create SqliteSaver instance
export const checkpointer = new SqliteSaver(checkpointDb)

// Initialize the checkpointer tables
checkpointer.setup()

export { checkpointDb }

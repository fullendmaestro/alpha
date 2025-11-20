/**
 * Database utilities and connection management
 */

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db: ReturnType<typeof drizzle> | null = null
let sqlite: Database.Database | null = null

/**
 * Initialize database connection
 */
export function initializeDatabase(dbPath?: string) {
  const defaultPath = path.join(process.cwd(), 'data', 'alpha.db')
  const finalPath = dbPath || process.env.DATABASE_PATH || defaultPath

  // Ensure directory exists
  const dir = path.dirname(finalPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  console.log(`📦 Initializing database at: ${finalPath}`)

  // Create SQLite connection
  sqlite = new Database(finalPath)
  sqlite.pragma('journal_mode = WAL') // Enable Write-Ahead Logging for better concurrency
  sqlite.pragma('foreign_keys = ON') // Enable foreign key constraints

  // Create Drizzle instance
  db = drizzle(sqlite, { schema })

  // Run migrations
  runMigrations()

  return db
}

/**
 * Run database migrations
 */
function runMigrations() {
  if (!db) throw new Error('Database not initialized')

  const migrationsFolder = path.join(__dirname, '../../drizzle')

  // Create migrations folder if it doesn't exist
  if (!fs.existsSync(migrationsFolder)) {
    fs.mkdirSync(migrationsFolder, { recursive: true })
  }

  try {
    migrate(db, { migrationsFolder })
    console.log('✓ Database migrations completed')
  } catch (error) {
    console.warn('Migration warning:', error)
    // Create tables manually if migrations fail
    createTablesManually()
  }
}

/**
 * Create tables manually (fallback)
 */
function createTablesManually() {
  if (!sqlite) throw new Error('SQLite not initialized')

  console.log('Creating tables manually...')

  // Create conversations table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      metadata TEXT
    );
  `)

  // Create messages table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      message_id TEXT NOT NULL UNIQUE,
      context_id TEXT,
      task_id TEXT,
      role TEXT NOT NULL,
      parts TEXT NOT NULL,
      timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
      metadata TEXT,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
  `)

  // Create tasks table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      context_id TEXT,
      state TEXT NOT NULL,
      status_message TEXT,
      history TEXT,
      artifacts TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      metadata TEXT,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
  `)

  // Create events table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      actor TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
      metadata TEXT,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
  `)

  // Create remote_agents table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS remote_agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      card TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      registered_at INTEGER NOT NULL DEFAULT (unixepoch()),
      last_seen INTEGER,
      metadata TEXT
    );
  `)

  // Create pending_messages table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS pending_messages (
      message_id TEXT PRIMARY KEY,
      context_id TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `)

  // Create context_mappings table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS context_mappings (
      context_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
  `)

  // Create indexes
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON conversations(created_at);
    CREATE INDEX IF NOT EXISTS conversations_updated_at_idx ON conversations(updated_at);
    CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS messages_context_idx ON messages(context_id);
    CREATE INDEX IF NOT EXISTS messages_task_idx ON messages(task_id);
    CREATE INDEX IF NOT EXISTS messages_timestamp_idx ON messages(timestamp);
    CREATE INDEX IF NOT EXISTS tasks_conversation_idx ON tasks(conversation_id);
    CREATE INDEX IF NOT EXISTS tasks_context_idx ON tasks(context_id);
    CREATE INDEX IF NOT EXISTS tasks_state_idx ON tasks(state);
    CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks(created_at);
    CREATE INDEX IF NOT EXISTS events_conversation_idx ON events(conversation_id);
    CREATE INDEX IF NOT EXISTS events_timestamp_idx ON events(timestamp);
    CREATE INDEX IF NOT EXISTS events_actor_idx ON events(actor);
    CREATE INDEX IF NOT EXISTS remote_agents_name_idx ON remote_agents(name);
    CREATE INDEX IF NOT EXISTS remote_agents_active_idx ON remote_agents(is_active);
    CREATE INDEX IF NOT EXISTS pending_messages_context_idx ON pending_messages(context_id);
    CREATE INDEX IF NOT EXISTS context_mappings_conversation_idx ON context_mappings(conversation_id);
  `)

  console.log('✓ Tables created successfully')
}

/**
 * Get database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

/**
 * Get SQLite instance
 */
export function getSQLite(): Database.Database {
  if (!sqlite) {
    throw new Error('SQLite not initialized. Call initializeDatabase() first.')
  }
  return sqlite
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (sqlite) {
    sqlite.close()
    sqlite = null
    db = null
    console.log('✓ Database connection closed')
  }
}

/**
 * Cleanup old data
 */
export function cleanupOldData(daysOld: number = 30) {
  if (!db) throw new Error('Database not initialized')

  const cutoffTimestamp = Math.floor(Date.now() / 1000) - daysOld * 24 * 60 * 60

  // Delete old conversations and their related data (cascade will handle the rest)
  const result = sqlite!
    .prepare(
      `
    DELETE FROM conversations 
    WHERE updated_at < ? AND is_active = 0
  `
    )
    .run(cutoffTimestamp)

  console.log(`✓ Cleaned up ${result.changes} old conversations`)
}

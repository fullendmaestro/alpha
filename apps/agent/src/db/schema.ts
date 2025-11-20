/**
 * Database schema for Alpha Agent
 * Using Drizzle ORM with SQLite
 */

import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

/**
 * Conversations table
 */
export const conversations = sqliteTable(
  'conversations',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    metadata: text('metadata', { mode: 'json' }),
  },
  (table) => ({
    createdAtIdx: index('conversations_created_at_idx').on(table.createdAt),
    updatedAtIdx: index('conversations_updated_at_idx').on(table.updatedAt),
  })
)

/**
 * Messages table
 */
export const messages = sqliteTable(
  'messages',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    messageId: text('message_id').notNull().unique(),
    contextId: text('context_id'),
    taskId: text('task_id'),
    role: text('role', { enum: ['user', 'agent', 'system'] }).notNull(),
    parts: text('parts', { mode: 'json' }).notNull(), // JSON array of parts
    timestamp: integer('timestamp', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    metadata: text('metadata', { mode: 'json' }),
  },
  (table) => ({
    conversationIdx: index('messages_conversation_idx').on(table.conversationId),
    contextIdx: index('messages_context_idx').on(table.contextId),
    taskIdx: index('messages_task_idx').on(table.taskId),
    timestampIdx: index('messages_timestamp_idx').on(table.timestamp),
  })
)

/**
 * Tasks table
 */
export const tasks = sqliteTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id').references(() => conversations.id, {
      onDelete: 'cascade',
    }),
    contextId: text('context_id'),
    state: text('state', {
      enum: ['submitted', 'working', 'completed', 'failed', 'canceled', 'input-required'],
    }).notNull(),
    statusMessage: text('status_message', { mode: 'json' }), // Message object
    history: text('history', { mode: 'json' }), // Array of Message objects
    artifacts: text('artifacts', { mode: 'json' }), // Array of Artifact objects
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    metadata: text('metadata', { mode: 'json' }),
  },
  (table) => ({
    conversationIdx: index('tasks_conversation_idx').on(table.conversationId),
    contextIdx: index('tasks_context_idx').on(table.contextId),
    stateIdx: index('tasks_state_idx').on(table.state),
    createdAtIdx: index('tasks_created_at_idx').on(table.createdAt),
  })
)

/**
 * Events table
 */
export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id').references(() => conversations.id, {
      onDelete: 'cascade',
    }),
    actor: text('actor').notNull(), // 'user', 'agent', agent name
    content: text('content', { mode: 'json' }).notNull(), // Message object
    timestamp: integer('timestamp', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    metadata: text('metadata', { mode: 'json' }),
  },
  (table) => ({
    conversationIdx: index('events_conversation_idx').on(table.conversationId),
    timestampIdx: index('events_timestamp_idx').on(table.timestamp),
    actorIdx: index('events_actor_idx').on(table.actor),
  })
)

/**
 * Remote agents table
 */
export const remoteAgents = sqliteTable(
  'remote_agents',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    url: text('url').notNull(),
    card: text('card', { mode: 'json' }).notNull(), // AgentCard object
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    registeredAt: integer('registered_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    lastSeen: integer('last_seen', { mode: 'timestamp' }),
    metadata: text('metadata', { mode: 'json' }),
  },
  (table) => ({
    nameIdx: index('remote_agents_name_idx').on(table.name),
    activeIdx: index('remote_agents_active_idx').on(table.isActive),
  })
)

/**
 * Pending messages table (for tracking message processing)
 */
export const pendingMessages = sqliteTable(
  'pending_messages',
  {
    messageId: text('message_id').primaryKey(),
    contextId: text('context_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    contextIdx: index('pending_messages_context_idx').on(table.contextId),
  })
)

/**
 * Context to conversation mapping
 */
export const contextMappings = sqliteTable(
  'context_mappings',
  {
    contextId: text('context_id').primaryKey(),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    conversationIdx: index('context_mappings_conversation_idx').on(table.conversationId),
  })
)

// Type exports for TypeScript
export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
export type RemoteAgent = typeof remoteAgents.$inferSelect
export type NewRemoteAgent = typeof remoteAgents.$inferInsert
export type PendingMessage = typeof pendingMessages.$inferSelect
export type NewPendingMessage = typeof pendingMessages.$inferInsert
export type ContextMapping = typeof contextMappings.$inferSelect
export type NewContextMapping = typeof contextMappings.$inferInsert

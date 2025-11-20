/**
 * Database repository for conversation and message management
 * Implements persistence layer using Drizzle ORM
 */

import { eq, desc, sql } from 'drizzle-orm'
import { getDatabase } from './utils.js'
import * as schema from './schema.js'
import { v4 as uuidv4 } from 'uuid'
import type { Message as A2AMessage, Task as A2ATask, AgentCard } from '@a2a-js/sdk'

export class DatabaseRepository {
  private get db() {
    return getDatabase()
  }

  // ========== Conversation Operations ==========

  async createConversation(name?: string) {
    const id = uuidv4()
    const conversationName = name || `Conversation ${Date.now()}`

    const [conversation] = await this.db
      .insert(schema.conversations)
      .values({
        id,
        name: conversationName,
        isActive: true,
      })
      .returning()

    return conversation
  }

  async getConversation(id: string) {
    const [conversation] = await this.db
      .select()
      .from(schema.conversations)
      .where(eq(schema.conversations.id, id))
      .limit(1)

    return conversation
  }

  async listConversations(limit: number = 100) {
    return await this.db
      .select()
      .from(schema.conversations)
      .orderBy(desc(schema.conversations.updatedAt))
      .limit(limit)
  }

  async updateConversation(id: string, updates: Partial<schema.NewConversation>) {
    await this.db
      .update(schema.conversations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.conversations.id, id))
  }

  async deleteConversation(id: string) {
    await this.db.delete(schema.conversations).where(eq(schema.conversations.id, id))
  }

  // ========== Message Operations ==========

  async createMessage(conversationId: string, message: A2AMessage) {
    const id = uuidv4()

    const [dbMessage] = await this.db
      .insert(schema.messages)
      .values({
        id,
        conversationId,
        messageId: message.messageId || uuidv4(),
        contextId: message.contextId,
        taskId: message.taskId,
        role: message.role === 'agent' ? 'agent' : 'user',
        parts: message.parts as any,
        metadata: message.metadata as any,
      })
      .returning()

    // Update conversation timestamp
    await this.updateConversation(conversationId, {})

    return dbMessage
  }

  async getMessagesByConversation(conversationId: string) {
    return await this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.conversationId, conversationId))
      .orderBy(schema.messages.timestamp)
  }

  async getMessagesByContext(contextId: string) {
    return await this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.contextId, contextId))
      .orderBy(schema.messages.timestamp)
  }

  async getMessageById(messageId: string) {
    const [message] = await this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.messageId, messageId))
      .limit(1)

    return message
  }

  // ========== Task Operations ==========

  async createTask(task: A2ATask, conversationId?: string) {
    const [dbTask] = await this.db
      .insert(schema.tasks)
      .values({
        id: task.id,
        conversationId,
        contextId: task.contextId,
        state: task.status.state as any,
        statusMessage: task.status.message as any,
        history: task.history as any,
        artifacts: task.artifacts as any,
        metadata: task.metadata as any,
      })
      .returning()

    return dbTask
  }

  async updateTask(
    taskId: string,
    updates: {
      state?: string
      statusMessage?: any
      history?: any
      artifacts?: any
      metadata?: any
    }
  ) {
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    }

    await this.db.update(schema.tasks).set(updateData).where(eq(schema.tasks.id, taskId))
  }

  async getTask(taskId: string) {
    const [task] = await this.db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, taskId))
      .limit(1)

    return task
  }

  async listTasks(conversationId?: string) {
    if (conversationId) {
      return await this.db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.conversationId, conversationId))
        .orderBy(desc(schema.tasks.createdAt))
    }

    return await this.db
      .select()
      .from(schema.tasks)
      .orderBy(desc(schema.tasks.createdAt))
      .limit(100)
  }

  async getTasksByState(
    state: 'submitted' | 'working' | 'completed' | 'failed' | 'canceled' | 'input-required'
  ) {
    return await this.db.select().from(schema.tasks).where(eq(schema.tasks.state, state))
  }

  // ========== Event Operations ==========

  async createEvent(conversationId: string | null, actor: string, content: any) {
    const id = uuidv4()

    const [event] = await this.db
      .insert(schema.events)
      .values({
        id,
        conversationId,
        actor,
        content: content as any,
      })
      .returning()

    return event
  }

  async listEvents(conversationId?: string, limit: number = 100) {
    if (conversationId) {
      return await this.db
        .select()
        .from(schema.events)
        .where(eq(schema.events.conversationId, conversationId))
        .orderBy(desc(schema.events.timestamp))
        .limit(limit)
    }

    return await this.db
      .select()
      .from(schema.events)
      .orderBy(desc(schema.events.timestamp))
      .limit(limit)
  }

  // ========== Remote Agent Operations ==========

  async registerRemoteAgent(card: AgentCard) {
    const id = uuidv4()

    // Check if agent already exists
    const existing = await this.db
      .select()
      .from(schema.remoteAgents)
      .where(eq(schema.remoteAgents.name, card.name))
      .limit(1)

    if (existing.length > 0) {
      // Update existing agent
      await this.db
        .update(schema.remoteAgents)
        .set({
          url: card.url,
          card: card as any,
          isActive: true,
          lastSeen: new Date(),
        })
        .where(eq(schema.remoteAgents.name, card.name))

      return existing[0]
    }

    // Insert new agent
    const [agent] = await this.db
      .insert(schema.remoteAgents)
      .values({
        id,
        name: card.name,
        url: card.url,
        card: card as any,
        isActive: true,
      })
      .returning()

    return agent
  }

  async listRemoteAgents(activeOnly: boolean = true) {
    if (activeOnly) {
      return await this.db
        .select()
        .from(schema.remoteAgents)
        .where(eq(schema.remoteAgents.isActive, true))
        .orderBy(schema.remoteAgents.registeredAt)
    }

    return await this.db
      .select()
      .from(schema.remoteAgents)
      .orderBy(schema.remoteAgents.registeredAt)
  }

  async getRemoteAgent(name: string) {
    const [agent] = await this.db
      .select()
      .from(schema.remoteAgents)
      .where(eq(schema.remoteAgents.name, name))
      .limit(1)

    return agent
  }

  async deactivateRemoteAgent(name: string) {
    await this.db
      .update(schema.remoteAgents)
      .set({ isActive: false })
      .where(eq(schema.remoteAgents.name, name))
  }

  // ========== Pending Message Operations ==========

  async addPendingMessage(messageId: string, contextId: string) {
    await this.db.insert(schema.pendingMessages).values({
      messageId,
      contextId,
    })
  }

  async removePendingMessage(messageId: string) {
    await this.db
      .delete(schema.pendingMessages)
      .where(eq(schema.pendingMessages.messageId, messageId))
  }

  async listPendingMessages() {
    return await this.db.select().from(schema.pendingMessages)
  }

  async clearOldPendingMessages(olderThanMinutes: number = 30) {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000)
    await this.db
      .delete(schema.pendingMessages)
      .where(sql`${schema.pendingMessages.createdAt} < ${cutoffTime}`)
  }

  // ========== Context Mapping Operations ==========

  async mapContextToConversation(contextId: string, conversationId: string) {
    const existing = await this.db
      .select()
      .from(schema.contextMappings)
      .where(eq(schema.contextMappings.contextId, contextId))
      .limit(1)

    if (existing.length > 0) {
      return existing[0]
    }

    const [mapping] = await this.db
      .insert(schema.contextMappings)
      .values({
        contextId,
        conversationId,
      })
      .returning()

    return mapping
  }

  async getConversationByContext(contextId: string) {
    const [mapping] = await this.db
      .select()
      .from(schema.contextMappings)
      .where(eq(schema.contextMappings.contextId, contextId))
      .limit(1)

    if (!mapping) return null

    return await this.getConversation(mapping.conversationId)
  }

  // ========== Utility Operations ==========

  async getConversationWithMessages(conversationId: string) {
    const conversation = await this.getConversation(conversationId)
    if (!conversation) return null

    const messages = await this.getMessagesByConversation(conversationId)
    const tasks = await this.listTasks(conversationId)

    return {
      conversation,
      messages,
      tasks,
    }
  }

  async getFullConversationHistory(contextId: string) {
    const conversation = await this.getConversationByContext(contextId)
    if (!conversation) return null

    const messages = await this.getMessagesByConversation(conversation.id)
    const tasks = await this.listTasks(conversation.id)
    const events = await this.listEvents(conversation.id)

    return {
      conversation,
      messages,
      tasks,
      events,
    }
  }
}

// Singleton instance
let repositoryInstance: DatabaseRepository | null = null

export function getRepository(): DatabaseRepository {
  if (!repositoryInstance) {
    repositoryInstance = new DatabaseRepository()
  }
  return repositoryInstance
}

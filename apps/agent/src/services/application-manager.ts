/**
 * Application Manager - Service layer for agent operations
 * Handles business logic and coordinates between database and agent
 */

import type { Message, Task, AgentCard } from '@a2a-js/sdk'
import { getRepository, DatabaseRepository } from '../db/repository.js'
import type { Conversation as DBConversation } from '../db/schema.js'

export interface Conversation {
  conversation_id: string
  is_active: boolean
  name: string
  task_ids: string[]
  messages: Message[]
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  actor: string
  content: Message
  timestamp: number
}

export interface AgentInfo {
  name: string
  url: string
  registered_at: string
}

/**
 * Application Manager
 * Provides high-level API for managing conversations, messages, tasks, and agents
 */
export class ApplicationManager {
  private repository: DatabaseRepository

  constructor() {
    this.repository = getRepository()
  }

  // ========== Conversation Management ==========

  async createConversation(name?: string): Promise<Conversation> {
    const dbConversation = await this.repository.createConversation(name)
    if (!dbConversation) throw new Error('Failed to create conversation')
    return this.dbConversationToConversation(dbConversation)
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    const dbConversation = await this.repository.getConversation(conversationId)
    if (!dbConversation) return null

    const messages = await this.repository.getMessagesByConversation(conversationId)
    const tasks = await this.repository.listTasks(conversationId)

    return {
      conversation_id: dbConversation.id,
      is_active: dbConversation.isActive,
      name: dbConversation.name,
      task_ids: tasks.map((t) => t.id),
      messages: messages.map((m) => this.dbMessageToA2AMessage(m)),
      created_at: dbConversation.createdAt.toISOString(),
      updated_at: dbConversation.updatedAt.toISOString(),
    }
  }

  async getConversationByContext(contextId: string): Promise<Conversation | null> {
    const dbConversation = await this.repository.getConversationByContext(contextId)
    if (!dbConversation) return null

    return this.getConversation(dbConversation.id)
  }

  async listConversations(): Promise<Conversation[]> {
    const dbConversations = await this.repository.listConversations()

    const conversations = await Promise.all(
      dbConversations.map(async (dbConv) => {
        const messages = await this.repository.getMessagesByConversation(dbConv.id)
        const tasks = await this.repository.listTasks(dbConv.id)

        return {
          conversation_id: dbConv.id,
          is_active: dbConv.isActive,
          name: dbConv.name,
          task_ids: tasks.map((t) => t.id),
          messages: messages.map((m) => this.dbMessageToA2AMessage(m)),
          created_at: dbConv.createdAt.toISOString(),
          updated_at: dbConv.updatedAt.toISOString(),
        }
      })
    )

    return conversations
  }

  // ========== Message Management ==========

  async addMessage(conversationId: string, message: Message): Promise<void> {
    await this.repository.createMessage(conversationId, message)

    // Create event for message
    await this.repository.createEvent(
      conversationId,
      message.role === 'user' ? 'user' : 'agent',
      message
    )

    // Map context to conversation if contextId exists
    if (message.contextId) {
      await this.repository.mapContextToConversation(message.contextId, conversationId)
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const dbMessages = await this.repository.getMessagesByConversation(conversationId)
    return dbMessages.map((m) => this.dbMessageToA2AMessage(m))
  }

  async getMessagesByContext(contextId: string): Promise<Message[]> {
    const dbMessages = await this.repository.getMessagesByContext(contextId)
    return dbMessages.map((m) => this.dbMessageToA2AMessage(m))
  }

  // ========== Task Management ==========

  async addTask(task: Task, conversationId?: string): Promise<void> {
    await this.repository.createTask(task, conversationId)

    // Map task to conversation if contextId exists
    if (task.contextId && !conversationId) {
      const conversation = await this.repository.getConversationByContext(task.contextId)
      if (conversation) {
        await this.repository.updateTask(task.id, {
          metadata: { ...task.metadata, conversationId: conversation.id },
        })
      }
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const updateData: any = {}

    if (updates.status) {
      updateData.state = updates.status.state
      updateData.statusMessage = updates.status.message
    }

    if (updates.history) {
      updateData.history = updates.history
    }

    if (updates.artifacts) {
      updateData.artifacts = updates.artifacts
    }

    if (updates.metadata) {
      updateData.metadata = updates.metadata
    }

    await this.repository.updateTask(taskId, updateData)
  }

  async getTask(taskId: string): Promise<Task | null> {
    const dbTask = await this.repository.getTask(taskId)
    if (!dbTask) return null

    return this.dbTaskToA2ATask(dbTask)
  }

  async listTasks(): Promise<Task[]> {
    const dbTasks = await this.repository.listTasks()
    return dbTasks.map((t) => this.dbTaskToA2ATask(t))
  }

  // ========== Event Management ==========

  async createEvent(message: Message, actor: string, conversationId?: string): Promise<Event> {
    const dbEvent = await this.repository.createEvent(conversationId || null, actor, message)
    if (!dbEvent) throw new Error('Failed to create event')

    return {
      id: dbEvent.id,
      actor: dbEvent.actor,
      content: dbEvent.content as Message,
      timestamp: Math.floor(dbEvent.timestamp.getTime() / 1000),
    }
  }

  async listEvents(): Promise<Event[]> {
    const dbEvents = await this.repository.listEvents()

    return dbEvents.map((e) => ({
      id: e.id,
      actor: e.actor,
      content: e.content as Message,
      timestamp: Math.floor(e.timestamp.getTime() / 1000),
    }))
  }

  // ========== Remote Agent Management ==========

  async registerAgent(card: AgentCard): Promise<void> {
    await this.repository.registerRemoteAgent(card)
  }

  async listAgents(): Promise<AgentInfo[]> {
    const dbAgents = await this.repository.listRemoteAgents()

    return dbAgents.map((a) => ({
      name: a.name,
      url: a.url,
      registered_at: a.registeredAt.toISOString(),
    }))
  }

  async getAgentCards(): Promise<AgentCard[]> {
    const dbAgents = await this.repository.listRemoteAgents()
    return dbAgents.map((a) => a.card as AgentCard)
  }

  // ========== Pending Message Management ==========

  async addPendingMessage(messageId: string, contextId: string): Promise<void> {
    await this.repository.addPendingMessage(messageId, contextId)
  }

  async removePendingMessage(messageId: string): Promise<void> {
    await this.repository.removePendingMessage(messageId)
  }

  async getPendingMessages(): Promise<Array<[string, string]>> {
    const pending = await this.repository.listPendingMessages()
    return pending.map((p) => [p.messageId, p.contextId])
  }

  // ========== Message Sanitization ==========

  async sanitizeMessage(message: Message): Promise<Message> {
    if (!message.contextId) return message

    // Get conversation by context
    const conversation = await this.getConversationByContext(message.contextId)
    if (!conversation || conversation.messages.length === 0) return message

    // Get last message
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    if (!lastMessage || !lastMessage.taskId) return message

    // Get task
    const task = await this.getTask(lastMessage.taskId)
    if (!task) return message

    // Check if task is still open
    const openStates = ['submitted', 'working', 'input-required']
    if (openStates.includes(task.status.state)) {
      message.taskId = task.id
    }

    return message
  }

  // ========== Conversion Helpers ==========

  private dbConversationToConversation(dbConv: DBConversation): Conversation {
    return {
      conversation_id: dbConv.id,
      is_active: dbConv.isActive,
      name: dbConv.name,
      task_ids: [],
      messages: [],
      created_at: dbConv.createdAt.toISOString(),
      updated_at: dbConv.updatedAt.toISOString(),
    }
  }

  private dbMessageToA2AMessage(dbMsg: any): Message {
    return {
      kind: 'message',
      messageId: dbMsg.messageId,
      contextId: dbMsg.contextId,
      taskId: dbMsg.taskId,
      role: dbMsg.role,
      parts: dbMsg.parts,
      metadata: dbMsg.metadata,
    }
  }

  private dbTaskToA2ATask(dbTask: any): Task {
    return {
      kind: 'task',
      id: dbTask.id,
      contextId: dbTask.contextId,
      status: {
        state: dbTask.state,
        message: dbTask.statusMessage,
        timestamp: dbTask.updatedAt.toISOString(),
      },
      history: dbTask.history || [],
      artifacts: dbTask.artifacts || [],
      metadata: dbTask.metadata,
    }
  }
}

// Singleton instance
let managerInstance: ApplicationManager | null = null

export function getApplicationManager(): ApplicationManager {
  if (!managerInstance) {
    managerInstance = new ApplicationManager()
  }
  return managerInstance
}

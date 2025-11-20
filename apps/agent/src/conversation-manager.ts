/**
 * Conversation Manager - handles conversation state and message history
 */

import { v4 as uuidv4 } from 'uuid'
import { Message, Task } from '@a2a-js/sdk'
import { Conversation, Event } from './types.js'

export class ConversationManager {
  private conversations: Map<string, Conversation> = new Map()
  private tasks: Map<string, Task> = new Map()
  private events: Map<string, Event> = new Map()
  private pendingMessages: Set<string> = new Set()
  private contextToConversation: Map<string, string> = new Map()
  private taskToConversation: Map<string, string> = new Map()

  /**
   * Create a new conversation
   */
  createConversation(name?: string): Conversation {
    const conversationId = uuidv4()
    const conversation: Conversation = {
      conversation_id: conversationId,
      is_active: true,
      name: name || `Conversation ${this.conversations.size + 1}`,
      task_ids: [],
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.conversations.set(conversationId, conversation)
    return conversation
  }

  /**
   * Get a conversation by ID
   */
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId)
  }

  /**
   * Get conversation by context ID
   */
  getConversationByContext(contextId: string): Conversation | undefined {
    const conversationId = this.contextToConversation.get(contextId)
    if (!conversationId) return undefined
    return this.conversations.get(conversationId)
  }

  /**
   * List all conversations
   */
  listConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }

  /**
   * Add a message to a conversation
   */
  addMessage(conversationId: string, message: Message): void {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`)
    }

    conversation.messages.push(message)
    conversation.updated_at = new Date().toISOString()

    // Map context to conversation
    if (message.contextId) {
      this.contextToConversation.set(message.contextId, conversationId)
    }

    // Map task to conversation
    if (message.taskId) {
      if (!conversation.task_ids.includes(message.taskId)) {
        conversation.task_ids.push(message.taskId)
      }
      this.taskToConversation.set(message.taskId, conversationId)
    }
  }

  /**
   * Get messages for a conversation
   */
  getMessages(conversationId: string): Message[] {
    const conversation = this.conversations.get(conversationId)
    return conversation?.messages || []
  }

  /**
   * Add a task
   */
  addTask(task: Task): void {
    this.tasks.set(task.id, task)

    // Map task to conversation if context exists
    if (task.contextId) {
      const conversationId = this.contextToConversation.get(task.contextId)
      if (conversationId) {
        this.taskToConversation.set(task.id, conversationId)
        const conversation = this.conversations.get(conversationId)
        if (conversation && !conversation.task_ids.includes(task.id)) {
          conversation.task_ids.push(task.id)
        }
      }
    }
  }

  /**
   * Update a task
   */
  updateTask(taskId: string, updates: Partial<Task>): void {
    const task = this.tasks.get(taskId)
    if (task) {
      Object.assign(task, updates)
    }
  }

  /**
   * Get a task by ID
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId)
  }

  /**
   * List all tasks
   */
  listTasks(): Task[] {
    return Array.from(this.tasks.values())
  }

  /**
   * Add an event
   */
  addEvent(event: Event): void {
    this.events.set(event.id, event)
  }

  /**
   * Create event from message
   */
  createEventFromMessage(message: Message, actor: string = 'user'): Event {
    const event: Event = {
      id: uuidv4(),
      actor,
      content: message,
      timestamp: Date.now(),
    }
    this.addEvent(event)
    return event
  }

  /**
   * List all events
   */
  listEvents(): Event[] {
    return Array.from(this.events.values()).sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   * Mark a message as pending
   */
  addPendingMessage(messageId: string): void {
    this.pendingMessages.add(messageId)
  }

  /**
   * Remove a pending message
   */
  removePendingMessage(messageId: string): void {
    this.pendingMessages.delete(messageId)
  }

  /**
   * Get pending messages
   */
  getPendingMessages(): Array<[string, string]> {
    const pending: Array<[string, string]> = []

    for (const messageId of this.pendingMessages) {
      // Find the message across all conversations
      for (const conversation of this.conversations.values()) {
        const message = conversation.messages.find((m) => m.messageId === messageId)
        if (message) {
          pending.push([messageId, message.contextId || ''])
          break
        }
      }
    }

    return pending
  }

  /**
   * Sanitize message - add task_id if the last message in the conversation has an open task
   */
  sanitizeMessage(message: Message): Message {
    if (!message.contextId) return message

    const conversationId = this.contextToConversation.get(message.contextId)
    if (!conversationId) return message

    const conversation = this.conversations.get(conversationId)
    if (!conversation || conversation.messages.length === 0) return message

    const lastMessage = conversation.messages[conversation.messages.length - 1]
    if (!lastMessage || !lastMessage.taskId) return message

    const task = this.tasks.get(lastMessage.taskId)
    if (!task) return message

    // Check if task is still open
    const openStates = ['submitted', 'working', 'input-required']
    if (openStates.includes(task.status.state)) {
      message.taskId = task.id
    }

    return message
  }

  /**
   * Clear all data (useful for testing)
   */
  clear(): void {
    this.conversations.clear()
    this.tasks.clear()
    this.events.clear()
    this.pendingMessages.clear()
    this.contextToConversation.clear()
    this.taskToConversation.clear()
  }
}

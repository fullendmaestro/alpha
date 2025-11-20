/**
 * Host Agent Service
 * Handles LLM invocation and agent orchestration using LangGraph
 */

import { v4 as uuidv4 } from 'uuid'
import type { Message, TextPart, AgentCard } from '@a2a-js/sdk'
import { graph } from '../alpha-agent/graph.js'
import { AIMessage } from '@langchain/core/messages'
import { ApplicationManager } from './application-manager.js'
import { A2AClient } from '@a2a-js/sdk/client'

export interface RemoteAgentConnection {
  card: AgentCard
  client: A2AClient
}

/**
 * Host Agent Service
 * Processes messages through LangGraph and coordinates with remote agents
 */
export class HostAgentService {
  private manager: ApplicationManager
  private remoteAgents: Map<string, RemoteAgentConnection> = new Map()

  constructor(manager: ApplicationManager) {
    this.manager = manager
  }

  /**
   * Initialize remote agents
   */
  async initializeRemoteAgents(addresses: string[]): Promise<void> {
    for (const address of addresses) {
      try {
        const tempClient = new A2AClient(address)
        const card = await tempClient.getAgentCard()
        this.registerRemoteAgent(card)
      } catch (error) {
        console.error(`Failed to register agent at ${address}:`, error)
      }
    }
  }

  /**
   * Register a remote agent
   */
  registerRemoteAgent(card: AgentCard): void {
    const client = new A2AClient(card.url)
    this.remoteAgents.set(card.name, { card, client })
    this.manager.registerAgent(card)
    console.log(`✓ Registered remote agent: ${card.name}`)
  }

  /**
   * List available remote agents
   */
  listRemoteAgents(): Array<{ name: string; description?: string; url: string }> {
    return Array.from(this.remoteAgents.values()).map((conn) => ({
      name: conn.card.name,
      description: conn.card.description,
      url: conn.card.url,
    }))
  }

  /**
   * Get remote agent cards
   */
  getRemoteAgentCards(): AgentCard[] {
    return Array.from(this.remoteAgents.values()).map((conn) => conn.card)
  }

  /**
   * Process a message through the host agent
   */
  async processMessage(message: Message): Promise<void> {
    const taskId = uuidv4()
    const contextId = message.contextId || uuidv4()

    console.log(`[HostAgent] Processing message ${message.messageId} for task ${taskId}`)

    // Ensure contextId is set
    if (!message.contextId) {
      message.contextId = contextId
    }

    // Get or create conversation
    let conversation = await this.manager.getConversationByContext(contextId)
    if (!conversation) {
      conversation = await this.manager.createConversation(`Chat ${new Date().toLocaleString()}`)
    }

    // Add user message
    await this.manager.addMessage(conversation.conversation_id, message)
    await this.manager.createEvent(message, 'user', conversation.conversation_id)

    if (message.messageId) {
      await this.manager.addPendingMessage(message.messageId, contextId)
    }

    try {
      // Get conversation history
      const conversationData = await this.manager.getConversation(conversation.conversation_id)
      if (!conversationData) {
        throw new Error('Conversation not found')
      }

      // Convert to LangGraph format
      const langGraphMessages = conversationData.messages
        .filter((m) => m.parts.some((p) => p.kind === 'text'))
        .map((m) => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.parts
            .filter((p): p is TextPart => p.kind === 'text')
            .map((p) => p.text)
            .join('\n'),
        }))

      // Build system prompt
      const agentList = this.listRemoteAgents()
        .map((a) => `- ${a.name}: ${a.description || 'No description'}`)
        .join('\n')

      const systemPrompt = `You are an expert AI assistant that helps users with their requests.

Available Remote Agents:
${agentList || 'No remote agents available'}

When users ask about specific topics that remote agents can handle, delegate to them.
Otherwise, answer questions directly and be helpful.
Always be accurate, friendly, and concise.
Current time: ${new Date().toISOString()}`

      const config = {
        configurable: {
          systemPromptTemplate: systemPrompt,
          model: process.env.MODEL || 'google-genai/gemini-2.0-flash-exp',
          thread_id: contextId,
        },
      }

      // Stream through LangGraph
      const streamResponse = await graph.stream(
        {
          messages: langGraphMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
        config
      )

      let finalResponse = ''

      for await (const chunk of streamResponse) {
        if (chunk.callModel?.messages) {
          const messages = chunk.callModel.messages
          const messageArray = Array.isArray(messages) ? messages : [messages]
          const lastMessage = messageArray[messageArray.length - 1]

          if (lastMessage instanceof AIMessage) {
            if (lastMessage.content) {
              finalResponse = String(lastMessage.content)
            }
          }
        }
      }

      // Create agent response
      const agentMessage: Message = {
        kind: 'message',
        role: 'agent',
        messageId: uuidv4(),
        parts: [
          {
            kind: 'text',
            text: finalResponse || 'I received your message.',
          },
        ],
        taskId: taskId,
        contextId: contextId,
      }

      // Add to conversation
      await this.manager.addMessage(conversation.conversation_id, agentMessage)
      await this.manager.createEvent(agentMessage, 'agent', conversation.conversation_id)

      if (message.messageId) {
        await this.manager.removePendingMessage(message.messageId)
      }

      console.log(`[HostAgent] Completed processing for task ${taskId}`)
    } catch (error) {
      console.error(`[HostAgent] Error processing message:`, error)

      const errorMessage: Message = {
        kind: 'message',
        role: 'agent',
        messageId: uuidv4(),
        parts: [
          {
            kind: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        taskId: taskId,
        contextId: contextId,
      }

      await this.manager.addMessage(conversation.conversation_id, errorMessage)

      if (message.messageId) {
        await this.manager.removePendingMessage(message.messageId)
      }
    }
  }
}

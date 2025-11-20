import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import { AgentCard, Task, TaskStatusUpdateEvent, Message, TextPart } from '@a2a-js/sdk'
import {
  InMemoryTaskStore,
  TaskStore,
  AgentExecutor,
  RequestContext,
  ExecutionEventBus,
  DefaultRequestHandler,
} from '@a2a-js/sdk/server'
import { A2AExpressApp } from '@a2a-js/sdk/server/express'
import { A2AClient } from '@a2a-js/sdk/client'
import { alpaAgentCard } from './alpha-agent/agentCard.js'
import { graph } from './alpha-agent/graph.js'
import { AIMessage } from '@langchain/core/messages'
import { ConversationManager } from './conversation-manager.js'
import type {
  Conversation,
  JSONRPCRequest,
  CreateConversationResponse,
  ListConversationResponse,
  SendMessageResponse,
  ListMessageResponse,
  PendingMessageResponse,
  GetEventResponse,
  ListTaskResponse,
  RegisterAgentResponse,
  ListAgentResponse,
  MessageInfo,
} from './types.js'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 2024
const HOST = process.env.HOST || '0.0.0.0'

/**
 * Remote agent connection manager
 */
class RemoteAgentConnection {
  private client: A2AClient
  public card: AgentCard

  constructor(card: AgentCard) {
    this.card = card
    this.client = new A2AClient(card.url)
  }

  async sendMessage(message: Message): Promise<Task | Message> {
    try {
      if (this.card.capabilities?.streaming) {
        const stream = this.client.sendMessageStream({ message })
        let lastTask: Task | undefined

        for await (const event of stream) {
          if (event.kind === 'task') {
            lastTask = event as Task
          } else if (event.kind === 'status-update') {
            const statusEvent = event as TaskStatusUpdateEvent
            if (statusEvent.final) {
              return {
                kind: 'task',
                id: statusEvent.taskId,
                contextId: statusEvent.contextId,
                status: statusEvent.status,
                history: [],
                artifacts: [],
              } as Task
            }
          }
        }

        if (lastTask) return lastTask
      }

      const response = await this.client.sendMessage({ message })
      if ('kind' in response && (response.kind === 'task' || response.kind === 'message')) {
        return response as unknown as Task | Message
      }
      throw new Error('Invalid response from remote agent')
    } catch (error) {
      console.error(`Error sending message to ${this.card.name}:`, error)
      throw error
    }
  }
}

/**
 * Host Agent Executor with conversation management
 */
class HostAgentExecutor implements AgentExecutor {
  private remoteAgents: Map<string, RemoteAgentConnection> = new Map()
  private cancelledTasks = new Set<string>()
  public conversationManager: ConversationManager

  constructor(remoteAgentAddresses: string[] = [], conversationManager: ConversationManager) {
    this.conversationManager = conversationManager
    this.initializeRemoteAgents(remoteAgentAddresses)
  }

  private async initializeRemoteAgents(addresses: string[]) {
    for (const address of addresses) {
      try {
        const tempClient = new A2AClient(address)
        const card = await tempClient.getAgentCard()
        const connection = new RemoteAgentConnection(card)
        this.remoteAgents.set(card.name, connection)
        console.log(`✓ Registered remote agent: ${card.name} at ${address}`)
      } catch (error) {
        console.error(`Failed to register agent at ${address}:`, error)
      }
    }
  }

  public registerRemoteAgent(card: AgentCard) {
    const connection = new RemoteAgentConnection(card)
    this.remoteAgents.set(card.name, connection)
    console.log(`✓ Registered remote agent: ${card.name}`)
  }

  public listRemoteAgents(): Array<{ name: string; description?: string }> {
    return Array.from(this.remoteAgents.values()).map((conn) => ({
      name: conn.card.name,
      description: conn.card.description,
    }))
  }

  public getRemoteAgentCards(): AgentCard[] {
    return Array.from(this.remoteAgents.values()).map((conn) => conn.card)
  }

  public cancelTask = async (taskId: string, _eventBus: ExecutionEventBus): Promise<void> => {
    this.cancelledTasks.add(taskId)
  }

  async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const userMessage = requestContext.userMessage
    const existingTask = requestContext.task

    const taskId = existingTask?.id || uuidv4()
    const contextId = userMessage.contextId || existingTask?.contextId || uuidv4()

    console.log(`[HostAgent] Processing message ${userMessage.messageId} for task ${taskId}`)

    // Track in conversation manager
    let conversation: Conversation | undefined
    if (userMessage.contextId) {
      conversation = this.conversationManager.getConversationByContext(userMessage.contextId)
    }

    // Create conversation if needed
    if (!conversation && contextId) {
      conversation = this.conversationManager.createConversation()
      userMessage.contextId = contextId
    }

    // Add user message to conversation
    if (conversation) {
      this.conversationManager.addMessage(conversation.conversation_id, userMessage)
      this.conversationManager.createEventFromMessage(userMessage, 'user')

      if (userMessage.messageId) {
        this.conversationManager.addPendingMessage(userMessage.messageId)
      }
    }

    // Publish initial task if new
    if (!existingTask) {
      const initialTask: Task = {
        kind: 'task',
        id: taskId,
        contextId: contextId,
        status: {
          state: 'submitted',
          timestamp: new Date().toISOString(),
        },
        history: [userMessage],
        metadata: userMessage.metadata,
        artifacts: [],
      }
      eventBus.publish(initialTask)
      this.conversationManager.addTask(initialTask)
    }

    // Working status
    const workingStatusUpdate: TaskStatusUpdateEvent = {
      kind: 'status-update',
      taskId: taskId,
      contextId: contextId,
      status: {
        state: 'working',
        message: {
          kind: 'message',
          role: 'agent',
          messageId: uuidv4(),
          parts: [{ kind: 'text', text: 'Processing your request...' }],
          taskId: taskId,
          contextId: contextId,
        },
        timestamp: new Date().toISOString(),
      },
      final: false,
    }
    eventBus.publish(workingStatusUpdate)

    try {
      // Build conversation history
      const historyMessages = existingTask?.history ? [...existingTask.history] : []
      if (!historyMessages.find((m) => m.messageId === userMessage.messageId)) {
        historyMessages.push(userMessage)
      }

      // Convert to LangGraph format
      const langGraphMessages = historyMessages
        .filter((m) => m.parts.some((p) => p.kind === 'text'))
        .map((m) => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.parts
            .filter((p): p is TextPart => p.kind === 'text')
            .map((p) => p.text)
            .join('\n'),
        }))

      // Enhanced system prompt
      const agentList = this.listRemoteAgents()
        .map((a) => `- ${a.name}: ${a.description || 'No description'}`)
        .join('\n')

      const systemPrompt = `You are an expert delegator that can delegate user requests to appropriate remote agents.

Available Remote Agents:
${agentList || 'No remote agents available'}

Discovery:
- You can use the list_remote_agents tool to list available remote agents.

Execution:
- For actionable requests, use the send_message tool to interact with remote agents.

Always include the remote agent name when responding to the user.
Focus on the most recent parts of the conversation.
Current time: ${new Date().toISOString()}`

      const config = {
        configurable: {
          systemPromptTemplate: systemPrompt,
          model: 'google-genai/gemini-2.0-flash-exp',
          thread_id: contextId,
        },
      }

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
        if (this.cancelledTasks.has(taskId)) {
          const cancelledUpdate: TaskStatusUpdateEvent = {
            kind: 'status-update',
            taskId: taskId,
            contextId: contextId,
            status: {
              state: 'canceled',
              timestamp: new Date().toISOString(),
            },
            final: true,
          }
          eventBus.publish(cancelledUpdate)
          return
        }

        if (chunk.callModel?.messages) {
          const messages = chunk.callModel.messages
          const messageArray = Array.isArray(messages) ? messages : [messages]
          const lastMessage = messageArray[messageArray.length - 1]

          if (lastMessage instanceof AIMessage) {
            if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
              const intermediateUpdate: TaskStatusUpdateEvent = {
                kind: 'status-update',
                taskId: taskId,
                contextId: contextId,
                status: {
                  state: 'working',
                  message: {
                    kind: 'message',
                    role: 'agent',
                    messageId: uuidv4(),
                    parts: [
                      {
                        kind: 'text',
                        text: 'Coordinating with remote agents...',
                      },
                    ],
                    taskId: taskId,
                    contextId: contextId,
                  },
                  timestamp: new Date().toISOString(),
                },
                final: false,
              }
              eventBus.publish(intermediateUpdate)
            }

            if (lastMessage.content) {
              finalResponse = String(lastMessage.content)
            }
          }
        }
      }

      // Create agent response message
      const agentMessage: Message = {
        kind: 'message',
        role: 'agent',
        messageId: uuidv4(),
        parts: [
          {
            kind: 'text',
            text: finalResponse || 'Task completed successfully.',
          },
        ],
        taskId: taskId,
        contextId: contextId,
      }

      // Add to conversation
      if (conversation) {
        this.conversationManager.addMessage(conversation.conversation_id, agentMessage)
        this.conversationManager.createEventFromMessage(agentMessage, 'agent')

        if (userMessage.messageId) {
          this.conversationManager.removePendingMessage(userMessage.messageId)
        }
      }

      // Publish completion
      const completedUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: 'completed',
          message: agentMessage,
          timestamp: new Date().toISOString(),
        },
        final: true,
      }
      eventBus.publish(completedUpdate)

      // Update task
      this.conversationManager.updateTask(taskId, {
        status: completedUpdate.status,
      })
    } catch (error) {
      console.error(`[HostAgent] Error processing task ${taskId}:`, error)

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

      if (conversation) {
        this.conversationManager.addMessage(conversation.conversation_id, errorMessage)

        if (userMessage.messageId) {
          this.conversationManager.removePendingMessage(userMessage.messageId)
        }
      }

      const errorUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: 'failed',
          message: errorMessage,
          timestamp: new Date().toISOString(),
        },
        final: true,
      }
      eventBus.publish(errorUpdate)

      this.conversationManager.updateTask(taskId, {
        status: errorUpdate.status,
      })
    }
  }
}

/**
 * Main application setup
 */
async function main() {
  console.log('🚀 Starting Alpha Host Agent with Backend API...')

  // Initialize conversation manager
  const conversationManager = new ConversationManager()

  // Get remote agent addresses
  const remoteAgentAddresses = process.env.REMOTE_AGENTS
    ? process.env.REMOTE_AGENTS.split(',').map((s) => s.trim())
    : []

  // Initialize executor
  const executor = new HostAgentExecutor(remoteAgentAddresses, conversationManager)

  // Wait for remote agents
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Initialize task store
  const taskStore: TaskStore = new InMemoryTaskStore()

  // Create request handler
  const requestHandler = new DefaultRequestHandler(alpaAgentCard, taskStore, executor)

  // Create A2A app
  const appBuilder = new A2AExpressApp(requestHandler)
  const app = appBuilder.setupRoutes(express() as any)

  // Enable CORS for frontend
  app.use(cors())
  app.use(express.json())

  // ========== Backend API Routes ==========

  // Create conversation
  app.post('/conversation/create', (_req: Request, res: Response) => {
    const conversation = conversationManager.createConversation()
    const response: CreateConversationResponse = {
      jsonrpc: '2.0',
      id: uuidv4(),
      result: conversation,
    }
    res.json(response)
  })

  // List conversations
  app.post('/conversation/list', (_req: Request, res: Response) => {
    const conversations = conversationManager.listConversations()
    const response: ListConversationResponse = {
      jsonrpc: '2.0',
      id: uuidv4(),
      result: conversations,
    }
    res.json(response)
  })

  // Send message (handles both A2A and conversation tracking)
  app.post('/message/send', async (req: Request, res: Response) => {
    try {
      const body = req.body as JSONRPCRequest
      const message = body.params as Message

      // Sanitize message
      const sanitizedMessage = conversationManager.sanitizeMessage(message)

      const response: SendMessageResponse = {
        jsonrpc: '2.0',
        id: body.id,
        result: {
          message_id: sanitizedMessage.messageId || uuidv4(),
          context_id: sanitizedMessage.contextId || '',
        } as MessageInfo,
      }

      res.json(response)

      // Process asynchronously (will be handled by executor)
      // The executor will track it in conversation manager
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: req.body.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // List messages
  app.post('/message/list', (req: Request, res: Response) => {
    const body = req.body as JSONRPCRequest
    const conversationId = body.params as string
    const messages = conversationManager.getMessages(conversationId)

    const response: ListMessageResponse = {
      jsonrpc: '2.0',
      id: body.id,
      result: messages,
    }
    res.json(response)
  })

  // Pending messages
  app.post('/message/pending', (_req: Request, res: Response) => {
    const pending = conversationManager.getPendingMessages()
    const response: PendingMessageResponse = {
      jsonrpc: '2.0',
      id: uuidv4(),
      result: pending,
    }
    res.json(response)
  })

  // Get events
  app.post('/events/get', (_req: Request, res: Response) => {
    const events = conversationManager.listEvents()
    const response: GetEventResponse = {
      jsonrpc: '2.0',
      id: uuidv4(),
      result: events,
    }
    res.json(response)
  })

  // List tasks
  app.post('/task/list', (_req: Request, res: Response) => {
    const tasks = conversationManager.listTasks()
    const response: ListTaskResponse = {
      jsonrpc: '2.0',
      id: uuidv4(),
      result: tasks,
    }
    res.json(response)
  })

  // Register agent
  app.post('/agent/register', async (req: Request, res: Response) => {
    try {
      const body = req.body as JSONRPCRequest
      const agentUrl = body.params as string

      const client = new A2AClient(agentUrl)
      const card = await client.getAgentCard()
      executor.registerRemoteAgent(card)

      const response: RegisterAgentResponse = {
        jsonrpc: '2.0',
        id: body.id,
        result: 'success',
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: req.body.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // List agents
  app.post('/agent/list', async (_req: Request, res: Response) => {
    const agents = executor.getRemoteAgentCards()
    const agentInfos = agents.map((card) => ({
      name: card.name,
      url: card.url,
      registered_at: new Date().toISOString(),
    }))

    const response = {
      jsonrpc: '2.0',
      id: uuidv4(),
      result: agentInfos,
    } as ListAgentResponse
    res.json(response)
  })

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      agent: alpaAgentCard.name,
      version: alpaAgentCard.version,
      remoteAgents: executor.listRemoteAgents(),
      conversations: conversationManager.listConversations().length,
      tasks: conversationManager.listTasks().length,
    })
  })

  // Start server
  app.listen(PORT, () => {
    console.log(`✓ Alpha Host Agent running at http://${HOST}:${PORT}`)
    console.log(`✓ Agent Card: http://${HOST}:${PORT}/.well-known/agent-card.json`)
    console.log(`✓ Backend API: http://${HOST}:${PORT}/conversation/*`)
    console.log(`✓ Registered ${executor.listRemoteAgents().length} remote agent(s)`)
    console.log('\nBackend API Endpoints:')
    console.log('  POST /conversation/create')
    console.log('  POST /conversation/list')
    console.log('  POST /message/send')
    console.log('  POST /message/list')
    console.log('  POST /message/pending')
    console.log('  POST /events/get')
    console.log('  POST /task/list')
    console.log('  POST /agent/register')
    console.log('  POST /agent/list')
  })
}

main().catch((error) => {
  console.error('Failed to start host agent:', error)
  process.exit(1)
})

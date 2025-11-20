/**
 * Alpha Host Agent Server
 * Unified server with A2A protocol support and backend API
 * Using SQLite/Drizzle for persistence
 */

import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import type { Message } from '@a2a-js/sdk'
import {
  InMemoryTaskStore,
  TaskStore,
  AgentExecutor,
  RequestContext,
  ExecutionEventBus,
  DefaultRequestHandler,
} from '@a2a-js/sdk/server'
import { A2AExpressApp } from '@a2a-js/sdk/server/express'
// Database
import { initializeDatabase, closeDatabase } from './db/utils.js'

// Services
import { getApplicationManager } from './services/application-manager.js'
import { HostAgentService } from './services/host-agent-service.js'

// Types
import type {
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
 * Minimal A2A Executor (for A2A protocol compatibility)
 */
class MinimalA2AExecutor implements AgentExecutor {
  async execute(_requestContext: RequestContext, _eventBus: ExecutionEventBus): Promise<void> {
    // A2A protocol execution handled separately
    // This is just for protocol compliance
  }

  async cancelTask(_taskId: string, _eventBus: ExecutionEventBus): Promise<void> {
    // No-op
  }
}

/**
 * Main application
 */
async function main() {
  console.log('🚀 Starting Alpha Host Agent Server...\n')

  // Initialize database
  console.log('📦 Setting up database...')
  initializeDatabase()

  // Initialize services
  const manager = getApplicationManager()
  const hostAgent = new HostAgentService(manager)

  // Initialize remote agents
  const remoteAgentAddresses = process.env.REMOTE_AGENTS
    ? process.env.REMOTE_AGENTS.split(',').map((s) => s.trim())
    : []

  if (remoteAgentAddresses.length > 0) {
    console.log(`🔗 Initializing ${remoteAgentAddresses.length} remote agent(s)...`)
    await hostAgent.initializeRemoteAgents(remoteAgentAddresses)
  }

  // Create agent card
  const agentCard = {
    name: 'alpha',
    version: '1.0.0',
    url: `http://${HOST}:${PORT}`,
    capabilities: {},
    defaultInputModes: ['text'],
    defaultOutputModes: ['text'],
  }

  // Setup A2A protocol (for protocol compliance)
  const taskStore: TaskStore = new InMemoryTaskStore()
  const executor = new MinimalA2AExecutor()
  const requestHandler = new DefaultRequestHandler(agentCard as any, taskStore, executor)
  const appBuilder = new A2AExpressApp(requestHandler)

  // Create Express app
  const app = appBuilder.setupRoutes(express() as any)

  // Enable CORS
  app.use(cors())
  app.use(express.json())

  // ========== Backend API Routes ==========

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      agent: agentCard.name,
      version: agentCard.version,
      remoteAgents: hostAgent.listRemoteAgents().length,
      database: 'connected',
    })
  })

  // Create conversation
  app.post('/conversation/create', async (_req: Request, res: Response) => {
    try {
      const conversation = await manager.createConversation()
      const response: CreateConversationResponse = {
        jsonrpc: '2.0',
        id: uuidv4(),
        result: conversation,
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: uuidv4(),
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // List conversations
  app.post('/conversation/list', async (_req: Request, res: Response) => {
    try {
      const conversations = await manager.listConversations()
      const response: ListConversationResponse = {
        jsonrpc: '2.0',
        id: uuidv4(),
        result: conversations,
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: uuidv4(),
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // Send message
  app.post('/message/send', async (req: Request, res: Response) => {
    try {
      const body = req.body as JSONRPCRequest
      const message = body.params as Message

      // Ensure message has required fields
      if (!message.messageId) {
        message.messageId = uuidv4()
      }
      if (!message.contextId) {
        message.contextId = uuidv4()
      }

      // Sanitize message
      const sanitizedMessage = await manager.sanitizeMessage(message)

      const response: SendMessageResponse = {
        jsonrpc: '2.0',
        id: body.id,
        result: {
          message_id: sanitizedMessage.messageId,
          context_id: sanitizedMessage.contextId,
        } as MessageInfo,
      }

      // Return immediately
      res.json(response)

      // Process asynchronously
      setImmediate(() => {
        hostAgent.processMessage(sanitizedMessage).catch((error) => {
          console.error('Error processing message:', error)
        })
      })
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
  app.post('/message/list', async (req: Request, res: Response) => {
    try {
      const body = req.body as JSONRPCRequest
      const conversationId = body.params as string
      const messages = await manager.getMessages(conversationId)

      const response: ListMessageResponse = {
        jsonrpc: '2.0',
        id: body.id,
        result: messages,
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

  // Pending messages
  app.post('/message/pending', async (_req: Request, res: Response) => {
    try {
      const pending = await manager.getPendingMessages()
      const response: PendingMessageResponse = {
        jsonrpc: '2.0',
        id: uuidv4(),
        result: pending,
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: uuidv4(),
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // Get events
  app.post('/events/get', async (_req: Request, res: Response) => {
    try {
      const events = await manager.listEvents()
      const response: GetEventResponse = {
        jsonrpc: '2.0',
        id: uuidv4(),
        result: events,
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: uuidv4(),
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // List tasks
  app.post('/task/list', async (_req: Request, res: Response) => {
    try {
      const tasks = await manager.listTasks()
      const response: ListTaskResponse = {
        jsonrpc: '2.0',
        id: uuidv4(),
        result: tasks,
      }
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: uuidv4(),
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // Register agent
  app.post('/agent/register', async (req: Request, res: Response) => {
    try {
      const body = req.body as JSONRPCRequest
      const agentUrl = body.params as string

      const { A2AClient } = await import('@a2a-js/sdk/client')
      const client = new A2AClient(agentUrl)
      const card = await client.getAgentCard()
      hostAgent.registerRemoteAgent(card)

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
    try {
      const agents = await manager.listAgents()
      const response = {
        jsonrpc: '2.0',
        id: uuidv4(),
        result: agents,
      } as ListAgentResponse
      res.json(response)
    } catch (error) {
      res.status(500).json({
        jsonrpc: '2.0',
        id: uuidv4(),
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      })
    }
  })

  // Start server
  const server = app.listen(PORT, HOST, () => {
    console.log(`\n✓ Alpha Host Agent running at http://${HOST}:${PORT}`)
    console.log(`✓ Agent Card: http://${HOST}:${PORT}/.well-known/agent-card.json`)
    console.log(`✓ Backend API: http://${HOST}:${PORT}/*`)
    console.log(`✓ Database: SQLite with Drizzle ORM`)
    console.log(`✓ Registered ${hostAgent.listRemoteAgents().length} remote agent(s)\n`)
    console.log('Backend API Endpoints:')
    console.log('  GET  /health')
    console.log('  POST /conversation/create')
    console.log('  POST /conversation/list')
    console.log('  POST /message/send')
    console.log('  POST /message/list')
    console.log('  POST /message/pending')
    console.log('  POST /events/get')
    console.log('  POST /task/list')
    console.log('  POST /agent/register')
    console.log('  POST /agent/list\n')
  })

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down gracefully...')
    server.close(() => {
      closeDatabase()
      console.log('✓ Server closed')
      process.exit(0)
    })

    // Force exit after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

main().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

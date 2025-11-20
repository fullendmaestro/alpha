import 'dotenv/config'
import express from 'express'
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
      // Try streaming first if supported
      if (this.card.capabilities?.streaming) {
        const stream = this.client.sendMessageStream({ message })
        let lastTask: Task | undefined

        for await (const event of stream) {
          if (event.kind === 'task') {
            lastTask = event as Task
          } else if (event.kind === 'status-update') {
            const statusEvent = event as TaskStatusUpdateEvent
            if (statusEvent.final) {
              // Return task-like structure from final status
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

      // Fallback to non-streaming - returns SendMessageResponse which might be an error
      const response = await this.client.sendMessage({ message })
      // Type guard and conversion
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
 * Host Agent Executor - orchestrates remote agents using LangGraph
 */
class HostAgentExecutor implements AgentExecutor {
  private remoteAgents: Map<string, RemoteAgentConnection> = new Map()
  private cancelledTasks = new Set<string>()

  constructor(remoteAgentAddresses: string[] = []) {
    // Initialize remote agent connections
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

  public cancelTask = async (taskId: string, _eventBus: ExecutionEventBus): Promise<void> => {
    this.cancelledTasks.add(taskId)
  }

  async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const userMessage = requestContext.userMessage
    const existingTask = requestContext.task

    const taskId = existingTask?.id || uuidv4()
    const contextId = userMessage.contextId || existingTask?.contextId || uuidv4()

    console.log(`[HostAgent] Processing message ${userMessage.messageId} for task ${taskId}`)

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
      // Build conversation history for LangGraph
      const historyMessages = existingTask?.history ? [...existingTask.history] : []
      if (!historyMessages.find((m) => m.messageId === userMessage.messageId)) {
        historyMessages.push(userMessage)
      }

      // Convert A2A messages to LangGraph format
      const langGraphMessages = historyMessages
        .filter((m) => m.parts.some((p) => p.kind === 'text'))
        .map((m) => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.parts
            .filter((p): p is TextPart => p.kind === 'text')
            .map((p) => p.text)
            .join('\n'),
        }))

      // Create enhanced system prompt with remote agent info
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

      // Invoke LangGraph with tools for remote agent interaction
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
        // Check for cancellation
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

        // LangGraph stream returns state updates
        // Check for callModel updates which contain the agent's response
        if (chunk.callModel?.messages) {
          const messages = chunk.callModel.messages
          // Handle Messages type which can be either an array or a single message
          const messageArray = Array.isArray(messages) ? messages : [messages]
          const lastMessage = messageArray[messageArray.length - 1]

          if (lastMessage instanceof AIMessage) {
            if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
              // Agent is making tool calls - publish intermediate status
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

      // Publish completion
      const completedUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: 'completed',
          message: {
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
          },
          timestamp: new Date().toISOString(),
        },
        final: true,
      }
      eventBus.publish(completedUpdate)
    } catch (error) {
      console.error(`[HostAgent] Error processing task ${taskId}:`, error)

      const errorUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: 'failed',
          message: {
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
          },
          timestamp: new Date().toISOString(),
        },
        final: true,
      }
      eventBus.publish(errorUpdate)
    }
  }
}

/**
 * Main application setup
 */
async function main() {
  console.log('🚀 Starting Alpha Host Agent...')

  // Get remote agent addresses from environment
  const remoteAgentAddresses = process.env.REMOTE_AGENTS
    ? process.env.REMOTE_AGENTS.split(',').map((s) => s.trim())
    : []

  // Initialize executor
  const executor = new HostAgentExecutor(remoteAgentAddresses)

  // Wait a bit for remote agents to be registered
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Initialize task store
  const taskStore: TaskStore = new InMemoryTaskStore()

  // Create request handler with correct parameters
  const requestHandler = new DefaultRequestHandler(alpaAgentCard, taskStore, executor)

  // Create A2A app builder
  const appBuilder = new A2AExpressApp(requestHandler)

  // Setup routes on Express app
  // Type assertion needed due to Express type compatibility
  const app = appBuilder.setupRoutes(express() as any)

  // Health check endpoint
  app.get('/health', (_req: any, res: any) => {
    res.json({
      status: 'healthy',
      agent: alpaAgentCard.name,
      version: alpaAgentCard.version,
      remoteAgents: executor.listRemoteAgents(),
    })
  })

  // Start server
  app.listen(PORT, () => {
    console.log(`✓ Alpha Host Agent running at http://${HOST}:${PORT}`)
    console.log(`✓ Agent Card available at http://${HOST}:${PORT}/.well-known/agent-card.json`)
    console.log(`✓ Registered ${executor.listRemoteAgents().length} remote agent(s)`)
  })
}

// Start the application
main().catch((error) => {
  console.error('Failed to start host agent:', error)
  process.exit(1)
})

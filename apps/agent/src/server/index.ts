import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { db } from '@/db'
import type { ServerEnv } from './types'
import { checkpointer } from './storage/checkpointer'
import { workflow } from '@/react-agent/graph'
import { v4 as uuidv4 } from 'uuid'

// Import custom routes
import customRoutes from './routes/custom'
import healthRoutes from './routes/health'

// Compile the graph with the checkpointer
const graph = workflow.compile({ checkpointer })

const app = new Hono<ServerEnv>()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
  '*',
  cors({
    origin: '*', // Configure this based on your needs
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

// Inject database into context
app.use('*', async (c, next) => {
  c.set('db', db)
  await next()
})

// Health check routes
app.route('/health', healthRoutes)

// Custom API routes
app.route('/api', customRoutes)

// LangGraph agent endpoint
app.post('/agent/invoke', async (c) => {
  try {
    const body = await c.req.json()
    const { message, threadId = uuidv4(), userId } = body

    if (!message) {
      return c.json({ error: 'Message is required' }, 400)
    }

    // Set userId in context if provided
    if (userId) {
      c.set('userId', userId)
    }

    const config = {
      configurable: {
        thread_id: threadId,
      },
    }

    const result = await graph.invoke(
      {
        messages: [{ role: 'user', content: message }],
      },
      config
    )

    return c.json({
      threadId,
      messages: result.messages,
    })
  } catch (error: any) {
    console.error('Agent invocation error:', error)
    return c.json(
      {
        error: 'Failed to process request',
        details: error.message,
      },
      500
    )
  }
})

// LangGraph agent streaming endpoint
app.post('/agent/stream', async (c) => {
  try {
    const body = await c.req.json()
    const { message, threadId = uuidv4(), userId } = body

    if (!message) {
      return c.json({ error: 'Message is required' }, 400)
    }

    // Set userId in context if provided
    if (userId) {
      c.set('userId', userId)
    }

    const config = {
      configurable: {
        thread_id: threadId,
      },
    }

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const agentStream = await graph.stream(
            {
              messages: [{ role: 'user', content: message }],
            },
            { ...config, streamMode: 'values' }
          )

          for await (const chunk of agentStream) {
            const data = JSON.stringify(chunk)
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
          }

          controller.close()
        } catch (error: any) {
          console.error('Stream error:', error)
          const errorData = JSON.stringify({ error: error.message })
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Agent streaming error:', error)
    return c.json(
      {
        error: 'Failed to process streaming request',
        details: error.message,
      },
      500
    )
  }
})

// Get thread history
app.get('/agent/thread/:threadId', async (c) => {
  try {
    const threadId = c.req.param('threadId')

    const config = {
      configurable: {
        thread_id: threadId,
      },
    }

    const state = await graph.getState(config)

    return c.json({
      threadId,
      state: state.values,
      next: state.next,
    })
  } catch (error: any) {
    console.error('Get thread error:', error)
    return c.json(
      {
        error: 'Failed to retrieve thread',
        details: error.message,
      },
      500
    )
  }
})

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Alpha Agent API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      agent: {
        invoke: 'POST /agent/invoke',
        stream: 'POST /agent/stream',
        thread: 'GET /agent/thread/:threadId',
      },
      custom: '/api/*',
    },
  })
})

// Start server
export async function startServer(port: number = 2024) {
  console.log('🚀 Starting Alpha Agent Server...')
  console.log(`📦 Database initialized at ./data/alpha.db`)
  console.log(`💾 Checkpointer initialized at ./data/checkpoints.db`)

  const server = serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`✅ Server running at http://localhost:${info.port}`)
    }
  )

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...')
    server.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
  })

  return server
}

// Export app for testing or custom usage
export { app }

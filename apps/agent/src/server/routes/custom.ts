import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import type { ServerEnv } from '../types'
import { users, agentInteractions, analytics } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

const app = new Hono<ServerEnv>()

// ==================== User Management ====================

// Create user schema
const createUserSchema = z.object({
  walletAddress: z.string().min(1),
  email: z.string().email().optional(),
})

// Create a new user
app.post('/users', zValidator('json', createUserSchema), async (c) => {
  try {
    const db = c.get('db')
    const { walletAddress, email } = c.req.valid('json')

    const newUser = {
      id: uuidv4(),
      walletAddress,
      email: email || null,
    }

    await db.insert(users).values(newUser)

    return c.json({ success: true, user: newUser }, 201)
  } catch (error: any) {
    console.error('Create user error:', error)
    return c.json({ error: 'Failed to create user', details: error.message }, 500)
  }
})

// Get user by wallet address
app.get('/users/:walletAddress', async (c) => {
  try {
    const db = c.get('db')
    const walletAddress = c.req.param('walletAddress')

    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1)

    if (!user || user.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ success: true, user: user[0] })
  } catch (error: any) {
    console.error('Get user error:', error)
    return c.json({ error: 'Failed to retrieve user', details: error.message }, 500)
  }
})

// List all users
app.get('/users', async (c) => {
  try {
    const db = c.get('db')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')

    const allUsers = await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt))

    return c.json({ success: true, users: allUsers, limit, offset })
  } catch (error: any) {
    console.error('List users error:', error)
    return c.json({ error: 'Failed to list users', details: error.message }, 500)
  }
})

// ==================== Agent Interactions ====================

// Create interaction schema
const createInteractionSchema = z.object({
  threadId: z.string(),
  userId: z.string().optional(),
  input: z.string(),
  output: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// Log an agent interaction
app.post('/interactions', zValidator('json', createInteractionSchema), async (c) => {
  try {
    const db = c.get('db')
    const data = c.req.valid('json')

    const newInteraction = {
      id: uuidv4(),
      ...data,
      userId: data.userId || null,
      output: data.output || null,
      metadata: data.metadata || null,
    }

    await db.insert(agentInteractions).values(newInteraction)

    return c.json({ success: true, interaction: newInteraction }, 201)
  } catch (error: any) {
    console.error('Create interaction error:', error)
    return c.json({ error: 'Failed to log interaction', details: error.message }, 500)
  }
})

// Get interactions by thread ID
app.get('/interactions/thread/:threadId', async (c) => {
  try {
    const db = c.get('db')
    const threadId = c.req.param('threadId')

    const interactions = await db
      .select()
      .from(agentInteractions)
      .where(eq(agentInteractions.threadId, threadId))
      .orderBy(desc(agentInteractions.createdAt))

    return c.json({ success: true, interactions })
  } catch (error: any) {
    console.error('Get interactions error:', error)
    return c.json({ error: 'Failed to retrieve interactions', details: error.message }, 500)
  }
})

// Get interactions by user ID
app.get('/interactions/user/:userId', async (c) => {
  try {
    const db = c.get('db')
    const userId = c.req.param('userId')
    const limit = parseInt(c.req.query('limit') || '50')

    const interactions = await db
      .select()
      .from(agentInteractions)
      .where(eq(agentInteractions.userId, userId))
      .limit(limit)
      .orderBy(desc(agentInteractions.createdAt))

    return c.json({ success: true, interactions })
  } catch (error: any) {
    console.error('Get user interactions error:', error)
    return c.json({ error: 'Failed to retrieve user interactions', details: error.message }, 500)
  }
})

// ==================== Analytics ====================

// Create analytics event schema
const createAnalyticsSchema = z.object({
  eventType: z.string(),
  userId: z.string().optional(),
  data: z.record(z.any()).optional(),
})

// Log an analytics event
app.post('/analytics', zValidator('json', createAnalyticsSchema), async (c) => {
  try {
    const db = c.get('db')
    const eventData = c.req.valid('json')

    const newEvent = {
      id: uuidv4(),
      ...eventData,
      userId: eventData.userId || null,
      data: eventData.data || null,
    }

    await db.insert(analytics).values(newEvent)

    return c.json({ success: true, event: newEvent }, 201)
  } catch (error: any) {
    console.error('Create analytics error:', error)
    return c.json({ error: 'Failed to log analytics', details: error.message }, 500)
  }
})

// Get analytics by event type
app.get('/analytics/:eventType', async (c) => {
  try {
    const db = c.get('db')
    const eventType = c.req.param('eventType')
    const limit = parseInt(c.req.query('limit') || '100')

    const events = await db
      .select()
      .from(analytics)
      .where(eq(analytics.eventType, eventType))
      .limit(limit)
      .orderBy(desc(analytics.createdAt))

    return c.json({ success: true, events, count: events.length })
  } catch (error: any) {
    console.error('Get analytics error:', error)
    return c.json({ error: 'Failed to retrieve analytics', details: error.message }, 500)
  }
})

// ==================== Custom Example Endpoints ====================

// Example: Get statistics
app.get('/stats', async (c) => {
  try {
    const db = c.get('db')

    // Count total users
    const totalUsers = await db.select().from(users)

    // Count total interactions
    const totalInteractions = await db.select().from(agentInteractions)

    // Count total analytics events
    const totalEvents = await db.select().from(analytics)

    return c.json({
      success: true,
      stats: {
        totalUsers: totalUsers.length,
        totalInteractions: totalInteractions.length,
        totalEvents: totalEvents.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Get stats error:', error)
    return c.json({ error: 'Failed to retrieve stats', details: error.message }, 500)
  }
})

export default app

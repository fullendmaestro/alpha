/**
 * API client for the Hpulse Agent Express Server
 */

// Types matching the server API
export interface Session {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, unknown>
}

export interface Message {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface ChatRequest {
  sessionId?: string
  message: string
  network?: string
}

export interface ChatResponse {
  sessionId: string
  messageId: string
  response: string
  toolsUsed?: {
    name: string
    success: boolean
  }[]
}

export interface SessionResponse {
  session: Session
  messageCount?: number
  lastMessage?: Message
}

export interface SessionListResponse {
  sessions: SessionResponse[]
  total: number
}

export interface MessageListResponse {
  messages: Message[]
  total: number
  page: number
  limit: number
}

export interface AgentStatusResponse {
  status: 'ready' | 'processing' | 'error'
  version: string
  uptime: number
  currentSessions: number
  totalMessages: number
  toolsAvailable: string[]
  supportedNetworks: string[]
}

export interface CreateSessionRequest {
  title?: string
}

export interface UpdateSessionRequest {
  title?: string
}

/**
 * Hpulse Agent API Client
 */
export class HpulseAgentAPI {
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Health check
   */
  async health(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`)
    if (!response.ok) throw new Error('Health check failed')
    return response.json()
  }

  /**
   * Get agent status
   */
  async getStatus(): Promise<AgentStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/status`)
    if (!response.ok) throw new Error('Failed to fetch agent status')
    return response.json()
  }

  /**
   * Send a chat message
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send message' }))
      throw new Error(error.message || 'Failed to send message')
    }

    return response.json()
  }

  /**
   * Get messages for a session
   */
  async getMessages(
    sessionId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessageListResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/chat/${sessionId}/messages?page=${page}&limit=${limit}`
    )

    if (!response.ok) throw new Error('Failed to fetch messages')
    return response.json()
  }

  /**
   * List all sessions
   */
  async listSessions(page: number = 1, limit: number = 50): Promise<SessionListResponse> {
    const response = await fetch(`${this.baseUrl}/api/sessions?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch sessions')
    return response.json()
  }

  /**
   * Get a session by ID
   */
  async getSession(id: string): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`)
    if (!response.ok) throw new Error('Failed to fetch session')
    return response.json()
  }

  /**
   * Create a new session
   */
  async createSession(request: CreateSessionRequest = {}): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) throw new Error('Failed to create session')
    return response.json()
  }

  /**
   * Update a session
   */
  async updateSession(id: string, request: UpdateSessionRequest): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) throw new Error('Failed to update session')
    return response.json()
  }

  /**
   * Delete a session
   */
  async deleteSession(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete session')
  }
}

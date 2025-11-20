/**
 * Conversation and state management types for the Alpha Host Agent
 */

import { Message, Task } from '@a2a-js/sdk'

export interface Conversation {
  conversation_id: string
  is_active: boolean
  name?: string
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

export interface MessageInfo {
  message_id: string
  context_id: string
}

export interface JSONRPCMessage {
  jsonrpc: '2.0'
  id?: string | number | null
}

export interface JSONRPCRequest extends JSONRPCMessage {
  method: string
  params?: any
}

export interface JSONRPCError {
  code: number
  message: string
  data?: any
}

export interface JSONRPCResponse extends JSONRPCMessage {
  result?: any
  error?: JSONRPCError
}

// Specific request/response types
export interface SendMessageRequest extends JSONRPCRequest {
  method: 'message/send'
  params: Message
}

export interface SendMessageResponse extends JSONRPCResponse {
  result?: Message | MessageInfo
}

export interface CreateConversationRequest extends JSONRPCRequest {
  method: 'conversation/create'
}

export interface CreateConversationResponse extends JSONRPCResponse {
  result?: Conversation
}

export interface ListConversationRequest extends JSONRPCRequest {
  method: 'conversation/list'
}

export interface ListConversationResponse extends JSONRPCResponse {
  result?: Conversation[]
}

export interface ListMessageRequest extends JSONRPCRequest {
  method: 'message/list'
  params: string // conversation_id
}

export interface ListMessageResponse extends JSONRPCResponse {
  result?: Message[]
}

export interface PendingMessageRequest extends JSONRPCRequest {
  method: 'message/pending'
}

export interface PendingMessageResponse extends JSONRPCResponse {
  result?: Array<[string, string]> // [message_id, context_id]
}

export interface GetEventRequest extends JSONRPCRequest {
  method: 'events/get'
}

export interface GetEventResponse extends JSONRPCResponse {
  result?: Event[]
}

export interface ListTaskRequest extends JSONRPCRequest {
  method: 'task/list'
}

export interface ListTaskResponse extends JSONRPCResponse {
  result?: Task[]
}

export interface RegisterAgentRequest extends JSONRPCRequest {
  method: 'agent/register'
  params?: string // agent URL
}

export interface RegisterAgentResponse extends JSONRPCResponse {
  result?: string
}

export interface ListAgentRequest extends JSONRPCRequest {
  method: 'agent/list'
}

export interface AgentInfo {
  name: string
  url: string
  registered_at: string
}

export interface ListAgentResponse extends JSONRPCResponse {
  result?: AgentInfo[]
}

export interface UpdateApiKeyRequest {
  api_key: string
}

export interface UpdateApiKeyResponse {
  status: 'success' | 'error'
  message?: string
}

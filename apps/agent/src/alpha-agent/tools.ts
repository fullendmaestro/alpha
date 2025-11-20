import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'

// MCP Client for Hedera tools
const client = new MultiServerMCPClient({
  mcpServers: {
    Hedera: {
      command: 'node',
      args: ['/home/fullendmaestro/alpha/apps/agentkit-mcp/dist/index.js'],
      env: {
        HEDERA_OPERATOR_ID: '0.0.6496803',
        HEDERA_OPERATOR_KEY:
          '3030020100300706052b8104000a04220420d0d11ed62b5f0980ddb8265deafdb77cf3b511ada797cb17e27b110b47c0d2d1',
      },
    },
  },
})

// Host agent tools for managing remote agents
const listRemoteAgentsTool = tool(
  async () => {
    // This will be dynamically bound to the executor instance
    // For now, return empty array - will be populated by executor context
    return JSON.stringify([])
  },
  {
    name: 'list_remote_agents',
    description: 'List the available remote agents you can use to delegate tasks.',
    schema: z.object({}),
  }
)

const sendMessageTool = tool(
  async ({ agentName, message }: { agentName: string; message: string }) => {
    // This will be dynamically bound to the executor instance
    // Placeholder implementation - will be overridden by executor
    return `Would send "${message}" to agent ${agentName}`
  },
  {
    name: 'send_message',
    description:
      'Sends a message to a remote agent. Use this to delegate tasks to specialized agents.',
    schema: z.object({
      agentName: z.string().describe('The name of the remote agent to send the message to'),
      message: z.string().describe('The message/task to send to the remote agent'),
    }),
  }
)

const TOOLS: any[] = [listRemoteAgentsTool, sendMessageTool]

// Load MCP tools asynchronously
;(async () => {
  try {
    const MCPTools = await client.getTools()
    TOOLS.push(...MCPTools)
    console.log(`✓ Loaded ${MCPTools.length} MCP tools`)
  } catch (error) {
    console.warn('Failed to load MCP tools:', error)
  }
})()

export { TOOLS, listRemoteAgentsTool, sendMessageTool }

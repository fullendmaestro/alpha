import { MultiServerMCPClient } from '@langchain/mcp-adapters'

const client = new MultiServerMCPClient({
  mcpServers: {
    sei: {
      command: 'node',
      args: ['C:\\Users\\fullendmaestro\\Desktop\\alpha\\apps\\agentkit-mcp\\dist\\index.js'],
      env: {
        HEDERA_OPERATOR_ID: '0.0.6496803',
        HEDERA_OPERATOR_KEY:
          '3030020100300706052b8104000a04220420d0d11ed62b5f0980ddb8265deafdb77cf3b511ada797cb17e27b110b47c0d2d1',
      },
    },
  },
})

const TOOLS: any[] = []

;(async () => {
  try {
    const seiMCPTools = await client.getTools()
    TOOLS.push(...seiMCPTools)
  } catch (error) {}
})()

export { TOOLS }

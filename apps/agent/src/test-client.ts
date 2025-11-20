/**
 * Simple test client to interact with the Alpha Host Agent
 *
 * Usage:
 *   pnpm tsx src/test-client.ts
 */

import 'dotenv/config'
import { A2AClient } from '@a2a-js/sdk/client'
import { v4 as uuidv4 } from 'uuid'

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:2024'

async function main() {
  console.log(`🔌 Connecting to Alpha Host Agent at ${AGENT_URL}\n`)

  const client = new A2AClient(AGENT_URL)

  try {
    // 1. Get Agent Card
    console.log('📋 Fetching agent card...')
    const card = await client.getAgentCard()
    console.log(`✓ Agent: ${card.name} v${card.version}`)
    console.log(`  Description: ${card.description}\n`)

    // 2. Send a simple message
    console.log('💬 Sending message: "List available agents"\n')

    const message = {
      messageId: uuidv4(),
      kind: 'message' as const,
      role: 'user' as const,
      parts: [
        {
          kind: 'text' as const,
          text: 'List available agents',
        },
      ],
    }

    // Test streaming
    console.log('📡 Streaming response...\n')
    const stream = client.sendMessageStream({ message })

    for await (const event of stream) {
      if (event.kind === 'status-update') {
        const statusEvent = event as any
        console.log(
          `[${statusEvent.status.state}] ${statusEvent.status.message?.parts[0]?.text || ''}`
        )
      } else if (event.kind === 'task') {
        console.log(`[Task] ${event.id} - ${event.status.state}`)
      } else if (event.kind === 'message') {
        const textPart = event.parts.find((p: any) => p.kind === 'text') as any
        console.log(`[Message] ${textPart?.text || ''}`)
      }
    }

    console.log('\n✓ Test completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()

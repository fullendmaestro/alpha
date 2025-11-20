import { AgentCard } from '@a2a-js/sdk'

export const alpaAgentCard: AgentCard = {
  name: 'Alpha Host Agent',
  version: '1.2.0',
  protocolVersion: '1.1.0',
  description:
    'Alpha Host Agent — an intelligent A2A orchestrator that coordinates multiple specialized agents. Integrates with the Hedera ecosystem and supports agent-to-agent communication via ERC-8004.',
  url: 'http://localhost:2024',
  provider: {
    organization: 'Alpha',
    url: 'https://alpha.example.com',
  },
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: true,
  },
  securitySchemes: {
    apiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'Optional API key for authenticated endpoints (development only).',
    },
  },
  security: [{ apiKey: [] }],
  defaultInputModes: ['text'],
  defaultOutputModes: ['text', 'file'],
  skills: [
    {
      id: 'agent_orchestration',
      name: 'Agent Orchestration',
      description: 'Coordinate and delegate tasks to multiple specialized AI agents',
      tags: ['orchestration', 'delegation', 'coordination'],
      examples: [
        'List available agents',
        'Delegate a task to a specific agent',
        'Coordinate tasks across multiple agents',
      ],
      inputModes: ['text'],
      outputModes: ['text'],
    },
    {
      id: 'hedera_integration',
      name: 'Hedera Blockchain Integration',
      description: 'Interact with Hedera network for blockchain operations',
      tags: ['hedera', 'blockchain', 'web3'],
      examples: ['Create a Hedera account', 'Transfer HBAR', 'Deploy smart contracts'],
      inputModes: ['text'],
      outputModes: ['text', 'file'],
    },
  ],
  supportsAuthenticatedExtendedCard: false,
}

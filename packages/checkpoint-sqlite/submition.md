---
title: Alpha — Hackathon Submission
---

# Aim

Alpha provides an AI-powered wallet and a decentralized context protocol on Hedera, enabling AI agents to discover, understand, and interact with dApp protocols securely and automatically.

_(Goal: keep the Aim concise — meets the hackathon 256-character limit.)_

## Introduction

Alpha brings an integrated AI assistant wallet and a standardized Context Protocol to the Hedera ecosystem. By registering protocol context (contracts, services, and metadata), Alpha enables local AI agents to resolve intent-to-action flows and interact with complex dApp stacks reliably.

## Problem

- Dapp users want seamless, safe automation for common tasks (transfers, swaps, multi-step contract interactions) without exposing keys or relying on centralized services.
- AI agents lack reliable, structured context to interact correctly with multi-contract protocols, so actions can be incomplete or unsafe.
- Developers face high integration costs and brittle UX when exposing protocol surfaces to automated agents.

## Alpha Solution

### 1) AI Agent Wallet

An AI-powered Chrome extension wallet that runs a local agent (LangGraph integration) to interpret natural language intent, suggest actions, and orchestrate multi-contract flows while keeping keys under user control.

Features:

- Natural-language transactions (send, swap, execute flows)
- Intent validation and user confirmation flows
- Local agent + extension architecture (no external secret exfiltration)

### 2) Alpha Context Protocol

A decentralized registry on Hedera where dApp developers register their protocol's context: contracts, services, APIs, event hooks, and recommended interaction patterns. AI agents query this registry to build complete, safe execution plans.

Key properties:

- Deployed on Hedera Contract Service using Solidity
- ENS-like architecture: each protocol is its own deployed contract
- Standardized JSON context format for protocol metadata
- Versioning & capability-based discovery
- Registration fees and expiration system to prevent spam
- Batch query resolver for efficient AI agent discovery

Smart Contracts:

- **AlphaRegistry**: Central registry mapping protocol names to contracts
- **AlphaProtocol**: Individual protocol contract (deployed per protocol)
- **AlphaRegistrar**: Manages protocol registration and deployment
- **AlphaResolver**: Helper for batch queries and discovery

## Architecture & How it works

### Contract Architecture (ENS-like)

1. **AlphaRegistry**: Central registry contract (like ENS Registry)

   - Maps protocol names to contract addresses (name → address)
   - Manages protocol ownership
   - Emits events for protocol lifecycle

2. **AlphaRegistrar**: Registration manager (like ENS Registrar)

   - Deploys new AlphaProtocol contracts
   - Handles registration fees and expiration
   - Prevents spam with economic incentives

3. **AlphaProtocol**: Individual protocol contract (one per protocol)

   - Stores protocol metadata (name, version, description)
   - Lists associated contract addresses
   - Lists service URLs and API endpoints
   - Defines capabilities (swap, stake, etc.)
   - Stores full context JSON for AI consumption

4. **AlphaResolver**: Query helper (like ENS Resolver)
   - Batch queries for multiple protocols
   - Search by capability
   - Find protocols by contract address
   - Registry statistics

### Workflow

1. **Protocol Registration** — Developer deploys protocol via AlphaRegistrar:

   ```typescript
   // Register using SDK
   const { protocolAddress } = await sdk.registerProtocol(
     "MyDeFiProtocol",
     "1.0.0",
     "A DeFi protocol",
     365 * 24 * 60 * 60 // 1 year
   );
   ```

2. **Protocol Configuration** — Developer adds contracts, services, capabilities:

   ```typescript
   const protocol = sdk.getProtocolContract(protocolAddress);
   await protocol.addContract("0x123..."); // DEX contract
   await protocol.addService("https://api.mydex.com");
   await protocol.addCapability("swap");
   await protocol.updateContext(JSON.stringify(fullContext));
   ```

3. **Agent Discovery** — AI agent queries registry for protocols:

   ```typescript
   // In LangGraph agent
   const protocols = await sdk.searchByCapability("swap");
   const protocol = await sdk.getProtocol("MyDeFiProtocol");
   const context = JSON.parse(protocol.contextJson);
   ```

4. **Plan Generation** — Agent uses context to build execution plan:

   - Parse protocol flows and required steps
   - Validate user has necessary tokens/permissions
   - Build transaction sequence

5. **User Execution** — Wallet prompts user for approval:
   - Show transaction details and gas estimates
   - User signs transactions
   - Agent monitors execution and outcomes

## Example (protocol registration)

### Via TypeScript SDK

```typescript
import { AlphaSDK } from "./alpha-sdk";
import { ethers } from "ethers";

// Initialize SDK
const provider = new ethers.JsonRpcProvider("https://testnet.hashio.io/api");
const wallet = new ethers.Wallet(privateKey, provider);

const sdk = new AlphaSDK(
  provider,
  REGISTRY_ADDRESS,
  REGISTRAR_ADDRESS,
  RESOLVER_ADDRESS,
  wallet
);

// Register protocol
const { protocolAddress } = await sdk.registerProtocol(
  "MyDeFiProtocol",
  "1.0.0",
  "A decentralized exchange on Hedera",
  365 * 24 * 60 * 60 // 1 year
);

// Configure protocol
const protocol = sdk.getProtocolContract(protocolAddress);
await protocol.addContract("0.0.12345"); // DEX contract
await protocol.addService("https://api.mydefi.example");
await protocol.addCapability("swap");

// Set full context for AI agents
const context = {
  name: "MyDeFiProtocol",
  version: "1.0.0",
  flows: [
    {
      id: "swap-and-stake",
      steps: [
        { action: "approve", contract: "token", method: "approve" },
        { action: "swap", contract: "dex", method: "swap" },
        { action: "stake", contract: "staking", method: "stake" },
      ],
    },
  ],
};
await protocol.updateContext(JSON.stringify(context));
```

### Via Solidity Script

```solidity
// Deploy using Forge
forge script script/RegisterExampleProtocol.s.sol \
  --rpc-url testnet \
  --broadcast
```

## Deliverables

- GitHub repository: https://github.com/fullendmaestro/alpha
- Chrome extension (source & build scripts) in `apps/extension`
- Agent & server: `apps/agent` (LangGraph wiring)
- README, setup guides, and a short demo video (linked in repo)

## Demo & Links

- Repo & code: https://github.com/fullendmaestro/alpha
- Pitch deck & demo video links included in the repo README

## Roadmap & Next Steps

- Short term (0–3 months): polish extension UX, register sample protocols, end-to-end demos on Hedera Testnet.
- Mid term (3–9 months): protocol discovery tooling, delegation & trust metadata, developer SDKs, audits.
- Long term (9–18 months): integrations with marketplaces, on-chain verifiable context, cross-chain context adapters.

## Team & Contact

- Maintainer / Lead: fullendmaestro — GitHub: https://github.com/fullendmaestro
- Contact: see repo README for more details

## Evaluation Metrics

- Successful end-to-end demo on Hedera Testnet (agent plans and executed flows)
- Developer adoption: N registered protocols in registry
- UX metrics: transaction completion rate and user approval rate

---

_If you'd like, I can also produce a condensed one-page pitch from this file, or auto-generate the context JSON schema used by the Alpha registry._

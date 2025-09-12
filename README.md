Medical records
Medical profile

# Hoova

Healthcare providers today maintain patient records individually, leading to fragmented and siloed data. Hoova is a protocol, powered by Hedera Hashgraph, that defines how health records should be securely and efficiently shared across healthcare organizations. By leveraging decentralized technology, Hoova enables hospitals to maintain records publicly while ensuring that only patients who own those records can access and share them with authorized providers as needed using their blockchain private keys.

## App Model Overview

Hoova is architected as a modular protocol with the following main components:

- **Frontend (Web App):**

  - Built with React/Next.js, provides user interfaces for patients, providers, and hospitals.
  - Integrates with blockchain via wallet connections and APIs.

- **Backend/Agents:**

  - Node.js/TypeScript agents coordinate data flow, AI assistant logic, and blockchain interactions.
  - Handles secure record sharing, access control, and smart contract calls.

- **Smart Contracts:**

  - Deployed on Hedera Hashgraph or EVM-compatible chains.
  - Manage record ownership, access grants, and audit trails.
  - Interact with frontend/backend via defined types and transaction schemas.

# Hoova as a Healthcare Protocol

Hoova standardizes the sharing of patient records in a decentralized manner. Patients control their data and can share records securely with authorized providers. All interactions are modeled using shared TypeScript types for reliability and security.

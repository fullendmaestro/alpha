const stored = {
  app: {
    authenticated: false,
    passwordKeyContent: null,
    authenticating: false,
    onBoarded: false,
    selected_network_slug: 'hedera-testnet',
    networks: [
      {
        id: 'hedera-testnet',
        nameSlug: 'hedera-testnet',
        name: 'Hedera Testnet',
        chainId: '296',
        rpcUrl: 'https://testnet.hashio.io/api',
        mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
        nativeCurrency: { name: 'HBAR', symbol: 'HBAR', decimals: 8 },
        logoURL: 'https://cryptologos.cc/logos/hedera-hbar-logo.svg',
        explorerUrl: 'https://hashscan.io/testnet',
      },
    ],
    langgraphConfig: {
      apiUrl: 'http://localhost:2024',
      assistantId: 'agent',
      threadId: 'ce796433-601a-4c5e-95a3-dfa4ce0a2d02',
      apiKey: null,
      hideToolCalls: false,
    },
  },
  settings: {
    baseCurrency: 'USD',
    autoLockTimeOut: 10,
    hidePortfolioBalances: false,
    openAsSidePanel: false,
    theme: 'dark',
  },
  wallet: { selectedWalletSlug: 'all', wallets: [] },
  _persist: { version: -1, rehydrated: true },
}

/**
 * Hedera Network Configuration
 * Supporting Hedera Testnet for development
 */

export interface HederaNetwork {
  id: string
  nameSlug: string
  name: string
  chainId: string
  rpcUrl: string
  mirrorNodeUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  logoURL: string
  explorerUrl: string
}

export const hederaTestnet: HederaNetwork = {
  id: 'hedera-testnet',
  nameSlug: 'hedera-testnet',
  name: 'Hedera Testnet',
  chainId: '296', // Hedera testnet chain ID
  rpcUrl: 'https://testnet.hashio.io/api',
  mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 8, // HBAR uses 8 decimals (tinybars)
  },
  logoURL: 'https://cryptologos.cc/logos/hedera-hbar-logo.svg',
  explorerUrl: 'https://hashscan.io/testnet',
}

// Array of supported Hedera networks (currently only testnet)
export const hederaNetworks: HederaNetwork[] = [hederaTestnet]

// Default network
export const defaultNetwork = hederaTestnet

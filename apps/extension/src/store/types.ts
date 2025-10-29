// Redux store types for the Alpha extension
import type { HederaNetwork } from '@/constants/networks'

export type AppTheme = 'dark' | 'light' | 'system'

export interface AppState {
  authenticated: boolean
  selected_network_slug: string
  authenticating: boolean
  passwordKeyContent: string | null
  onBoarded: boolean
  networks: HederaNetwork[]
  langgraphConfig: {
    apiUrl: string
    assistantId: string
    threadId: string | null
    apiKey: string | null
    hideToolCalls: boolean
  }
}

export interface AuthenticatePayload {
  authenticated: boolean
}

export interface SettingsState {
  autoLockTimeOut: number
  hidePortfolioBalances: boolean
  openAsSidePanel: boolean
  baseCurrency: string
  theme: AppTheme
}

// Base token interface for Hedera
export interface BaseToken {
  id: string
  name: string
  symbol: string
  decimals: number
  balance: string
  current_price?: number
  price_change_24h?: number
  logoUrl?: string
}

// Hedera HTS token (Hedera Token Service)
export interface HederaToken extends BaseToken {
  tokenId: string // Hedera token ID (e.g., 0.0.12345)
  networkSlug: string // which Hedera network this token belongs to
  tokenType: 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE'
  isNative?: false
}

// Native HBAR token
export interface HbarToken extends BaseToken {
  networkSlug: string
  isNative: true
}

// NFT asset (HTS NFT)
export interface HederaNFT {
  id: string
  name: string
  symbol: string
  serialNumber: string
  tokenId: string // Hedera token ID
  networkSlug: string
  owner: string
  logoUrl?: string
  metadata?: string
}

// Network balance summary
export interface NetworkBalance {
  networkSlug: string
  nativeToken: HbarToken
  htsTokens: HederaToken[] // Hedera Token Service tokens
  nftAssets: HederaNFT[]
  totalBalance: string // Total USD value for this network
}

export interface Wallet {
  id: string
  name: string
  publicKey: string
  privateKey: string // Note: Should be encrypted in production
  accountId: string // Hedera account ID (e.g., 0.0.12345)

  // Network-specific balances
  networkBalances: Record<string, NetworkBalance> // key is networkSlug

  // Aggregated total balance across all networks
  totalBalance: string
}

export interface WalletState {
  selectedWalletSlug: string | 'all'
  wallets: Wallet[]
}

export interface RootState {
  app: AppState
  settings: SettingsState
  wallet: WalletState
}

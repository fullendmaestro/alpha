import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WalletState, Wallet, NetworkBalance } from '../types'
import { hederaNetworks } from '@/constants/networks'

const initialState: WalletState = {
  selectedWalletSlug: 'all',
  wallets: [],
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // Wallet management
    addWallet: (state, action: PayloadAction<Wallet>) => {
      const wallet = action.payload

      // Initialize networkBalances with all Hedera networks and their native HBAR
      if (!wallet.networkBalances) {
        wallet.networkBalances = {}
      }

      // Add all networks with zero balance HBAR
      hederaNetworks.forEach((network) => {
        if (!wallet.networkBalances[network.nameSlug]) {
          wallet.networkBalances[network.nameSlug] = {
            networkSlug: network.nameSlug,
            nativeToken: {
              id: `${network.nameSlug}-hbar`,
              name: network.nativeCurrency.name,
              symbol: network.nativeCurrency.symbol,
              decimals: network.nativeCurrency.decimals,
              balance: '0',
              networkSlug: network.nameSlug,
              isNative: true,
              logoUrl: network.logoURL,
              current_price: 0,
              price_change_24h: 0,
            },
            htsTokens: [],
            nftAssets: [],
            totalBalance: '0',
          }
        }
      })

      // Initialize totalBalance if not provided
      if (!wallet.totalBalance) {
        wallet.totalBalance = '0'
      }

      state.wallets.push(wallet)

      // If this is the first wallet, select it
      if (state.wallets.length === 1) {
        state.selectedWalletSlug = wallet.id
      }
    },

    removeWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter((wallet) => wallet.id !== action.payload)
      // If we removed the selected wallet, reset to 'all'
      if (state.selectedWalletSlug === action.payload) {
        state.selectedWalletSlug = state.wallets.length > 0 ? state.wallets[0].id : 'all'
      }
    },

    setSelectedWallet: (state, action: PayloadAction<string>) => {
      state.selectedWalletSlug = action.payload
    },

    // Update network balance for a specific wallet and network
    updateNetworkBalance: (
      state,
      action: PayloadAction<{
        walletId: string
        networkSlug: string
        networkBalance: NetworkBalance
      }>
    ) => {
      const { walletId, networkSlug, networkBalance } = action.payload
      const wallet = state.wallets.find((w) => w.id === walletId)

      if (wallet) {
        wallet.networkBalances[networkSlug] = networkBalance

        // Recalculate total balance across all networks
        wallet.totalBalance = Object.values(wallet.networkBalances)
          .reduce((total, network) => {
            const networkTotal = parseFloat(network.totalBalance || '0')
            return total + networkTotal
          }, 0)
          .toFixed(2)
      }
    },

    // Update multiple network balances at once
    updateWalletBalances: (
      state,
      action: PayloadAction<{
        walletId: string
        networkBalances: Record<string, NetworkBalance>
      }>
    ) => {
      const { walletId, networkBalances } = action.payload
      const wallet = state.wallets.find((w) => w.id === walletId)

      if (wallet) {
        wallet.networkBalances = networkBalances

        // Recalculate total balance
        wallet.totalBalance = Object.values(networkBalances)
          .reduce((total, network) => {
            const networkTotal = parseFloat(network.totalBalance || '0')
            return total + networkTotal
          }, 0)
          .toFixed(2)
      }
    },
  },
})

export const {
  addWallet,
  removeWallet,
  setSelectedWallet,
  updateNetworkBalance,
  updateWalletBalances,
} = walletSlice.actions

export default walletSlice.reducer

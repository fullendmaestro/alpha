import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateWalletBalances } from '@/lib/hedera/balance-service'

/**
 * Hook to automatically fetch and update wallet balances
 */
export function useFetchWalletBalances() {
  const dispatch = useAppDispatch()
  const wallets = useAppSelector((state) => state.wallet.wallets)

  useEffect(() => {
    // Fetch balances for all wallets
    const fetchAllBalances = async () => {
      console.log(
        'useFetchWalletBalances - Starting to fetch balances for',
        wallets.length,
        'wallets'
      )
      for (const wallet of wallets) {
        try {
          console.log(
            'useFetchWalletBalances - Fetching balance for wallet:',
            wallet.id,
            wallet.accountId
          )
          await updateWalletBalances(wallet.id, wallet.privateKey, wallet.accountId, dispatch)
          console.log(
            'useFetchWalletBalances - Successfully fetched balance for wallet:',
            wallet.id
          )
        } catch (error) {
          console.error(`Error fetching balance for wallet ${wallet.id}:`, error)
        }
      }
    }

    if (wallets.length > 0) {
      console.log('useFetchWalletBalances - Found wallets, fetching balances...')
      fetchAllBalances()

      // Set up periodic refresh (every 30 seconds)
      const interval = setInterval(fetchAllBalances, 30000)

      return () => clearInterval(interval)
    } else {
      console.log('useFetchWalletBalances - No wallets found')
    }
  }, [wallets, dispatch])
}

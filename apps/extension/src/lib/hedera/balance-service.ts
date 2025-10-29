import { createHederaClient, type AccountBalance } from './client'
import { PrivateKeySoftwareWallet } from './wallet/software-private-key'
import type { NetworkBalance, HbarToken, HederaToken } from '@/store/types'
import { fetchHbarPrice, fetchHbarPriceChange } from './price-service'

/**
 * Fetches token info from Hedera network
 */
async function fetchTokenInfo(
  client: any,
  tokenId: string
): Promise<{ name: string; symbol: string; decimals: number } | null> {
  try {
    const { Hbar, TokenInfoQuery } = await import('@hashgraph/sdk')
    const tokenInfo = await new TokenInfoQuery()
      .setTokenId(tokenId)
      .setMaxQueryPayment(new Hbar(2))
      .execute(client)

    return {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      decimals: tokenInfo.decimals,
    }
  } catch (error) {
    console.error(`Error fetching token info for ${tokenId}:`, error)
    return null
  }
}

/**
 * Fetches the balance for a Hedera wallet
 */
export async function fetchWalletBalance(
  privateKeyString: string,
  accountIdString: string,
  network: 'mainnet' | 'testnet' | 'previewnet',
  networkSlug: string
): Promise<NetworkBalance | null> {
  console.log('fetchWalletBalance - Starting fetch for account:', accountIdString, 'on', network)
  try {
    const { PrivateKey, AccountId } = await import('@hashgraph/sdk')

    // Create wallet and client
    const privateKey = PrivateKey.fromString(privateKeyString)
    const accountId = AccountId.fromString(accountIdString)
    const wallet = new PrivateKeySoftwareWallet(privateKey)

    console.log('fetchWalletBalance - Creating Hedera client...')
    const client = await createHederaClient({
      network,
      wallet,
      keyIndex: 0,
      accountId,
    })

    if (!client) {
      console.error('fetchWalletBalance - Failed to create Hedera client')
      return null
    }

    console.log('fetchWalletBalance - Fetching account balance...')
    // Fetch balance
    const balance: AccountBalance = await client.getAccountBalance()
    console.log('fetchWalletBalance - Raw balance:', balance)

    // Parse HBAR balance
    const hbarBalance = parseFloat(balance.hbars)
    console.log('fetchWalletBalance - HBAR balance:', hbarBalance)

    // Fetch HBAR price from CoinGecko
    console.log('fetchWalletBalance - Fetching HBAR price...')
    const hbarPrice = await fetchHbarPrice()
    const priceChange24h = await fetchHbarPriceChange()
    console.log('fetchWalletBalance - HBAR price:', hbarPrice, 'Change 24h:', priceChange24h)

    const nativeToken: HbarToken = {
      id: `${networkSlug}-hbar`,
      name: 'Hedera',
      symbol: 'HBAR',
      decimals: 8,
      balance: hbarBalance.toFixed(8),
      networkSlug,
      isNative: true,
      current_price: hbarPrice,
      price_change_24h: priceChange24h,
      logoUrl: chrome.runtime.getURL('assets/hedera-hashgraph-logo.svg'),
    }

    console.log('fetchWalletBalance - Native token:', nativeToken)

    // Parse HTS tokens and fetch their info
    const htsTokens: HederaToken[] = []
    const sdkClient = client.getClient() // Get the underlying SDK client

    console.log('fetchWalletBalance - Token count:', balance.tokens.size)
    for (const [tokenId, tokenBalance] of balance.tokens.entries()) {
      console.log('fetchWalletBalance - Processing token:', tokenId, tokenBalance)
      try {
        // Fetch token info from network for name and symbol
        const tokenInfo = await fetchTokenInfo(sdkClient, tokenId)

        if (tokenInfo) {
          // Use the balance and decimals from the tokenBalance (already processed in client)
          const htsToken: HederaToken = {
            id: `${networkSlug}-${tokenId}`,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            decimals: tokenBalance.decimals,
            balance: tokenBalance.balance, // Already formatted with decimals applied
            tokenId: tokenId,
            networkSlug,
            tokenType: 'FUNGIBLE_COMMON' as const,
            isNative: false as const,
            logoUrl: chrome.runtime.getURL('assets/img_token_gen.svg'),
          }

          console.log('fetchWalletBalance - Added HTS token:', htsToken)
          htsTokens.push(htsToken)
        }
      } catch (error) {
        console.error(`Error processing token ${tokenId}:`, error)
      }
    }

    console.log('fetchWalletBalance - Total HTS tokens:', htsTokens.length)

    // Calculate total balance in USD
    const hbarUsdValue = hbarBalance * hbarPrice
    const totalBalance = hbarUsdValue.toFixed(2)

    // Close client
    client.close()

    const result: NetworkBalance = {
      networkSlug,
      nativeToken,
      htsTokens,
      nftAssets: [],
      totalBalance,
    }

    console.log('fetchWalletBalance - Final result:', result)
    return result
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    return null
  }
}

/**
 * Hook to fetch and update wallet balances
 */
export async function updateWalletBalances(
  walletId: string,
  privateKey: string,
  accountId: string,
  dispatch: any
) {
  const { updateNetworkBalance } = await import('@/store/slices/walletSlice')

  // Fetch balance for testnet (you can extend this to other networks)
  const testnetBalance = await fetchWalletBalance(
    privateKey,
    accountId,
    'testnet',
    'hedera-testnet'
  )

  if (testnetBalance) {
    dispatch(
      updateNetworkBalance({
        walletId,
        networkSlug: 'hedera-testnet',
        networkBalance: testnetBalance,
      })
    )
  }
}

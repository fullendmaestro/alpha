/**
 * Fetches the current HBAR price from CoinGecko API
 */
export async function fetchHbarPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd&include_24hr_change=true'
    )

    if (!response.ok) {
      console.error('Failed to fetch HBAR price')
      return 0.05 // Fallback price
    }

    const data = await response.json()
    return data['hedera-hashgraph']?.usd || 0.05
  } catch (error) {
    console.error('Error fetching HBAR price:', error)
    return 0.05 // Fallback price
  }
}

/**
 * Fetches the 24h price change for HBAR
 */
export async function fetchHbarPriceChange(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd&include_24hr_change=true'
    )

    if (!response.ok) {
      return 0
    }

    const data = await response.json()
    return data['hedera-hashgraph']?.usd_24h_change || 0
  } catch (error) {
    console.error('Error fetching HBAR price change:', error)
    return 0
  }
}

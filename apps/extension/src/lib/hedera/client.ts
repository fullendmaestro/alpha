import type {
  AccountId,
  PrivateKey,
  PublicKey,
  Client,
  AccountBalance as HederaAccountBalance,
  TokenId,
} from '@hashgraph/sdk'
import { Wallet } from './wallet/abstract'

export interface AccountBalance {
  // balance in hbars
  hbars: string
  tokens: Map<string, TokenBalance>
}

export interface TokenBalance {
  // balance has already had decimals applied
  balance: string
  decimals: number
  tokenId: string
  name?: string
  symbol?: string
}

export interface SimpleHederaClient {
  // get the associated private key, if available
  getPrivateKey(): PrivateKey | null

  // get the associated public key
  getPublicKey(): PublicKey

  // get the associated account ID
  getAccountId(): AccountId

  // returns the account balance
  getAccountBalance(): Promise<AccountBalance>

  // get the underlying SDK client for advanced operations
  getClient(): Client

  // close the client
  close(): void
}

export class HederaClientImpl implements SimpleHederaClient {
  private client: Client
  private wallet: Wallet
  private keyIndex: number
  private accountId: AccountId

  constructor(client: Client, wallet: Wallet, keyIndex: number, accountId: AccountId) {
    this.client = client
    this.wallet = wallet
    this.keyIndex = keyIndex
    this.accountId = accountId
  }

  getPrivateKey(): PrivateKey | null {
    // For software wallets, private key is accessible
    try {
      const privateKey = this.wallet.getPrivateKey(this.keyIndex)
      return privateKey ? (privateKey as any) : null
    } catch {
      return null
    }
  }

  getPublicKey(): PublicKey {
    const publicKey = this.wallet.getPublicKey(this.keyIndex)
    return publicKey as any
  }

  getAccountId(): AccountId {
    return this.accountId
  }

  getClient(): Client {
    return this.client
  }

  async getAccountBalance(): Promise<AccountBalance> {
    const { AccountBalanceQuery, HbarUnit } = await import('@hashgraph/sdk')

    const query = new AccountBalanceQuery().setAccountId(this.accountId)

    const resp: HederaAccountBalance = await query.execute(this.client)

    // Convert HBAR using the SDK's built-in converter to Hbar unit
    const hbars = resp.hbars.to(HbarUnit.Hbar)

    // Convert token balances
    const tokens = new Map<string, TokenBalance>()

    // Hedera SDK returns tokens as a TokenBalanceMap
    if (resp.tokens && resp.tokens.size > 0) {
      // Iterate over the token IDs using keys()
      for (const tokenId of resp.tokens.keys()) {
        const amount = resp.tokens.get(tokenId)
        const decimals = resp.tokenDecimals?.get(tokenId) ?? 0

        if (amount) {
          // Apply decimals to the token balance
          const balanceValue = parseFloat(amount.toString()) / Math.pow(10, decimals)

          tokens.set(tokenId.toString(), {
            balance: balanceValue.toFixed(decimals),
            decimals: decimals,
            tokenId: tokenId.toString(),
          })
        }
      }
    }

    return {
      hbars: hbars.toString(),
      tokens,
    }
  }

  close(): void {
    this.client.close()
  }
}

export async function createHederaClient(options: {
  network: 'mainnet' | 'testnet' | 'previewnet'
  wallet: Wallet
  keyIndex: number
  accountId: AccountId
}): Promise<SimpleHederaClient | null> {
  const { Client } = await import('@hashgraph/sdk')

  let client: Client

  // Create client based on network
  switch (options.network) {
    case 'mainnet':
      client = Client.forMainnet()
      break
    case 'testnet':
      client = Client.forTestnet()
      break
    case 'previewnet':
      client = Client.forPreviewnet()
      break
    default:
      throw new Error(`Unknown network: ${options.network}`)
  }

  // Ping all nodes to ensure they're healthy
  await client.pingAll()

  // Get public key and transaction signer from wallet
  const publicKey = await options.wallet.getPublicKey(options.keyIndex)
  const transactionSigner = await options.wallet.getTransactionSigner(options.keyIndex)

  if (!publicKey) {
    client.close()
    return null
  }

  // Set operator with transaction signer
  client.setOperatorWith(options.accountId, publicKey, transactionSigner as any)

  // Verify the account key matches by attempting a zero-value transaction
  if (!(await testClientOperatorMatch(client))) {
    client.close()
    return null
  }

  return new HederaClientImpl(client, options.wallet, options.keyIndex, options.accountId)
}

/**
 * Tests if the operator key belongs to the operator account
 * by attempting a zero-value transaction
 */
async function testClientOperatorMatch(client: Client): Promise<boolean> {
  const { TransferTransaction, Hbar, Status } = await import('@hashgraph/sdk')

  const tx = new TransferTransaction()
    .addHbarTransfer(client.operatorAccountId!, Hbar.fromTinybars(0))
    .setMaxTransactionFee(Hbar.fromTinybars(1))

  try {
    await tx.execute(client)
  } catch (err: any) {
    // Check if the error is a StatusError
    if (err.status) {
      // If the transaction fails with Insufficient Tx Fee or Insufficient Payer Balance,
      // this means that the account ID verification succeeded before this point
      if (
        err.status === Status.InsufficientTxFee ||
        err.status === Status.InsufficientPayerBalance
      ) {
        return true
      }

      // Any other status error means the key doesn't match
      return false
    }

    // Unknown error, rethrow
    throw err
  }

  // Under no circumstances should this transaction succeed
  throw new Error('unexpected success of intentionally-erroneous transaction to confirm account ID')
}

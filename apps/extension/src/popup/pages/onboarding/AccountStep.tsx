import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Copy, CheckCircle2 } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'
import QRCode from 'react-qr-code'

const AccountStep: React.FC = () => {
  const { privateKey, setAccountId, nextStep, prevStep } = useOnboarding()
  const [accountIdText, setAccountIdText] = useState('')
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [publicKey, setPublicKey] = useState<string>('')
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  React.useEffect(() => {
    const loadPublicKey = async () => {
      if (privateKey) {
        const { PrivateKey } = await import('@hashgraph/sdk')
        const pk = PrivateKey.fromString(privateKey)
        const pubKey = pk.publicKey.toString()
        setPublicKey(pubKey)
      }
    }
    loadPublicKey()
  }, [privateKey])

  const handleCopyPublicKey = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.slice(24)) // Remove DER prefix
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsValidating(true)

    try {
      // Validate account ID format
      const { AccountId, PrivateKey } = await import('@hashgraph/sdk')
      const { createHederaClient } = await import('@/lib/hedera/client')
      const { PrivateKeySoftwareWallet } = await import('@/lib/hedera/wallet/software-private-key')

      let accountId
      try {
        accountId = AccountId.fromString(accountIdText.trim())
      } catch (err) {
        setError('Invalid account ID format. Expected format: 0.0.12345')
        setIsValidating(false)
        return
      }

      // Verify account exists and key matches
      if (privateKey) {
        const pk = PrivateKey.fromString(privateKey)
        const wallet = new PrivateKeySoftwareWallet(pk)

        try {
          // Try to create a client, which will verify the key matches the account
          const client = await createHederaClient({
            network: 'testnet', // Using testnet for now
            wallet,
            keyIndex: 0,
            accountId,
          })

          if (!client) {
            setError(
              'Account key mismatch. This account does not belong to the provided private key.'
            )
            setIsValidating(false)
            return
          }

          // Close the client after verification
          client.close()
        } catch (err: any) {
          console.error('Account verification error:', err)

          if (err.message?.includes('INVALID_ACCOUNT_ID')) {
            setError('Account does not exist on the network.')
          } else if (err.message?.includes('account')) {
            setError('Failed to verify account. Please check your account ID and network.')
          } else {
            setError('Failed to verify account. Please try again.')
          }

          setIsValidating(false)
          return
        }
      }

      setAccountId(accountId.toString())
      nextStep()
    } catch (err) {
      console.error('Validation error:', err)
      setError('An error occurred while validating the account.')
      setIsValidating(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Connect Hedera Account</h2>
        <p className="text-sm text-muted-foreground">
          Enter your Hedera account ID or create a new account with your public key
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <Label htmlFor="accountId" className="text-foreground">
              Account ID
            </Label>
            <Input
              id="accountId"
              type="text"
              value={accountIdText}
              onChange={(e) => {
                setAccountIdText(e.target.value)
                setError('')
              }}
              placeholder="0.0.12345"
              className={error ? 'border-red-500' : ''}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Format: shard.realm.number (e.g., 0.0.12345)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Public Key Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Don't have an account?</h3>
              <p className="text-sm text-muted-foreground">
                Share your public key with someone to create an account for you.
              </p>
            </div>

            {publicKey && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Your Public Key</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQR(!showQR)}
                  >
                    {showQR ? 'Hide QR' : 'Show QR'}
                  </Button>
                </div>

                {showQR && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCode value={publicKey.slice(24)} size={180} />
                  </div>
                )}

                <div className="relative">
                  <Input readOnly value={publicKey.slice(24)} className="pr-10 font-mono text-xs" />
                  <button
                    type="button"
                    onClick={handleCopyPublicKey}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
            Back
          </Button>
          <Button
            type="submit"
            disabled={!accountIdText.trim() || isValidating}
            className="flex-1 gradient-golden"
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AccountStep

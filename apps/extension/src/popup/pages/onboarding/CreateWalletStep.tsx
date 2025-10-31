import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'
import { useAppDispatch } from '@/store/hooks'
import { addWallet } from '@/store/slices/walletSlice'
import { v4 as uuidv4 } from 'uuid'

const CreateWalletStep: React.FC = () => {
  const { privateKey, accountId, prevStep, nextStep } = useOnboarding()
  const dispatch = useAppDispatch()
  const [walletName, setWalletName] = useState('Wallet 1')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreateWallet = async () => {
    if (!privateKey || !accountId) {
      setError('Missing required information')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const { PrivateKey } = await import('@hashgraph/sdk')

      // Get public key
      const pk = PrivateKey.fromString(privateKey)
      const publicKey = pk.publicKey.toString()

      // Create wallet object
      const newWallet = {
        id: uuidv4(),
        name: walletName,
        publicKey,
        privateKey, // Note: In production, this should be encrypted
        accountId,
        networkBalances: {},
        totalBalance: '0',
      }

      // Add wallet to store
      dispatch(addWallet(newWallet))

      // Navigate to success step
      nextStep()
    } catch (err) {
      console.error('Error creating wallet:', err)
      setError('Failed to create wallet. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Name Your Wallet</h2>
        <p className="text-sm text-muted-foreground">
          Give your wallet a memorable name to easily identify it
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col">
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <Label htmlFor="walletName" className="text-foreground">
              Wallet Name
            </Label>
            <Input
              id="walletName"
              type="text"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="My Hedera Wallet"
              autoFocus
            />
          </div>

          {/* Summary */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <h3 className="text-sm font-semibold text-foreground">Wallet Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="font-mono text-foreground">{accountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="text-foreground">Hedera Testnet</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t mt-6">
          <Button
            type="button"
            size={'bg'}
            variant="outline"
            onClick={prevStep}
            disabled={isCreating}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            size={'bg'}
            onClick={handleCreateWallet}
            disabled={!walletName.trim() || isCreating}
            className="flex-1 gradient-golden"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Wallet'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateWalletStep

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

const PrivateKeyStep: React.FC = () => {
  const { setPrivateKey, nextStep, prevStep } = useOnboarding()
  const [privateKeyText, setPrivateKeyText] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsValidating(true)

    try {
      // Validate the private key format
      const { PrivateKey } = await import('@hashgraph/sdk')

      let privateKey
      try {
        privateKey = PrivateKey.fromString(privateKeyText.trim())
      } catch (err) {
        setError('Invalid private key format. Please check and try again.')
        setIsValidating(false)
        return
      }

      // Store the private key and move to next step
      setPrivateKey(privateKey.toString())
      nextStep()
    } catch (err) {
      setError('An error occurred while validating the private key.')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Import Private Key</h2>
        <p className="text-sm text-muted-foreground">
          Enter your Hedera private key to access your wallet
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label htmlFor="privateKey" className="text-foreground">
              Private Key
            </Label>
            <div className="relative">
              <Input
                id="privateKey"
                type={showKey ? 'text' : 'password'}
                value={privateKeyText}
                onChange={(e) => {
                  setPrivateKeyText(e.target.value)
                  setError('')
                }}
                placeholder="302e020100300506032b657004220420..."
                className={`pr-10 ${error ? 'border-red-500' : ''}`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your private key should start with "302e020100300506032b6570..."
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Not Recommended Warning */}
          <Alert className="bg-yellow-500/10 border-yellow-500/50">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              <strong>Not Recommended:</strong> Importing private keys directly is less secure. Use
              hardware wallets for better security.
            </AlertDescription>
          </Alert>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
            Back
          </Button>
          <Button
            type="submit"
            disabled={!privateKeyText.trim() || isValidating}
            className="flex-1 gradient-golden"
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PrivateKeyStep

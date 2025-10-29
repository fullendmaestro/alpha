import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Key, FileKey2, Shield } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

const ImportOptionStep: React.FC = () => {
  const { setCurrentStep, prevStep } = useOnboarding()

  const handlePrivateKeyImport = () => {
    setCurrentStep('import-private-key')
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Import Wallet</h2>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to import your existing wallet
        </p>
      </div>

      {/* Options */}
      <div className="flex-1 space-y-4">
        {/* Private Key Option */}
        <Card
          className="p-6 cursor-pointer hover:bg-accent/50 transition-colors border-2"
          onClick={handlePrivateKeyImport}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">Private Key</h3>
              <p className="text-sm text-muted-foreground">
                Import your wallet using your Hedera private key (DER-encoded format)
              </p>
            </div>
          </div>
        </Card>

        {/* Mnemonic Option - Coming Soon */}
        <Card className="p-6 opacity-50 cursor-not-allowed border-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <FileKey2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Recovery Phrase
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Import your wallet using a 12 or 24-word recovery phrase
              </p>
            </div>
          </div>
        </Card>

        {/* Hardware Wallet Option - Coming Soon */}
        <Card className="p-6 opacity-50 cursor-not-allowed border-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Hardware Wallet
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Connect a Ledger or other hardware wallet for maximum security
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
      </div>
    </div>
  )
}

export default ImportOptionStep

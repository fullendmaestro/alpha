import React from 'react'
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'
import WelcomeStep from './WelcomeStep'
import ImportOptionStep from './ImportOptionStep'
import PrivateKeyStep from './PrivateKeyStep'
import AccountStep from './AccountStep'
import CreateWalletStep from './CreateWalletStep'
import SuccessStep from './SuccessStep'
import { OnboardingProvider, useOnboarding } from './OnboardingContext'

interface WalletOnboardingWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WalletOnboardingContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentStep } = useOnboarding()

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />
      case 'import-option':
        return <ImportOptionStep />
      case 'import-private-key':
        return <PrivateKeyStep />
      case 'import-account':
        return <AccountStep />
      case 'create-wallet':
        return <CreateWalletStep />
      case 'success':
        return <SuccessStep />
      default:
        return <WelcomeStep />
    }
  }

  return <div className="flex flex-col h-full">{renderStep()}</div>
}

export const WalletOnboardingWizard: React.FC<WalletOnboardingWizardProps> = ({
  open,
  onOpenChange,
}) => {
  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-md h-[90vh] gradient-cosmic overflow-auto hide-scrollbar">
        <OnboardingProvider>
          <WalletOnboardingContent onClose={handleClose} />
        </OnboardingProvider>
      </DialogContent>
    </Dialog>
  )
}

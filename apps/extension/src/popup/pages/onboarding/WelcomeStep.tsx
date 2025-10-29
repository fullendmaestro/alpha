import React from 'react'
import Logo from '@/assets/alphaLogo.svg?react'
import { Button } from '@/components/ui/button'
import { useOnboarding } from './OnboardingContext'

const WelcomeStep: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  return (
    <div className="flex flex-col gap-y-4 justify-center items-center h-full">
      <div className="flex flex-col gap-6 items-center justify-center flex-1">
        <Logo className="size-50" />
        {/* <img src={Images.Logos.MetaFox} alt='MetaFox logo'  /> */}
        <p className="text-center text-lg">The World's Most Powerful AI Wallet for Hedera</p>
      </div>
      <div className="flex flex-col gap-y-4 w-full mt-auto">
        <Button
          size={'bg'}
          className="w-full opacity-50 cursor-not-allowed"
          disabled
          onClick={() => {}}
        >
          Create a new wallet
          <span className="ml-2 text-xs">(Coming Soon)</span>
        </Button>

        <Button
          variant="secondary"
          size={'bg'}
          className="w-full gradient-golden"
          onClick={() => setCurrentStep('import-option')}
        >
          Import an existing wallet
        </Button>
      </div>
    </div>
  )
}

export default WelcomeStep

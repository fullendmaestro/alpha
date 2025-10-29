import { useApp, useAppDispatch } from '@/store'
import { createContext, ReactNode, useContext, useState } from 'react'

export type OnboardingStep =
  | 'welcome'
  | 'import-option'
  | 'import-private-key'
  | 'import-account'
  | 'create-wallet'
  | 'success'

interface OnboardingContextType {
  // Current step
  currentStep: OnboardingStep
  setCurrentStep: (step: OnboardingStep) => void

  // Navigation helpers
  nextStep: () => void
  prevStep: () => void

  // Wallet data
  privateKey: string | null
  setPrivateKey: (key: string) => void
  accountId: string | null
  setAccountId: (id: string) => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

interface OnboardingProviderProps {
  children: ReactNode
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const {} = useApp()

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)

  // Step flow
  const stepFlow: OnboardingStep[] = [
    'welcome',
    'import-option',
    'import-private-key',
    'import-account',
    'create-wallet',
    'success',
  ]

  const nextStep = () => {
    const currentIndex = stepFlow.indexOf(currentStep)
    if (currentIndex < stepFlow.length - 1) {
      setCurrentStep(stepFlow[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = stepFlow.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepFlow[currentIndex - 1])
    }
  }

  const contextValue: OnboardingContextType = {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    privateKey,
    setPrivateKey,
    accountId,
    setAccountId,
  }
  return <OnboardingContext.Provider value={contextValue}>{children}</OnboardingContext.Provider>
}

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

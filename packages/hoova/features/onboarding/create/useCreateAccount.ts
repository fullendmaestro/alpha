import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'

interface AccountInfo {
  firstName: string
  lastName: string
  email: string
  role: 'patient' | 'provider' | 'hospital_admin'
  phoneNumber?: string
  dateOfBirth?: string
}

interface UseCreateAccountReturn {
  mnemonic: string
  currentStep: number
  loading: boolean
  accountInfo: AccountInfo
  password: string
  confirmPassword: string
  onOnboardingCompleted: () => void
  moveToNextStep: () => void
  moveToPrevStep: () => void
  setAccountInfo: (info: Partial<AccountInfo>) => void
  setPassword: (password: string) => void
  setConfirmPassword: (password: string) => void
  generateMnemonic: () => void
}

// Mock mnemonic generation - replace with actual crypto library
const generateMockMnemonic = (): string => {
  const words = [
    'abandon',
    'ability',
    'able',
    'about',
    'above',
    'absent',
    'absorb',
    'abstract',
    'absurd',
    'abuse',
    'access',
    'accident',
    'account',
    'accuse',
    'achieve',
    'acid',
    'acoustic',
    'acquire',
    'across',
    'act',
    'action',
    'actor',
    'actress',
    'actual',
  ]

  // Generate 12 random words
  const mnemonic = Array.from(
    { length: 12 },
    () => words[Math.floor(Math.random() * words.length)]
  ).join(' ')

  return mnemonic
}

export const useCreateAccount = (): UseCreateAccountReturn => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountInfo, setAccountInfoState] = useState<AccountInfo>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'patient',
    phoneNumber: '',
    dateOfBirth: '',
  })

  const generateMnemonic = () => {
    const newMnemonic = generateMockMnemonic()
    setMnemonic(newMnemonic)
  }

  useEffect(() => {
    if (!mnemonic) {
      generateMnemonic()
    }
  }, [mnemonic])

  const setAccountInfo = (info: Partial<AccountInfo>) => {
    setAccountInfoState((prev) => ({ ...prev, ...info }))
  }

  const moveToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const moveToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onOnboardingCompleted = async () => {
    setLoading(true)

    try {
      // Simulate wallet creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store wallet data securely (implement actual secure storage)
      console.log('Creating wallet with:', {
        accountInfo,
        mnemonic,
        hasPassword: !!password,
      })

      // Navigate to success screen
      router.push('/onboarding/success')
    } catch (error) {
      console.error('Error creating wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    mnemonic,
    currentStep,
    loading,
    accountInfo,
    password,
    confirmPassword,
    onOnboardingCompleted,
    moveToNextStep,
    moveToPrevStep,
    setAccountInfo,
    setPassword,
    setConfirmPassword,
    generateMnemonic,
  }
}

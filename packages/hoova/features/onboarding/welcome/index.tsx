import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { YStack, XStack, Text, Button, Card, H1, H4, Image, styled, ScrollView } from '@hoova/ui'

const OnboardingContainer = styled(ScrollView, {
  flex: 1,
  backgroundColor: '$blue12',
})

const ContentContainer = styled(YStack, {
  minHeight: '100%',
  padding: '$6',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const LogoContainer = styled(YStack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  space: '$4',
})

const ButtonContainer = styled(YStack, {
  width: '100%',
  space: '$3',
  marginBottom: '$4',
})

const PrimaryButton = styled(Button, {
  width: '100%',
  height: '$5',
  backgroundColor: '$blue9',
  borderRadius: '$4',
  color: 'white',
  fontWeight: '600',
  fontSize: '$4',

  pressStyle: {
    backgroundColor: '$blue10',
    opacity: 0.9,
  },
})

const SecondaryButton = styled(Button, {
  width: '100%',
  height: '$5',
  backgroundColor: 'white',
  borderRadius: '$4',
  color: '$blue12',
  fontWeight: '600',
  fontSize: '$4',

  pressStyle: {
    backgroundColor: '$gray2',
    opacity: 0.9,
  },
})

export function OnboardWelcomeScreen() {
  const router = useRouter()

  useEffect(() => {
    // Preload routes for better performance
    router.prefetch('/onboarding/create')
    router.prefetch('/onboarding/import')
  }, [])

  const handleCreateWallet = () => {
    router.push('/onboarding/create')
  }

  const handleImportWallet = () => {
    router.push('/onboarding/import')
  }

  return (
    <OnboardingContainer>
      <ContentContainer>
        <LogoContainer>
          <H1 color="white" textAlign="center" fontSize="$9" fontWeight="bold" letterSpacing="$1">
            HOOVA
          </H1>
          <H4 color="$gray10" textAlign="center" fontWeight="normal" fontSize="$4" marginTop="$2">
            Your decentralized healthcare wallet
          </H4>
        </LogoContainer>

        <ButtonContainer>
          <PrimaryButton onPress={handleCreateWallet}>Create a new wallet</PrimaryButton>

          <SecondaryButton onPress={handleImportWallet}>Import an existing wallet</SecondaryButton>
        </ButtonContainer>
      </ContentContainer>
    </OnboardingContainer>
  )
}

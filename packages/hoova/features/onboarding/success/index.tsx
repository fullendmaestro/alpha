import React from 'react'
import { useRouter } from 'expo-router'
import { YStack, Text, Button, H1, H4, styled } from '@hoova/ui'

const SuccessContainer = styled(YStack, {
  flex: 1,
  backgroundColor: '$blue12',
  padding: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  space: '$6',
})

const IconContainer = styled(YStack, {
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: '$blue9',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '$4',
})

const ButtonContainer = styled(YStack, {
  width: '100%',
  marginTop: '$6',
})

const GetStartedButton = styled(Button, {
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

export function OnboardingSuccessScreen() {
  const router = useRouter()

  const handleGetStarted = () => {
    // Navigate to main app
    router.replace('/')
  }

  return (
    <SuccessContainer>
      <IconContainer>
        <Text fontSize="$10" color="white">
          ✓
        </Text>
      </IconContainer>

      <YStack space="$4" alignItems="center" maxWidth={300}>
        <H1 color="white" textAlign="center" fontSize="$8" fontWeight="bold">
          You're all set!
        </H1>

        <H4 color="$gray10" textAlign="center" fontWeight="normal" fontSize="$4" lineHeight="$2">
          Discover the full power of decentralized healthcare with Hoova.
        </H4>

        <YStack alignItems="center" marginTop="$4">
          <Text fontSize="$3" color="$gray11" textAlign="center">
            Open Hoova with{' '}
            <Text fontWeight="600" color="$blue10">
              your secure wallet
            </Text>
          </Text>
        </YStack>
      </YStack>

      <ButtonContainer>
        <GetStartedButton onPress={handleGetStarted}>Get started</GetStartedButton>
      </ButtonContainer>
    </SuccessContainer>
  )
}

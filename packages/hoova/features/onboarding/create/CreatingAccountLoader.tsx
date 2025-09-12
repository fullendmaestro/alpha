import React from 'react'
import { YStack, Text, Spinner, H2, H4, styled } from '@hoova/ui'

const LoaderContainer = styled(YStack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  space: '$6',
  padding: '$6',
})

const AnimatedSpinner = styled(Spinner, {
  size: 'large',
  color: '$blue9',
})

export const CreatingAccountLoader: React.FC = () => {
  return (
    <LoaderContainer>
      <YStack space="$4" alignItems="center">
        <AnimatedSpinner />
        <H2 color="$color12" textAlign="center">
          Creating your wallet...
        </H2>
        <H4 color="$color11" textAlign="center" fontWeight="normal">
          This may take a moment. Please don't close the app.
        </H4>
      </YStack>

      <YStack space="$3" alignItems="center" maxWidth={300}>
        <Text fontSize="$3" color="$color10" textAlign="center" lineHeight="$1">
          🔐 Generating secure keys
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center" lineHeight="$1">
          🏥 Setting up healthcare record access
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center" lineHeight="$1">
          ⚡ Connecting to Hedera network
        </Text>
      </YStack>
    </LoaderContainer>
  )
}

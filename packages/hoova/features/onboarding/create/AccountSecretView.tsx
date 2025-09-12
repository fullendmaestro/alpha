import React, { useState } from 'react'
import { Alert } from 'react-native'
// import * as Clipboard from 'expo-clipboard'
import { YStack, XStack, Text, Button, Card, H2, H4, styled, ScrollView } from '@hoova/ui'

const StepContainer = styled(ScrollView, {
  flex: 1,
  backgroundColor: '$background',
})

const ContentContainer = styled(YStack, {
  minHeight: '100%',
  padding: '$6',
  justifyContent: 'center',
  space: '$6',
})

const SecretCard = styled(Card, {
  width: '100%',
  padding: '$5',
  borderRadius: '$4',
  backgroundColor: '$gray2',
  borderWidth: 1,
  borderColor: '$gray7',
})

const MnemonicContainer = styled(YStack, {
  space: '$3',
  padding: '$4',
  backgroundColor: '$gray3',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$gray6',
})

const MnemonicGrid = styled(YStack, {
  space: '$2',
})

const MnemonicRow = styled(XStack, {
  justifyContent: 'space-between',
  space: '$2',
})

const MnemonicWord = styled(XStack, {
  flex: 1,
  alignItems: 'center',
  space: '$2',
  padding: '$2',
  backgroundColor: 'white',
  borderRadius: '$2',
  borderWidth: 1,
  borderColor: '$gray5',
})

const WordNumber = styled(Text, {
  fontSize: '$3',
  color: '$gray10',
  fontWeight: '500',
  minWidth: 20,
})

const WordText = styled(Text, {
  fontSize: '$4',
  color: '$color12',
  fontWeight: '500',
})

const WarningContainer = styled(YStack, {
  space: '$3',
  padding: '$4',
  backgroundColor: '$orange2',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$orange7',
})

interface AccountSecretViewProps {
  mnemonic: string
  onNext: () => void
  onBack: () => void
}

export const AccountSecretView: React.FC<AccountSecretViewProps> = ({
  mnemonic,
  onNext,
  onBack,
}) => {
  const [hasConfirmed, setHasConfirmed] = useState(false)

  const words = mnemonic.split(' ')

  const handleCopyToClipboard = async () => {
    try {
      // await Clipboard.setStringAsync(mnemonic)
      Alert.alert('Copied!', 'Recovery phrase copied to clipboard')
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard')
    }
  }

  const handleConfirm = () => {
    if (!hasConfirmed) {
      Alert.alert(
        'Important!',
        'Have you safely stored your recovery phrase? You will need it to recover your wallet.',
        [
          { text: 'Not yet', style: 'cancel' },
          {
            text: 'Yes, I have saved it',
            onPress: () => {
              setHasConfirmed(true)
              onNext()
            },
          },
        ]
      )
    } else {
      onNext()
    }
  }

  const renderMnemonicGrid = () => {
    const rows = []
    for (let i = 0; i < words.length; i += 2) {
      rows.push(
        <MnemonicRow key={i}>
          <MnemonicWord>
            <WordNumber>{i + 1}.</WordNumber>
            <WordText>{words[i]}</WordText>
          </MnemonicWord>
          {words[i + 1] && (
            <MnemonicWord>
              <WordNumber>{i + 2}.</WordNumber>
              <WordText>{words[i + 1]}</WordText>
            </MnemonicWord>
          )}
        </MnemonicRow>
      )
    }
    return rows
  }

  return (
    <StepContainer>
      <ContentContainer>
        <YStack space="$4" alignItems="center">
          <Text fontSize="$6">🔐</Text>
          <H2 color="$color12" textAlign="center">
            Your secret recovery phrase
          </H2>
          <H4 color="$color11" textAlign="center" fontWeight="normal">
            Write down these words, your secret recovery phrase is the only way to recover your
            wallet and funds!
          </H4>
        </YStack>

        <SecretCard>
          <MnemonicContainer>
            <MnemonicGrid>{renderMnemonicGrid()}</MnemonicGrid>
          </MnemonicContainer>

          <Button
            marginTop="$4"
            height="$4"
            backgroundColor="transparent"
            color="$blue10"
            fontWeight="600"
            fontSize="$4"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$blue9"
            onPress={handleCopyToClipboard}
          >
            📋 Copy to Clipboard
          </Button>
        </SecretCard>

        <WarningContainer>
          <Text fontSize="$4" fontWeight="600" color="$orange11">
            ⚠️ Important Security Notice
          </Text>
          <Text fontSize="$3" color="$orange11" lineHeight="$1">
            • Store this phrase in a secure location{'\n'}• Never share it with anyone{'\n'}• Hoova
            cannot recover your wallet without it{'\n'}• Anyone with this phrase can access your
            healthcare data
          </Text>
        </WarningContainer>

        <XStack space="$3">
          <Button
            flex={1}
            height="$5"
            backgroundColor="$gray5"
            color="$color12"
            fontWeight="600"
            fontSize="$4"
            borderRadius="$4"
            onPress={onBack}
          >
            Back
          </Button>
          <Button
            flex={1}
            height="$5"
            backgroundColor="$blue9"
            color="white"
            fontWeight="600"
            fontSize="$4"
            borderRadius="$4"
            onPress={handleConfirm}
          >
            I have saved my recovery phrase
          </Button>
        </XStack>
      </ContentContainer>
    </StepContainer>
  )
}

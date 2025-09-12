import React, { useState } from 'react'
import { YStack, XStack, Text, Button, Input, H2, H4, styled, Select, ScrollView } from '@hoova/ui'

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

const FormContainer = styled(YStack, {
  space: '$4',
  width: '100%',
})

const FormField = styled(YStack, {
  space: '$2',
})

const StyledInput = styled(Input, {
  height: '$5',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$gray7',
  backgroundColor: '$gray2',
  paddingHorizontal: '$4',
  fontSize: '$4',
  color: '$color12',

  focusStyle: {
    borderColor: '$blue9',
    backgroundColor: 'white',
  },
})

const ErrorText = styled(Text, {
  fontSize: '$3',
  color: '$red10',
})

interface AccountInfo {
  firstName: string
  lastName: string
  email: string
  role: 'patient' | 'provider' | 'hospital_admin'
  phoneNumber?: string
  dateOfBirth?: string
}

interface AccountInfoProps {
  accountInfo: AccountInfo
  onInfoChange: (info: Partial<AccountInfo>) => void
  onNext: () => void
  onBack: () => void
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  accountInfo,
  onInfoChange,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!accountInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!accountInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!accountInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (accountInfo.phoneNumber && !/^\+?[\d\s-()]+$/.test(accountInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'patient':
        return 'Patient'
      case 'provider':
        return 'Healthcare Provider'
      case 'hospital_admin':
        return 'Hospital Administrator'
      default:
        return role
    }
  }

  return (
    <StepContainer>
      <ContentContainer>
        <YStack space="$4" alignItems="center">
          <H2 color="$color12" textAlign="center">
            Account Information
          </H2>
          <H4 color="$color11" textAlign="center" fontWeight="normal">
            Tell us a bit about yourself
          </H4>
        </YStack>

        <FormContainer>
          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Role
            </Text>
            <Text fontSize="$4" color="$blue10" fontWeight="600">
              {getRoleDisplayName(accountInfo.role)}
            </Text>
          </FormField>

          <XStack space="$3">
            <FormField flex={1}>
              <Text fontSize="$4" fontWeight="500" color="$color12">
                First Name *
              </Text>
              <StyledInput
                placeholder="John"
                value={accountInfo.firstName}
                onChangeText={(text) => onInfoChange({ firstName: text })}
              />
              {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
            </FormField>

            <FormField flex={1}>
              <Text fontSize="$4" fontWeight="500" color="$color12">
                Last Name *
              </Text>
              <StyledInput
                placeholder="Doe"
                value={accountInfo.lastName}
                onChangeText={(text) => onInfoChange({ lastName: text })}
              />
              {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
            </FormField>
          </XStack>

          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Email Address *
            </Text>
            <StyledInput
              placeholder="john.doe@example.com"
              value={accountInfo.email}
              onChangeText={(text) => onInfoChange({ email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </FormField>

          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Phone Number
            </Text>
            <StyledInput
              placeholder="+1 (555) 123-4567"
              value={accountInfo.phoneNumber}
              onChangeText={(text) => onInfoChange({ phoneNumber: text })}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && <ErrorText>{errors.phoneNumber}</ErrorText>}
          </FormField>

          {accountInfo.role === 'patient' && (
            <FormField>
              <Text fontSize="$4" fontWeight="500" color="$color12">
                Date of Birth
              </Text>
              <StyledInput
                placeholder="MM/DD/YYYY"
                value={accountInfo.dateOfBirth}
                onChangeText={(text) => onInfoChange({ dateOfBirth: text })}
              />
            </FormField>
          )}
        </FormContainer>

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
            onPress={handleNext}
          >
            Continue
          </Button>
        </XStack>
      </ContentContainer>
    </StepContainer>
  )
}

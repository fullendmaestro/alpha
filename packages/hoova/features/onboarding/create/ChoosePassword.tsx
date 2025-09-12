import React, { useState } from 'react'
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  H2,
  H4,
  styled,
  Checkbox,
  ScrollView,
} from '@hoova/ui'

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
  secureTextEntry: true,

  focusStyle: {
    borderColor: '$blue9',
    backgroundColor: 'white',
  },

  variants: {
    strength: {
      weak: {
        borderColor: '$red8',
      },
      medium: {
        borderColor: '$orange8',
      },
      strong: {
        borderColor: '$green8',
      },
    },
  },
})

const PasswordStrength = styled(XStack, {
  alignItems: 'center',
  space: '$2',
})

const StrengthIndicator = styled(Text, {
  fontSize: '$3',
  fontWeight: '600',

  variants: {
    strength: {
      weak: {
        color: '$red10',
      },
      medium: {
        color: '$orange10',
      },
      strong: {
        color: '$green10',
      },
    },
  },
})

const ErrorText = styled(Text, {
  fontSize: '$3',
  color: '$red10',
})

const CheckboxContainer = styled(XStack, {
  alignItems: 'flex-start',
  space: '$3',
  marginVertical: '$4',
})

interface ChoosePasswordProps {
  password: string
  confirmPassword: string
  onPasswordChange: (password: string) => void
  onConfirmPasswordChange: (password: string) => void
  onComplete: () => void
  onBack: () => void
}

export const ChoosePassword: React.FC<ChoosePasswordProps> = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onComplete,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (pwd.length < 6) return 'weak'
    if (pwd.length < 10) return 'medium'
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
      return 'strong'
    }
    return 'medium'
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms & Conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleComplete = () => {
    if (validateForm()) {
      onComplete()
    }
  }

  const strength = getPasswordStrength(password)
  const strengthText = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  }

  return (
    <StepContainer>
      <ContentContainer>
        <YStack space="$4" alignItems="center">
          <Text fontSize="$6">🔐</Text>
          <H2 color="$color12" textAlign="center">
            Create your password
          </H2>
          <H4 color="$color11" textAlign="center" fontWeight="normal">
            Choose a password to secure & lock your wallet
          </H4>
        </YStack>

        <FormContainer>
          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Password
            </Text>
            <StyledInput
              placeholder="Enter your password"
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry={!showPassword}
            />
            {password && (
              <PasswordStrength>
                <StrengthIndicator {...{ strength }}>{strengthText[strength]}</StrengthIndicator>
              </PasswordStrength>
            )}
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormField>

          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Confirm Password
            </Text>
            <StyledInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              secureTextEntry={!showPassword}
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </FormField>

          <Button
            alignSelf="flex-start"
            backgroundColor="transparent"
            color="$blue10"
            fontSize="$3"
            height="auto"
            padding="$2"
            onPress={() => setShowPassword(!showPassword)}
          >
            👁 {showPassword ? 'Hide' : 'Show'} passwords
          </Button>
        </FormContainer>

        <CheckboxContainer>
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
            size="$4"
          />
          <YStack flex={1}>
            <Text fontSize="$3" color="$color11" lineHeight="$1">
              I agree to the{' '}
              <Text color="$blue10" textDecorationLine="underline">
                Terms & Conditions
              </Text>
            </Text>
            {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
          </YStack>
        </CheckboxContainer>

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
            onPress={handleComplete}
            disabled={!password || !confirmPassword || !agreedToTerms}
            opacity={password && confirmPassword && agreedToTerms ? 1 : 0.5}
          >
            Set Password
          </Button>
        </XStack>
      </ContentContainer>
    </StepContainer>
  )
}

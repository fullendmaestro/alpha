import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  H2,
  H4,
  styled,
  TextArea,
  ScrollView,
} from '@hoova/ui'

const ImportContainer = styled(ScrollView, {
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

const StyledTextArea = styled(TextArea, {
  minHeight: 120,
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$gray7',
  backgroundColor: '$gray2',
  padding: '$4',
  fontSize: '$4',
  color: '$color12',

  focusStyle: {
    borderColor: '$blue9',
    backgroundColor: 'white',
  },
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

const BackButton = styled(Button, {
  alignSelf: 'flex-start',
  backgroundColor: 'transparent',
  color: '$blue10',
  fontSize: '$4',
  height: '$4',
  paddingHorizontal: 0,
})

export function ImportAccountScreen() {
  const router = useRouter()
  const [seedPhrase, setSeedPhrase] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!seedPhrase.trim()) {
      newErrors.seedPhrase = 'Recovery phrase is required'
    } else {
      const words = seedPhrase.trim().split(/\s+/)
      if (words.length !== 12 && words.length !== 24) {
        newErrors.seedPhrase = 'Recovery phrase must be 12 or 24 words'
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImport = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // Simulate wallet import
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store wallet data securely (implement actual secure storage)
      console.log('Importing wallet with:', {
        seedPhrase: seedPhrase.split(' ').length + ' words',
        hasPassword: !!password,
      })

      // Navigate to success screen
      router.push('/onboarding/success')
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet. Please try again.')
      console.error('Error importing wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <ImportContainer>
      <ContentContainer>
        <YStack space="$4">
          <BackButton onPress={handleBack}>← Back</BackButton>

          <YStack space="$2" alignItems="center">
            <Text fontSize="$6">🔐</Text>
            <H2 color="$color12" textAlign="center">
              Import your wallet
            </H2>
            <H4 color="$color11" textAlign="center" fontWeight="normal">
              Enter your 12 or 24-word recovery phrase to restore your healthcare wallet
            </H4>
          </YStack>
        </YStack>

        <FormContainer>
          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Recovery Phrase *
            </Text>
            <StyledTextArea
              placeholder="Enter your recovery phrase here..."
              value={seedPhrase}
              onChangeText={setSeedPhrase}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text fontSize="$3" color="$color10">
              Separate each word with a space
            </Text>
            {errors.seedPhrase && <ErrorText>{errors.seedPhrase}</ErrorText>}
          </FormField>

          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              New Password *
            </Text>
            <StyledInput
              placeholder="Enter a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormField>

          <FormField>
            <Text fontSize="$4" fontWeight="500" color="$color12">
              Confirm Password *
            </Text>
            <StyledInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </FormField>
        </FormContainer>

        <YStack space="$3">
          <Text fontSize="$3" color="$orange11" textAlign="center" lineHeight="$1">
            ⚠️ Make sure no one can see your screen. Never share your recovery phrase with anyone.
          </Text>

          <Button
            width="100%"
            height="$5"
            backgroundColor="$blue9"
            color="white"
            fontWeight="600"
            fontSize="$4"
            borderRadius="$4"
            onPress={handleImport}
            disabled={loading || !seedPhrase || !password || !confirmPassword}
            opacity={loading || !seedPhrase || !password || !confirmPassword ? 0.5 : 1}
          >
            {loading ? 'Importing Wallet...' : 'Import Wallet'}
          </Button>
        </YStack>
      </ContentContainer>
    </ImportContainer>
  )
}
//   }

//   const handleLogin = async () => {
//     if (!validateForm()) return

//     dispatch(setAuthenticating(true))

//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // Mock user data based on email
//       const mockUser: User = {
//         id: '1',
//         email: email.toLowerCase(),
//         firstName: email.includes('doctor') ? 'Dr. Sarah' : 'John',
//         lastName: email.includes('doctor') ? 'Johnson' : 'Doe',
//         role: email.includes('doctor')
//           ? 'provider'
//           : email.includes('admin')
//             ? 'hospital_admin'
//             : 'patient',
//         profilePicture: 'https://via.placeholder.com/150',
//         phoneNumber: '+1234567890',
//         dateOfBirth: '1990-01-01',
//       }

//       const mockToken = `mock_token_${Date.now()}`

//       // Log successful login
//       console.log('Login successful for:', mockUser.email, 'Role:', mockUser.role)

//       // dispatch(loginSuccess({ user: mockUser, token: mockToken }))
//     } catch (error) {
//       console.error('Login error:', error)
//       // dispatch(setLoginError('Invalid email or password. Please try again.'))
//     }
//   }

//   return (
//     <ScrollView flex={1} backgroundColor="$background">
//       <YStack flex={1} justifyContent="center" backgroundColor="$background">
//         <Card elevate size="$4" padding="$6" margin="$4">
//           <YStack space="$4" alignItems="center">
//             <YStack space="$2" alignItems="center">
//               <H1 color="$color" textAlign="center">
//                 Welcome to Hoova
//               </H1>
//               <H4 color="$color11" textAlign="center" fontWeight="normal">
//                 Secure Healthcare Record Management
//               </H4>
//             </YStack>

//             <Separator />

//             <YStack space="$3" width="100%">
//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Email Address
//                 </Text>
//                 <Input
//                   placeholder="Enter your email"
//                   value={email}
//                   onChangeText={(text) => {
//                     setEmail(text)
//                     if (emailError) setEmailError('')
//                   }}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   borderColor={emailError ? '$red10' : '$borderColor'}
//                 />
//                 {emailError ? (
//                   <Text fontSize="$3" color="$red10">
//                     {emailError}
//                   </Text>
//                 ) : null}
//               </YStack>

//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Password
//                 </Text>
//                 <Input
//                   placeholder="Enter your password"
//                   value={password}
//                   onChangeText={(text) => {
//                     setPassword(text)
//                     if (passwordError) setPasswordError('')
//                   }}
//                   secureTextEntry
//                   borderColor={passwordError ? '$red10' : '$borderColor'}
//                 />
//                 {passwordError ? (
//                   <Text fontSize="$3" color="$red10">
//                     {passwordError}
//                   </Text>
//                 ) : null}
//               </YStack>

//               {loginError ? (
//                 <Card backgroundColor="$red2" padding="$3" borderColor="$red8" borderWidth={1}>
//                   <Text fontSize="$3" color="$red11" textAlign="center">
//                     {loginError}
//                   </Text>
//                 </Card>
//               ) : null}

//               <Button
//                 size="$4"
//                 theme="active"
//                 onPress={handleLogin}
//                 disabled={authenticating}
//                 marginTop="$2"
//               >
//                 {authenticating ? (
//                   <XStack space="$2" alignItems="center">
//                     <Spinner size="small" />
//                     <Text color="$color">Signing In...</Text>
//                   </XStack>
//                 ) : (
//                   <Text color="$color">Sign In</Text>
//                 )}
//               </Button>
//             </YStack>

//             <YStack space="$3" alignItems="center" width="100%">
//               <Separator />

//               {onNavigateToForgotPassword && (
//                 <Button
//                   variant="outlined"
//                   size="$3"
//                   onPress={onNavigateToForgotPassword}
//                   chromeless
//                 >
//                   <Text color="$blue10">Forgot Password?</Text>
//                 </Button>
//               )}

//               {onNavigateToSignup && (
//                 <XStack space="$2" alignItems="center">
//                   <Text fontSize="$3" color="$color11">
//                     Don't have an account?
//                   </Text>
//                   <Button variant="outlined" size="$3" onPress={onNavigateToSignup} chromeless>
//                     <Text color="$blue10" fontWeight="600">
//                       Sign Up
//                     </Text>
//                   </Button>
//                 </XStack>
//               )}
//             </YStack>

//             <YStack space="$2" marginTop="$4">
//               <Paragraph fontSize="$2" color="$color11" textAlign="center">
//                 Demo Accounts:
//               </Paragraph>
//               <Paragraph fontSize="$2" color="$color11" textAlign="center">
//                 Patient: patient@hoova.com | Provider: doctor@hoova.com | Admin: admin@hoova.com
//               </Paragraph>
//               <Paragraph fontSize="$2" color="$color11" textAlign="center">
//                 Password: password123
//               </Paragraph>
//             </YStack>
//           </YStack>
//         </Card>
//       </YStack>
//     </ScrollView>
//   )
// }

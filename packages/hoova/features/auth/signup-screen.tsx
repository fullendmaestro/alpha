import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Spinner,
  Card,
  H1,
  H4,
  Separator,
  Select,
} from '@hoova/ui'
import { loginSuccess, setAuthenticating, setLoginError } from '../../store/slices/authSlice'
import { useAuth } from '@hoova/core/store'
import type { User } from '../../store/types'

interface SignupScreenProps {
  onNavigateToLogin?: () => void
}

export function SignupScreen({ onNavigateToLogin }: SignupScreenProps) {
  const dispatch = useDispatch()
  const { authenticating, loginError } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'provider' | 'hospital_admin',
    phoneNumber: '',
    dateOfBirth: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    dispatch(setAuthenticating(true))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock user data
      const mockUser: User = {
        id: Date.now().toString(),
        email: formData.email.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        phoneNumber: formData.phoneNumber || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        profilePicture: 'https://via.placeholder.com/150',
      }

      const mockToken = `mock_token_${Date.now()}`

      // Log successful signup
      console.log('Signup successful for:', mockUser.email, 'Role:', mockUser.role)

      dispatch(loginSuccess({ user: mockUser, token: mockToken }))
    } catch (error) {
      console.error('Signup error:', error)
      dispatch(setLoginError('Failed to create account. Please try again.'))
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <YStack flex={1} padding="$4" justifyContent="center" backgroundColor="$background">
      <Card elevate size="$4" padding="$6" margin="$4">
        <YStack space="$4" alignItems="center">
          <YStack space="$2" alignItems="center">
            <H1 color="$color" textAlign="center">
              Join Hoova
            </H1>
            <H4 color="$color11" textAlign="center" fontWeight="normal">
              Create your healthcare account
            </H4>
          </YStack>

          <Separator />

          <YStack space="$3" width="100%">
            <XStack space="$2">
              <YStack flex={1} space="$2">
                <Text fontSize="$4" fontWeight="600" color="$color">
                  First Name
                </Text>
                <Input
                  placeholder="John"
                  value={formData.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                  borderColor={errors.firstName ? '$red10' : '$borderColor'}
                />
                {errors.firstName ? (
                  <Text fontSize="$3" color="$red10">
                    {errors.firstName}
                  </Text>
                ) : null}
              </YStack>

              <YStack flex={1} space="$2">
                <Text fontSize="$4" fontWeight="600" color="$color">
                  Last Name
                </Text>
                <Input
                  placeholder="Doe"
                  value={formData.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                  borderColor={errors.lastName ? '$red10' : '$borderColor'}
                />
                {errors.lastName ? (
                  <Text fontSize="$3" color="$red10">
                    {errors.lastName}
                  </Text>
                ) : null}
              </YStack>
            </XStack>

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Email Address
              </Text>
              <Input
                placeholder="john@example.com"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                borderColor={errors.email ? '$red10' : '$borderColor'}
              />
              {errors.email ? (
                <Text fontSize="$3" color="$red10">
                  {errors.email}
                </Text>
              ) : null}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Role
              </Text>
              <Select value={formData.role} onValueChange={(value) => updateField('role', value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Select your role" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item index={0} value="patient">
                    <Select.ItemText>Patient</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={1} value="provider">
                    <Select.ItemText>Healthcare Provider</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={2} value="hospital_admin">
                    <Select.ItemText>Hospital Administrator</Select.ItemText>
                  </Select.Item>
                </Select.Content>
              </Select>
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Password
              </Text>
              <Input
                placeholder="Enter password"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                borderColor={errors.password ? '$red10' : '$borderColor'}
              />
              {errors.password ? (
                <Text fontSize="$3" color="$red10">
                  {errors.password}
                </Text>
              ) : null}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Confirm Password
              </Text>
              <Input
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChangeText={(text) => updateField('confirmPassword', text)}
                secureTextEntry
                borderColor={errors.confirmPassword ? '$red10' : '$borderColor'}
              />
              {errors.confirmPassword ? (
                <Text fontSize="$3" color="$red10">
                  {errors.confirmPassword}
                </Text>
              ) : null}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Phone Number (Optional)
              </Text>
              <Input
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChangeText={(text) => updateField('phoneNumber', text)}
                keyboardType="phone-pad"
                borderColor={errors.phoneNumber ? '$red10' : '$borderColor'}
              />
              {errors.phoneNumber ? (
                <Text fontSize="$3" color="$red10">
                  {errors.phoneNumber}
                </Text>
              ) : null}
            </YStack>

            {loginError ? (
              <Card backgroundColor="$red2" padding="$3" borderColor="$red8" borderWidth={1}>
                <Text fontSize="$3" color="$red11" textAlign="center">
                  {loginError}
                </Text>
              </Card>
            ) : null}

            <Button
              size="$4"
              theme="active"
              onPress={handleSignup}
              disabled={authenticating}
              marginTop="$2"
            >
              {authenticating ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" />
                  <Text color="$color">Creating Account...</Text>
                </XStack>
              ) : (
                <Text color="$color">Create Account</Text>
              )}
            </Button>
          </YStack>

          <YStack space="$3" alignItems="center" width="100%">
            <Separator />

            {onNavigateToLogin && (
              <XStack space="$2" alignItems="center">
                <Text fontSize="$3" color="$color11">
                  Already have an account?
                </Text>
                <Button variant="outlined" size="$3" onPress={onNavigateToLogin} chromeless>
                  <Text color="$blue10" fontWeight="600">
                    Sign In
                  </Text>
                </Button>
              </XStack>
            )}
          </YStack>
        </YStack>
      </Card>
    </YStack>
  )
}

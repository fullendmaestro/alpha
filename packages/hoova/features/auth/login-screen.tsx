import React, { useState } from 'react'
import { Alert } from 'react-native'
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
  Paragraph,
  Separator,
} from '@hoova/ui'
import { loginSuccess, setAuthenticating, setLoginError } from '../../store/slices/authSlice'
import { useAuth } from '@hoova/core/store'

import type { User } from '../../store/types'

interface LoginScreenProps {
  onNavigateToSignup?: () => void
  onNavigateToForgotPassword?: () => void
}

export function LoginScreen({ onNavigateToSignup, onNavigateToForgotPassword }: LoginScreenProps) {
  const dispatch = useDispatch()
  const { authenticating, loginError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    let isValid = true

    if (!email.trim()) {
      setEmailError('Email is required')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    } else {
      setEmailError('')
    }

    if (!password.trim()) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    } else {
      setPasswordError('')
    }

    return isValid
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    dispatch(setAuthenticating(true))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user data based on email
      const mockUser: User = {
        id: '1',
        email: email.toLowerCase(),
        firstName: email.includes('doctor') ? 'Dr. Sarah' : 'John',
        lastName: email.includes('doctor') ? 'Johnson' : 'Doe',
        role: email.includes('doctor')
          ? 'provider'
          : email.includes('admin')
            ? 'hospital_admin'
            : 'patient',
        profilePicture: 'https://via.placeholder.com/150',
        phoneNumber: '+1234567890',
        dateOfBirth: '1990-01-01',
      }

      const mockToken = `mock_token_${Date.now()}`

      // Log successful login
      console.log('Login successful for:', mockUser.email, 'Role:', mockUser.role)

      dispatch(loginSuccess({ user: mockUser, token: mockToken }))
    } catch (error) {
      console.error('Login error:', error)
      dispatch(setLoginError('Invalid email or password. Please try again.'))
    }
  }

  return (
    <YStack flex={1} padding="$4" justifyContent="center" backgroundColor="$background">
      <Card elevate size="$4" padding="$6" margin="$4">
        <YStack space="$4" alignItems="center">
          <YStack space="$2" alignItems="center">
            <H1 color="$color" textAlign="center">
              Welcome to Hoova
            </H1>
            <H4 color="$color11" textAlign="center" fontWeight="normal">
              Secure Healthcare Record Management
            </H4>
          </YStack>

          <Separator />

          <YStack space="$3" width="100%">
            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Email Address
              </Text>
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text)
                  if (emailError) setEmailError('')
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                borderColor={emailError ? '$red10' : '$borderColor'}
              />
              {emailError ? (
                <Text fontSize="$3" color="$red10">
                  {emailError}
                </Text>
              ) : null}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$color">
                Password
              </Text>
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  if (passwordError) setPasswordError('')
                }}
                secureTextEntry
                borderColor={passwordError ? '$red10' : '$borderColor'}
              />
              {passwordError ? (
                <Text fontSize="$3" color="$red10">
                  {passwordError}
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
              onPress={handleLogin}
              disabled={authenticating}
              marginTop="$2"
            >
              {authenticating ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" />
                  <Text color="$color">Signing In...</Text>
                </XStack>
              ) : (
                <Text color="$color">Sign In</Text>
              )}
            </Button>
          </YStack>

          <YStack space="$3" alignItems="center" width="100%">
            <Separator />

            {onNavigateToForgotPassword && (
              <Button variant="outlined" size="$3" onPress={onNavigateToForgotPassword} chromeless>
                <Text color="$blue10">Forgot Password?</Text>
              </Button>
            )}

            {onNavigateToSignup && (
              <XStack space="$2" alignItems="center">
                <Text fontSize="$3" color="$color11">
                  Don't have an account?
                </Text>
                <Button variant="outlined" size="$3" onPress={onNavigateToSignup} chromeless>
                  <Text color="$blue10" fontWeight="600">
                    Sign Up
                  </Text>
                </Button>
              </XStack>
            )}
          </YStack>

          <YStack space="$2" marginTop="$4">
            <Paragraph fontSize="$2" color="$color11" textAlign="center">
              Demo Accounts:
            </Paragraph>
            <Paragraph fontSize="$2" color="$color11" textAlign="center">
              Patient: patient@hoova.com | Provider: doctor@hoova.com | Admin: admin@hoova.com
            </Paragraph>
            <Paragraph fontSize="$2" color="$color11" textAlign="center">
              Password: password123
            </Paragraph>
          </YStack>
        </YStack>
      </Card>
    </YStack>
  )
}

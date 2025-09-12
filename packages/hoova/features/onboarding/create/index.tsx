import React from 'react'
import { YStack, styled } from '@hoova/ui'
import { useCreateAccount } from './useCreateAccount'
import { SelectAccountType } from './SelectAccountType'
import { AccountInfo } from './AccountInfo'
import { AccountSecretView } from './AccountSecretView'
import { ChoosePassword } from './ChoosePassword'
import { CreatingAccountLoader } from './CreatingAccountLoader'

const CreateAccountContainer = styled(YStack, {
  flex: 1,
  backgroundColor: '$background',
})

export function CreateAccountScreen() {
  const {
    mnemonic,
    onOnboardingCompleted,
    moveToNextStep,
    moveToPrevStep,
    currentStep,
    loading,
    accountInfo,
    setAccountInfo,
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
  } = useCreateAccount()

  return (
    <CreateAccountContainer>
      {loading && <CreatingAccountLoader />}

      {currentStep === 0 && !loading && (
        <SelectAccountType
          selectedRole={accountInfo.role}
          onRoleSelect={(role) => setAccountInfo({ role })}
          onNext={moveToNextStep}
        />
      )}

      {currentStep === 1 && !loading && (
        <AccountInfo
          accountInfo={accountInfo}
          onInfoChange={setAccountInfo}
          onNext={moveToNextStep}
          onBack={moveToPrevStep}
        />
      )}

      {currentStep === 2 && !loading && (
        <AccountSecretView mnemonic={mnemonic} onNext={moveToNextStep} onBack={moveToPrevStep} />
      )}

      {currentStep === 3 && !loading && (
        <ChoosePassword
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onComplete={onOnboardingCompleted}
          onBack={moveToPrevStep}
        />
      )}
    </CreateAccountContainer>
  )
}

//       // Log successful signup
//       console.log('Signup successful for:', mockUser.email, 'Role:', mockUser.role)

//       // dispatch(loginSuccess({ user: mockUser, token: mockToken }))
//     } catch (error) {
//       console.error('Signup error:', error)
//       // dispatch(setLoginError('Failed to create account. Please try again.'))
//     }
//   }

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: '' }))
//     }
//     console.log('hello')
//   }

//   return (
//     <ScrollView flex={1} backgroundColor="$background">
//       <YStack flex={1} justifyContent="center" backgroundColor="$background">
//         <Card elevate size="$4" padding="$6" margin="$4">
//           <YStack space="$4" alignItems="center">
//             <YStack space="$2" alignItems="center">
//               <H1 color="$color" textAlign="center">
//                 Join Hoova
//               </H1>
//               <H4 color="$color11" textAlign="center" fontWeight="normal">
//                 Create your healthcare account
//               </H4>
//             </YStack>

//             <Separator />

//             <YStack space="$3" width="100%">
//               <XStack space="$2">
//                 <YStack flex={1} space="$2">
//                   <Text fontSize="$4" fontWeight="600" color="$color">
//                     First Name
//                   </Text>
//                   <Input
//                     placeholder="John"
//                     value={formData.firstName}
//                     onChangeText={(text) => updateField('firstName', text)}
//                     borderColor={errors.firstName ? '$red10' : '$borderColor'}
//                   />
//                   {errors.firstName ? (
//                     <Text fontSize="$3" color="$red10">
//                       {errors.firstName}
//                     </Text>
//                   ) : null}
//                 </YStack>

//                 <YStack flex={1} space="$2">
//                   <Text fontSize="$4" fontWeight="600" color="$color">
//                     Last Name
//                   </Text>
//                   <Input
//                     placeholder="Doe"
//                     value={formData.lastName}
//                     onChangeText={(text) => updateField('lastName', text)}
//                     borderColor={errors.lastName ? '$red10' : '$borderColor'}
//                   />
//                   {errors.lastName ? (
//                     <Text fontSize="$3" color="$red10">
//                       {errors.lastName}
//                     </Text>
//                   ) : null}
//                 </YStack>
//               </XStack>

//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Email Address
//                 </Text>
//                 <Input
//                   placeholder="john@example.com"
//                   value={formData.email}
//                   onChangeText={(text) => updateField('email', text)}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   borderColor={errors.email ? '$red10' : '$borderColor'}
//                 />
//                 {errors.email ? (
//                   <Text fontSize="$3" color="$red10">
//                     {errors.email}
//                   </Text>
//                 ) : null}
//               </YStack>

//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Role
//                 </Text>
//                 <Select value={formData.role} onValueChange={(value) => updateField('role', value)}>
//                   <Select.Trigger>
//                     <Select.Value placeholder="Select your role" />
//                   </Select.Trigger>
//                   <Select.Content>
//                     <Select.Item index={0} value="patient">
//                       <Select.ItemText>Patient</Select.ItemText>
//                     </Select.Item>
//                     <Select.Item index={1} value="provider">
//                       <Select.ItemText>Healthcare Provider</Select.ItemText>
//                     </Select.Item>
//                     <Select.Item index={2} value="hospital_admin">
//                       <Select.ItemText>Hospital Administrator</Select.ItemText>
//                     </Select.Item>
//                   </Select.Content>
//                 </Select>
//               </YStack>

//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Password
//                 </Text>
//                 <Input
//                   placeholder="Enter password"
//                   value={formData.password}
//                   onChangeText={(text) => updateField('password', text)}
//                   secureTextEntry
//                   borderColor={errors.password ? '$red10' : '$borderColor'}
//                 />
//                 {errors.password ? (
//                   <Text fontSize="$3" color="$red10">
//                     {errors.password}
//                   </Text>
//                 ) : null}
//               </YStack>

//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Confirm Password
//                 </Text>
//                 <Input
//                   placeholder="Confirm password"
//                   value={formData.confirmPassword}
//                   onChangeText={(text) => updateField('confirmPassword', text)}
//                   secureTextEntry
//                   borderColor={errors.confirmPassword ? '$red10' : '$borderColor'}
//                 />
//                 {errors.confirmPassword ? (
//                   <Text fontSize="$3" color="$red10">
//                     {errors.confirmPassword}
//                   </Text>
//                 ) : null}
//               </YStack>

//               <YStack space="$2">
//                 <Text fontSize="$4" fontWeight="600" color="$color">
//                   Phone Number (Optional)
//                 </Text>
//                 <Input
//                   placeholder="+1 (555) 123-4567"
//                   value={formData.phoneNumber}
//                   onChangeText={(text) => updateField('phoneNumber', text)}
//                   keyboardType="phone-pad"
//                   borderColor={errors.phoneNumber ? '$red10' : '$borderColor'}
//                 />
//                 {errors.phoneNumber ? (
//                   <Text fontSize="$3" color="$red10">
//                     {errors.phoneNumber}
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
//                 onPress={handleSignup}
//                 disabled={authenticating}
//                 marginTop="$2"
//               >
//                 {authenticating ? (
//                   <XStack space="$2" alignItems="center">
//                     <Spinner size="small" />
//                     <Text color="$color">Creating Account...</Text>
//                   </XStack>
//                 ) : (
//                   <Text color="$color">Create Account</Text>
//                 )}
//               </Button>
//             </YStack>

//             <YStack space="$3" alignItems="center" width="100%">
//               <Separator />

//               <XStack space="$2" alignItems="center">
//                 <Text fontSize="$3" color="$color11">
//                   Already have an account?
//                 </Text>
//                 <Button variant="outlined" size="$3" onPress={() => {}} chromeless>
//                   <Text color="$blue10" fontWeight="600">
//                     Sign In
//                   </Text>
//                 </Button>
//               </XStack>
//             </YStack>
//           </YStack>
//         </Card>
//       </YStack>
//     </ScrollView>
//   )
// }

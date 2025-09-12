import React from 'react'
import { YStack, XStack, Text, Button, Card, H2, H4, styled, ScrollView } from '@hoova/ui'

const StepContainer = styled(ScrollView, {
  flex: 1,
  backgroundColor: '$background',
})

const ContentContainer = styled(YStack, {
  minHeight: '100%',
  padding: '$6',
  justifyContent: 'center',
  alignItems: 'center',
  space: '$6',
})

const RoleCard = styled(Card, {
  width: '100%',
  padding: '$4',
  borderRadius: '$4',
  borderWidth: 2,
  borderColor: 'transparent',
  backgroundColor: '$gray2',

  pressStyle: {
    borderColor: '$blue9',
    backgroundColor: '$blue2',
  },

  variants: {
    selected: {
      true: {
        borderColor: '$blue9',
        backgroundColor: '$blue2',
      },
    },
  },
})

interface SelectAccountTypeProps {
  selectedRole: 'patient' | 'provider' | 'hospital_admin'
  onRoleSelect: (role: 'patient' | 'provider' | 'hospital_admin') => void
  onNext: () => void
}

export const SelectAccountType: React.FC<SelectAccountTypeProps> = ({
  selectedRole,
  onRoleSelect,
  onNext,
}) => {
  const roles = [
    {
      id: 'patient' as const,
      title: 'Patient',
      description: 'Access and manage your healthcare records',
      icon: '👤',
    },
    {
      id: 'provider' as const,
      title: 'Healthcare Provider',
      description: 'Provide care and access patient records',
      icon: '🏥',
    },
    {
      id: 'hospital_admin' as const,
      title: 'Hospital Administrator',
      description: 'Manage hospital systems and records',
      icon: '⚕️',
    },
  ]

  return (
    <StepContainer>
      <ContentContainer>
        <YStack space="$4" alignItems="center">
          <H2 color="$color12" textAlign="center">
            Choose Your Role
          </H2>
          <H4 color="$color11" textAlign="center" fontWeight="normal">
            Select how you'll use Hoova
          </H4>
        </YStack>

        <YStack space="$3" width="100%">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              selected={selectedRole === role.id}
              onPress={() => onRoleSelect(role.id)}
              pressable
            >
              <XStack space="$3" alignItems="center">
                <Text fontSize="$6">{role.icon}</Text>
                <YStack flex={1} space="$1">
                  <Text fontSize="$5" fontWeight="600" color="$color12">
                    {role.title}
                  </Text>
                  <Text fontSize="$3" color="$color11">
                    {role.description}
                  </Text>
                </YStack>
              </XStack>
            </RoleCard>
          ))}
        </YStack>

        <Button
          width="100%"
          height="$5"
          backgroundColor="$blue9"
          color="white"
          fontWeight="600"
          fontSize="$4"
          borderRadius="$4"
          onPress={onNext}
          disabled={!selectedRole}
          opacity={selectedRole ? 1 : 0.5}
        >
          Continue
        </Button>
      </ContentContainer>
    </StepContainer>
  )
}

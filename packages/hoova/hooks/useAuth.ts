import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '../store/types'

// Mock API functions
const fetchUserProfile = async (userId: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user data
  return {
    id: userId,
    email: `user${userId}@hoova.com`,
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    profilePicture: 'https://via.placeholder.com/150',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01',
  }
}

const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock update response
  return {
    id: userData.id || '1',
    email: userData.email || 'user@hoova.com',
    firstName: userData.firstName || 'John',
    lastName: userData.lastName || 'Doe',
    role: userData.role || 'patient',
    profilePicture: userData.profilePicture || 'https://via.placeholder.com/150',
    phoneNumber: userData.phoneNumber,
    dateOfBirth: userData.dateOfBirth,
  }
}

// React Query hooks
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Update the cache
      queryClient.setQueryData(['userProfile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
  })
}

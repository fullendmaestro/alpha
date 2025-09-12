import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types for healthcare data
export interface MedicalRecord {
  id: string
  patientId: string
  providerId: string
  title: string
  description: string
  date: string
  type: 'diagnosis' | 'prescription' | 'lab_result' | 'imaging' | 'visit_note'
  status: 'active' | 'inactive' | 'archived'
  attachments?: string[]
}

export interface HealthcareProvider {
  id: string
  firstName: string
  lastName: string
  title: string
  specialty: string
  hospitalId: string
  email: string
  phoneNumber: string
  profilePicture?: string
}

export interface Hospital {
  id: string
  name: string
  address: string
  phoneNumber: string
  website?: string
  specialties: string[]
}

// Mock API functions
const fetchMedicalRecords = async (patientId: string): Promise<MedicalRecord[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock medical records
  return [
    {
      id: '1',
      patientId,
      providerId: 'dr1',
      title: 'Annual Physical Examination',
      description: 'Routine annual check-up. Patient appears healthy with no significant concerns.',
      date: '2024-03-15',
      type: 'visit_note',
      status: 'active',
    },
    {
      id: '2',
      patientId,
      providerId: 'dr2',
      title: 'Blood Test Results',
      description:
        'Complete Blood Count (CBC) and Basic Metabolic Panel. All values within normal range.',
      date: '2024-03-10',
      type: 'lab_result',
      status: 'active',
    },
    {
      id: '3',
      patientId,
      providerId: 'dr1',
      title: 'Hypertension Management',
      description: 'Prescribed Lisinopril 10mg daily for blood pressure management.',
      date: '2024-02-20',
      type: 'prescription',
      status: 'active',
    },
  ]
}

const fetchProviders = async (): Promise<HealthcareProvider[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: 'dr1',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      title: 'MD',
      specialty: 'Internal Medicine',
      hospitalId: 'hosp1',
      email: 'sarah.johnson@hospital.com',
      phoneNumber: '+1-555-0123',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 'dr2',
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      title: 'MD, PhD',
      specialty: 'Cardiology',
      hospitalId: 'hosp1',
      email: 'michael.chen@hospital.com',
      phoneNumber: '+1-555-0124',
      profilePicture: 'https://via.placeholder.com/150',
    },
  ]
}

const fetchHospitals = async (): Promise<Hospital[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return [
    {
      id: 'hosp1',
      name: 'City General Hospital',
      address: '123 Healthcare Drive, Medical City, MC 12345',
      phoneNumber: '+1-555-0100',
      website: 'https://citygeneral.com',
      specialties: ['Emergency Medicine', 'Internal Medicine', 'Cardiology', 'Oncology'],
    },
    {
      id: 'hosp2',
      name: "St. Mary's Medical Center",
      address: '456 Wellness Blvd, Health Town, HT 67890',
      phoneNumber: '+1-555-0200',
      website: 'https://stmarysmedical.com',
      specialties: ['Pediatrics', 'Obstetrics', 'Orthopedics', 'Neurology'],
    },
  ]
}

// React Query hooks
export const useMedicalRecords = (patientId: string | undefined) => {
  return useQuery({
    queryKey: ['medicalRecords', patientId],
    queryFn: () => fetchMedicalRecords(patientId!),
    enabled: !!patientId,
  })
}

export const useProviders = () => {
  return useQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders,
  })
}

export const useHospitals = () => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: fetchHospitals,
  })
}

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (record: Omit<MedicalRecord, 'id'>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { id: Date.now().toString(), ...record }
    },
    onSuccess: (newRecord) => {
      // Update the cache
      queryClient.invalidateQueries({ queryKey: ['medicalRecords', newRecord.patientId] })
    },
  })
}

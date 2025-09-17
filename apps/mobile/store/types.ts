// Redux store types for Hoova healthcare app

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'patient' | 'provider' | 'hospital_admin'
  profilePicture?: string
  dateOfBirth?: string
  phoneNumber?: string
}

export interface AuthState {
  authenticated: boolean
  authenticating: boolean
  user: User | null
  passwordCyoherStoreID: string | null
  onBoarded: boolean
  loginError: string | null
}

export interface RootState {
  auth: AuthState
}

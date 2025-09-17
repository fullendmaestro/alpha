import { createSelector } from '@reduxjs/toolkit'
import type { RootState, AuthState } from '../types'

// Base selectors
export const selectAuthState = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.authenticated
export const selectIsAuthenticating = (state: RootState) => state.auth.authenticating
export const selectOnBoarded = (state: RootState) => state.auth.onBoarded
export const selectUser = (state: RootState) => state.auth.user
export const selectLoginError = (state: RootState) => state.auth.loginError

// Derived selectors
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectIsAuthenticating],
  (isAuthenticated, isAuthenticating) => {
    if (isAuthenticating) return 'loading'
    return isAuthenticated ? 'authenticated' : 'unauthenticated'
  }
)

export const selectUserDisplayName = createSelector([selectUser], (user) => {
  if (!user) return null
  return `${user.firstName} ${user.lastName}`
})

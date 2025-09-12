/**
 * Healthcare-focused design tokens for Hoova
 * These tokens align with the healthcare design system and provide
 * semantic color naming for healthcare applications
 */

export const healthcareTokens = {
  // Primary brand colors
  primary: {
    50: '#FEFEFF',
    100: '#F8F7FE',
    200: '#F1EFFD',
    300: '#E9E5FB',
    400: '#DFD8F9',
    500: '#7A58E3', // Main brand color
    600: '#6B4DD6',
    700: '#5D42C9',
    800: '#2D1B69',
    900: '#1A0F42',
  },

  // Healthcare blue for trust and reliability
  blue: {
    50: '#FBFCFF',
    100: '#F4F7FE',
    200: '#EDF2FD',
    300: '#E5EDFC',
    400: '#DCE7FB',
    500: '#4B58FA', // Trust blue
    600: '#3E4BF0',
    700: '#323EE6',
    800: '#0F1B4D',
    900: '#07104E',
  },

  // Navy for professional healthcare contexts
  navy: {
    50: '#FAFBFD',
    100: '#F2F4F9',
    200: '#EAECF5',
    300: '#E1E5F1',
    400: '#D8DDEC',
    500: '#07104E', // Professional navy
    600: '#061044',
    700: '#050E3A',
    800: '#020619',
    900: '#010308',
  },

  // Accent colors for highlights and CTAs
  accent: {
    50: '#FFFCF7',
    100: '#FFF7E7',
    200: '#FFF1D7',
    300: '#FFEBC7',
    400: '#FFE4B7',
    500: '#FFC79A', // Warm accent
    600: '#FFBF77',
    700: '#FFB654',
    800: '#8A5600',
    900: '#5C3900',
  },

  // Semantic colors for healthcare contexts
  semantic: {
    success: '#10B981', // Healthy/positive outcomes
    warning: '#F59E0B', // Caution/attention needed
    error: '#EF4444', // Critical/emergency
    info: '#3B82F6', // Information/neutral
  },

  // Neutral grays with healthcare warmth
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
}

// Theme-specific color mappings
export const themeColors = {
  light: {
    background: {
      primary: healthcareTokens.primary[50],
      secondary: healthcareTokens.primary[100],
      tertiary: healthcareTokens.neutral[50],
    },
    text: {
      primary: healthcareTokens.navy[800],
      secondary: healthcareTokens.navy[600],
      tertiary: healthcareTokens.neutral[600],
    },
    border: {
      primary: healthcareTokens.primary[300],
      secondary: healthcareTokens.neutral[200],
    },
    interactive: {
      primary: healthcareTokens.primary[500],
      secondary: healthcareTokens.blue[500],
      tertiary: healthcareTokens.accent[500],
    },
  },
  dark: {
    background: {
      primary: healthcareTokens.navy[900],
      secondary: healthcareTokens.navy[800],
      tertiary: healthcareTokens.navy[700],
    },
    text: {
      primary: healthcareTokens.neutral[50],
      secondary: healthcareTokens.neutral[200],
      tertiary: healthcareTokens.neutral[400],
    },
    border: {
      primary: healthcareTokens.navy[600],
      secondary: healthcareTokens.navy[500],
    },
    interactive: {
      primary: healthcareTokens.primary[400],
      secondary: healthcareTokens.blue[400],
      tertiary: healthcareTokens.accent[400],
    },
  },
}

// Component-specific tokens
export const componentTokens = {
  button: {
    primary: {
      background: healthcareTokens.primary[500],
      hover: healthcareTokens.primary[600],
      active: healthcareTokens.primary[700],
      text: '#FFFFFF',
    },
    secondary: {
      background: healthcareTokens.blue[500],
      hover: healthcareTokens.blue[600],
      active: healthcareTokens.blue[700],
      text: '#FFFFFF',
    },
    accent: {
      background: healthcareTokens.accent[500],
      hover: healthcareTokens.accent[600],
      active: healthcareTokens.accent[700],
      text: healthcareTokens.navy[800],
    },
  },
  card: {
    background: healthcareTokens.primary[50],
    border: healthcareTokens.primary[200],
    shadow: 'rgba(122, 88, 227, 0.08)',
  },
  input: {
    background: '#FFFFFF',
    border: healthcareTokens.neutral[300],
    focus: healthcareTokens.primary[500],
    placeholder: healthcareTokens.neutral[500],
  },
}

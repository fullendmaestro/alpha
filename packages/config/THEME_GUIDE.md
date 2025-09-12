# Hoova Healthcare Theme System

This document explains the healthcare-focused theme system implemented for the Hoova platform.

## Overview

The theme system is built on Tamagui's theme builder and includes healthcare-specific color palettes, semantic tokens, and component themes designed for medical applications.

## Color Palette

### Primary Colors

- **Hoova Primary (#7A58E3)**: Main brand color, purple gradient representing trust and innovation
- **Healthcare Blue (#4B58FA)**: Professional blue for trust and reliability
- **Healthcare Navy (#07104E)**: Deep navy for professional contexts and high contrast
- **Healthcare Accent (#FFC79A)**: Warm accent color for highlights and CTAs

### Usage in Components

```typescript
import { styled } from '@hoova/ui'

// Using theme tokens
const HealthcareButton = styled(Button, {
  backgroundColor: '$hoovaPrimary9', // Main brand color
  color: '$white1',

  hoverStyle: {
    backgroundColor: '$hoovaPrimary10',
  },

  pressStyle: {
    backgroundColor: '$hoovaPrimary11',
  },
})

// Using healthcare tokens directly
import { healthcareTokens } from '@hoova/config'

const PatientCard = styled(Card, {
  backgroundColor: healthcareTokens.primary[50],
  borderColor: healthcareTokens.primary[200],
  shadowColor: 'rgba(122, 88, 227, 0.08)',
})
```

## Available Themes

### Base Themes

- `light` - Light healthcare theme with purple tints
- `dark` - Dark healthcare theme with navy base

### Color Themes

- `hoovaPrimary` - Purple-based theme (primary brand)
- `hoovaBlue` - Blue-based theme (trust/reliability)
- `hoovaNavy` - Navy-based theme (professional)
- `hoovaAccent` - Accent-based theme (highlights)

### Component Themes

- `HealthCard` - Cards for healthcare content
- `MedicalButton` - Buttons for medical actions
- `PatientCard` - Patient information cards
- `RecordItem` - Medical record items

## Theme Switching

```typescript
// In your app root
import { TamaguiProvider } from 'tamagui'
import { config } from '@hoova/config'

function App() {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      {/* Toggle between themes */}
      <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Switch Theme
      </Button>

      {/* Use healthcare-specific themes */}
      <Theme name="hoovaPrimary">
        <HealthcareButton>Primary Action</HealthcareButton>
      </Theme>

      <Theme name="hoovaBlue">
        <PatientCard>Patient Information</PatientCard>
      </Theme>
    </TamaguiProvider>
  )
}
```

## Healthcare Color Guidelines

### When to Use Each Color

1. **Primary Purple (#7A58E3)**

   - Main CTAs and primary actions
   - Brand elements and logos
   - Progress indicators and active states

2. **Healthcare Blue (#4B58FA)**

   - Trust-building elements
   - Information displays
   - Secondary actions

3. **Healthcare Navy (#07104E)**

   - Text and headers
   - Professional contexts
   - High contrast needs

4. **Healthcare Accent (#FFC79A)**
   - Highlights and notifications
   - Success states
   - Warm, approachable elements

### Accessibility

All color combinations have been tested for WCAG AA compliance:

- Text contrast ratios meet minimum 4.5:1 requirement
- Interactive elements have clear focus indicators
- Color is not the only way to convey information

## Component Examples

### Healthcare Button

```typescript
<Theme name="hoovaPrimary">
  <Button size="$4" theme="MedicalButton">
    Schedule Appointment
  </Button>
</Theme>
```

### Patient Information Card

```typescript
<Theme name="hoovaBlue">
  <Card theme="PatientCard" padding="$4">
    <Text fontSize="$5" fontWeight="600">John Doe</Text>
    <Text color="$color11">Patient ID: 12345</Text>
  </Card>
</Theme>
```

### Medical Record Item

```typescript
<Theme name="hoovaNavy">
  <ListItem theme="RecordItem">
    <Text>Blood Test Results</Text>
    <Text color="$color10">Normal Range</Text>
  </ListItem>
</Theme>
```

## Custom Theme Creation

To create custom themes for specific healthcare contexts:

```typescript
// In your component
const customHealthcareTheme = {
  background: healthcareTokens.primary[50],
  color: healthcareTokens.navy[800],
  borderColor: healthcareTokens.primary[300],
  // ... other theme properties
}

<Theme {...customHealthcareTheme}>
  <YourComponent />
</Theme>
```

## Best Practices

1. **Consistency**: Use theme tokens instead of hardcoded colors
2. **Accessibility**: Always test color combinations for contrast
3. **Semantic**: Use colors that match their healthcare context
4. **Responsive**: Consider both light and dark theme variants
5. **Platform**: Use platform-specific color adjustments when needed

## Migration Guide

If migrating from the previous theme system:

1. Replace generic color references with healthcare tokens
2. Update component themes to use new healthcare-specific variants
3. Test all color combinations for healthcare appropriateness
4. Update any custom theme definitions to use new color scales

For questions or theme customization needs, refer to the Tamagui documentation or create an issue in the repository.

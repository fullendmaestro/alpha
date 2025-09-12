# Copilot instructions

## Project Overview

This is a monorepo for Hoova, a decentralized healthcare record management platform:

- **Web** (`apps/web/`): Healthcare record management web interface for patients, providers, and hospitals
- **Mobile** (`apps/mobile/`): Mobile interface for healthcare record management using expo with react native

## Architecture Overview

### Monorepo Structure

- **Turborepo** for build orchestration
- **Yarn workspaces** for package management
- Shared code in `packages/` directory
- App-specific code in `apps/` directory

### Key Technologies

- **TypeScript** everywhere
- **React** for web
- **React Native** for mobile
- **Redux Toolkit** for state management
- **Tamagui** for cross-platform UI components
- **Blockchain** (Hedera Hashgraph, EVM-compatible chains) for record management

### Code Organization Principles

#### Styling

- **ALWAYS** use `styled` from `ui/src` (never styled-components or direct Tamagui)
- Use theme tokens instead of hardcoded values
- Platform-specific files: `Component.ios.tsx`, `Component.android.tsx`

#### State Management

- **Redux** for complex global state
- **Zustand** for simple state
- Keep state as local as possible
- No custom hooks for simple data fetching - use `useQuery`/`useMutation` directly

#### Component Structure

1. State declarations at top
2. Event handlers after state
3. Memoize properly, especially for anything that might be used in the React Native app
4. JSX at the end
5. Keep components under 250 lines

#### TypeScript Conventions

- Do not use `any`, prefer `unknown`
- Always consider strict mode
- Use explicit return types
- PascalCase for types/interfaces
- camelCase for variables/functions
- String enums with initializers

## Testing + Formatting Guidelines

- Test behaviors, not implementations
- Always update existing unit tests related to changes made
- Run tests before considering a task to be 'complete'
- Also run linting and typecheck before considering a task to be 'complete'

## Critical Development Notes

1. **Environment Variables**: Override URLs in `.env.defaults.local` (mobile) or `.env` (web)
2. **Pre-commit Hooks**: Use `--no-verify` to skip or set `export HUSKY=0` to disable
3. **Python Setup**: Run `brew install python-setuptools` if you encounter Python module errors
4. **Mobile Development**: Always run `yarn mobile pod` after dependency changes
5. **Bundle Size**: Monitor bundle size impacts when adding dependencies

## Package Dependencies

Core shared packages:

- `packages/ui/` - Cross-platform UI components and theme
- `packages/hooks/` - Shared React/TypeScript hooks for healthcare logic
- `packages/hoova/` - Utilities for the entire application including the screens, store, sdks, etc

## Healthcare Blockchain Integration

- Support for Hedera Hashgraph only
- Healthcare record management, access grants, and audit trails via smart contracts
- Multiple wallet providers (WalletConnect, Metamask, etc.)
- Transaction building and gas estimation for healthcare operations

## Other Considerations

**Always check and reference the specific app in `apps/` or package in `packages/` you are working on.**
For every change:

- Review and update the relevant configuration files (`package.json`, `tsconfig.json`, etc.) in that app or package.
- Ensure dependencies, scripts, and TypeScript settings are correct for the context.
- Validate imports/exports and local usage within the app/package.
- If adding or modifying shared code, confirm compatibility across all affected apps/packages.
  This ensures changes are properly scoped and integrated within the Hoova monorepo structure.

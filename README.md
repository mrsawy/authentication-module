# Testing Documentation

## Overview

This project uses **Jest** and **React Testing Library** for comprehensive unit and integration testing.

## Test Structure

```
__tests__/
├── app/
│   └── pages.test.tsx          # Page component tests
├── components/
│   ├── atoms/
│   │   ├── button.test.tsx     # Button component tests
│   │   └── input.test.tsx      # Input component tests
│   ├── molecules/
│   │   ├── combobox.test.tsx   # Combobox component tests
│   │   └── nav-user.test.tsx   # NavUser component tests
│   └── organs/
│       ├── loader.test.tsx     # Loader component tests
│       └── phone-input.test.tsx # PhoneInput component tests
└── lib/
    ├── schema/
    │   └── auth.schema.test.ts # Schema validation tests
    ├── store/
    │   └── generalStore.test.ts # Zustand store tests
    └── utils/
        └── cn.test.ts          # Utility function tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Run tests with coverage
```bash
pnpm test:coverage
```

### Run tests in CI mode
```bash
pnpm test:ci
```

## Test Coverage

The test suite covers:

- ✅ **Components**: All UI components (atoms, molecules, organs)
- ✅ **Forms**: Login and Signup forms with validation
- ✅ **Utils**: Helper functions like `cn()`
- ✅ **Schemas**: Yup validation schemas
- ✅ **Store**: Zustand state management
- ✅ **Pages**: All page components

## Writing New Tests

### Component Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { YourComponent } from '@/components/your-component'

describe('some Component', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    const handleClick = jest.fn()
    render(<YourComponent onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Testing Best Practices

1. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
2. **User-Centric**: Test from the user's perspective using accessible queries
3. **Isolation**: Each test should be independent and not rely on others
4. **Mocking**: Mock external dependencies (API calls, navigation, etc.)
5. **Cleanup**: Use beforeEach/afterEach for setup and teardown

## Common Testing Patterns

### Testing Forms
```typescript
await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com')
fireEvent.submit(screen.getByRole('form'))
```

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### Testing State Changes
```typescript
act(() => {
  useGeneralStore.setState({ generalIsLoading: true })
})
```

### Testing Error States
```typescript
await expect(schema.validate(invalidData)).rejects.toThrow('Error message')
```

## Mocked Dependencies

The following are mocked globally in `jest.setup.js`:

- `next/navigation` (useRouter, usePathname, etc.)
- `next/image`
- `next-themes`
- Environment variables
- Window.matchMedia


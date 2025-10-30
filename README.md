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

describe('YourComponent', () => {
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

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Debugging Tests

### Run specific test file
```bash
npm test button.test.tsx
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="renders correctly"
```

### Debug in VS Code
Add this to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

Tests automatically run on:
- Pull requests
- Commits to main branch
- Pre-commit hooks (recommended)

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

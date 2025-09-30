# Testing Guide

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing.

## Quick Start

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

```
src/
├── __tests__/           # Global test files
├── components/
│   └── shared/
│       └── __tests__/    # Component-specific tests
└── test/
    ├── setup.ts         # Test environment setup
    ├── utils.tsx        # Testing utilities
    └── mocks.ts         # Mock implementations
```

## Writing Tests

### Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const mockFn = vi.fn();
    render(<MyComponent onClick={mockFn} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });
});
```

### Testing with Context

```tsx
import { render } from 'src/test/utils'; // Uses custom render with providers

describe('Component with Context', () => {
  it('renders with context', () => {
    render(<MyComponent />);
    // Test will have access to QueryClient and other providers
  });
});
```

## Mock Data

Use the provided mock data generators:

```tsx
import { mockLead, mockCompany, mockJob } from 'src/test/utils';

describe('LeadComponent', () => {
  it('displays lead information', () => {
    render(<LeadComponent lead={mockLead} />);
    expect(screen.getByText(mockLead.name)).toBeInTheDocument();
  });
});
```

## Testing Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (`getByRole`, `getByLabelText`)
3. **Test accessibility** (ARIA attributes, keyboard navigation)
4. **Mock external dependencies** (APIs, localStorage, etc.)
5. **Keep tests focused** (one concept per test)
6. **Use descriptive test names**

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## CI/CD Integration

Tests run automatically on:
- Push to main/master/develop branches
- Pull requests
- Multiple Node.js versions (18.x, 20.x)

Coverage reports are uploaded to Codecov for tracking.
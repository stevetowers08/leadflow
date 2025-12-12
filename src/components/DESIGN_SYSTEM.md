# Design System Documentation

This document outlines the design system architecture, patterns, and best practices for LeadFlow components.

## Component Architecture

### File Organization

```
src/components/
├── ui/                    # Base shadcn/ui components (Button, Input, etc.)
├── composite/            # Complex composed components
│   ├── forms/            # Form patterns
│   ├── navigation/       # Nav patterns
│   └── data-display/     # Tables, cards, lists
└── layout/               # Layout components (Container, Grid, Stack)
```

### Component Patterns

#### 1. Compound Component Pattern

For complex components, use the compound pattern:

```typescript
// card.tsx
export const Card = ({ children, ...props }) => (
  <div className="rounded-lg border bg-card" {...props}>
    {children}
  </div>
);

Card.Header = ({ children, ...props }) => (
  <div className="flex flex-col space-y-1.5 p-6" {...props}>
    {children}
  </div>
);

Card.Title = ({ children, ...props }) => (
  <h3 className="font-semibold leading-none tracking-tight" {...props}>
    {children}
  </h3>
);

// Usage:
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
</Card>
```

#### 2. Variant System with CVA

Use class-variance-authority for variant management:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

#### 3. TypeScript Excellence

```typescript
// Always export prop types for documentation and reusability
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

## Design Tokens

All components MUST use design tokens from `@/lib/design-tokens`:

- **Colors**: Use `colorTokens` - never hardcoded colors
- **Spacing**: Use `spacingTokens` - never hardcoded spacing
- **Typography**: Use `typographyTokens` - never hardcoded font sizes
- **Borders**: Use `borderTokens` - never hardcoded border radius
- **Shadows**: Use `shadowTokens` - never hardcoded shadows
- **Animations**: Use `animationTokens` - never hardcoded durations

See `src/lib/design-tokens/README.md` for full documentation.

## Accessibility Requirements

Every component MUST include:

1. **Keyboard Navigation**: Full keyboard operability
2. **ARIA Labels**: Proper ARIA attributes for all interactive elements
3. **Focus Management**: Visible focus indicators, logical tab order
4. **Screen Reader Support**: Descriptive labels, live regions where needed
5. **Color Contrast**: Minimum WCAG AA (4.5:1 for text)

### Implementation Pattern

```typescript
<Button
  aria-label="Delete item"
  aria-describedby="delete-description"
  disabled={isLoading}
>
  Delete
</Button>
```

See `src/lib/design-tokens/accessibility.ts` for accessibility patterns.

## Testing Strategy

Write tests FIRST, then the code, then run tests and update until all pass.

### Testing Tools

- **Unit Tests**: Vitest + React Testing Library
- **Accessibility**: @axe-core/react automated tests

### Test Structure

```typescript
describe('Button', () => {
  it('renders with correct variant styles', () => {
    // test implementation
  });

  it('handles click events', () => {
    // test implementation
  });

  it('is keyboard accessible', () => {
    // test implementation
  });
});
```

## Component Documentation Template

Every component needs:

```markdown
# Component Name

## Overview

Brief description of the component and its purpose.

## Usage

\`\`\`tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">
  Click me
</Button>
\`\`\`

## API Reference

| Prop    | Type                       | Default   | Description          |
| ------- | -------------------------- | --------- | -------------------- |
| variant | "default" \| "destructive" | "default" | Visual style variant |

## Accessibility

- Keyboard: Space/Enter activates
- Screen reader: Announced as button with label

## Design Tokens Used

- Colors: `--primary`, `--primary-foreground`
- Spacing: `spacing-4`, `spacing-2`
```

## File Naming & Code Style

### Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Interfaces**: PascalCase (`ButtonProps`)

### Code Style Rules

```typescript
// ✅ DO: Use functional components
export function Button({ variant, ...props }: ButtonProps) { }

// ❌ DON'T: Use class components
export class Button extends React.Component { }

// ✅ DO: Use composition
<Card>
  <Card.Header />
  <Card.Content />
</Card>

// ✅ DO: Destructure props
const Button = ({ variant, size, ...rest }) => { }
```

## Performance Optimization

### Bundle Size

```typescript
// ✅ Use dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <Skeleton />
});

// ✅ Use React.memo for expensive renders
export const ExpensiveList = React.memo(({ items }) => {
  // component implementation
});
```

## Responsive Design

### Breakpoint System

```typescript
// Use Tailwind's responsive prefixes consistently
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>

// Standard breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

## Success Criteria

A component is complete when it has:

✅ Full TypeScript types
✅ All variants implemented
✅ Accessibility verified (keyboard + screen reader)
✅ Unit tests written and passing
✅ Documentation with examples
✅ Responsive behavior verified
✅ Design tokens used (no hardcoded values)
✅ Dark mode support (if applicable)

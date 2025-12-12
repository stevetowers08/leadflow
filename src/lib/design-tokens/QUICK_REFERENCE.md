# Design Tokens Quick Reference

Quick reference guide for using design tokens in components.

## Import

```typescript
import {
  colorTokens,
  spacingTokens,
  typographyTokens,
  borderTokens,
  shadowTokens,
  animationTokens,
  accessibilityTokens,
} from '@/lib/design-tokens';
```

## Colors

```typescript
// Use Tailwind classes (recommended)
<div className="bg-primary text-primary-foreground">
<div className="bg-success text-success-foreground">
<div className="bg-destructive text-destructive-foreground">

// Or reference CSS variables directly
<div style={{ backgroundColor: `hsl(${colorTokens.semantic.primary})` }}>
```

## Spacing

```typescript
// Use Tailwind spacing scale
<div className="p-6"> {/* 1.5rem */}
<div className="gap-4"> {/* 1rem */}

// Semantic spacing
<div className="p-6"> {/* card.default: 1.5rem */}
```

## Typography

```typescript
// Use Tailwind classes with CSS variables
<h1 className="text-2xl font-heading">Title</h1>
<p className="text-sm font-body">Body text</p>

// Font weights from CSS variables
<span className="font-heading">Semibold</span>
<span className="font-body">Medium</span>
```

## Borders

```typescript
// Border radius
<div className="rounded-lg"> {/* var(--radius): 12px */}
<div className="rounded-md"> {/* calc(var(--radius) - 2px): 10px */}
<div className="rounded-sm"> {/* calc(var(--radius) - 4px): 8px */}

// Border styles
<div className="border border-border">
```

## Shadows

```typescript
// Elevation levels
<div className="shadow-sm">  {/* Level 1: Subtle */}
<div className="shadow-md">  {/* Level 2: Medium */}
<div className="shadow-lg">  {/* Level 3: High */}
<div className="shadow-xl">  {/* Level 4: Highest */}
```

## Animations

```typescript
// Transitions
<div className="transition-colors duration-200 ease-out">
<div className="transition-all duration-200 ease-out">

// Animations
<div className="animate-pulse">
<div className="animate-spin">
```

## Accessibility

```typescript
// ARIA attributes
<button aria-label="Delete item" aria-describedby="delete-desc">
  Delete
</button>

// Keyboard navigation
// Space/Enter for buttons
// Arrow keys for navigation
// Escape to close modals

// Focus management
<button className="focus-visible:ring-2 focus-visible:ring-primary">
  Button
</button>
```

## Common Patterns

### Button with Variants

```typescript
<Button variant="default" size="lg">
  Click me
</Button>
```

### Card with Compound Pattern

```typescript
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

### Responsive Design

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

## ❌ Don't Do This

```typescript
// ❌ Hardcoded colors
<div style={{ backgroundColor: '#2563EB' }}>

// ❌ Hardcoded spacing
<div style={{ padding: '24px' }}>

// ❌ Hardcoded font sizes
<div style={{ fontSize: '16px' }}>

// ❌ Missing accessibility
<button onClick={handleClick}>Click</button>
```

## ✅ Do This

```typescript
// ✅ Use Tailwind classes with CSS variables
<div className="bg-primary p-6 text-base">

// ✅ Use design tokens
<div className={cn('bg-primary', spacingTokens.semantic.card.default)}>

// ✅ Include accessibility
<button
  onClick={handleClick}
  aria-label="Click button"
  className="focus-visible:ring-2"
>
  Click
</button>
```

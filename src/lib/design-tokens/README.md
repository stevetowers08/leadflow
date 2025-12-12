# Design Tokens

Centralized design token system for LeadFlow. All design decisions (colors, spacing, typography, etc.) are defined here and referenced through CSS variables.

## Structure

```
src/lib/design-tokens/
├── colors.ts          # Color tokens (semantic, sidebar, gradients)
├── spacing.ts         # Spacing scale and semantic spacing
├── typography.ts      # Font system (weights, sizes, line heights)
├── borders.ts         # Border radius, widths, styles
├── shadows.ts         # Shadow/elevation system
├── animations.ts      # Motion and transition tokens
├── accessibility.ts  # ARIA patterns, keyboard navigation
└── index.ts          # Central export
```

## Usage

### Importing Tokens

```typescript
import {
  colorTokens,
  spacingTokens,
  typographyTokens,
} from '@/lib/design-tokens';
```

### Using Color Tokens

```typescript
// In component styles
<div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
  Content
</div>

// Or use Tailwind classes that reference CSS variables
<div className="bg-primary text-primary-foreground">
  Content
</div>
```

### Using Spacing Tokens

```typescript
// Use semantic spacing
<div className="p-6"> {/* Uses spacingTokens.semantic.card.default */}

// Or reference CSS variables directly
<div style={{ padding: spacingTokens.semantic.card.default }}>
  Content
</div>
```

### Using Typography Tokens

```typescript
// Use Tailwind classes with CSS variables
<h1 className="text-2xl font-heading">Title</h1>

// Or reference tokens directly
<h1 style={{
  fontSize: typographyTokens.semantic.heading.h1.size,
  fontWeight: typographyTokens.semantic.heading.h1.weight
}}>
  Title
</h1>
```

## Design Token Principles

1. **CSS Variables First**: All tokens reference CSS variables defined in `globals.css`
2. **Semantic Naming**: Use semantic names (primary, success, warning) not color names (blue, green, red)
3. **No Hardcoded Values**: Never use hardcoded colors, spacing, or other design values
4. **Type Safety**: All tokens are typed for TypeScript support
5. **Accessibility**: All tokens meet WCAG AA contrast requirements

## Adding New Tokens

1. Add the CSS variable to `src/app/globals.css`
2. Add the token reference to the appropriate token file
3. Export from `index.ts`
4. Update TypeScript types if needed

## Examples

See component examples in:

- `src/components/ui/button.tsx` - CVA variant system
- `src/components/composite/card/card.tsx` - Compound component pattern

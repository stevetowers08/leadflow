# Empowr CRM - Design System Guide

## Table of Contents
- [Design Philosophy](#design-philosophy)
- [Design Tokens](#design-tokens)
- [Typography](#typography)
- [Color System](#color-system)
- [Layout & Spacing](#layout--spacing)
- [Components](#components)
- [Icons & Imagery](#icons--imagery)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

## Design Philosophy

### Core Principles
1. **Consistency**: Unified visual language across all interfaces
2. **Clarity**: Clear hierarchy and intuitive navigation
3. **Efficiency**: Streamlined workflows for productivity
4. **Accessibility**: Inclusive design for all users
5. **Scalability**: Flexible system that grows with the product

### Visual Style
- **Modern & Professional**: Clean, business-focused aesthetic
- **Data-Driven**: Emphasis on clear data visualization
- **Minimal**: Reduced visual noise, focus on content
- **Trustworthy**: Reliable and stable visual foundation

## Design Tokens

### Implementation
Design tokens are centralized in `src/design-system/tokens.ts`:

```typescript
export const designTokens = {
  colors: {
    primary: '#3b82f6',      // Blue
    secondary: '#6366f1',    // Indigo
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    error: '#ef4444',        // Red
    muted: '#6b7280',        // Gray
    background: '#ffffff',   // White
    surface: '#f9fafb',      // Light gray
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

## Typography

### Font Stack
- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, -apple-system, sans-serif
- **Monospace**: 'Fira Code', 'Consolas', monospace

### Type Scale
```css
/* Headings */
.text-3xl { font-size: 1.875rem; font-weight: 700; } /* Page titles */
.text-2xl { font-size: 1.5rem; font-weight: 600; }   /* Section titles */
.text-xl  { font-size: 1.25rem; font-weight: 600; }  /* Card titles */
.text-lg  { font-size: 1.125rem; font-weight: 500; } /* Subheadings */

/* Body text */
.text-base { font-size: 1rem; font-weight: 400; }    /* Default body */
.text-sm   { font-size: 0.875rem; font-weight: 400; } /* Secondary text */
.text-xs   { font-size: 0.75rem; font-weight: 400; }  /* Captions */
```

### Usage Examples
```tsx
// Page title
<h1 className="text-3xl font-bold text-gray-900">Reporting & Analytics</h1>

// Section heading
<h2 className="text-2xl font-semibold text-gray-900">Daily Activity Trends</h2>

// Card title
<h3 className="text-lg font-semibold text-gray-900">Total People</h3>

// Body text
<p className="text-base text-gray-700">Description text goes here.</p>

// Secondary text
<span className="text-sm text-gray-500">Last updated 2 hours ago</span>

// Caption text
<span className="text-xs text-gray-400">Optional helper text</span>
```

## Color System

### Primary Palette
```css
/* Primary Blue - Main brand color */
--primary-50:  #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;  /* Main primary */
--primary-600: #2563eb;
--primary-900: #1e3a8a;

/* Secondary Indigo - Accent color */
--secondary-50:  #eef2ff;
--secondary-100: #e0e7ff;
--secondary-500: #6366f1;  /* Main secondary */
--secondary-600: #5b21b6;
--secondary-900: #312e81;
```

### Semantic Colors
```css
/* Success Green */
--success-50:  #ecfdf5;
--success-100: #d1fae5;
--success-500: #10b981;  /* Main success */
--success-600: #059669;
--success-900: #064e3b;

/* Warning Amber */
--warning-50:  #fffbeb;
--warning-100: #fef3c7;
--warning-500: #f59e0b;  /* Main warning */
--warning-600: #d97706;
--warning-900: #78350f;

/* Error Red */
--error-50:  #fef2f2;
--error-100: #fee2e2;
--error-500: #ef4444;  /* Main error */
--error-600: #dc2626;
--error-900: #7f1d1d;
```

### Neutral Grays
```css
/* Gray scale for text and backgrounds */
--gray-50:  #f9fafb;  /* Light backgrounds */
--gray-100: #f3f4f6;  /* Card backgrounds */
--gray-200: #e5e7eb;  /* Borders */
--gray-300: #d1d5db;  /* Disabled states */
--gray-400: #9ca3af;  /* Placeholder text */
--gray-500: #6b7280;  /* Secondary text */
--gray-600: #4b5563;  /* Primary text */
--gray-700: #374151;  /* Headings */
--gray-800: #1f2937;  /* Dark headings */
--gray-900: #111827;  /* Highest contrast */
```

### Usage Guidelines
```tsx
// Status indicators
<Badge className="bg-success-100 text-success-800">Active</Badge>
<Badge className="bg-warning-100 text-warning-800">Pending</Badge>
<Badge className="bg-error-100 text-error-800">Failed</Badge>

// Interactive elements
<Button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Action
</Button>

<Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
  Secondary Action
</Button>

// Text hierarchy
<h1 className="text-gray-900">Main heading</h1>
<p className="text-gray-700">Body text</p>
<span className="text-gray-500">Secondary text</span>
<span className="text-gray-400">Placeholder text</span>
```

## Layout & Spacing

### Grid System
```css
/* Container widths */
.container-sm  { max-width: 640px; }   /* Mobile */
.container-md  { max-width: 768px; }   /* Tablet */
.container-lg  { max-width: 1024px; }  /* Desktop */
.container-xl  { max-width: 1280px; }  /* Large desktop */
.container-2xl { max-width: 1536px; }  /* Extra large */

/* Grid layouts */
.grid-cols-1   { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2   { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3   { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4   { grid-template-columns: repeat(4, 1fr); }
```

### Spacing Scale
```css
/* Padding and margin utilities */
.p-1  { padding: 0.25rem; }   /* 4px */
.p-2  { padding: 0.5rem; }    /* 8px */
.p-3  { padding: 0.75rem; }   /* 12px */
.p-4  { padding: 1rem; }      /* 16px */
.p-6  { padding: 1.5rem; }    /* 24px */
.p-8  { padding: 2rem; }      /* 32px */
.p-12 { padding: 3rem; }      /* 48px */

/* Gap utilities for flex/grid */
.gap-1 { gap: 0.25rem; }      /* 4px */
.gap-2 { gap: 0.5rem; }       /* 8px */
.gap-3 { gap: 0.75rem; }      /* 12px */
.gap-4 { gap: 1rem; }         /* 16px */
.gap-6 { gap: 1.5rem; }       /* 24px */
```

### Layout Patterns
```tsx
// Page layout
<div className="min-h-screen bg-gray-50">
  <main className="container mx-auto px-4 py-8">
    <div className="space-y-6">
      {/* Page content */}
    </div>
  </main>
</div>

// Card grid
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <Card className="p-6">
    {/* Card content */}
  </Card>
</div>

// Two-column layout
<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>
```

## Components

### Card Component
```tsx
// Base card styling
const Card = ({ className, children, ...props }) => (
  <div 
    className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm",
      "hover:shadow-md transition-all duration-300",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Usage
<Card className="p-6">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>
```

### Button Component
```tsx
// Button variants
const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  ghost: "hover:bg-gray-100 text-gray-700",
  destructive: "bg-error-500 hover:bg-error-600 text-white",
};

// Button sizes
const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

// Usage
<Button variant="primary" size="md">
  Primary Button
</Button>
```

### Form Components
```tsx
// Input styling
<input 
  className={cn(
    "w-full px-3 py-2 border border-gray-300 rounded-md",
    "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
    "placeholder:text-gray-400",
    "disabled:bg-gray-50 disabled:text-gray-500"
  )}
  placeholder="Enter text..."
/>

// Label styling
<label className="block text-sm font-medium text-gray-700 mb-1">
  Field Label
</label>

// Error message
<p className="mt-1 text-sm text-error-600">
  This field is required
</p>
```

### Status Components
```tsx
// Status badge
const StatusBadge = ({ status, children }) => {
  const variants = {
    active: "bg-success-100 text-success-800",
    pending: "bg-warning-100 text-warning-800",
    inactive: "bg-gray-100 text-gray-800",
    error: "bg-error-100 text-error-800",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[status]
    )}>
      {children}
    </span>
  );
};

// Progress indicator
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

## Icons & Imagery

### Icon System
Using Lucide React for consistent iconography:

```tsx
import { 
  User, 
  Building2, 
  Briefcase, 
  BarChart3,
  Activity,
  Settings,
  Plus,
  Edit,
  Trash2 
} from 'lucide-react';

// Icon sizing
<User className="h-4 w-4" />  // Small (16px)
<User className="h-5 w-5" />  // Medium (20px)
<User className="h-6 w-6" />  // Large (24px)
<User className="h-8 w-8" />  // Extra large (32px)

// Icon with text
<div className="flex items-center gap-2">
  <User className="h-4 w-4 text-gray-500" />
  <span className="text-sm text-gray-700">User Profile</span>
</div>
```

### Icon Guidelines
- **Size**: Use consistent sizing (16px, 20px, 24px, 32px)
- **Color**: Match text color or use semantic colors
- **Alignment**: Center-align with adjacent text
- **Spacing**: Use consistent gap between icon and text

### Company Logos
```tsx
// Logo display with fallback
const CompanyLogo = ({ company, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn(
      "rounded-lg bg-gray-100 flex items-center justify-center",
      sizeClasses[size]
    )}>
      {company.logo_url ? (
        <img 
          src={company.logo_url} 
          alt={`${company.name} logo`}
          className="h-full w-full object-contain rounded-lg"
        />
      ) : (
        <Building2 className="h-1/2 w-1/2 text-gray-400" />
      )}
    </div>
  );
};
```

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
/* Default: 0px and up (mobile) */

@media (min-width: 640px) {  /* sm: tablet */
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {  /* md: small desktop */
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) { /* lg: desktop */
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1280px) { /* xl: large desktop */
  .xl\:grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
}
```

### Responsive Patterns
```tsx
// Responsive grid
<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards adapt to screen size */}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Padding increases on larger screens */}
</div>

// Hide/show elements
<div className="hidden md:block">
  {/* Only visible on medium screens and up */}
</div>

<div className="block md:hidden">
  {/* Only visible on small screens */}
</div>
```

### Mobile Considerations
- **Touch Targets**: Minimum 44px for interactive elements
- **Navigation**: Collapsible mobile menu
- **Tables**: Horizontal scroll or stacked layout
- **Charts**: Responsive sizing and simplified on mobile

## Accessibility

### Color Contrast
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text

```css
/* High contrast combinations */
.text-gray-900 { color: #111827; } /* 16.8:1 on white */
.text-gray-700 { color: #374151; } /* 9.3:1 on white */
.text-gray-600 { color: #4b5563; } /* 7.1:1 on white */
.text-gray-500 { color: #6b7280; } /* 4.9:1 on white */
```

### Focus States
```css
/* Focus ring for interactive elements */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--primary-500);
}

/* Focus visible for keyboard navigation */
.focus-visible\:ring-2:focus-visible {
  box-shadow: 0 0 0 2px var(--primary-500);
}
```

### Semantic HTML
```tsx
// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<main>
  <section>
    <article>
      <header>
        <h2>Article Title</h2>
      </header>
      <p>Article content...</p>
    </article>
  </section>
</main>

// Use proper form labels
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />

// Use ARIA attributes when needed
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>
```

### Screen Reader Support
```tsx
// Skip links for keyboard navigation
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Screen reader only text
<span className="sr-only">
  Current page: Dashboard
</span>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Descriptive alt text
<img 
  src="chart.png" 
  alt="Bar chart showing 45% increase in leads over the last month"
/>
```

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through interactive elements
- **Focus Management**: Proper focus handling in modals and dropdowns
- **Keyboard Shortcuts**: Common shortcuts (Escape to close, Enter to submit)
- **Skip Links**: Allow users to skip repetitive navigation

---

*For implementation details, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)*
*For troubleshooting design issues, see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)*

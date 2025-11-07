---
owner: devops-team
last-reviewed: 2025-01-27
status: final
product-area: infrastructure
---

# Local Development

**Last Updated:** January 2025

## Development Server

```bash
npm run dev
```

Starts Next.js development server on **http://localhost:8086**

## Available Scripts

### Development

```bash
npm run dev          # Start dev server (port 8086)
npm run build        # Production build
npm run start        # Start production server
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix      # Fix linting errors
npm run lint:app      # Lint app directory only
npm run lint:api      # Lint API routes only
npm run format        # Format with Prettier
npm run type-check    # TypeScript type checking
```

### Testing

```bash
npm test             # Run Vitest tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run Playwright E2E tests
```

### Database

```bash
npm run db:schema              # Show all tables
npm run db:schema people       # Show people table fields
npm run db:schema companies name  # Show specific field
```

### Security

```bash
npm run security:scan          # Run Semgrep security scan
npm run security:audit         # Run npm audit
```

## Development Workflow

### 1. Start Development

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
```

### 2. Make Changes

- **Frontend**: Edit files in `src/app/` or `src/components/`
- **API Routes**: Edit files in `src/app/api/`
- **Services**: Edit files in `src/services/`

Next.js HMR (Hot Module Replacement) automatically reloads changes.

### 3. Check Code Quality

```bash
# Before committing
npm run lint        # Check linting
npm run type-check  # Check types
npm run format      # Format code
```

### 4. Test Changes

```bash
# Run unit tests
npm test

# Run E2E tests (if applicable)
npm run test:e2e
```

## Common Development Tasks

### Adding a New Page

```typescript
// src/app/your-page/page.tsx
export default function YourPage() {
  return <div>Your page content</div>;
}
```

Next.js App Router automatically creates routes from file structure.

### Adding an API Route

```typescript
// src/app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Database Queries

```typescript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('people')
  .select('id, name, stage')
  .eq('stage', 'new_lead');
```

**Always use:**
- Type-safe queries from `src/utils/databaseQueries.ts`
- Service functions from `src/services/`
- RLS policies - never bypass security

See [Database Best Practices](../06-reference/database/queries.md) for details.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (dashboard)/  # Dashboard routes
│   └── api/          # API routes
├── components/       # React components
├── services/         # API service layer
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript definitions
└── contexts/         # React Context providers
```

## Type Checking

```bash
npm run type-check
```

Runs TypeScript compiler in check mode. Fix errors before committing.

## Linting

```bash
npm run lint
```

Runs ESLint with Next.js rules. Automatically fixes many issues.

### Lint Specific Directories

```bash
npm run lint:app      # App directory only
npm run lint:api       # API routes only
npm run lint:components  # Components only
```

## Debugging

### Browser DevTools

- **Console**: Check for errors and warnings
- **Network**: Monitor API calls
- **React DevTools**: Inspect component state

### Next.js Debug Mode

```bash
NODE_OPTIONS='--inspect' npm run dev
```

Enables Node.js debugging.

### Database Debugging

```bash
# Check table schemas
npm run db:schema

# Check specific table
npm run db:schema people
```

## Hot Reload Issues

If HMR isn't working:

1. Clear `.next` folder: `rm -rf .next`
2. Restart dev server
3. Check for TypeScript errors (may block HMR)

## Common Issues

### Port Already in Use

```bash
# Find process using port 8086
lsof -i :8086  # macOS/Linux
netstat -ano | findstr :8086  # Windows

# Kill process or change port
PORT=3000 npm run dev
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### TypeScript Errors

Fix all TypeScript errors before development. They can block builds and HMR.

## Best Practices

1. **Run linting** before committing
2. **Fix TypeScript errors** immediately
3. **Test locally** before pushing
4. **Use service functions** for database access
5. **Follow coding standards** (see [Coding Standards](coding-standards.md))

---

**Related Docs:**
- [Environment Setup](environment-setup.md) - Configuration
- [Coding Standards](coding-standards.md) - Code style and conventions
- [Workflows](workflows.md) - Common development tasks








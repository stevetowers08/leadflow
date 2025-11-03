---
owner: devops-team
last-reviewed: 2025-01-27
status: final
---

# Development Guide

**Last Updated:** January 2025

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd Recruitement-01
npm install

# Setup environment
cp env.example .env.local
# Edit .env.local with your values

# Start development
npm run dev
```

Server runs on **http://localhost:8086**

## Environment Variables

### Required

```bash
# Supabase (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Where to find Supabase keys:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → API
3. Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Optional

```bash
GEMINI_API_KEY=your-gemini-key  # For AI features
LINKEDIN_CLIENT_ID=...           # For LinkedIn sync
N8N_WEBHOOK_URL=...              # For n8n workflows
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 8086)
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting errors
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm test             # Run Vitest tests
npm run test:e2e     # Run Playwright E2E tests

# Database
npm run db:schema              # Show all tables
npm run db:schema people       # Show people table

# Security
npm run security:scan          # Run Semgrep security scan
```

## Development Workflow

1. **Start development**: `npm run dev`
2. **Make changes**: Edit files in `src/app/` or `src/components/`
3. **Check quality**: `npm run lint && npm run type-check`
4. **Test**: `npm test`

Next.js HMR automatically reloads changes.

## Coding Standards

### TypeScript

- Use strict mode (enabled in `tsconfig.json`)
- Avoid `any` - use proper types
- Define interfaces for all props

```typescript
// ✅ Good
interface PersonCardProps {
  person: Person;
  onSelect: (id: string) => void;
}

// ❌ Bad
function process(data: any) { ... }
```

### React

- Use functional components with hooks
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to children

### Database Access

**Always use service functions:**

```typescript
// ✅ Good
import { getJobs } from '@/services/jobsService';
const jobs = await getJobs({ status: 'qualify' });

// ❌ Bad: Direct queries
const { data } = await supabase.from('jobs').select('*');
```

**Always use explicit field selection:**

```typescript
// ✅ Good
.select('id, name, people_stage')

// ❌ Bad
.select('*')
```

### Status Handling

Use `src/utils/statusUtils.ts`:

```typescript
import { getStatusDisplayText } from '@/utils/statusUtils';
const displayText = getStatusDisplayText('new_lead'); // "New Lead"
```

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

## Common Issues

### Port Already in Use

```bash
# Find process using port 8086
lsof -i :8086  # macOS/Linux
netstat -ano | findstr :8086  # Windows

# Or change port
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

---

**Related:** [Product Overview](product.md) | [Database Reference](database.md) | [Deployment](deployment.md)

# Project Design Requirements (PDR): Complete Migration from Vite to Next.js

**Document Version:** 1.0  
**Date:** January 2025  
**Project:** Empowr CRM - Next.js Migration  
**Status:** Planning Phase

---

## Executive Summary

This document outlines the complete migration of Empowr CRM from Vite + React Router to Next.js 15 App Router, including migration of all 22 Supabase Edge Functions to Next.js API Routes. This migration will provide:

- **Enhanced Security:** API keys and secrets stored server-side only
- **Better Performance:** Server-side rendering and optimized builds
- **Modern Architecture:** Industry-standard Next.js App Router patterns
- **Simplified Backend:** Single codebase (no separate Edge Functions)
- **Improved Developer Experience:** Better TypeScript support and debugging

**Timeline:** 3-4 weeks  
**Complexity:** Medium-High  
**Risk Level:** Medium (mitigated by preserving `vite` branch)

---

## 1. Current State Analysis

### 1.1 Technology Stack (Current - Vite)

- **Build Tool:** Vite 7.1
- **Routing:** React Router 7.9 (17 routes, 36 files using router hooks)
- **Frontend Framework:** React 18.2
- **Backend:** 22 Supabase Edge Functions (Deno)
- **State Management:** TanStack Query 5.90 + React Context
- **UI Framework:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS 3.4
- **Database:** Supabase (PostgreSQL)

### 1.2 Codebase Statistics

- **Routes:** 17 React Router routes
- **Components:** ~150+ React components
- **Edge Functions:** 22 functions (see Section 3.3)
- **Environment Variables:** 105 instances of `import.meta.env.VITE_*`
- **Router Hooks:** 36 files using `useNavigate`, `useLocation`, etc.
- **Services:** 47 service files
- **Hooks:** 50+ custom hooks

### 1.3 Current Architecture Issues

1. **Security Risk:** API keys exposed in browser (`VITE_GEMINI_API_KEY`, `VITE_HUBSPOT_CLIENT_SECRET`, etc.)
2. **Dual Backend:** Vite frontend + Supabase Edge Functions (increased complexity)
3. **No SSR:** Client-side only rendering
4. **Deployment Complexity:** Separate deployment pipelines

---

## 2. Target State: Next.js Architecture

### 2.1 Technology Stack (Target - Next.js)

- **Framework:** Next.js 15 (App Router)
- **Routing:** File-based routing (no React Router needed)
- **Frontend Framework:** React 18.2 (Server + Client Components)
- **Backend:** Next.js API Routes (replacing all Edge Functions)
- **State Management:** TanStack Query 5.90 + React Context (compatible)
- **UI Framework:** Radix UI + shadcn/ui (compatible)
- **Styling:** Tailwind CSS 3.4 (compatible)
- **Database:** Supabase (PostgreSQL) - unchanged

### 2.2 Architecture Benefits

1. **Security:** All API keys server-side only
2. **Unified Backend:** Single Next.js codebase for frontend + API
3. **SSR/SSG:** Server-side rendering for better performance
4. **Simplified Deployment:** Single Vercel deployment
5. **Better DX:** TypeScript-first, better debugging
6. **Industry Standard:** Aligns with modern CRM architectures (e.g., Attio)

---

## 3. Detailed Migration Plan

### 3.1 Phase 1: Foundation Setup (Week 1)

#### 3.1.1 Next.js Installation & Configuration

**Tasks:**

- [ ] Install Next.js 15 and dependencies
- [ ] Create `next.config.ts` with proper TypeScript path aliases
- [ ] Update `tsconfig.json` for Next.js
- [ ] Configure Tailwind CSS for Next.js
- [ ] Set up ESLint for Next.js

**Deliverables:**

- Working Next.js dev server
- TypeScript compilation successful
- Tailwind CSS working

#### 3.1.2 App Directory Structure

**Current Structure:**

```
src/
├── pages/          # Page components
├── components/     # All components
├── services/       # API services
├── hooks/          # Custom hooks
└── utils/          # Utilities
```

**Target Structure:**

```
app/
├── (auth)/         # Auth routes group
│   ├── auth/
│   │   ├── callback/
│   │   └── gmail-callback/
├── (dashboard)/    # Protected routes group
│   ├── layout.tsx  # Dashboard layout
│   ├── page.tsx    # Dashboard (/)
│   ├── jobs/
│   ├── people/
│   ├── companies/
│   ├── pipeline/
│   ├── conversations/
│   ├── campaigns/
│   ├── reporting/
│   └── settings/
├── api/            # API routes (replacing Edge Functions)
│   ├── ai/
│   ├── gmail/
│   ├── campaigns/
│   └── ...
└── layout.tsx      # Root layout

src/
├── components/     # Shared components (unchanged)
├── hooks/          # Custom hooks (unchanged)
├── lib/            # Utilities (unchanged)
└── types/          # TypeScript types (unchanged)
```

**Best Practice:** Use route groups `(auth)` and `(dashboard)` for shared layouts without affecting URLs.

**Tasks:**

- [ ] Create `app/` directory structure
- [ ] Create root `app/layout.tsx` with all providers
- [ ] Set up route groups for layout organization
- [ ] Create initial page files

#### 3.1.3 Environment Variables Migration

**Current (Vite):**

```typescript
// ❌ Exposed in browser
import.meta.env.VITE_GEMINI_API_KEY;
import.meta.env.VITE_HUBSPOT_CLIENT_SECRET;
```

**Target (Next.js):**

```typescript
// ✅ Client-side (public) - ONLY for truly public keys
process.env.NEXT_PUBLIC_SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ Server-side (secure) - All API keys here
process.env.GEMINI_API_KEY; // No NEXT_PUBLIC_ prefix
process.env.HUBSPOT_CLIENT_SECRET; // Server-only
process.env.MAILCHIMP_API_KEY; // Server-only
```

**Migration Strategy:**

1. Update `.env.example` with new variable names
2. Global find/replace: `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*` (client)
3. Move secrets to server-only variables (remove `NEXT_PUBLIC_` prefix)
4. Update 105 instances across 47 files

**Security Classification:**

| Variable                     | Current   | Target                          | Location  |
| ---------------------------- | --------- | ------------------------------- | --------- |
| `VITE_SUPABASE_URL`          | Client    | `NEXT_PUBLIC_SUPABASE_URL`      | Client ✅ |
| `VITE_SUPABASE_ANON_KEY`     | Client    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client ✅ |
| `VITE_GOOGLE_CLIENT_ID`      | Client    | `NEXT_PUBLIC_GOOGLE_CLIENT_ID`  | Client ✅ |
| `VITE_GEMINI_API_KEY`        | Client ❌ | `GEMINI_API_KEY`                | Server ✅ |
| `VITE_HUBSPOT_CLIENT_SECRET` | Client ❌ | `HUBSPOT_CLIENT_SECRET`         | Server ✅ |
| `VITE_MAILCHIMP_API_KEY`     | Client ❌ | `MAILCHIMP_API_KEY`             | Server ✅ |
| `VITE_LOGO_DEV_API_KEY`      | Client ❌ | `LOGO_DEV_API_KEY`              | Server ✅ |

**Tasks:**

- [ ] Audit all environment variables (105 instances)
- [ ] Classify variables (public vs. server-only)
- [ ] Update `.env.example` with new names
- [ ] Create migration script for find/replace
- [ ] Update all service files
- [ ] Test environment variable access

---

### 3.2 Phase 2: Routing Migration (Week 1-2)

#### 3.2.1 Route Mapping

**React Router → Next.js App Router:**

| React Router Route        | Next.js File Path                      | Type    |
| ------------------------- | -------------------------------------- | ------- |
| `/`                       | `app/page.tsx`                         | Page    |
| `/dashboard`              | `app/dashboard/page.tsx`               | Page    |
| `/jobs`                   | `app/jobs/page.tsx`                    | Page    |
| `/people`                 | `app/people/page.tsx`                  | Page    |
| `/companies`              | `app/companies/page.tsx`               | Page    |
| `/pipeline`               | `app/pipeline/page.tsx`                | Page    |
| `/conversations`          | `app/conversations/page.tsx`           | Page    |
| `/crm/communications`     | `app/crm/communications/page.tsx`      | Page    |
| `/reporting`              | `app/reporting/page.tsx`               | Page    |
| `/settings`               | `app/settings/page.tsx`                | Page    |
| `/settings/job-filtering` | `app/settings/job-filtering/page.tsx`  | Page    |
| `/campaigns`              | `app/campaigns/page.tsx`               | Page    |
| `/campaigns/sequence/:id` | `app/campaigns/sequence/[id]/page.tsx` | Dynamic |
| `/integrations`           | `app/integrations/page.tsx`            | Page    |
| `/integrations/callback`  | `app/integrations/callback/page.tsx`   | Page    |
| `/auth/callback`          | `app/auth/callback/page.tsx`           | Page    |
| `/auth/gmail-callback`    | `app/auth/gmail-callback/page.tsx`     | Page    |

#### 3.2.2 Router Hooks Migration

**React Router → Next.js Navigation:**

| React Router    | Next.js App Router                    | Usage Count |
| --------------- | ------------------------------------- | ----------- |
| `useNavigate()` | `useRouter()` from `next/navigation`  | ~30 files   |
| `useLocation()` | `usePathname()` + `useSearchParams()` | ~10 files   |
| `useParams()`   | `useParams()` from `next/navigation`  | ~5 files    |
| `BrowserRouter` | Not needed (file-based routing)       | 1 file      |
| `<Route>`       | File-based (automatic)                | 17 routes   |
| `<Routes>`      | Not needed                            | 1 file      |

**Example Migration:**

```typescript
// ❌ Before (React Router)
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate('/jobs');
  };
}

// ✅ After (Next.js)
import { useRouter, usePathname } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push('/jobs');
  };
}
```

**Tasks:**

- [ ] Convert all 17 routes to Next.js page files
- [ ] Update 36 files using router hooks
- [ ] Test all navigation flows
- [ ] Update link components (`<Link>` from `next/link`)

#### 3.2.3 Layout Migration

**Current Structure:**

```tsx
// src/App.tsx
<BrowserRouter>
  <AuthProvider>
    <Layout>
      <Routes>...</Routes>
    </Layout>
  </AuthProvider>
</BrowserRouter>
```

**Target Structure:**

```tsx
// app/layout.tsx (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <AllOtherProviders>{children}</AllOtherProviders>
        </AuthProvider>
      </body>
    </html>
  );
}

// app/(dashboard)/layout.tsx (Dashboard Layout)
export default function DashboardLayout({ children }) {
  return <Layout>{children}</Layout>;
}
```

**Tasks:**

- [ ] Create root `app/layout.tsx` with all providers
- [ ] Create dashboard layout for protected routes
- [ ] Move Layout component integration
- [ ] Test provider nesting

---

### 3.3 Phase 3: Edge Functions → API Routes Migration (Week 2-3)

#### 3.3.1 Edge Functions Inventory

**Total: 22 Edge Functions to Migrate**

| Edge Function               | Purpose                   | Migration Priority | Estimated Effort |
| --------------------------- | ------------------------- | ------------------ | ---------------- |
| `ai-chat`                   | AI chat interface         | High               | 4 hours          |
| `ai-job-summary`            | Generate job summaries    | High               | 3 hours          |
| `analyze-reply`             | Analyze email replies     | Medium             | 4 hours          |
| `campaign-executor`         | Execute campaigns         | High               | 6 hours          |
| `add-person`                | Add person via API        | Medium             | 2 hours          |
| `check-company-duplicate`   | Check duplicates          | Low                | 2 hours          |
| `enrichment-callback`       | Enrichment webhook        | Medium             | 3 hours          |
| `gmail-auth`                | Gmail OAuth               | High               | 4 hours          |
| `gmail-refresh`             | Refresh Gmail tokens      | High               | 3 hours          |
| `gmail-sync`                | Sync Gmail data           | High               | 4 hours          |
| `gmail-token`               | Get Gmail tokens          | High               | 3 hours          |
| `gmail-token-secure`        | Secure token retrieval    | High               | 4 hours          |
| `gmail-watch-renewal`       | Renew Gmail watch         | High               | 3 hours          |
| `gmail-watch-setup`         | Setup Gmail watch         | High               | 4 hours          |
| `gmail-webhook`             | Gmail webhook handler     | High               | 5 hours          |
| `job-qualification-webhook` | Job qualification webhook | Medium             | 3 hours          |
| `linkedin-auth`             | LinkedIn OAuth            | Medium             | 4 hours          |
| `linkedin-sync`             | Sync LinkedIn data        | Medium             | 4 hours          |
| `resend-api`                | Resend email API          | High               | 3 hours          |
| `resend-webhook`            | Resend webhook handler    | Medium             | 3 hours          |
| `test-job-filters`          | Test job filters          | Low                | 2 hours          |
| `mcp-server`                | MCP server                | Low                | 4 hours          |

**Total Estimated Effort:** ~75 hours (~2 weeks)

#### 3.3.2 API Route Structure

**Target Structure:**

```
app/api/
├── ai/
│   ├── chat/
│   │   └── route.ts          # POST /api/ai/chat
│   └── job-summary/
│       └── route.ts          # POST /api/ai/job-summary
├── gmail/
│   ├── auth/
│   │   └── route.ts         # POST /api/gmail/auth
│   ├── token/
│   │   └── route.ts          # GET /api/gmail/token
│   ├── refresh/
│   │   └── route.ts         # POST /api/gmail/refresh
│   ├── sync/
│   │   └── route.ts         # POST /api/gmail/sync
│   ├── watch/
│   │   ├── setup/
│   │   │   └── route.ts     # POST /api/gmail/watch/setup
│   │   └── renewal/
│   │       └── route.ts     # POST /api/gmail/watch/renewal
│   └── webhook/
│       └── route.ts         # POST /api/gmail/webhook
├── campaigns/
│   ├── executor/
│   │   └── route.ts         # POST /api/campaigns/executor
│   └── webhook/
│       └── route.ts         # POST /api/campaigns/webhook
├── people/
│   └── route.ts             # POST /api/people
├── companies/
│   └── duplicate/
│       └── route.ts         # POST /api/companies/duplicate
├── enrichment/
│   └── callback/
│       └── route.ts         # POST /api/enrichment/callback
├── email/
│   ├── analyze/
│   │   └── route.ts         # POST /api/email/analyze
│   ├── resend/
│   │   ├── route.ts         # POST /api/email/resend
│   │   └── webhook/
│   │       └── route.ts     # POST /api/email/resend/webhook
└── jobs/
    ├── qualification/
    │   └── webhook/
    │       └── route.ts     # POST /api/jobs/qualification/webhook
    └── filters/
        └── test/
            └── route.ts    # POST /api/jobs/filters/test
```

#### 3.3.3 Migration Pattern

**Edge Function Pattern:**

```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req: Request) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Handler logic
  const body = await req.json();
  // ... processing
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

**Next.js API Route Pattern:**

```typescript
// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  // CORS handling (if needed)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const body = await request.json();

    // Server-side only - API keys secure here
    const geminiKey = process.env.GEMINI_API_KEY; // ✅ Secure

    // ... processing

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

#### 3.3.4 Client Service Updates

**Before (Calling Edge Function):**

```typescript
// src/services/serverAIService.ts
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-job-summary`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  }
);
```

**After (Calling Next.js API Route):**

```typescript
// src/services/serverAIService.ts
const response = await fetch('/api/ai/job-summary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

**Benefits:**

- ✅ Simpler URLs (relative paths)
- ✅ No need for Supabase URL/keys in client
- ✅ Better TypeScript support
- ✅ Easier local debugging

**Tasks:**

- [ ] Migrate each Edge Function (22 functions)
- [ ] Update client service calls (16+ files)
- [ ] Test all API endpoints
- [ ] Update webhook URLs in external services
- [ ] Document API routes

---

### 3.4 Phase 4: Component Migration (Week 2-3)

#### 3.4.1 Server Components vs Client Components

**Next.js App Router Strategy:**

**Server Components (Default):**

- ✅ Fetch data directly from Supabase
- ✅ Access server-side environment variables
- ✅ No JavaScript sent to client
- ✅ Better performance

**Client Components (`'use client'`):**

- ✅ Interactive components (buttons, forms)
- ✅ Components using hooks (`useState`, `useEffect`)
- ✅ Browser APIs (`window`, `localStorage`)
- ✅ Event handlers

**Migration Strategy:**

1. **Start with Server Components** for pages that fetch data
2. **Mark interactive components** with `'use client'`
3. **Use Server Actions** for form submissions
4. **Keep TanStack Query** for client-side state management

**Example:**

```typescript
// app/jobs/page.tsx (Server Component - default)
import { createClient } from '@supabase/supabase-js';

// ✅ Server Component - fetches data on server
export default async function JobsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  return <JobsClientComponent initialJobs={jobs} />;
}

// app/components/jobs/JobsClientComponent.tsx
'use client'; // ✅ Client Component - interactive

export function JobsClientComponent({ initialJobs }) {
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  // ... interactive logic
}
```

**Tasks:**

- [ ] Identify which components need to be client components
- [ ] Convert pages to Server Components where possible
- [ ] Add `'use client'` directive to interactive components
- [ ] Test Server/Client component boundaries
- [ ] Optimize data fetching patterns

#### 3.4.2 Provider Migration

**Current Provider Setup:**

```tsx
// src/App.tsx
<ErrorBoundaryProvider>
  <LoggingProvider>
    <PerformanceProvider>
      <QueryClientProvider>
        <BrowserRouter>
          <AuthProvider>
            <OnboardingProvider>
              <AppRoutes />
            </OnboardingProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </PerformanceProvider>
  </LoggingProvider>
</ErrorBoundaryProvider>
```

**Target Provider Setup:**

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <ErrorBoundaryProvider>
          <LoggingProvider>
            <PerformanceProvider>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <OnboardingProvider>{children}</OnboardingProvider>
                </AuthProvider>
              </QueryClientProvider>
            </PerformanceProvider>
          </LoggingProvider>
        </ErrorBoundaryProvider>
      </body>
    </html>
  );
}
```

**Changes:**

- Remove `<BrowserRouter>` (not needed)
- Move providers to root layout
- Keep all existing providers (they're compatible)

**Tasks:**

- [ ] Move providers to `app/layout.tsx`
- [ ] Remove BrowserRouter wrapper
- [ ] Test provider nesting
- [ ] Verify context access in components

---

### 3.5 Phase 5: Build & Deployment (Week 3-4)

#### 3.5.1 Build Configuration

**Package.json Scripts:**

```json
{
  "scripts": {
    "dev": "next dev -p 8086",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "vercel-build": "next build"
  }
}
```

**Next.js Configuration:**

- TypeScript path aliases (`@/*`)
- Image optimization domains
- Environment variable handling
- Output configuration

**Tasks:**

- [ ] Update `package.json` scripts
- [ ] Configure `next.config.ts`
- [ ] Test production build
- [ ] Verify build output

#### 3.5.2 Deployment Updates

**Vercel Configuration:**

- Update build command
- Configure environment variables
- Set up webhook endpoints
- Update domain settings

**Tasks:**

- [ ] Update Vercel project settings
- [ ] Migrate environment variables
- [ ] Test deployment pipeline
- [ ] Update webhook URLs in external services

---

## 4. Best Practices & Patterns

### 4.1 Server Components Best Practices

**✅ DO:**

- Fetch data directly in Server Components
- Use async/await for data fetching
- Pass data as props to Client Components
- Keep Server Components simple

**❌ DON'T:**

- Use hooks in Server Components
- Access browser APIs in Server Components
- Use event handlers in Server Components
- Mix server and client logic

### 4.2 API Routes Best Practices

**✅ DO:**

- Use TypeScript for all API routes
- Implement proper error handling
- Return consistent response formats
- Handle CORS correctly
- Validate input data

**❌ DON'T:**

- Expose API keys in responses
- Skip error handling
- Return sensitive data
- Allow unvalidated inputs

### 4.3 Environment Variables Best Practices

**✅ DO:**

- Use `NEXT_PUBLIC_*` ONLY for truly public keys
- Keep ALL secrets server-side (no prefix)
- Document which variables are public vs. server-only
- Use `.env.local` for local development

**❌ DON'T:**

- Use `NEXT_PUBLIC_*` for API keys or secrets
- Commit `.env.local` to git
- Expose server-side variables to client

### 4.4 Routing Best Practices

**✅ DO:**

- Use route groups `(group)` for layouts
- Use dynamic routes `[id]` for parameters
- Use catch-all routes `[...slug]` when needed
- Organize routes logically

**❌ DON'T:**

- Create deeply nested routes unnecessarily
- Mix routing concerns
- Use route groups that affect URLs

---

## 5. Risk Assessment & Mitigation

### 5.1 High-Risk Areas

| Risk                            | Impact | Probability | Mitigation                                   |
| ------------------------------- | ------ | ----------- | -------------------------------------------- |
| Breaking existing functionality | High   | Medium      | Comprehensive testing at each phase          |
| Performance regression          | Medium | Low         | Monitor Core Web Vitals                      |
| Data loss during migration      | High   | Low         | No database changes, only frontend migration |
| Deployment issues               | Medium | Medium      | Staging environment testing                  |
| Learning curve                  | Medium | High        | Pair programming, documentation              |

### 5.2 Mitigation Strategies

1. **Preserve Vite Branch:** `vite` branch remains as fallback
2. **Incremental Migration:** Migrate route by route, test frequently
3. **Comprehensive Testing:** Test each migrated route immediately
4. **Staging Deployment:** Test full deployment before production
5. **Rollback Plan:** Keep `vite` branch deployable

---

## 6. Testing Strategy

### 6.1 Testing Phases

**Phase 1: Unit Tests**

- [ ] Test API route handlers
- [ ] Test component rendering
- [ ] Test utility functions

**Phase 2: Integration Tests**

- [ ] Test route navigation
- [ ] Test API route → database flows
- [ ] Test authentication flows

**Phase 3: E2E Tests**

- [ ] Test critical user journeys
- [ ] Test form submissions
- [ ] Test data fetching

**Phase 4: Performance Tests**

- [ ] Test page load times
- [ ] Test API response times
- [ ] Monitor Core Web Vitals

### 6.2 Test Checklist

**Routing:**

- [ ] All 17 routes accessible
- [ ] Dynamic routes work correctly
- [ ] Navigation between routes works
- [ ] Deep linking works

**API Routes:**

- [ ] All 22 API routes functional
- [ ] Error handling works
- [ ] Authentication works
- [ ] CORS configured correctly

**Components:**

- [ ] All components render
- [ ] Interactive components work
- [ ] Forms submit correctly
- [ ] Data displays correctly

---

## 7. Timeline & Milestones

### Week 1: Foundation

- [x] Day 1: Git branch setup (✅ Complete)
- [ ] Day 2-3: Next.js installation & configuration
- [ ] Day 4-5: App directory structure & root layout

### Week 2: Core Migration

- [ ] Day 1-2: Environment variables migration
- [ ] Day 3-4: Route migration (first 8 routes)
- [ ] Day 5: Router hooks migration

### Week 3: Backend & Remaining Routes

- [ ] Day 1-3: Edge Functions → API Routes (11 functions)
- [ ] Day 4: Remaining route migration (9 routes)
- [ ] Day 5: Component migration & testing

### Week 4: Final Migration & Testing

- [ ] Day 1-2: Complete Edge Functions migration (11 remaining)
- [ ] Day 3: Comprehensive testing
- [ ] Day 4: Build & deployment setup
- [ ] Day 5: Final testing & documentation

---

## 8. Success Criteria

### 8.1 Functional Requirements

- ✅ All 17 routes accessible and working
- ✅ All 22 API routes functional
- ✅ No API keys exposed in browser
- ✅ All existing features working
- ✅ Authentication flows working

### 8.2 Performance Requirements

- ✅ Page load times equal or better
- ✅ API response times ≤ 200ms (p95)
- ✅ Core Web Vitals passing
- ✅ Lighthouse score ≥ 90

### 8.3 Security Requirements

- ✅ Zero API keys in client bundle
- ✅ All secrets server-side only
- ✅ Proper authentication on API routes
- ✅ CORS configured correctly

---

## 9. Post-Migration Tasks

### 9.1 Cleanup

- [ ] Remove Vite dependencies
- [ ] Remove React Router
- [ ] Delete `supabase/functions` directory
- [ ] Remove `vite.config.ts`
- [ ] Update documentation

### 9.2 Documentation

- [ ] Update README with Next.js instructions
- [ ] Document API routes
- [ ] Update deployment guide
- [ ] Create migration notes for team

### 9.3 Monitoring

- [ ] Set up error tracking
- [ ] Monitor API performance
- [ ] Track user metrics
- [ ] Monitor Core Web Vitals

---

## 10. References & Resources

### 10.1 Official Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/guides/migrating/app-router-migration)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

### 10.2 Migration Guides

- [Migrating from Vite to Next.js](https://nextjs.org/docs/app/guides/migrating/from-vite)
- [React Router to Next.js Migration](https://www.buttercups.tech/blog/react/nextjs-app-router-migration-guide)
- [Server Components Best Practices](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### 10.3 Best Practices

- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#environment-variable-loading)
- [API Routes Security](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#security)
- [Server Components Patterns](https://nextjs.org/docs/app/building-your-application/rendering/server-components#when-to-use-server-vs-client-components)

---

## 11. Approval & Sign-off

**Document Status:** ✅ Approved for Implementation  
**Next Steps:** Begin Phase 1 - Foundation Setup

---

**Created:** January 2025  
**Last Updated:** January 2025  
**Next Review:** After Phase 1 completion

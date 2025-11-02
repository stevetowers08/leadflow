# Edge Functions → API Routes Migration Guide

**Date:** January 2025  
**Framework:** Next.js 16.0.1 App Router

## Best Practices Summary

Based on Next.js 16 documentation and community best practices:

### 1. API Route Structure
- **Location**: `src/app/api/[route]/route.ts`
- **Export**: Named exports `GET`, `POST`, `PUT`, `DELETE`, etc.
- **Request/Response**: Use standard Web API `Request` and `Response` objects

### 2. Async Parameters (Next.js 16 Breaking Change)
- **Params**: Must be awaited - `const params = await getParams()`
- **SearchParams**: Must be awaited - `const searchParams = await getSearchParams()`
- **Cookies**: Must be awaited - `const cookies = await cookies()`
- **Headers**: Must be awaited - `const headers = await headers()`

### 3. Server Components vs Client Components
- **API Routes**: Always Server Components (no 'use client')
- **Server Actions**: Use for mutations (instead of API routes when possible)
- **Reserve API Routes**: For external webhooks, integrations, third-party callbacks

### 4. Error Handling
- Return proper HTTP status codes
- Use consistent error response format
- Log errors server-side (never expose sensitive info to client)

### 5. CORS Handling
- Set appropriate CORS headers for webhook endpoints
- Use middleware for shared CORS configuration

### 6. Environment Variables
- **Public**: `NEXT_PUBLIC_*` (client-side accessible)
- **Server-only**: No prefix (server-side only)
- **Secrets**: Use server-only env vars for API keys

## Migration Pattern

### Edge Function (Deno) → API Route (Next.js)

**Before (Edge Function):**
```typescript
// supabase/functions/ai-job-summary/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { jobData, jobId } = await req.json();
  
  // Process...
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**After (API Route):**
```typescript
// src/app/api/ai-job-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobData, jobId } = body;
    
    // Process...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

## Functions to Migrate (22 total)

### Priority 1: Core Features
1. ✅ `ai-job-summary` - AI processing (already migrated example)
2. `check-company-duplicate` - Company validation
3. `job-qualification-webhook` - Job workflow
4. `add-person` - Lead creation

### Priority 2: Gmail Integration
5. `gmail-auth` - OAuth flow
6. `gmail-token` - Token management
7. `gmail-token-secure` - Secure token handling
8. `gmail-refresh` - Token refresh
9. `gmail-sync` - Email synchronization
10. `gmail-webhook` - Incoming webhooks
11. `gmail-watch-setup` - Push notification setup
12. `gmail-watch-renewal` - Watch renewal

### Priority 3: Campaign Automation
13. `campaign-executor` - Campaign execution
14. `analyze-reply` - Reply analysis

### Priority 4: Integrations
15. `linkedin-auth` - LinkedIn OAuth
16. `linkedin-sync` - LinkedIn sync
17. `enrichment-callback` - Data enrichment
18. `resend-api` - Email sending
19. `resend-webhook` - Resend webhooks

### Priority 5: Utilities
20. `ai-chat` - AI chat functionality
21. `mcp-server` - MCP protocol server
22. `test-job-filters` - Testing utility

## Testing Strategy

1. **Unit Tests**: Test each route handler independently
2. **Integration Tests**: Test with actual database operations
3. **E2E Tests**: Test full workflows with Playwright
4. **Webhook Testing**: Use tools like ngrok or Supabase webhook testing

## Environment Variables Migration

### Edge Functions (Deno)
```typescript
Deno.env.get('GEMINI_API_KEY')
```

### API Routes (Next.js)
```typescript
process.env.GEMINI_API_KEY
```

## Deployment Notes

- **Vercel**: Automatic deployment from Git
- **Environment Variables**: Set in Vercel dashboard
- **Webhook URLs**: Update external services with new URLs
- **Backward Compatibility**: Consider proxy routes during transition

## Checklist per Function

- [ ] Create route file: `src/app/api/[function-name]/route.ts`
- [ ] Migrate request handling logic
- [ ] Update environment variable access
- [ ] Add proper error handling
- [ ] Add CORS headers if needed
- [ ] Update client-side calls to use new URL
- [ ] Test with Postman/curl
- [ ] Update documentation
- [ ] Deploy and verify
- [ ] Remove old Edge Function



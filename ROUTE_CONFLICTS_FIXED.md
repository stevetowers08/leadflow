# Route Conflicts Fixed

## Issue
Next.js doesn't allow two parallel pages that resolve to the same path when using route groups.

## Conflicts Resolved

### 1. Settings Route ✅
- **Old**: `src/app/settings/page.tsx` → `/settings`
- **New**: `src/app/(app)/settings/page.tsx` → `/settings`
- **Action**: Deleted old file

### 2. Root Route ✅
- **Old**: `src/app/page.tsx` → `/`
- **New**: `src/app/(app)/page.tsx` → `/`
- **Action**: Deleted old file

## Remaining Routes (No Conflicts)

These routes don't conflict because they resolve to different paths:

### Different Paths (OK)
- `src/app/contacts/page.tsx` → `/contacts` (redirects to `/leads`)
- `src/app/(app)/leads/page.tsx` → `/leads` ✅

- `src/app/conversations/page.tsx` → `/conversations` (redirects to `/inbox`)
- `src/app/(app)/inbox/page.tsx` → `/inbox` ✅

### Nested Routes (OK)
- `src/app/settings/job-filtering/page.tsx` → `/settings/job-filtering` ✅
  - This is a nested route, doesn't conflict with `/settings`

### Route Groups (OK)
- `src/app/(mobile)/capture/page.tsx` → `/mobile/capture` ✅
- `src/app/(app)/workflows/page.tsx` → `/workflows` ✅

## Build Status
✅ All route conflicts resolved
✅ Build should now succeed

## Notes
- Route groups `(mobile)` and `(app)` don't appear in URLs
- They're organizational only
- Both `(app)/page.tsx` and `(app)/settings/page.tsx` resolve to `/` and `/settings` respectively
- Old duplicate routes have been removed


# 🐛 Empowr CRM Debugging Guide

## 🚨 Common Issues & Solutions

### 1. Query Timeout Issues

**Error**: `Query timeout after 10 seconds`
**Cause**: Database queries taking too long, often due to:

- Missing indexes
- Complex joins without optimization
- Network latency
- Database connection issues

**Solutions**:

```typescript
// Increase timeout in useEntityData.ts
const queryTimeout = 30000; // 30 seconds instead of 10

// Add retry logic
const retryCount = 3;
const retryDelay = 1000; // 1 second

// Optimize queries with proper indexes
// Check database performance with EXPLAIN ANALYZE
```

### 2. Slide-Out Panel Issues

**Error**: `SlideOutPanel not rendering` or `Cannot read properties of undefined`
**Cause**: Missing data or incorrect props passed to slide-out components

**Solutions**:

- Always check data exists before rendering slide-out panels
- Use proper TypeScript types for slide-out props
- Check all pages: `Jobs.tsx`, `People.tsx`, `Companies.tsx`, `Dashboard.tsx`, `GlobalSearchDropdown.tsx`

```typescript
// Always add null checks
if (!entityData || !entityData.id) {
  return <div>Loading...</div>;
}

// Use proper props
<JobDetailsSlideOut
  isOpen={isSlideOutOpen}
  onClose={() => setIsSlideOutOpen(false)}
  jobId={selectedJobId}
/>
```

### 3. Component Styling Inconsistencies

**Issue**: Inconsistent button styling, text sizes, spacing

**Solutions**:

- Always use `InfoCard` wrapper for consistency
- Use `text-sm` for values, `text-xs` for labels
- Use `rounded-md` for all buttons
- Use `border border-gray-300` for icon buttons
- Use `p-1.5` for icon button padding

### 4. Missing Data Issues

**Error**: `Cannot read properties of undefined`
**Cause**: Components trying to access undefined data

**Solutions**:

```typescript
// Always add null checks
if (!entityData || !entityData.name) {
  return <div>Loading...</div>;
}

// Use optional chaining
const name = entityData?.name || "Unknown";
```

## 🔧 Debugging Tools

### 1. Console Debugging

```typescript
// Add debug logs to track data flow
console.log('🔍 EntityData:', entityData);
console.log('🔍 Loading state:', isLoading);
console.log('🔍 Error state:', error);
```

### 2. React Query DevTools

```typescript
// Enable in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to App.tsx
<ReactQueryDevtools initialIsOpen={false} />
```

### 3. Database Query Analysis

```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM people WHERE id = '...';

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'people';
```

## 📋 Pre-Deployment Checklist

### ✅ Code Quality

- [ ] All linting errors fixed
- [ ] No console errors in browser
- [ ] All TypeScript errors resolved
- [ ] Components have proper error boundaries

### ✅ Styling Consistency

- [ ] All buttons use consistent styling
- [ ] Text sizes are consistent (`text-sm` for values)
- [ ] Spacing is consistent (`space-y-6`, `p-1.5`)
- [ ] Border radius is consistent (`rounded-md`)

### ✅ Data Handling

- [ ] All components have null checks
- [ ] Loading states are properly handled
- [ ] Error states are properly handled
- [ ] Query timeouts are appropriate

### ✅ Slide-Out Panel System

- [ ] All pages use slide-out panels consistently
- [ ] No references to deprecated popup systems
- [ ] Slide-out components render correctly
- [ ] Header action buttons are consistent

## 🚨 Emergency Fixes

### Quick Fixes for Common Issues

1. **Query Timeout**:

   ```typescript
   // In useEntityData.ts, increase timeout
   const timeout = setTimeout(() => {
     reject(new Error('Query timeout after 30 seconds'));
   }, 30000);
   ```

2. **Slide-Out Panel Error**:

   ```typescript
   // Check slide-out panel implementation
   import { JobDetailsSlideOut } from '@/components/slide-out/JobDetailsSlideOut';

   // Ensure proper state management
   const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
   const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
   ```

3. **Styling Inconsistency**:
   ```typescript
   // Standardize all buttons
   className =
     'p-1.5 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50';
   ```

## 📊 Performance Monitoring

### Database Performance

- Monitor query execution times
- Check for missing indexes
- Optimize complex joins
- Use connection pooling

### Frontend Performance

- Monitor component re-renders
- Check for memory leaks
- Optimize bundle size
- Use React.memo for expensive components

## 🔍 Debugging Workflow

1. **Identify the Issue**
   - Check browser console for errors
   - Look for specific error messages
   - Check network tab for failed requests

2. **Locate the Source**
   - Find the component/file causing the issue
   - Check the error stack trace
   - Look for recent changes

3. **Apply the Fix**
   - Use the solutions from this guide
   - Test the fix thoroughly
   - Check for side effects

4. **Document the Solution**
   - Add to this guide if it's a new issue
   - Update the checklist if needed
   - Share with the team

## 📝 Maintenance Notes

- **Weekly**: Check for new console errors
- **Monthly**: Review database query performance
- **Quarterly**: Update debugging tools and processes
- **Before each release**: Run through the pre-deployment checklist

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintained by**: Development Team

# Empowr CRM - Troubleshooting Guide

## Table of Contents
- [Common Issues](#common-issues)
- [Development Issues](#development-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Integration Issues](#integration-issues)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)
- [Debugging Tools](#debugging-tools)

## Common Issues

### White Screen / App Won't Load

#### Symptoms
- Blank white screen on app load
- Console errors about missing modules
- "Cannot read property of undefined" errors

#### Solutions
1. **Check Environment Variables**
   ```bash
   # Verify all required env vars are set
   cat .env.local
   
   # Required variables:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

2. **Clear Cache and Reinstall**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Restart dev server
   npm run dev
   ```

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed requests

### Charts Not Displaying

#### Symptoms
- Empty chart containers
- "No data available" messages
- Chart components render but show no visualization

#### Solutions
1. **Check Data Structure**
   ```typescript
   // Ensure data matches expected format
   console.log('Chart data:', chartData);
   
   // For bar charts, data should be array of objects:
   const barData = [
     { name: 'Category 1', value: 100 },
     { name: 'Category 2', value: 200 }
   ];
   
   // For pie charts, ensure dataKey matches:
   <Pie dataKey="value" nameKey="name" data={pieData} />
   ```

2. **Verify Chart Container**
   ```tsx
   // Ensure ChartContainer has proper config
   <ChartContainer
     config={{
       value: { label: "Value", color: "#8884d8" }
     }}
     className="h-64 w-full"
   >
     <BarChart data={data}>
       <Bar dataKey="value" fill="#8884d8" />
     </BarChart>
   </ChartContainer>
   ```

3. **Check for React Key Warnings**
   ```tsx
   // Add unique keys to list items
   {data.map((item, index) => (
     <Cell key={`cell-${item.name}-${index}`} fill={item.color} />
   ))}
   ```

### Drag and Drop Not Working

#### Symptoms
- Items can't be dragged
- Drop zones don't respond
- Pipeline stages don't update

#### Solutions
1. **Check dnd-kit Setup**
   ```tsx
   import { DndContext, closestCenter } from '@dnd-kit/core';
   import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
   
   <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
     <SortableContext items={items} strategy={verticalListSortingStrategy}>
       {/* Draggable items */}
     </SortableContext>
   </DndContext>
   ```

2. **Verify Touch Support**
   ```tsx
   import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
   
   const sensors = useSensors(
     useSensor(MouseSensor),
     useSensor(TouchSensor)
   );
   
   <DndContext sensors={sensors}>
     {/* Content */}
   </DndContext>
   ```

## Development Issues

### TypeScript Errors

#### "Property does not exist on type"
```typescript
// Problem: Accessing undefined properties
const value = data.someProperty; // Error if data might be undefined

// Solution: Use optional chaining
const value = data?.someProperty;

// Or provide fallback
const value = data?.someProperty || 'default';
```

#### "Type 'unknown' is not assignable to type 'number'"
```typescript
// Problem: Supabase queries return unknown types
const count = data.count; // Type 'unknown'

// Solution: Type assertion
const count = data.count as number;

// Or type guard
const count = typeof data.count === 'number' ? data.count : 0;
```

#### "Cannot find module" Errors
```bash
# Install missing dependencies
npm install @types/node @types/react @types/react-dom

# For path resolution issues, check tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Build Errors

#### "Module not found" in Production
```typescript
// Problem: Case-sensitive imports
import { Component } from './component'; // Wrong case

// Solution: Match exact file names
import { Component } from './Component';
```

#### "Out of memory" During Build
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

### Hot Reload Issues

#### Changes Not Reflecting
```bash
# Restart dev server
npm run dev

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Check file watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Database Issues

### Supabase Connection Errors

#### "Invalid API key" or "Project not found"
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify in Supabase dashboard:
# Settings > API > Project URL and anon key
```

#### RLS Policy Errors
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Create missing policies
CREATE POLICY "Users can access table" ON table_name 
FOR ALL USING (auth.role() = 'authenticated');
```

### Query Performance Issues

#### Slow Queries
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM people WHERE stage = 'connected';

-- Add missing indexes
CREATE INDEX idx_people_stage ON people(stage);
CREATE INDEX idx_people_company_id ON people(company_id);

-- Check for N+1 queries
-- Use joins instead of multiple queries
SELECT p.*, c.name as company_name 
FROM people p 
LEFT JOIN companies c ON p.company_id = c.id;
```

#### Connection Pool Exhaustion
```typescript
// Limit concurrent queries
const { data, error } = await supabase
  .from('people')
  .select('*')
  .limit(100); // Add reasonable limits

// Use pagination for large datasets
const { data, error } = await supabase
  .from('people')
  .select('*')
  .range(0, 49); // First 50 records
```

### Data Consistency Issues

#### Stale Data
```typescript
// Force refetch in React Query
const { data, refetch } = useQuery(['people'], fetchPeople);

// Invalidate cache after mutations
const mutation = useMutation(createPerson, {
  onSuccess: () => {
    queryClient.invalidateQueries(['people']);
  }
});

// Use real-time subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('people-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'people' },
      (payload) => {
        queryClient.invalidateQueries(['people']);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## Authentication Issues

### Google OAuth Not Working

#### "OAuth error" or "Invalid client"
1. **Check Google Cloud Console**
   - Verify client ID and secret
   - Check authorized redirect URIs
   - Ensure OAuth consent screen is configured

2. **Supabase Auth Settings**
   ```
   Go to: Authentication > Settings > Auth Providers
   Enable Google provider
   Add your Google OAuth credentials
   Set redirect URL: https://your-project.supabase.co/auth/v1/callback
   ```

3. **Environment Variables**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

### Session Management Issues

#### User Not Staying Logged In
```typescript
// Check session persistence
const { data: { session } } = await supabase.auth.getSession();

// Listen for auth changes
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear user data
        queryClient.clear();
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

#### "User not authenticated" Errors
```typescript
// Check auth state before API calls
const user = supabase.auth.getUser();
if (!user) {
  router.push('/login');
  return;
}

// Add auth headers to requests
const { data, error } = await supabase
  .from('people')
  .select('*')
  .eq('user_id', user.id);
```

## Integration Issues

### LinkedIn API Issues

#### Rate Limiting
```typescript
// Implement exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async (fn: Function, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status === 429) {
      await delay(Math.pow(2, 3 - retries) * 1000);
      return retryWithBackoff(fn, retries - 1);
    }
    throw error;
  }
};
```

#### Invalid Access Token
```typescript
// Check token expiration
const isTokenExpired = (token: string) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
};

// Refresh token if needed
if (isTokenExpired(accessToken)) {
  const newToken = await refreshLinkedInToken();
  // Update stored token
}
```

### Expandi/Prosp Integration

#### Webhook Not Receiving Data
1. **Check Webhook URL**
   - Verify URL is accessible from internet
   - Test with tools like ngrok for local development
   - Ensure HTTPS in production

2. **Verify Webhook Signature**
   ```typescript
   const verifyWebhook = (payload: string, signature: string, secret: string) => {
     const expectedSignature = crypto
       .createHmac('sha256', secret)
       .update(payload)
       .digest('hex');
     
     return signature === expectedSignature;
   };
   ```

## Performance Issues

### Slow Page Load Times

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Identify large dependencies
npm ls --depth=0 --long
```

#### Code Splitting
```typescript
// Lazy load pages
const ReportingPage = lazy(() => import('./pages/Reporting'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ReportingPage />
</Suspense>
```

### Memory Leaks

#### React Query Cache
```typescript
// Set cache time limits
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 1 * 60 * 1000,  // 1 minute
    },
  },
});

// Clear cache on unmount
useEffect(() => {
  return () => {
    queryClient.removeQueries(['specific-query']);
  };
}, []);
```

#### Event Listeners
```typescript
// Always cleanup event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

## Deployment Issues

### Vercel Deployment Failures

#### Build Errors in Production
```bash
# Check build logs in Vercel dashboard
# Common issues:

# 1. Environment variables missing
# Add all required env vars in Vercel settings

# 2. Node.js version mismatch
# Add .nvmrc file with Node version
echo "18.17.0" > .nvmrc

# 3. Build command issues
# Verify build command in vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

#### Function Timeout Errors
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Environment-Specific Issues

#### Different Behavior in Production
```typescript
// Add environment checks
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

if (isDevelopment) {
  console.log('Debug info:', data);
}

// Use different configs per environment
const config = {
  development: {
    apiUrl: 'http://localhost:8080',
    debug: true
  },
  production: {
    apiUrl: 'https://your-domain.com',
    debug: false
  }
}[import.meta.env.MODE];
```

## Debugging Tools

### Browser DevTools

#### Console Debugging
```typescript
// Add strategic console logs
console.log('Component rendered with props:', props);
console.log('API response:', data);
console.log('User state:', user);

// Use console.table for arrays/objects
console.table(reportingData);

// Use console.group for organized logging
console.group('Authentication Flow');
console.log('User:', user);
console.log('Session:', session);
console.groupEnd();
```

#### Network Tab
- Check API requests and responses
- Verify request headers and payloads
- Look for failed requests (4xx, 5xx status codes)
- Check request timing and performance

#### React DevTools
- Install React Developer Tools extension
- Inspect component props and state
- Profile component performance
- Debug React Query cache

### Application Debugging

#### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Debug Hooks
```typescript
// Custom debug hook
const useDebug = (value: any, name: string) => {
  useEffect(() => {
    console.log(`${name} changed:`, value);
  }, [value, name]);
};

// Usage
const MyComponent = ({ data }) => {
  useDebug(data, 'component data');
  
  return <div>{/* component content */}</div>;
};
```

### Database Debugging

#### Supabase Logs
```typescript
// Enable query logging
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    debug: true, // Enable auth debugging
  },
});

// Log all queries
const originalFrom = supabase.from;
supabase.from = function(table) {
  console.log(`Querying table: ${table}`);
  return originalFrom.call(this, table);
};
```

#### SQL Query Analysis
```sql
-- Enable query logging in Supabase
-- Go to Settings > Database > Query Performance
-- Enable "Log all queries"

-- Analyze slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Performance Debugging

#### React Profiler
```typescript
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Component render:', {
    id,
    phase,
    actualDuration
  });
};

<Profiler id="ReportingPage" onRender={onRenderCallback}>
  <ReportingPage />
</Profiler>
```

#### Bundle Analysis
```bash
# Analyze bundle with webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js

# Check for duplicate dependencies
npm ls --depth=0 | grep -E "├─|└─" | sort
```

---

*For development setup, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)*
*For design guidelines, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)*
*For integration setup, see [INTEGRATIONS_GUIDE.md](./INTEGRATIONS_GUIDE.md)*

# Empowr CRM - Performance Optimization Guide

## Table of Contents
- [Overview](#overview)
- [React 18 Performance Patterns](#react-18-performance-patterns)
- [Database Optimization](#database-optimization)
- [Component Architecture](#component-architecture)
- [Bundle Optimization](#bundle-optimization)
- [Monitoring & Debugging](#monitoring--debugging)
- [Best Practices Checklist](#best-practices-checklist)

## Overview

This guide documents the performance optimizations implemented in Empowr CRM, focusing on React 18 best practices, database query optimization, and modern TypeScript patterns.

### Key Performance Metrics
- **Initial Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Database Query Response**: < 500ms
- **Component Re-render Frequency**: Minimized through memoization

## React 18 Performance Patterns

### 1. Component Memoization

#### React.memo for Expensive Components
```typescript
// ✅ Good: Memoized component
const ExpensiveChart = React.memo<ChartProps>(({ data, onDataPointClick }) => {
  const processedData = useMemo(() => {
    return processChartData(data);
  }, [data]);

  return (
    <div className="chart-container">
      {/* Chart rendering */}
    </div>
  );
});

ExpensiveChart.displayName = 'ExpensiveChart';
```

#### useMemo for Expensive Calculations
```typescript
// ✅ Good: Memoized calculation
const Dashboard = () => {
  const [rawData, setRawData] = useState<RawData[]>([]);
  
  const processedMetrics = useMemo(() => {
    return rawData.reduce((acc, item) => {
      acc.totalLeads += item.leadCount;
      acc.conversionRate += item.conversionRate;
      return acc;
    }, { totalLeads: 0, conversionRate: 0 });
  }, [rawData]);

  return <MetricsDisplay metrics={processedMetrics} />;
};
```

#### useCallback for Event Handlers
```typescript
// ✅ Good: Memoized event handler
const DataTable = ({ data, onRowClick }: DataTableProps) => {
  const handleRowClick = useCallback((rowId: string) => {
    onRowClick(rowId);
  }, [onRowClick]);

  return (
    <table>
      {data.map(row => (
        <TableRow 
          key={row.id} 
          data={row} 
          onClick={handleRowClick} 
        />
      ))}
    </table>
  );
};
```

### 2. State Management Optimization

#### Localized State
```typescript
// ✅ Good: State close to where it's used
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // State is only used in this component
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

#### Context Optimization
```typescript
// ✅ Good: Split contexts to avoid unnecessary re-renders
const AuthContext = createContext<AuthState | null>(null);
const ThemeContext = createContext<ThemeState | null>(null);

// ❌ Bad: Single context with everything
const AppContext = createContext<AppState | null>(null);
```

### 3. Effect Optimization

#### Dependency Array Optimization
```typescript
// ✅ Good: Minimal dependencies
const UserProfile = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(userId);
      setProfile(data);
    };
    
    fetchProfile();
  }, [userId]); // Only depend on userId

  return <ProfileDisplay profile={profile} />;
};
```

## Database Optimization

### 1. RPC Functions for Complex Queries

#### Dashboard Data Optimization
```sql
-- Single optimized function for dashboard data
CREATE OR REPLACE FUNCTION get_dashboard_data(start_date text, end_date text)
RETURNS TABLE (
  new_jobs_today bigint,
  new_leads_today bigint,
  new_companies_today bigint,
  automated_jobs bigint,
  pending_follow_ups bigint,
  todays_jobs jsonb,
  todays_companies jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  jobs_count bigint;
  leads_count bigint;
  companies_count bigint;
  automated_count bigint;
  follow_ups_count bigint;
  jobs_data jsonb;
  companies_data jsonb;
BEGIN
  -- Get counts efficiently
  SELECT COUNT(*) INTO jobs_count
  FROM jobs 
  WHERE created_at >= start_date::timestamptz 
    AND created_at < end_date::timestamptz;
    
  SELECT COUNT(*) INTO leads_count
  FROM people 
  WHERE created_at >= start_date::timestamptz 
    AND created_at < end_date::timestamptz;
    
  SELECT COUNT(*) INTO companies_count
  FROM companies 
  WHERE created_at >= start_date::timestamptz 
    AND created_at < end_date::timestamptz;
    
  SELECT COUNT(*) INTO automated_count
  FROM jobs 
  WHERE created_at >= start_date::timestamptz 
    AND created_at < end_date::timestamptz
    AND automation_active = true;
    
  SELECT COUNT(*) INTO follow_ups_count
  FROM interactions 
  WHERE created_at >= start_date::timestamptz 
    AND created_at < end_date::timestamptz
    AND interaction_type = 'linkedin_connection_request_sent';
    
  -- Get detailed data with joins
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', j.id,
      'title', j.title,
      'automation_active', j.automation_active,
      'created_at', j.created_at,
      'companies', jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'industry', c.industry
      )
    )
  ) INTO jobs_data
  FROM jobs j
  LEFT JOIN companies c ON j.company_id = c.id
  WHERE j.created_at >= start_date::timestamptz 
    AND j.created_at < end_date::timestamptz
  LIMIT 10;
    
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', name,
      'industry', industry,
      'created_at', created_at
    )
  ) INTO companies_data
  FROM companies 
  WHERE created_at >= start_date::timestamptz 
    AND created_at < end_date::timestamptz
  LIMIT 10;
    
  RETURN QUERY SELECT 
    jobs_count,
    leads_count,
    companies_count,
    automated_count,
    follow_ups_count,
    COALESCE(jobs_data, '[]'::jsonb),
    COALESCE(companies_data, '[]'::jsonb);
END;
$$;
```

### 2. Index Strategy

#### Essential Indexes
```sql
-- Date-based queries (most common)
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_people_created_at ON people(created_at);
CREATE INDEX idx_companies_created_at ON companies(created_at);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Foreign key indexes
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_people_company_id ON people(company_id);
CREATE INDEX idx_interactions_person_id ON interactions(person_id);

-- Composite indexes for complex queries
CREATE INDEX idx_jobs_automation_created ON jobs(automation_active, created_at);
CREATE INDEX idx_interactions_type_created ON interactions(interaction_type, created_at);
CREATE INDEX idx_people_stage_created ON people(stage, created_at);

-- Owner-based filtering
CREATE INDEX idx_jobs_owner_id ON jobs(owner_id);
CREATE INDEX idx_people_owner_id ON people(owner_id);
CREATE INDEX idx_companies_owner_id ON companies(owner_id);
```

### 3. Query Patterns

#### Efficient Data Fetching
```typescript
// ✅ Good: Single RPC call
const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const today = new Date().toISOString().split('T')[0];
        const todayEnd = `${today}T23:59:59.999Z`;
        
        const { data: result, error: rpcError } = await supabase
          .rpc('get_dashboard_data', {
            start_date: today,
            end_date: todayEnd
          });

        if (rpcError) throw rpcError;
        setData(result[0]);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
```

## Component Architecture

### 1. Error Boundaries

#### Global Error Boundary
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Lazy Loading

#### Route-based Code Splitting
```typescript
// Lazy load page components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Reporting = lazy(() => import('@/pages/Reporting'));
const Settings = lazy(() => import('@/pages/Settings'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
```

#### Component-based Lazy Loading
```typescript
// Lazy load heavy chart components
const HeavyChart = lazy(() => import('@/components/charts/HeavyChart'));

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Load Chart
      </button>
      
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart data={data} />
        </Suspense>
      )}
    </div>
  );
};
```

### 3. Custom Hooks

#### Reusable Data Fetching Hook
```typescript
interface UseApiOptions<T> {
  initialData?: T;
  enabled?: boolean;
  refetchInterval?: number;
}

export const useApi = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
) => {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, options.enabled]);

  useEffect(() => {
    fetchData();
    
    if (options.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options.refetchInterval]);

  return { data, isLoading, error, refetch: fetchData };
};
```

## Bundle Optimization

### 1. Code Splitting Strategy

#### Dynamic Imports
```typescript
// Dynamic import for heavy libraries
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

const ChartComponent = () => {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    loadChartLibrary().then(setChart);
  }, []);

  if (!Chart) return <div>Loading chart...</div>;
  
  return <Chart data={data} />;
};
```

### 2. Tree Shaking

#### Import Optimization
```typescript
// ✅ Good: Import only what you need
import { debounce } from 'lodash/debounce';
import { format } from 'date-fns/format';

// ❌ Bad: Import entire library
import _ from 'lodash';
import * as dateFns from 'date-fns';
```

### 3. Bundle Analysis

#### Webpack Bundle Analyzer
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer dist/assets/*.js
```

## Monitoring & Debugging

### 1. Performance Monitoring

#### React DevTools Profiler
```typescript
// Wrap components for profiling
const ProfiledComponent = React.memo(({ data }: Props) => {
  // Component logic
});

// Use React DevTools Profiler to identify:
// - Components that re-render frequently
// - Expensive render cycles
// - Unnecessary effect executions
```

#### Custom Performance Hooks
```typescript
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`${componentName} render time: ${endTime - startTime}ms`);
    };
  });
};
```

### 2. Database Query Monitoring

#### Query Performance Tracking
```typescript
const trackQueryPerformance = async <T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await queryFn();
    const endTime = performance.now();
    
    console.log(`${queryName} took ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`${queryName} failed after ${endTime - startTime}ms:`, error);
    throw error;
  }
};
```

## Best Practices Checklist

### Component Development
- [ ] Use `React.memo` for expensive components
- [ ] Implement `useMemo` for heavy calculations
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Minimize state updates and re-renders
- [ ] Implement proper loading and error states
- [ ] Use TypeScript interfaces for all props and state

### Database Queries
- [ ] Use RPC functions for complex queries
- [ ] Implement proper indexes for frequently queried columns
- [ ] Avoid N+1 query patterns
- [ ] Use pagination for large datasets (see [Table Pagination Guide](../COMPONENTS/TABLE_PAGINATION_GUIDE.md))
- [ ] Implement query result caching where appropriate
- [ ] Monitor query performance regularly

### Bundle Optimization
- [ ] Implement code splitting for routes
- [ ] Use dynamic imports for heavy libraries
- [ ] Optimize imports to avoid unused code
- [ ] Monitor bundle size regularly
- [ ] Use tree shaking effectively
- [ ] Implement lazy loading for heavy components

### Error Handling
- [ ] Implement error boundaries for component trees
- [ ] Provide meaningful error messages to users
- [ ] Log errors for debugging
- [ ] Implement retry mechanisms for failed requests
- [ ] Handle loading states gracefully
- [ ] Provide fallback UI for errors

### Performance Monitoring
- [ ] Use React DevTools Profiler
- [ ] Monitor Core Web Vitals
- [ ] Track database query performance
- [ ] Monitor component re-render frequency
- [ ] Implement performance budgets
- [ ] Regular performance audits

---

*This guide is updated regularly as new optimizations are implemented. For specific implementation details, refer to the actual code in the repository.*

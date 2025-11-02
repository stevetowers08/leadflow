# RECRUITEDGE - Development Guide

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Database Management](#database-management)
- [Deployment Process](#deployment-process)
- [Best Practices](#best-practices)

## Modern CSS Architecture (December 2024)

### Action Bar Implementation

**✅ Best Practice**: Use design tokens with Tailwind utilities

```tsx
// ✅ CORRECT: Modern action bar implementation
export const FilterControls = ({ ... }) => {
  const tokens = designTokens.filterControls;

  return (
    <div className={tokens.container}>
      <div className={tokens.leftGroup}>
        <DropdownSelect className={cn(tokens.dropdown, tokens.dropdownSmall)} />
        <button className={cn(tokens.button, tokens.buttonDefault)}>
          <Star className={tokens.icon} />
        </button>
      </div>
    </div>
  );
};
```

**❌ Avoid**: Custom CSS files with overrides

```css
/* ❌ WRONG: Don't create custom CSS files */
.action-bar-icon-button {
  height: 32px !important;
  /* ... more overrides */
}
```

### Page Layout Standards (Updated January 2025)

**✅ Fixed Viewport Layout**: All table pages use flex constraints with no page scrolling

```tsx
// ✅ CORRECT: Fixed viewport with internal scrolling
<Page stats={stats} title='Companies' hideHeader>
  <div className='flex-1 flex flex-col min-h-0 space-y-4'>
    {/* Fixed filters at top */}
    <FilterControls {...props} />

    {/* Scrollable table area */}
    <div className='flex-1 min-h-0'>
      <UnifiedTable
        scrollable={true}
        onRowClick={handleRowClick}
        loading={loading}
      />
    </div>

    {/* Fixed pagination at bottom */}
    <PaginationControls {...props} />
  </div>
</Page>
```

### Table Header Standards (Updated January 2025)

**✅ All tables feature consistent headers**: Borders, single-line text, and sticky scrolling

```tsx
// ✅ CORRECT: Table with proper header styling
<th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-r border-b-2 border-gray-200 last:border-r-0 whitespace-nowrap">
  {column.label}
</th>

// Table with border-collapse for clean borders
<table className='w-full border-collapse'>
  {/* table content */}
</table>
```

**Key Requirements**:

- Use `border-b-2 border-gray-200` for header bottom border
- Use `whitespace-nowrap` to prevent text wrapping
- Use `sticky top-0 z-20` for sticky headers when scrolling
- Use `border-collapse` instead of `border-separate` for cleaner borders
- Headers automatically stick on tables with `scrollable={true}`

**Benefits**:

- Headers always visible while scrolling through data
- Clean, professional appearance with proper borders
- Consistent across all pages (People, Jobs, Companies)

### Standard Column Widths (Updated January 2025)

**✅ Status columns use consistent width across all tables**

**Key Requirements**:

- All status columns: `150px` width - **CONSISTENT**
  - Jobs page status: `150px`
  - People page status: `150px`
  - Companies page status: `150px`

**Implementation**:

```tsx
// Status column configuration
{
  key: 'status',
  label: 'Status',
  width: '150px',  // Standardized width
  cellType: 'status',
  align: 'center',
  // ...
}
```

**Benefits**:

- Consistent visual appearance across all tables
- Predictable column sizing
- Better UX with uniform layouts

### Unified Status Dropdown (Updated January 2025)

**✅ Single unified component for all status dropdowns**

**Implementation**:

```tsx
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';

// Status column configuration
{
  key: 'status',
  label: 'Status',
  width: '150px',
  cellType: 'status',
  align: 'center',
  render: (_, item) => (
    <UnifiedStatusDropdown
      entityId={item.id}
      entityType='people'
      currentStatus={item.people_stage}
      availableStatuses={[
        'new_lead',
        'message_sent',
        'replied',
        'interested',
        'meeting_scheduled',
        'meeting_completed',
        'follow_up',
        'not_interested',
      ]}
      onStatusChange={() => handleRefresh()}
    />
  ),
}
```

**Key Features**:

- ✅ Whole cell clickable (entire area activates dropdown)
- ✅ Status dots in dropdown items for quick visual recognition
- ✅ Checkmark indicates selected item
- ✅ Single source of truth - no duplicate code
- ✅ Optimistic updates with error handling
- ✅ Consistent `180px` dropdown width

**Benefits**:

- Clean, maintainable codebase
- Modern, professional UI
- Consistent UX across all tables
- Better accessibility

**Key Pattern**:

- Use `flex-1 min-h-0` for flexible areas that need scrolling
- Wrap scrollable content in `flex-1 min-h-0` containers
- Let `overflow-auto` handle internal scrolling

**Layout Hierarchy**:

1. **Layout**: `h-screen overflow-hidden` - Prevents page scroll
2. **Content Wrapper**: `overflow-hidden` - Delegates overflow to pages
3. **Page**: `h-full overflow-hidden` - Fits container without scroll
4. **Page Content**: `flex-1 flex flex-col min-h-0` - Flex constraints
5. **Table Container**: `flex-1 min-h-0` - Takes available space
6. **Table**: `overflow-auto` - Scrolls internally

**❌ Avoid**: Pages that scroll independently

```tsx
// ❌ WRONG: Page-level scrolling (causes issues)
<Page title='Companies'>
  <div className='h-screen overflow-auto'>
    {' '}
    {/* NO! */}
    <Table />
  </div>
</Page>
```

### Height Standards

**All action bar elements must be `h-7` (28px)**:

- Filter dropdowns: `h-7`
- Action buttons: `h-7 w-7`
- Search inputs: `h-7`
- Icons: `h-4 w-4` (16px)

### Inline Search Pattern

**✅ Modern UX**: Search expands inline next to favorite button

```tsx
// ✅ CORRECT: Inline search implementation
{
  isSearchActive ? (
    <input
      type='text'
      value={searchTerm}
      onChange={e => onSearchChange(e.target.value)}
      placeholder='Search...'
      className='h-7 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-w-48'
      autoFocus
    />
  ) : (
    <button
      onClick={onSearchToggle}
      className={cn(tokens.button, tokens.buttonDefault)}
    >
      <Search className={tokens.icon} />
    </button>
  );
}
```

---

## Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version
- **Supabase Account**: For database and authentication
- **Google Cloud Console**: For OAuth setup

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd empowr-crm

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

### Development Server

- **Local**: http://localhost:8086 (Next.js default port)
- **Network**: Accessible on local network for mobile testing
- **Hot Reload**: Fast Refresh with Next.js (instant updates)
- **Onboarding Dashboard**: Access `/getting-started` for guided setup flow
- **Status**: ✅ Stable - Next.js 16.0.1 with App Router

## Environment Setup

### Required Environment Variables

#### Core Application

```env
# Supabase Configuration (Client-side)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application Settings (if needed)
NEXT_PUBLIC_APP_URL=http://localhost:8086
NODE_ENV=development
```

#### Optional Integrations

```env
# Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn

# Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id
```

### Supabase Setup

#### 1. Create Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Note down project URL and anon key

#### 2. Database Schema

Run the following SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  stage TEXT DEFAULT 'new',
  automation_active BOOLEAN DEFAULT false,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create people table
CREATE TABLE people (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  stage TEXT DEFAULT 'new',
  lead_score INTEGER DEFAULT 0,
  automation_started_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  reply_type TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  priority TEXT DEFAULT 'medium',
  function TEXT,
  location TEXT,
  employment_type TEXT DEFAULT 'full-time',
  seniority TEXT DEFAULT 'mid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interactions table
CREATE TABLE interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  person_id UUID REFERENCES people(id),
  type TEXT NOT NULL,
  content TEXT,
  response_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Row Level Security (RLS) - Development vs Production

**🚨 IMPORTANT**: RLS policies can cause infinite retry loops and HTTP 500 errors during development when users aren't authenticated.

**For Early Development Stages:**

```sql
-- Temporarily disable RLS for development tables
-- This allows unrestricted access during development
ALTER TABLE job_filter_configs DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE people DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- IMPORTANT: Re-enable before production deployment
ALTER TABLE job_filter_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

**For Production (when authentication is ready):**

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (authenticated users can access all data)
CREATE POLICY "Users can access companies" ON companies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can access people" ON people FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can access jobs" ON jobs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can access interactions" ON interactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can access user_profiles" ON user_profiles FOR ALL USING (auth.role() = 'authenticated');
```

**When to Disable RLS:**

- ✅ Early development stages where you need unrestricted access
- ✅ Testing and iteration phases
- ✅ When RLS policies are causing query failures
- ✅ When building features that don't require user authentication

**When NOT to Disable RLS:**

- ❌ Production environments
- ❌ When handling sensitive user data
- ❌ When you have proper authentication in place
- ❌ When multiple users will access the system

#### 4. Authentication Setup

1. Go to Authentication > Settings in Supabase
2. Enable Google OAuth provider
3. Add your Google OAuth credentials
4. Set redirect URLs for development and production

## Development Workflow

### Branch Strategy

```
main (production)
├── develop (staging)
├── feature/feature-name
├── bugfix/bug-description
└── hotfix/critical-fix
```

### Commit Convention

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat(reporting): add analytics dashboard
fix(pipeline): resolve drag and drop issue
docs(setup): update environment variables guide
```

### Development Process

1. **Create Branch**: `git checkout -b feature/feature-name`
2. **Develop**: Make changes following code standards
3. **Test**: Run tests and manual testing
4. **Commit**: Use conventional commit messages
5. **Push**: `git push origin feature/feature-name`
6. **Pull Request**: Create PR with description and screenshots
7. **Review**: Code review and approval
8. **Merge**: Merge to develop, then to main for release

## Reporting Architecture

### Overview

The reporting system has been optimized for performance and maintainability using modern React patterns and efficient data fetching.

### Architecture Components

#### 1. Data Fetching with React Query

```typescript
// src/hooks/useReportingData.ts
export const useReportingData = () => {
  return useQuery<ReportingData>({
    queryKey: ['reporting-data', user?.id],
    queryFn: async () => reportingService.getReportingData(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
```

#### 2. Modular Component Structure

The reporting page is split into focused, memoized components:

- **OverviewCards**: Displays key metrics with memoization
- **StageDistribution**: Bar and pie charts for stage analysis
- **MonthlyTrends**: Line charts for trend visualization
- **RecentInteractions**: Table of recent activity
- **TopCompanies**: Company performance rankings

#### 3. Lazy Loading

Heavy chart components are lazy-loaded to improve initial page load:

```typescript
const OverviewCards = lazy(() =>
  import('@/components/reporting/OverviewCards').then(m => ({
    default: m.OverviewCards,
  }))
);
```

#### 4. Performance Optimizations

- **Memoization**: All chart components use `React.memo()` to prevent unnecessary re-renders
- **Caching**: React Query provides intelligent caching with 5-minute stale time
- **Error Handling**: Comprehensive error states with retry mechanisms
- **Loading States**: Skeleton loaders for better UX

### Database Optimizations

#### Index Strategy

```sql
-- Foreign key indexes for better join performance
CREATE INDEX idx_business_profiles_created_by ON business_profiles(created_by);
CREATE INDEX idx_campaign_participants_person_id ON campaign_participants(person_id);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_invitations_accepted_by ON invitations(accepted_by);
CREATE INDEX idx_invitations_invited_by ON invitations(invited_by);
```

#### Query Optimization

- Removed verbose logging from service layer
- Consolidated error handling
- Optimized data fetching with Promise.all for parallel queries

### Best Practices

#### Component Development

```typescript
// Use memo for expensive components
export const ChartComponent = memo<Props>(({ data }) => {
  // Component logic
});

ChartComponent.displayName = 'ChartComponent';
```

#### Data Fetching

```typescript
// Use React Query for all data fetching
const { data, isLoading, error, refetch } = useReportingData();

// Handle loading and error states
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage onRetry={refetch} />;
```

#### Performance Monitoring

- Monitor component re-renders with React DevTools
- Use React Query DevTools for cache inspection
- Monitor database query performance with Supabase logs

## Code Standards

### TypeScript Guidelines

```typescript
// Use explicit types for function parameters and returns
function calculateMetrics(data: ReportingData[]): MetricsResult {
  return {
    totalLeads: data.length,
    conversionRate: calculateRate(data),
  };
}

// Use interfaces for object shapes
interface Company {
  id: string;
  name: string;
  industry: string;
  stage: CompanyStage;
}

// Use enums for constants
enum CompanyStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
}
```

### React Component Standards

```tsx
// Use functional components with TypeScript
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  optional?: boolean;
}

const Component: React.FC<ComponentProps> = ({
  title,
  onAction,
  optional = false,
}) => {
  // Use hooks at the top
  const [state, setState] = useState<string>('');
  const { data, loading } = useQuery(['key'], fetchData);

  // Event handlers
  const handleClick = useCallback(
    (id: string) => {
      onAction(id);
    },
    [onAction]
  );

  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;

  return (
    <div className='component-container'>
      <h2>{title}</h2>
      {optional && <OptionalContent />}
    </div>
  );
};
```

### CSS/Styling Standards

```tsx
// Use Tailwind classes with consistent patterns
<div className='flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300'>
  <span className='text-sm font-medium text-gray-600'>Label</span>
  <span className='text-lg font-semibold text-gray-900'>Value</span>
</div>;

// Use design tokens for consistency
import { designTokens } from '@/design-system/tokens';

<div className={designTokens.layout.card}>
  <span className={designTokens.typography.label}>Label</span>
</div>;
```

### Detail Pages Pattern (Jobs, People, Companies)

All detail pages follow a unified structure for consistency and maintainability:

```tsx
// Standard detail page template
export default function EntityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Single useEntityData call for all related data
  const {
    entityData,
    companyData,
    leadsData,
    jobsData,
    isLoading,
    entityError: error,
  } = useEntityData({
    entityType: 'entity-type', // 'job', 'lead', or 'company'
    entityId: id!,
    isOpen: true,
    refreshTrigger,
  });

  // Consistent error and loading states
  if (isLoading) return <LoadingState />;
  if (error || !entityData) return <ErrorState />;

  return (
    <>
      <div className='fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10' />
      <div className='relative min-h-screen -mx-4 -my-4 lg:-mx-6 lg:-my-6'>
        {/* Header - Same width as content */}
        <div className='flex items-center justify-between py-6 max-w-6xl mx-auto px-6'>
          {/* Header content with back button, title, status badge */}
        </div>

        {/* Main Content */}
        <div className='space-y-6 max-w-6xl mx-auto px-6 pb-8'>
          {/* Entity-specific info card */}
          {/* Company info card (if applicable) */}
          {/* Related items lists */}
        </div>
      </div>
    </>
  );
}
```

**Key Principles**:

- **Unified Layout**: All detail pages use the same gradient background and layout structure
- **Consistent Data Fetching**: Single `useEntityData` call handles all related data
- **Proper Component Usage**: Use appropriate info cards (`JobInfoCard`, `LeadInfoCard`, `CompanyInfoCard`)
- **Clean Structure**: No notes/activity clutter, focus on essential information
- **Performance**: Optimized imports and minimal state management

### File Organization

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── charts/          # Chart components
│   ├── popup/           # Info cards (JobInfoCard, LeadInfoCard, CompanyInfoCard)
│   └── layout/          # Layout components
├── pages/               # Page components (unified detail page pattern)
├── services/            # API services
├── hooks/               # Custom hooks (useEntityData for detail pages)
├── utils/               # Utility functions
├── types/               # TypeScript types
└── design-system/       # Design system
```

## Testing Guidelines

### Unit Testing

```typescript
// Use Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" onAction={jest.fn()} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onAction = jest.fn();
    render(<Component title="Test" onAction={onAction} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalledWith('expected-id');
  });
});
```

### Integration Testing

```typescript
// Test API integration
import { renderHook, waitFor } from '@testing-library/react';
import { useReportingData } from './useReportingData';

describe('useReportingData', () => {
  it('fetches data correctly', async () => {
    const { result } = renderHook(() => useReportingData('30d'));

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });
});
```

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Authentication flow works
- [ ] CRUD operations function correctly
- [ ] Charts and visualizations display properly
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Performance (load times, interactions)

## Database Management

### Migrations

```sql
-- Create migration file: migrations/YYYYMMDD_description.sql
-- Example: migrations/20241002_add_automation_fields.sql

-- Add new columns
ALTER TABLE people ADD COLUMN automation_type TEXT;
ALTER TABLE people ADD COLUMN last_activity_at TIMESTAMP WITH TIME ZONE;

-- Update existing data
UPDATE people SET automation_type = 'expandi' WHERE automation_started_at IS NOT NULL;

-- Create indexes for performance
CREATE INDEX idx_people_automation_type ON people(automation_type);
CREATE INDEX idx_people_last_activity ON people(last_activity_at);
```

### Data Seeding

```sql
-- Insert sample data for development
INSERT INTO companies (name, industry, stage) VALUES
('TechCorp Inc', 'Engineering', 'new'),
('HealthPlus', 'Sales', 'contacted'),
('FinanceFirst', 'Marketing', 'qualified');

INSERT INTO people (name, company_id, stage, lead_score) VALUES
('John Doe', (SELECT id FROM companies WHERE name = 'TechCorp Inc'), 'new', 75),
('Jane Smith', (SELECT id FROM companies WHERE name = 'HealthPlus'), 'connected', 85);
```

### Performance Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_people_stage ON people(stage);
CREATE INDEX idx_people_company_id ON people(company_id);
CREATE INDEX idx_companies_stage ON companies(stage);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM people WHERE stage = 'connected';
```

## Deployment Process

### Development Deployment

```bash
# Build for development
npm run build:dev

# Preview build locally
npm run preview

# Deploy to staging
npm run deploy:staging
```

### Production Deployment

```bash
# Build for production
npm run build

# Run production tests
npm run test:prod

# Deploy to production
npm run deploy:prod
```

### Vercel Deployment

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Environment Variables**: Add all required env vars
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Domain Setup**: Configure custom domain if needed

### Environment-Specific Configurations

```typescript
// config/environments.ts
export const config = {
  development: {
    apiUrl: 'http://localhost:8080',
    debug: true,
    logLevel: 'debug',
  },
  staging: {
    apiUrl: 'https://staging.empowr-crm.com',
    debug: true,
    logLevel: 'info',
  },
  production: {
    apiUrl: 'https://empowr-crm.com',
    debug: false,
    logLevel: 'error',
  },
};
```

## Performance Optimization Guide

### React 18 Performance Best Practices

#### 1. Component Memoization

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo<Props>(({ data, onAction }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(
  (id: string) => {
    onAction(id);
  },
  [onAction]
);
```

#### 2. Database Query Optimization

```typescript
// ❌ Bad: Multiple separate queries
const fetchDashboardData = async () => {
  const jobs = await supabase.from('jobs').select('*');
  const people = await supabase.from('people').select('*');
  const companies = await supabase.from('companies').select('*');
  // Multiple round trips to database
};

// ✅ Good: Single optimized query with RPC function
const fetchDashboardData = async () => {
  const { data } = await supabase.rpc('get_dashboard_data', {
    start_date: today,
    end_date: todayEnd,
  });
  // Single database call with optimized query
};
```

#### 3. Loading States and Error Handling

```typescript
// Proper loading and error states
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDataFromAPI();
      setData(data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

// Render loading states
{isLoading ? (
  <div className="h-6 w-8 bg-gray-200 animate-pulse rounded"></div>
) : (
  <span className="text-xl font-bold">{data.value}</span>
)}
```

#### 4. TypeScript Best Practices

```typescript
// Define proper interfaces
interface TodaysData {
  newJobsToday: number;
  newLeadsToday: number;
  newCompaniesToday: number;
  automatedJobs: number;
  pendingFollowUps: number;
}

// Use strict typing
const [todaysData, setTodaysData] = useState<TodaysData>({
  newJobsToday: 0,
  newLeadsToday: 0,
  newCompaniesToday: 0,
  automatedJobs: 0,
  pendingFollowUps: 0,
});

// Avoid 'any' type
const handleItemClick = useCallback(
  (item: Job | Company, type: 'job' | 'company') => {
    // Type-safe implementation
  },
  []
);
```

### Database Optimization Strategies

#### 1. RPC Functions for Complex Queries

```sql
-- Create optimized dashboard data function
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
  -- ... other variables
BEGIN
  -- Single query to get all counts
  SELECT COUNT(*) INTO jobs_count
  FROM jobs
  WHERE created_at >= start_date::timestamptz
    AND created_at < end_date::timestamptz;

  -- Return aggregated data
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

#### 2. Index Strategy

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_people_created_at ON people(created_at);
CREATE INDEX idx_companies_created_at ON companies(created_at);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Composite indexes for complex queries
CREATE INDEX idx_jobs_automation_created ON jobs(automation_active, created_at);
CREATE INDEX idx_interactions_type_created ON interactions(interaction_type, created_at);
```

#### 3. Query Performance Monitoring

```typescript
// Monitor query performance
const { data, error } = await supabase
  .from('jobs')
  .select('*')
  .gte('created_at', today);

if (error) {
  console.error('Query failed:', error);
  // Fallback to alternative query or cached data
}
```

### Component Architecture Patterns

#### 1. Error Boundaries

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
```

#### 2. Lazy Loading Components

```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

const Dashboard = () => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  );
};
```

#### 3. Custom Hooks for Data Fetching

```typescript
// Reusable data fetching hook
export const useDashboardData = () => {
  const [data, setData] = useState<TodaysData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await supabase.rpc('get_dashboard_data', {
          start_date: new Date().toISOString().split('T')[0],
          end_date: `${new Date().toISOString().split('T')[0]}T23:59:59.999Z`,
        });

        if (result.error) throw result.error;
        setData(result.data[0]);
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

## Best Practices

### Modern Design System (2025)

- **Card Components**: Use modern card variants (minimal, elevated, glass) for consistency
- **Glassmorphism**: Apply subtle transparency and backdrop blur effects
- **Typography**: Use consistent font sizes and weights across components
- **Spacing**: Follow the 8px grid system for consistent spacing
- **Colors**: Apply the 60-30-10 color rule for balanced designs
- **Hover Effects**: Implement subtle scale and shadow transitions
- **Rounded Corners**: Use `rounded-2xl` for modern card appearance

### Performance

- **Code Splitting**: Use React.lazy for route-based splitting
- **Memoization**: Use React.memo, useMemo, useCallback appropriately
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Compress and optimize images
- **Caching**: Implement proper caching strategies
- **Database Optimization**: Use RPC functions for complex queries
- **Loading States**: Implement proper loading and error states

### Security

- **Environment Variables**: Never commit secrets to version control
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Sanitize user-generated content
- **HTTPS**: Always use HTTPS in production

### Accessibility

- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Add ARIA attributes where needed
- **Keyboard Navigation**: Ensure keyboard accessibility
- **Color Contrast**: Meet WCAG guidelines
- **Screen Readers**: Test with screen reader software

### Error Handling

```typescript
// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }
}

// API error handling
const handleApiError = (error: ApiError) => {
  if (error.status === 401) {
    // Redirect to login
    router.push('/login');
  } else if (error.status >= 500) {
    // Show generic error message
    toast.error('Something went wrong. Please try again.');
  } else {
    // Show specific error message
    toast.error(error.message);
  }
};
```

### Code Quality Tools

```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Documentation

- **Code Comments**: Document complex logic and business rules
- **README Updates**: Keep README current with setup instructions
- **API Documentation**: Document all API endpoints and responses
- **Component Documentation**: Use Storybook for component documentation
- **Architecture Decisions**: Document major architectural decisions

---

_For troubleshooting and debugging, see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)_
_For design guidelines, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)_
_For integration setup, see [INTEGRATIONS_GUIDE.md](./INTEGRATIONS_GUIDE.md)_

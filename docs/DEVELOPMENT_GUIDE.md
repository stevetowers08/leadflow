# Empowr CRM - Development Guide

## Table of Contents
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Database Management](#database-management)
- [Deployment Process](#deployment-process)
- [Best Practices](#best-practices)

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
- **Local**: http://localhost:8080 (or next available port)
- **Network**: Accessible on local network for mobile testing
- **Hot Reload**: Automatic refresh on file changes

## Environment Setup

### Required Environment Variables

#### Core Application
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application Settings
VITE_APP_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

#### Optional Integrations
```env
# LinkedIn API (if using direct integration)
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id
VITE_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

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
  linkedin_connected BOOLEAN DEFAULT false,
  linkedin_responded BOOLEAN DEFAULT false,
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

#### 3. Row Level Security (RLS)
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
feat(reporting): add LinkedIn analytics tab
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
  import('@/components/reporting/OverviewCards').then(m => ({ default: m.OverviewCards }))
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
    conversionRate: calculateRate(data)
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
  QUALIFIED = 'qualified'
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
  optional = false 
}) => {
  // Use hooks at the top
  const [state, setState] = useState<string>('');
  const { data, loading } = useQuery(['key'], fetchData);

  // Event handlers
  const handleClick = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;

  return (
    <div className="component-container">
      <h2>{title}</h2>
      {optional && <OptionalContent />}
    </div>
  );
};
```

### CSS/Styling Standards
```tsx
// Use Tailwind classes with consistent patterns
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
  <span className="text-sm font-medium text-gray-600">Label</span>
  <span className="text-lg font-semibold text-gray-900">Value</span>
</div>

// Use design tokens for consistency
import { designTokens } from '@/design-system/tokens';

<div className={designTokens.layout.card}>
  <span className={designTokens.typography.label}>Label</span>
</div>
```

### File Organization
```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── charts/          # Chart components
│   └── layout/          # Layout components
├── pages/               # Page components
├── services/            # API services
├── hooks/               # Custom hooks
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
    logLevel: 'debug'
  },
  staging: {
    apiUrl: 'https://staging.empowr-crm.com',
    debug: true,
    logLevel: 'info'
  },
  production: {
    apiUrl: 'https://empowr-crm.com',
    debug: false,
    logLevel: 'error'
  }
};
```

## Best Practices

### Performance
- **Code Splitting**: Use React.lazy for route-based splitting
- **Memoization**: Use React.memo, useMemo, useCallback appropriately
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Compress and optimize images
- **Caching**: Implement proper caching strategies

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

*For troubleshooting and debugging, see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)*
*For design guidelines, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)*
*For integration setup, see [INTEGRATIONS_GUIDE.md](./INTEGRATIONS_GUIDE.md)*

# Layout Components Architecture

## Overview

The Empowr CRM uses a modern, responsive layout system with modular components for consistent navigation and user experience across all pages.

## Core Layout Components

### 1. **ModernLayout** (`src/components/layout/ModernLayout.tsx`)

The main layout wrapper that provides the overall page structure.

**Features:**
- Responsive sidebar integration
- Top navigation bar
- Mobile navigation support
- Content area with proper spacing
- Error boundary integration

**Usage:**
```tsx
import { ModernLayout } from '@/components/layout/ModernLayout';

function App() {
  return (
    <ModernLayout>
      {/* Your page content */}
    </ModernLayout>
  );
}
```

### 2. **ModernSidebar** (`src/components/layout/ModernSidebar.tsx`)

The main navigation sidebar with collapsible functionality.

**Features:**
- Collapsible/expandable design
- Navigation menu items
- User profile section
- Mobile-responsive behavior
- Active state management

**Navigation Items:**
- Dashboard
- Jobs
- People
- Companies
- Pipeline
- Campaigns
- Conversations
- Automations
- Reporting
- Settings

**Usage:**
```tsx
import { ModernSidebar } from '@/components/layout/ModernSidebar';

function Layout() {
  return (
    <div className="flex">
      <ModernSidebar />
      <main className="flex-1">
        {/* Main content */}
      </main>
    </div>
  );
}
```

### 3. **TopNavigationBar** (`src/components/layout/TopNavigationBar.tsx`)

The top navigation bar with search, notifications, and user controls.

**Features:**
- Global search functionality
- User profile dropdown
- Notification indicators
- Mobile menu toggle
- Breadcrumb navigation

**Usage:**
```tsx
import { TopNavigationBar } from '@/components/layout/TopNavigationBar';

function Layout() {
  return (
    <div className="flex flex-col">
      <TopNavigationBar />
      <main className="flex-1">
        {/* Main content */}
      </main>
    </div>
  );
}
```

## Search System Architecture

### 1. **SearchContext** (`src/contexts/SearchContext.tsx`)

Global search state management context.

**Features:**
- Global search state
- Search history
- Recent searches
- Search suggestions
- Cross-entity search

**Usage:**
```tsx
import { SearchProvider, useSearch } from '@/contexts/SearchContext';

function App() {
  return (
    <SearchProvider>
      <YourApp />
    </SearchProvider>
  );
}

function SearchComponent() {
  const { searchQuery, setSearchQuery, searchResults } = useSearch();
  
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 2. **GlobalSearchService** (`src/services/globalSearchService.ts`)

Service for handling global search across all entities.

**Features:**
- Multi-entity search (jobs, people, companies)
- Search result ranking
- Search analytics
- Performance optimization
- Caching

**Usage:**
```tsx
import { globalSearchService } from '@/services/globalSearchService';

const searchResults = await globalSearchService.search({
  query: 'react developer',
  entities: ['jobs', 'people', 'companies'],
  limit: 20
});
```

## Jobs System Architecture

### 1. **JobsService** (`src/services/jobsService.ts`)

Service for managing job-related operations.

**Features:**
- Job CRUD operations
- Job filtering and sorting
- Job analytics
- Company-job relationships
- Priority management

**Usage:**
```tsx
import { jobsService } from '@/services/jobsService';

// Get jobs with filters
const jobs = await jobsService.getJobs({
  filters: {
    function: 'engineering',
    location: 'remote',
    priority: 'high'
  },
  sortBy: 'created_at',
  sortOrder: 'desc'
});

// Update job priority
await jobsService.updateJobPriority(jobId, 'urgent');
```

### 2. **useJobs Hook** (`src/hooks/useJobs.ts`)

React hook for job data management.

**Features:**
- Job data fetching
- Real-time updates
- Optimistic updates
- Error handling
- Loading states

**Usage:**
```tsx
import { useJobs } from '@/hooks/useJobs';

function JobsPage() {
  const {
    jobs,
    isLoading,
    error,
    refetch,
    updateJob,
    deleteJob
  } = useJobs();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Navigation
- Collapsible sidebar
- Bottom navigation bar
- Touch-friendly interactions
- Swipe gestures

### Desktop Navigation
- Fixed sidebar
- Top navigation bar
- Keyboard shortcuts
- Hover states

## Layout Patterns

### 1. **Page Layout**
```tsx
function PageLayout({ children, title }) {
  return (
    <ModernLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </div>
    </ModernLayout>
  );
}
```

### 2. **Card Layout**
```tsx
function CardLayout({ children }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
```

### 3. **Two-Column Layout**
```tsx
function TwoColumnLayout({ left, right }) {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
```

## State Management

### Layout State
- Sidebar collapsed/expanded
- Mobile menu open/closed
- Active navigation item
- Search state

### Search State
- Current search query
- Search results
- Search history
- Recent searches

### Jobs State
- Jobs list
- Filters and sorting
- Selected jobs
- Job details

## Performance Considerations

### 1. **Lazy Loading**
- Components loaded on demand
- Route-based code splitting
- Image lazy loading

### 2. **Caching**
- Search results caching
- Job data caching
- Navigation state persistence

### 3. **Optimization**
- Virtual scrolling for large lists (see [Table Pagination Guide](./TABLE_PAGINATION_GUIDE.md))
- Debounced search
- Memoized components

## Accessibility

### 1. **Keyboard Navigation**
- Tab order management
- Focus management
- Keyboard shortcuts

### 2. **Screen Reader Support**
- ARIA labels
- Semantic HTML
- Live regions

### 3. **Visual Accessibility**
- High contrast mode
- Focus indicators
- Color-blind friendly

## Testing

### 1. **Unit Tests**
- Component rendering
- State management
- User interactions

### 2. **Integration Tests**
- Layout responsiveness
- Search functionality
- Navigation flow

### 3. **E2E Tests**
- Complete user journeys
- Cross-browser testing
- Mobile testing

---

*Last updated: January 30, 2025*

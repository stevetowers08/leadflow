# 🎯 Popup System Documentation

## 📋 Overview

The popup system provides a unified, consistent way to display detailed information for leads, companies, and jobs across the application. It uses a centralized context-based approach with React Query for data management and caching.

## 🏗️ Architecture

### Core Components

```
PopupProvider (Context)
├── UnifiedPopup (Main Component)
├── PopupModal (Modal Wrapper)
├── InfoCard (Content Sections)
└── ListItem (List Items)
```

### Data Flow

```
User Click → PopupContext → Supabase Query → React Query Cache → UnifiedPopup → PopupModal
```

## 🔧 Components

### 1. PopupContext (`src/contexts/PopupContext.tsx`)

**Purpose**: Centralized state management and data fetching for all popups.

**Key Features**:
- Manages popup state (`activePopup`, `currentId`, `popupData`)
- Handles data fetching with React Query caching
- Processes company data (logo URLs, etc.)
- Manages lead selection for automation

**API**:
```typescript
interface PopupContextType {
  // State
  activePopup: 'lead' | 'company' | 'job' | null;
  popupData: PopupData;
  
  // Actions
  openLeadPopup: (leadId: string) => void;
  openCompanyPopup: (companyId: string) => void;
  openJobPopup: (jobId: string) => void;
  closePopup: () => void;
  
  // Selection
  selectedLeads: any[];
  toggleLeadSelection: (leadId: string) => void;
  clearSelection: () => void;
}
```

**Data Processing**:
- Automatically generates company logo URLs using `getClearbitLogo`
- Handles nested company data structure
- Provides loading states for all queries

### 2. UnifiedPopup (`src/components/UnifiedPopup.tsx`)

**Purpose**: Single component that renders different content based on popup type.

**Content Types**:
- **Lead Popup**: Lead info + Company info + Related jobs
- **Company Popup**: Company info + Related leads + Related jobs  
- **Job Popup**: Job info + Company info + Related leads

**Layout Structure**:
```
PopupModal
├── Header (Title, Subtitle, Status Badge, AI Score)
└── Content
    ├── Primary Info Card (Lead/Company/Job details)
    ├── Company Info Card (if applicable)
    └── Related Items Card (Leads/Jobs)
```

### 3. PopupModal (`src/components/shared/PopupModal.tsx`)

**Purpose**: Generic modal wrapper providing consistent styling and behavior.

**Features**:
- Consistent z-index (`z-50`)
- Responsive design (`max-w-4xl`, `max-h-[90vh]`)
- Header with close button
- Status badge and AI score display
- Backdrop click to close

### 4. InfoCard (`src/components/shared/InfoCard.tsx`)

**Purpose**: Reusable card component for popup content sections.

**Features**:
- Consistent card styling
- Optional action buttons
- Flexible content area

### 5. ListItem (`src/components/shared/ListItem.tsx`)

**Purpose**: Reusable list item component for displaying related items.

**Features**:
- Avatar/profile image support
- Title and subtitle
- Optional badges and checkboxes
- Click handlers

## 📊 Data Structure

### PopupData Interface

```typescript
interface PopupData {
  // Primary data
  lead?: any;
  company?: any;
  job?: any;
  
  // Related data
  relatedLeads?: any[];
  relatedJobs?: any[];
  relatedCompanies?: any[];
  
  // Loading states
  isLoadingLead?: boolean;
  isLoadingCompany?: boolean;
  isLoadingJob?: boolean;
  isLoadingRelatedLeads?: boolean;
  isLoadingRelatedJobs?: boolean;
}
```

### Company Data Processing

The system automatically processes company data to include:
- **Logo URLs**: Uses `profile_image_url` or generates via `getClearbitLogo`
- **Nested Structure**: Company data is nested under `companies` property
- **Complete Fields**: All company fields are fetched and available

## 🎨 Styling & Behavior

### Z-Index System

All modals use consistent z-index values:
- **PopupModal**: `z-50`
- **LinkedInAutomationModal**: `z-50`
- **Toast**: `z-[100]`
- **Navigation**: `z-[1]`

### Responsive Design

- **Desktop**: `max-w-4xl` width, `max-h-[90vh]` height
- **Mobile**: Responsive padding and sizing
- **Content**: Scrollable areas for long content

### Loading States

- **Data Loading**: Shows loading spinners during data fetch
- **Error Handling**: Graceful error handling with fallbacks
- **Caching**: React Query provides intelligent caching

## 🚀 Usage Examples

### Opening Popups

```typescript
// In any component
const { openLeadPopup, openCompanyPopup, openJobPopup } = usePopup();

// Open lead popup
openLeadPopup('lead-id-123');

// Open company popup  
openCompanyPopup('company-id-456');

// Open job popup
openJobPopup('job-id-789');
```

### Accessing Popup Data

```typescript
// In UnifiedPopup or any component within PopupProvider
const { popupData, activePopup } = usePopup();

// Access current data
const currentLead = popupData.lead;
const currentCompany = popupData.company;
const currentJob = popupData.job;

// Access related data
const relatedLeads = popupData.relatedLeads;
const relatedJobs = popupData.relatedJobs;
```

## 🔄 Data Fetching Strategy

### Query Dependencies

The system uses intelligent query dependencies to ensure data is available:

```typescript
// Related leads query waits for main data
enabled: !!currentId && ['company', 'job', 'lead'].includes(activePopup!) && 
  (activePopup === 'company' || 
   (activePopup === 'job' && !!jobData) || 
   (activePopup === 'lead' && !!leadData))
```

### Caching Strategy

- **React Query**: Automatic caching with 5-minute stale time
- **Query Keys**: Structured keys for efficient cache invalidation
- **Background Updates**: Automatic refetching when data becomes stale

## 🛠️ Maintenance

### Adding New Popup Types

1. **Update PopupContext**:
   - Add new popup type to `activePopup` union
   - Add new query for data fetching
   - Add new open function

2. **Update UnifiedPopup**:
   - Add new case to `getPopupContent()`
   - Create new render function
   - Update title/subtitle/icon functions

3. **Update Types**:
   - Add new fields to `PopupData` interface
   - Update `PopupContextType` interface

### Modifying Data Structure

1. **Update Queries**: Modify Supabase queries in PopupContext
2. **Update Processing**: Modify data processing logic
3. **Update Display**: Modify UnifiedPopup rendering
4. **Test**: Ensure all popup types work correctly

## 🐛 Troubleshooting

### Common Issues

1. **"Target is not defined"**: Missing lucide-react import
2. **Missing company data**: Check query structure and data processing
3. **Related items not loading**: Check query dependencies and enabled conditions
4. **Z-index conflicts**: Ensure all modals use consistent z-index values

### Debug Tools

```typescript
// Add to PopupContext for debugging
console.log('🔍 Popup data:', { activePopup, popupData });

// Add to UnifiedPopup for debugging  
console.log('🔍 Rendering popup:', { activePopup, company: popupData.company });
```

## 📈 Performance Considerations

### Optimizations

- **React Query Caching**: Reduces redundant API calls
- **Conditional Rendering**: Only renders when popup is active
- **Lazy Loading**: Data fetched only when needed
- **Memoization**: Prevents unnecessary re-renders

### Best Practices

- **Single Source of Truth**: All popups use PopupContext
- **Consistent Data Fetching**: No pre-fetching in components
- **Error Boundaries**: Graceful error handling
- **Loading States**: Clear user feedback during data fetch

## 🔮 Future Enhancements

### Potential Improvements

1. **Animation System**: Add smooth open/close animations
2. **Keyboard Navigation**: Add keyboard shortcuts for popup control
3. **Bulk Operations**: Extend selection system for bulk actions
4. **Custom Fields**: Dynamic field configuration
5. **Export Functionality**: Export popup data to various formats

### Migration Notes

- **From Old System**: Migrated from individual popup components to unified system
- **Breaking Changes**: Removed SimplifiedJobDetailModal and other individual popups
- **Backward Compatibility**: All existing functionality preserved with improved architecture

---

## 📝 Quick Reference

### File Locations
- **Context**: `src/contexts/PopupContext.tsx`
- **Main Component**: `src/components/UnifiedPopup.tsx`
- **Modal Wrapper**: `src/components/shared/PopupModal.tsx`
- **Shared Components**: `src/components/shared/`

### Key Functions
- `openLeadPopup(id)` - Open lead popup
- `openCompanyPopup(id)` - Open company popup  
- `openJobPopup(id)` - Open job popup
- `closePopup()` - Close current popup
- `toggleLeadSelection(id)` - Toggle lead selection

### Data Access
- `popupData.lead` - Current lead data
- `popupData.company` - Current company data
- `popupData.job` - Current job data
- `popupData.relatedLeads` - Related leads
- `popupData.relatedJobs` - Related jobs

---

*Last Updated: January 2025*
*Version: 2.0 (Unified System)*


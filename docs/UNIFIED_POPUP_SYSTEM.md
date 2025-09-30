# Unified Popup System Usage Guide

## Overview
The new `EntityDetailPopup` component consolidates all entity detail popups into a single, reusable component that handles leads, companies, and jobs.

## Basic Usage

### For Leads
```tsx
import { EntityDetailPopup } from "@/components/crm/EntityDetailPopup";

<EntityDetailPopup
  entityType="lead"
  entityId={leadId}
  isOpen={isOpen}
  onClose={onClose}
/>
```

### For Companies
```tsx
<EntityDetailPopup
  entityType="company"
  entityId={companyId}
  isOpen={isOpen}
  onClose={onClose}
/>
```

### For Jobs
```tsx
<EntityDetailPopup
  entityType="job"
  entityId={jobId}
  isOpen={isOpen}
  onClose={onClose}
/>
```

## Migration from Old System

### Before (Old System)
```tsx
// Multiple separate popups
<LeadDetailPopup lead={lead} isOpen={isOpen} onClose={onClose} />
<CompanyDetailPopup company={company} isOpen={isOpen} onClose={onClose} />
<JobDetailPopup job={job} isOpen={isOpen} onClose={onClose} />
```

### After (Unified System)
```tsx
// Single unified popup
<EntityDetailPopup 
  entityType="lead" 
  entityId={lead.id} 
  isOpen={isOpen} 
  onClose={onClose} 
/>
<EntityDetailPopup 
  entityType="company" 
  entityId={company.id} 
  isOpen={isOpen} 
  onClose={onClose} 
/>
<EntityDetailPopup 
  entityType="job" 
  entityId={job.id} 
  isOpen={isOpen} 
  onClose={onClose} 
/>
```

## Benefits

1. **Consistent UX**: Same behavior across all entity types
2. **Reduced Code Duplication**: Single component handles all popups
3. **Easier Maintenance**: One place to update popup logic
4. **Better Performance**: Shared components and optimized data fetching
5. **Simplified Navigation**: Easy entity-to-entity navigation with nested modals

## Features

- ✅ **Unified Data Fetching**: Custom `useEntityData` hook
- ✅ **Entity Type Detection**: Automatic routing based on entity type
- ✅ **Nested Navigation**: Click between related entities seamlessly
- ✅ **Consistent UI**: Same layout and behavior across all entities
- ✅ **Reusable Components**: All existing InfoCard components work
- ✅ **Small Company Cards**: Available in all company contexts

## Data Fetching

The `useEntityData` hook automatically fetches:
- Entity data (lead/company/job)
- Related company data (for leads/jobs)
- Related leads (for companies/jobs)
- Related jobs (for companies/leads)

## Navigation

The popup supports seamless navigation between related entities:
- Click company card → Opens company popup
- Click lead in related items → Opens lead popup
- Click job in related items → Opens job popup
- All navigation maintains context and state

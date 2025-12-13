# Sonner Toast Migration Guide

This document tracks the migration from Radix UI toast to Sonner toast notifications.

## ✅ Completed

- ✅ Updated `src/app/providers.tsx` to use Sonner Toaster from UI component
- ✅ Created centralized toast utility at `src/utils/toast.ts`
- ✅ Updated `src/hooks/useUserFeedback.tsx` to use Sonner
- ✅ Updated `src/hooks/useErrorHandler.ts` to use Sonner
- ✅ Updated `src/hooks/useJobs.ts` to use Sonner
- ✅ Updated `src/contexts/AssignmentContext.tsx` to use Sonner
- ✅ Updated `src/contexts/ChatContext.tsx` to use Sonner
- ✅ Updated `src/components/shared/BulkAssignmentDialog.tsx` to use Sonner
- ✅ Updated `src/components/people/CSVImportDialog.tsx` to use Sonner
- ✅ Updated `src/utils/simpleToast.ts` to re-export Sonner toast

## 🔄 Migration Pattern

### Step 1: Update Import

**Before:**

```typescript
import { useToast } from '@/hooks/use-toast';
```

**After:**

```typescript
import { toast } from '@/utils/toast';
```

### Step 2: Remove Hook Usage

**Before:**

```typescript
const { toast } = useToast();
```

**After:**
Remove this line - `toast` is now imported directly.

### Step 3: Update Toast Calls

**Before:**

```typescript
toast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'destructive', // for errors
});
```

**After:**

```typescript
// Success
toast.success('Success', {
  description: 'Operation completed',
});

// Error
toast.error('Error', {
  description: 'Operation failed',
});

// Warning
toast.warning('Warning', {
  description: 'Please check this',
});

// Info
toast.info('Info', {
  description: 'Something happened',
});
```

### Step 4: Update Dependencies

Remove `toast` from dependency arrays in `useCallback` and `useEffect` hooks.

## 📋 Remaining Files to Update

The following files still need to be migrated:

### Hooks

- `src/hooks/useRetryLogic.tsx`
- `src/hooks/useRealtimeSubscriptions.ts`
- `src/hooks/useOptimizedAssignment.ts`
- `src/hooks/useOfflineSupport.ts`
- `src/hooks/useEntityTags.ts`
- `src/hooks/useAsyncOperation.ts`
- `src/hooks/useAssignmentState.ts`
- `src/hooks/useAdvancedCaching.ts`

### Components

- `src/pages/Campaigns.tsx`
- `src/components/admin/AssignmentManagementPanel.tsx`
- `src/components/slide-out/CompanyDetailsSlideOut.tsx`
- `src/components/shared/IconOnlyAssignmentCell.tsx`
- `src/components/shared/UnifiedStatusDropdown.tsx`
- `src/components/slide-out/PersonDetailsSlideOut.tsx`
- `src/components/slide-out/JobDetailsSlideOut.tsx`
- `src/components/shared/TableAssignmentCell.tsx`
- `src/components/shared/UnifiedActionComponent.tsx`
- `src/components/people/PersonMessagingPanel.tsx`
- `src/components/jobs/JobQualificationModal.tsx`
- `src/components/jobs/JobQualificationCardButtons.tsx`
- `src/components/jobs/JobQualificationActionBar.tsx`
- `src/components/jobs/JobApprovalActions.tsx`
- `src/components/forms/TagSelector.tsx`
- `src/components/forms/LeadSourceSelector.tsx`
- `src/components/forms/LeadAssignment.tsx`
- `src/components/forms/CompanyAssignment.tsx`
- `src/components/crm/communications/EmailComposer.tsx`
- `src/components/campaigns/SimplifiedCampaignSequenceBuilder.tsx`
- `src/components/ai/FloatingChatWidget.tsx`
- `src/components/NotesSection.tsx`
- `src/components/LogoManager.tsx`
- `src/components/FavoriteToggle.tsx`
- `src/components/utils/BulkActions.tsx`

### Services

- `src/services/statusAutomationService.ts`

## 🎯 Usage Examples

### Basic Usage

```typescript
import { toast } from '@/utils/toast';

// Success
toast.success('Saved', {
  description: 'Your changes have been saved',
});

// Error
toast.error('Error', {
  description: 'Failed to save changes',
});

// Warning
toast.warning('Warning', {
  description: 'This action cannot be undone',
});

// Info
toast.info('Info', {
  description: 'Processing your request',
});
```

### With Actions

```typescript
toast.success('Email sent', {
  description: 'Your email has been sent successfully',
  action: {
    label: 'View',
    onClick: () => navigate('/emails'),
  },
});
```

### Promise-based

```typescript
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved successfully',
  error: 'Failed to save',
});
```

## 📝 Notes

- Sonner toasts are automatically styled to match the app's theme
- The Toaster component is already set up in `src/app/providers.tsx`
- All toast types (success, error, warning, info) are available
- Duration defaults: success/info/warning (5000ms), error (7000ms)
- Toasts can be dismissed programmatically using `toast.dismiss(id)`

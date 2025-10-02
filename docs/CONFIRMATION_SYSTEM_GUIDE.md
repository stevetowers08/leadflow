# Confirmation System Documentation

## Overview

The new confirmation system provides a clean, consistent, and reusable way to handle confirmation dialogs throughout the Empowr CRM application. It replaces the inconsistent use of `window.confirm()` and custom confirmation modals with a unified, professional system.

## Key Features

- **Consistent Design**: All confirmations follow the same visual design patterns
- **Type Safety**: Full TypeScript support with predefined confirmation types
- **Loading States**: Built-in loading indicators for async operations
- **Error Handling**: Automatic error handling and rollback
- **Customizable**: Support for custom titles, descriptions, and content
- **Accessible**: Built on Radix UI primitives for accessibility
- **Mobile Friendly**: Responsive design that works on all screen sizes

## Quick Start

### 1. Basic Usage

```tsx
import { useDeleteConfirmation } from '@/contexts/ConfirmationContext';

function MyComponent() {
  const showDeleteConfirmation = useDeleteConfirmation();

  const handleDelete = () => {
    showDeleteConfirmation(
      () => {
        // Your delete logic here
        console.log('Item deleted!');
      },
      {
        customTitle: 'Delete Lead',
        customDescription: 'Are you sure you want to delete this lead? This action cannot be undone.',
        itemName: 'lead',
      }
    );
  };

  return (
    <Button onClick={handleDelete} variant="destructive">
      Delete Lead
    </Button>
  );
}
```

### 2. Available Confirmation Types

The system includes predefined confirmation types for common scenarios:

- **`delete`**: For deleting items
- **`assignment`**: For changing assignments
- **`signout`**: For signing out
- **`save`**: For saving changes
- **`automation`**: For starting automation processes
- **`bulk-action`**: For bulk operations
- **`custom`**: For custom confirmations

## Detailed Usage Examples

### Delete Confirmation

```tsx
import { useDeleteConfirmation } from '@/contexts/ConfirmationContext';

function DeleteButton({ itemName, onDelete }) {
  const showDeleteConfirmation = useDeleteConfirmation();

  const handleDelete = () => {
    showDeleteConfirmation(
      onDelete,
      {
        customTitle: `Delete ${itemName}`,
        customDescription: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
        itemName,
      }
    );
  };

  return (
    <Button onClick={handleDelete} variant="destructive">
      Delete {itemName}
    </Button>
  );
}
```

### Assignment Confirmation

```tsx
import { useAssignmentConfirmation } from '@/contexts/ConfirmationContext';

function AssignmentButton({ leadName, newAssignee, onAssign }) {
  const showAssignmentConfirmation = useAssignmentConfirmation();

  const handleAssign = () => {
    showAssignmentConfirmation(
      onAssign,
      {
        customTitle: 'Assign Lead',
        customDescription: `Are you sure you want to assign ${leadName} to ${newAssignee}?`,
        itemName: 'lead',
        newAssignee,
      }
    );
  };

  return (
    <Button onClick={handleAssign}>
      Assign to {newAssignee}
    </Button>
  );
}
```

### Custom Confirmation with Additional Content

```tsx
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { Info } from 'lucide-react';

function CustomConfirmationButton() {
  const { showConfirmation } = useConfirmation();

  const handleCustomAction = () => {
    showConfirmation(
      {
        type: 'custom',
        title: 'Start Automation',
        description: 'This will begin the automation process for selected leads.',
        icon: Info,
        confirmText: 'Start',
        cancelText: 'Cancel',
        variant: 'default',
        showIcon: true,
      },
      () => {
        // Your automation logic here
        console.log('Automation started!');
      },
      () => {
        console.log('Automation cancelled!');
      },
      // Custom content
      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This action will affect 5 leads and cannot be undone.
        </p>
      </div>
    );
  };

  return (
    <Button onClick={handleCustomAction}>
      Start Automation
    </Button>
  );
}
```

### Bulk Action Confirmation

```tsx
import { useBulkActionConfirmation } from '@/contexts/ConfirmationContext';

function BulkDeleteButton({ selectedItems, onBulkDelete }) {
  const showBulkActionConfirmation = useBulkActionConfirmation();

  const handleBulkDelete = () => {
    showBulkActionConfirmation(
      () => onBulkDelete(selectedItems),
      {
        customTitle: 'Delete Selected Items',
        customDescription: 'Are you sure you want to delete the selected items?',
        actionName: 'delete',
        itemCount: selectedItems.length,
      }
    );
  };

  return (
    <Button onClick={handleBulkDelete} variant="destructive">
      Delete Selected ({selectedItems.length})
    </Button>
  );
}
```

## Migration Guide

### Replacing `window.confirm()`

**Before:**
```tsx
const handleDelete = () => {
  const confirmed = window.confirm('Are you sure you want to delete this item?');
  if (confirmed) {
    // Delete logic
  }
};
```

**After:**
```tsx
import { useDeleteConfirmation } from '@/contexts/ConfirmationContext';

const showDeleteConfirmation = useDeleteConfirmation();

const handleDelete = () => {
  showDeleteConfirmation(() => {
    // Delete logic
  });
};
```

### Replacing Custom Confirmation Modals

**Before:**
```tsx
const [showModal, setShowModal] = useState(false);

const handleDelete = () => {
  setShowModal(true);
};

// Custom modal component...
```

**After:**
```tsx
import { useDeleteConfirmation } from '@/contexts/ConfirmationContext';

const showDeleteConfirmation = useDeleteConfirmation();

const handleDelete = () => {
  showDeleteConfirmation(() => {
    // Delete logic
  });
};
```

## API Reference

### ConfirmationConfig Interface

```tsx
interface ConfirmationConfig {
  type: ConfirmationType;
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  showIcon?: boolean;
}
```

### Available Hooks

- `useConfirmation()`: Main hook for custom confirmations
- `useDeleteConfirmation()`: For delete operations
- `useAssignmentConfirmation()`: For assignment changes
- `useSignOutConfirmation()`: For sign out operations
- `useSaveConfirmation()`: For save operations
- `useAutomationConfirmation()`: For automation processes
- `useBulkActionConfirmation()`: For bulk operations

### ConfirmationProvider

The `ConfirmationProvider` must wrap your application to provide confirmation functionality:

```tsx
import { ConfirmationProvider } from '@/contexts/ConfirmationContext';

function App() {
  return (
    <ConfirmationProvider>
      {/* Your app components */}
    </ConfirmationProvider>
  );
}
```

## Best Practices

1. **Use the appropriate hook**: Choose the most specific hook for your use case
2. **Provide clear descriptions**: Make confirmation messages clear and actionable
3. **Handle errors gracefully**: The system handles errors automatically, but you can add custom error handling
4. **Use custom content sparingly**: Only add custom content when it provides essential information
5. **Test on mobile**: Ensure confirmations work well on mobile devices
6. **Keep confirmations concise**: Avoid overly long confirmation messages

## Styling and Customization

The confirmation system uses the design tokens from `@/design-system/tokens.ts` and follows the established design patterns. All confirmations are styled consistently and automatically adapt to the current theme.

### Customizing Appearance

You can customize the appearance by modifying the `confirmationConfigs` in `src/components/ui/confirmation-dialog.tsx`:

```tsx
export const confirmationConfigs: Record<ConfirmationType, ConfirmationConfig> = {
  delete: {
    type: 'delete',
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    icon: Trash2,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
    showIcon: true,
  },
  // ... other configurations
};
```

## Troubleshooting

### Common Issues

1. **Confirmation not showing**: Ensure `ConfirmationProvider` wraps your app
2. **Hook not working**: Make sure you're using the hook inside a component that's wrapped by `ConfirmationProvider`
3. **Styling issues**: Check that the design system tokens are properly imported

### Debug Mode

You can enable debug mode by adding `console.log` statements in the confirmation handlers to track confirmation flow.

## Examples

See `src/components/examples/ConfirmationExamples.tsx` for comprehensive examples of all confirmation types and usage patterns.

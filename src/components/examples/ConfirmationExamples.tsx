import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  useConfirmation,
  useDeleteConfirmation,
  useAssignmentConfirmation,
  useSignOutConfirmation,
  useSaveConfirmation,
  useAutomationConfirmation,
  useBulkActionConfirmation
} from '@/contexts/ConfirmationContext';
import { 
  Trash2, 
  User, 
  LogOut, 
  Save, 
  MessageSquare, 
  Settings,
  Info
} from 'lucide-react';

/**
 * Example component demonstrating the new confirmation system
 * This shows how to use all the different confirmation types
 */
export function ConfirmationExamples() {
  const { showConfirmation } = useConfirmation();
  const showDeleteConfirmation = useDeleteConfirmation();
  const showAssignmentConfirmation = useAssignmentConfirmation();
  const showSignOutConfirmation = useSignOutConfirmation();
  const showSaveConfirmation = useSaveConfirmation();
  const showAutomationConfirmation = useAutomationConfirmation();
  const showBulkActionConfirmation = useBulkActionConfirmation();

  // Example: Custom confirmation with custom content
  const handleCustomConfirmation = () => {
    showConfirmation(
      {
        type: 'custom',
        title: 'Custom Action',
        description: 'This is a custom confirmation with additional content below.',
        icon: Info,
        confirmText: 'Proceed',
        cancelText: 'Cancel',
        variant: 'default',
        showIcon: true,
      },
      () => {
        console.log('Custom action confirmed!');
        // Your custom action logic here
      },
      () => {
        console.log('Custom action cancelled!');
      },
      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Additional Information:</strong> This action will affect multiple items in your system.
        </p>
      </div>
    );
  };

  // Example: Delete confirmation
  const handleDelete = () => {
    showDeleteConfirmation(
      () => {
        console.log('Item deleted!');
        // Your delete logic here
      },
      {
        customTitle: 'Delete Lead',
        customDescription: 'Are you sure you want to delete this lead? This action cannot be undone.',
        itemName: 'lead',
      }
    );
  };

  // Example: Assignment confirmation
  const handleAssignment = () => {
    showAssignmentConfirmation(
      () => {
        console.log('Assignment changed!');
        // Your assignment logic here
      },
      {
        customTitle: 'Assign Lead',
        customDescription: 'Are you sure you want to assign this lead to John Doe?',
        itemName: 'lead',
        newAssignee: 'John Doe',
      }
    );
  };

  // Example: Sign out confirmation
  const handleSignOut = () => {
    showSignOutConfirmation(() => {
      console.log('User signed out!');
      // Your sign out logic here
    });
  };

  // Example: Save confirmation
  const handleSave = () => {
    showSaveConfirmation(
      () => {
        console.log('Changes saved!');
        // Your save logic here
      },
      {
        customTitle: 'Save Changes',
        customDescription: 'Are you sure you want to save these changes?',
      }
    );
  };

  // Example: Automation confirmation
  const handleAutomation = () => {
    showAutomationConfirmation(
      () => {
        console.log('Automation started!');
        // Your automation logic here
      },
      {
        customTitle: 'Start LinkedIn Automation',
        customDescription: 'Are you sure you want to start the LinkedIn automation process?',
        leadCount: 5,
      }
    );
  };

  // Example: Bulk action confirmation
  const handleBulkAction = () => {
    showBulkActionConfirmation(
      () => {
        console.log('Bulk action executed!');
        // Your bulk action logic here
      },
      {
        customTitle: 'Delete Selected Items',
        customDescription: 'Are you sure you want to delete the selected items?',
        actionName: 'delete',
        itemCount: 3,
      }
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Confirmation System Examples</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button 
          onClick={handleDelete}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Item
        </Button>

        <Button 
          onClick={handleAssignment}
          variant="outline"
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Change Assignment
        </Button>

        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>

        <Button 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>

        <Button 
          onClick={handleAutomation}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Start Automation
        </Button>

        <Button 
          onClick={handleBulkAction}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Bulk Action
        </Button>

        <Button 
          onClick={handleCustomConfirmation}
          variant="secondary"
          className="flex items-center gap-2 col-span-2 md:col-span-1"
        >
          <Info className="h-4 w-4" />
          Custom Confirmation
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Usage Notes:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All confirmations are consistent in design and behavior</li>
          <li>• Loading states are handled automatically</li>
          <li>• Custom content can be added to any confirmation</li>
          <li>• All confirmations support async operations</li>
          <li>• Error handling is built-in</li>
        </ul>
      </div>
    </div>
  );
}


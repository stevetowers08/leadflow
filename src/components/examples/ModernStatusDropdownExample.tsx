import { GroupedStatusDropdown } from '@/components/ui/modern-status-dropdown';
import React from 'react';

// Example usage of the GroupedStatusDropdown component
export const ExampleGroupedStatusUsage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = React.useState('');

  // Grouped status options like HubSpot
  const groupedStatusOptions = [
    {
      group: 'Lead Status',
      options: [
        { value: 'new', label: 'New Lead', count: 12 },
        { value: 'contacted', label: 'Contacted', count: 8 },
        { value: 'qualified', label: 'Qualified', count: 15 },
        { value: 'unqualified', label: 'Unqualified', count: 3 },
      ],
    },
    {
      group: 'Sales Stage',
      options: [
        { value: 'meeting_scheduled', label: 'Meeting Scheduled', count: 5 },
        { value: 'proposal_sent', label: 'Proposal Sent', count: 7 },
        { value: 'negotiation', label: 'Negotiation', count: 4 },
        { value: 'closed_won', label: 'Closed Won', count: 23 },
        { value: 'closed_lost', label: 'Closed Lost', count: 9 },
      ],
    },
    {
      group: 'Follow-up',
      options: [
        { value: 'follow_up', label: 'Follow Up', count: 6 },
        { value: 'on_hold', label: 'On Hold', count: 2 },
        { value: 'renewal', label: 'Renewal', count: 1 },
      ],
    },
  ];

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-lg font-semibold'>Modern Status Dropdown Examples</h2>

      {/* Grouped Status Dropdown */}
      <div>
        <label className='block text-sm font-medium text-foreground mb-2'>
          Grouped Status Dropdown (HubSpot Style)
        </label>
        <GroupedStatusDropdown
          groupedOptions={groupedStatusOptions}
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          placeholder='Select a status...'
          className='w-64'
        />
      </div>

      {/* Selected Value Display */}
      {selectedStatus && (
        <div className='p-3 bg-muted rounded-lg'>
          <p className='text-sm text-muted-foreground'>
            Selected Status:{' '}
            <span className='font-medium'>{selectedStatus}</span>
          </p>
        </div>
      )}
    </div>
  );
};

import { ColumnConfig } from '@/components/ui/unified-table';
import React from 'react';

// Example data structure matching your deals table
interface Deal {
  id: string;
  company: {
    name: string;
    logo?: string;
  };
  job: {
    title: string;
    location?: string;
  };
  matchScore: number;
}

// Example usage of the ModernTable component
export const DealsTableExample: React.FC<{
  deals: Deal[];
  onSelect: (deal: Deal) => void;
}> = ({ deals, onSelect }) => {
  const columns: ColumnConfig<Deal>[] = [
    {
      key: 'company',
      label: 'Company',
      render: (_, row) => (
        <div className='flex items-center gap-3'>
          {row.company.logo && (
            <img
              src={row.company.logo}
              alt={row.company.name}
              className='w-8 h-8 rounded-full'
            />
          )}
          <span className='font-medium'>{row.company.name}</span>
        </div>
      ),
    },
    {
      key: 'job',
      label: 'Job Title',
      render: (_, row) => (
        <div>
          <div className='font-medium'>{row.job.title}</div>
          {row.job.location && (
            <div className='text-sm text-muted-foreground'>
              {row.job.location}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'matchScore',
      label: 'Match',
      align: 'center',
      render: (_, row) => (
        <div className='flex items-center justify-center'>
          <span className='px-2 py-1 bg-green-100 text-success rounded-full text-sm font-medium'>
            {row.matchScore}%
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      label: '',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => onSelect(row)}
          className='px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90'
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center h-32 text-muted-foreground">
      Table removed
    </div>
  );
};

// Example of how to use it in a page component
export const ExamplePage: React.FC = () => {
  const [deals] = React.useState<Deal[]>([
    {
      id: '1',
      company: {
        name: 'Acme Corp',
        logo: 'https://via.placeholder.com/40x40',
      },
      job: {
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
      },
      matchScore: 95,
    },
    {
      id: '2',
      company: {
        name: 'TechStart Inc',
        logo: 'https://via.placeholder.com/40x40',
      },
      job: {
        title: 'Full Stack Developer',
        location: 'New York, NY',
      },
      matchScore: 87,
    },
  ]);

  const handleSelect = (deal: Deal) => {
    console.log('Selected deal:', deal);
    // Handle selection logic here
  };

  return (
    <div className='p-6'>
      <DealsTableExample deals={deals} onSelect={handleSelect} />
    </div>
  );
};

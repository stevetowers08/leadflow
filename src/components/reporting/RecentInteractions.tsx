import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ColumnConfig } from '../ui/unified-table';

interface RecentInteractionsProps {
  recentInteractions: Array<{
    id: string;
    type: string;
    description: string;
    occurred_at: string;
    person_name: string;
    company_name: string;
  }>;
}

export const RecentInteractions: React.FC<RecentInteractionsProps> = ({
  recentInteractions,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-100 text-primary',
      call: 'bg-green-100 text-success',
      meeting: 'bg-purple-100 text-purple-800',
      linkedin: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-foreground',
    };
    return colors[type.toLowerCase()] || colors.other;
  };

  const columns: ColumnConfig[] = [
    {
      key: 'type',
      label: 'Type',
      width: '100px',
      cellType: 'regular',
      render: value => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(String(value))}`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      width: '300px',
      cellType: 'regular',
      render: value => <div className='max-w-xs truncate'>{String(value)}</div>,
    },
    {
      key: 'person_name',
      label: 'Person',
      width: '150px',
      cellType: 'regular',
    },
    {
      key: 'company_name',
      label: 'Company',
      width: '150px',
      cellType: 'regular',
    },
    {
      key: 'occurred_at',
      label: 'Date',
      width: '120px',
      cellType: 'regular',
      render: value => formatDate(String(value)),
    },
  ];

  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle>Recent Interactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center h-32 text-muted-foreground'>
          Table removed
        </div>
      </CardContent>
    </Card>
  );
};

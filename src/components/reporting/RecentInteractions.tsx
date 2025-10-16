import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UnifiedTable, ColumnConfig } from '../ui/unified-table';

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
      email: 'bg-blue-100 text-blue-800',
      call: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800',
      linkedin: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
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
          {value}
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
        <UnifiedTable
          data={recentInteractions}
          columns={columns}
          pagination={false}
          emptyMessage='No recent interactions'
        />
      </CardContent>
    </Card>
  );
};

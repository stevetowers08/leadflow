import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ColumnConfig } from '../ui/unified-table';

interface TopCompaniesProps {
  topCompanies: Array<{
    id: string;
    name: string;
    industry: string;
    people_count: number;
    interactions_count: number;
  }>;
}

export const TopCompanies: React.FC<TopCompaniesProps> = ({ topCompanies }) => {
  const columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Company',
      width: '200px',
      cellType: 'regular',
    },
    {
      key: 'industry',
      label: 'Industry',
      width: '150px',
      cellType: 'regular',
    },
    {
      key: 'people_count',
      label: 'People',
      width: '100px',
      cellType: 'regular',
      align: 'center',
    },
    {
      key: 'interactions_count',
      label: 'Interactions',
      width: '120px',
      cellType: 'regular',
      align: 'center',
    },
    {
      key: 'activity_score',
      label: 'Activity Score',
      width: '120px',
      cellType: 'regular',
      align: 'center',
      render: (_, company) => {
        const companyData = company as TopCompaniesProps['topCompanies'][0];
        const activityScore =
          companyData.people_count + companyData.interactions_count;
        return (
          <div className='flex items-center'>
            <div className='w-16 bg-gray-200 rounded-full h-2 mr-2'>
              <div
                className='bg-blue-600 h-2 rounded-full'
                style={{
                  width: `${Math.min(100, (activityScore / 50) * 100)}%`,
                }}
              ></div>
            </div>
            <span className='text-sm text-muted-foreground'>
              {activityScore}
            </span>
          </div>
        );
      },
    },
  ];

  const dataWithActivityScore = topCompanies.map(company => ({
    ...company,
    activity_score: company.people_count + company.interactions_count,
  }));

  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle>Top Companies by Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center h-32 text-muted-foreground'>
          Table removed
        </div>
      </CardContent>
    </Card>
  );
};

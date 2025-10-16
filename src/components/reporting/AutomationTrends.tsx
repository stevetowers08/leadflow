import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import React from 'react';

interface MonthlyStats {
  month: string;
  people: number;
  companies: number;
  interactions: number;
}

interface AutomationTrendsProps {
  monthlyStats: MonthlyStats[];
}

const AutomationTrends: React.FC<AutomationTrendsProps> = ({
  monthlyStats,
}) => {
  // Process the data to show trends
  const processedData = monthlyStats.map(stat => ({
    ...stat,
    automations: Math.round(stat.people * 0.8), // Mock calculation
    responses: Math.round(stat.interactions * 0.15), // Mock calculation
    meetings: Math.round(stat.interactions * 0.03), // Mock calculation
  }));

  const maxValue = Math.max(
    ...processedData.map(d =>
      Math.max(d.people, d.automations, d.responses, d.meetings)
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5' />
          Automation Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Trend Chart */}
          <div className='h-64 flex items-end justify-between gap-2'>
            {processedData.slice(-7).map((data, index) => (
              <div
                key={index}
                className='flex flex-col items-center gap-2 flex-1'
              >
                <div className='w-full flex flex-col gap-1'>
                  {/* People */}
                  <div
                    className='bg-blue-500 rounded-t'
                    style={{ height: `${(data.people / maxValue) * 120}px` }}
                    title={`People: ${data.people}`}
                  />
                  {/* Automations */}
                  <div
                    className='bg-green-500'
                    style={{
                      height: `${(data.automations / maxValue) * 120}px`,
                    }}
                    title={`Automations: ${data.automations}`}
                  />
                  {/* Responses */}
                  <div
                    className='bg-orange-500'
                    style={{ height: `${(data.responses / maxValue) * 120}px` }}
                    title={`Responses: ${data.responses}`}
                  />
                  {/* Meetings */}
                  <div
                    className='bg-emerald-500 rounded-b'
                    style={{ height: `${(data.meetings / maxValue) * 120}px` }}
                    title={`Meetings: ${data.meetings}`}
                  />
                </div>
                <span className='text-xs text-gray-500 mt-2'>
                  {new Date(data.month).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className='flex flex-wrap gap-4 justify-center'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-blue-500 rounded'></div>
              <span className='text-sm text-gray-600'>People</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-green-500 rounded'></div>
              <span className='text-sm text-gray-600'>Automations</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-orange-500 rounded'></div>
              <span className='text-sm text-gray-600'>Responses</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-emerald-500 rounded'></div>
              <span className='text-sm text-gray-600'>Meetings</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {processedData.reduce((sum, d) => sum + d.automations, 0)}
              </div>
              <div className='text-sm text-gray-600'>Total Automations</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {processedData.reduce((sum, d) => sum + d.responses, 0)}
              </div>
              <div className='text-sm text-gray-600'>Total Responses</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationTrends;

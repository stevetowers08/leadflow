import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Target, Users } from 'lucide-react';
import React from 'react';

interface StageData {
  stage: string;
  count: number;
}

interface StagePerformanceProps {
  peopleByStage: StageData[];
  companiesByStage: StageData[];
}

const StagePerformance: React.FC<StagePerformanceProps> = ({
  peopleByStage,
  companiesByStage,
}) => {
  // Define stage colors and order
  const stageConfig = {
    new: { color: 'bg-gray-500', label: 'New' },
    connection_requested: {
      color: 'bg-blue-500',
      label: 'Connection Requested',
    },
    connected: { color: 'bg-green-500', label: 'Connected' },
    messaged: { color: 'bg-purple-500', label: 'Messaged' },
    replied: { color: 'bg-orange-500', label: 'Replied' },
    meeting_booked: { color: 'bg-emerald-500', label: 'Meeting Booked' },
    meeting_held: { color: 'bg-yellow-500', label: 'Meeting Held' },
    disqualified: { color: 'bg-red-500', label: 'Disqualified' },
    'in queue': { color: 'bg-indigo-500', label: 'In Queue' },
    lead_lost: { color: 'bg-gray-400', label: 'Lead Lost' },
  };

  const totalPeople = peopleByStage.reduce(
    (sum, stage) => sum + stage.count,
    0
  );
  const totalCompanies = companiesByStage.reduce(
    (sum, stage) => sum + stage.count,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3 className='h-5 w-5' />
          Stage Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* People by Stage */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='font-semibold text-gray-900 flex items-center gap-2'>
                <Users className='h-4 w-4' />
                People Pipeline ({totalPeople})
              </h4>
            </div>
            <div className='space-y-3'>
              {peopleByStage.map(stage => {
                const config = stageConfig[
                  stage.stage as keyof typeof stageConfig
                ] || { color: 'bg-gray-500', label: stage.stage };
                const percentage =
                  totalPeople > 0 ? (stage.count / totalPeople) * 100 : 0;

                return (
                  <div key={stage.stage} className='space-y-1'>
                    <div className='flex justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {config.label}
                      </span>
                      <span className='text-gray-500'>
                        {stage.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full ${config.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Companies by Stage */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='font-semibold text-gray-900 flex items-center gap-2'>
                <Target className='h-4 w-4' />
                Company Pipeline ({totalCompanies})
              </h4>
            </div>
            <div className='space-y-3'>
              {companiesByStage.map(stage => {
                const config = stageConfig[
                  stage.stage as keyof typeof stageConfig
                ] || { color: 'bg-gray-500', label: stage.stage };
                const percentage =
                  totalCompanies > 0 ? (stage.count / totalCompanies) * 100 : 0;

                return (
                  <div key={stage.stage} className='space-y-1'>
                    <div className='flex justify-between text-sm'>
                      <span className='font-medium text-gray-700'>
                        {config.label}
                      </span>
                      <span className='text-gray-500'>
                        {stage.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full ${config.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Summary */}
          <div className='pt-4 border-t'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-center p-3 bg-blue-50 rounded-lg'>
                <div className='text-lg font-bold text-blue-600'>
                  {peopleByStage.find(s => s.stage === 'replied')?.count || 0}
                </div>
                <div className='text-sm text-blue-700'>People Replied</div>
              </div>
              <div className='text-center p-3 bg-green-50 rounded-lg'>
                <div className='text-lg font-bold text-green-600'>
                  {peopleByStage.find(s => s.stage === 'meeting_booked')
                    ?.count || 0}
                </div>
                <div className='text-sm text-green-700'>Meetings Booked</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StagePerformance;

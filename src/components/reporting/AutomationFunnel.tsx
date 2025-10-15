import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, PieChart, Target, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface StageData {
  stage: string;
  count: number;
}

interface AutomationFunnelProps {
  peopleByStage: StageData[];
  companiesByStage: StageData[];
}

const AutomationFunnel: React.FC<AutomationFunnelProps> = ({
  peopleByStage,
  companiesByStage,
}) => {
  // Calculate funnel metrics
  const totalPeople = peopleByStage.reduce(
    (sum, stage) => sum + stage.count,
    0
  );
  const totalCompanies = companiesByStage.reduce(
    (sum, stage) => sum + stage.count,
    0
  );

  // Calculate conversion rates
  const newPeople = peopleByStage.find(s => s.stage === 'new')?.count || 0;
  const connectedPeople =
    peopleByStage.find(s => s.stage === 'connected')?.count || 0;
  const messagedPeople =
    peopleByStage.find(s => s.stage === 'messaged')?.count || 0;
  const repliedPeople =
    peopleByStage.find(s => s.stage === 'replied')?.count || 0;
  const meetingBookedPeople =
    peopleByStage.find(s => s.stage === 'meeting_booked')?.count || 0;

  const funnelSteps = [
    {
      name: 'New Leads',
      count: newPeople,
      percentage: 100,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      icon: Users,
    },
    {
      name: 'Connected',
      count: connectedPeople,
      percentage: newPeople > 0 ? (connectedPeople / newPeople) * 100 : 0,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      icon: Target,
    },
    {
      name: 'Messaged',
      count: messagedPeople,
      percentage:
        connectedPeople > 0 ? (messagedPeople / connectedPeople) * 100 : 0,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      icon: TrendingUp,
    },
    {
      name: 'Replied',
      count: repliedPeople,
      percentage:
        messagedPeople > 0 ? (repliedPeople / messagedPeople) * 100 : 0,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      icon: PieChart,
    },
    {
      name: 'Meetings Booked',
      count: meetingBookedPeople,
      percentage:
        repliedPeople > 0 ? (meetingBookedPeople / repliedPeople) * 100 : 0,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      icon: Building2,
    },
  ];

  const maxCount = Math.max(...funnelSteps.map(step => step.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <PieChart className='h-5 w-5' />
          Automation Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Funnel Visualization */}
          <div className='space-y-4'>
            {funnelSteps.map((step, index) => {
              const IconComponent = step.icon;
              const widthPercentage =
                maxCount > 0 ? (step.count / maxCount) * 100 : 0;

              return (
                <div key={step.name} className='relative'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <div className={`p-2 ${step.bgColor} rounded-lg`}>
                        <IconComponent
                          className={`h-4 w-4 ${step.textColor}`}
                        />
                      </div>
                      <span className='font-medium text-gray-900'>
                        {step.name}
                      </span>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-gray-900'>
                        {step.count}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {step.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Funnel Bar */}
                  <div className='relative'>
                    <div className='w-full bg-gray-200 rounded-full h-8 overflow-hidden'>
                      <div
                        className={`h-8 ${step.color} transition-all duration-500 ease-out`}
                        style={{ width: `${widthPercentage}%` }}
                      />
                    </div>

                    {/* Conversion Arrow */}
                    {index < funnelSteps.length - 1 && (
                      <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
                        <div className='w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400'></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversion Rates Summary */}
          <div className='pt-6 border-t'>
            <h4 className='font-semibold text-gray-900 mb-4'>
              Conversion Rates
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {funnelSteps.slice(1).map((step, index) => (
                <div
                  key={step.name}
                  className='text-center p-3 bg-gray-50 rounded-lg'
                >
                  <div className={`text-2xl font-bold ${step.textColor}`}>
                    {step.percentage.toFixed(1)}%
                  </div>
                  <div className='text-sm text-gray-600'>
                    {funnelSteps[index].name} → {step.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Performance */}
          <div className='pt-6 border-t'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-blue-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>
                  {totalPeople}
                </div>
                <div className='text-sm text-blue-700'>Total People</div>
              </div>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {totalCompanies}
                </div>
                <div className='text-sm text-green-700'>Total Companies</div>
              </div>
              <div className='text-center p-4 bg-purple-50 rounded-lg'>
                <div className='text-2xl font-bold text-purple-600'>
                  {newPeople > 0
                    ? ((meetingBookedPeople / newPeople) * 100).toFixed(1)
                    : 0}
                  %
                </div>
                <div className='text-sm text-purple-700'>
                  Overall Conversion
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationFunnel;

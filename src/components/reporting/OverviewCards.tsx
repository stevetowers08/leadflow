import { Activity, Briefcase, Building2, Users } from 'lucide-react';
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface OverviewCardsProps {
  data: {
    totalPeople: number;
    totalCompanies: number;
    totalJobs: number;
    totalInteractions: number;
  };
}

export const OverviewCards = memo<OverviewCardsProps>(({ data }) => {
  const cards = [
    {
      title: 'Total People',
      value: data.totalPeople,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Companies',
      value: data.totalCompanies,
      icon: Building2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Jobs',
      value: data.totalJobs,
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Interactions',
      value: data.totalInteractions,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className='hover:shadow-lg transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {(card.value ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

OverviewCards.displayName = 'OverviewCards';

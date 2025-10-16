import { memo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MonthlyTrendsProps {
  monthlyStats: Array<{
    month: string;
    people: number;
    companies: number;
    interactions: number;
  }>;
}

export const MonthlyTrends = memo<MonthlyTrendsProps>(({ monthlyStats }) => {
  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={400}>
          <LineChart data={monthlyStats}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              angle={-45}
              textAnchor='end'
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='people'
              stroke='#8884D8'
              strokeWidth={2}
              name='People'
            />
            <Line
              type='monotone'
              dataKey='companies'
              stroke='#82CA9D'
              strokeWidth={2}
              name='Companies'
            />
            <Line
              type='monotone'
              dataKey='interactions'
              stroke='#FFC658'
              strokeWidth={2}
              name='Interactions'
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

MonthlyTrends.displayName = 'MonthlyTrends';

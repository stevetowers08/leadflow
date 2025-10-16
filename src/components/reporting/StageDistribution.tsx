import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StageDistributionProps {
  peopleByStage: Array<{ stage: string; count: number }>;
  companiesByStage: Array<{ stage: string; count: number }>;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

export const StageDistribution = memo<StageDistributionProps>(
  ({ peopleByStage, companiesByStage }) => {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <Card>
          <CardHeader>
            <CardTitle>People by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={peopleByStage}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='stage'
                  angle={-45}
                  textAnchor='end'
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#8884D8' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Companies by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={companiesByStage}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ stage, percent }) =>
                    `${stage} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884D8'
                  dataKey='count'
                >
                  {companiesByStage.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
);

StageDistribution.displayName = 'StageDistribution';

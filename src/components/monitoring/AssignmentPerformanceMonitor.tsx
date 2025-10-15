import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Database, Users, AlertTriangle } from 'lucide-react';
import { AssignmentService } from '@/services/assignmentService';

interface PerformanceMetrics {
  assignmentCount: number;
  averageAssignmentTime: number;
  bulkOperationCount: number;
  errorRate: number;
  lastUpdated: Date;
}

export const AssignmentPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      // This would typically come from a monitoring service
      // For now, we'll simulate the data
      const stats = await AssignmentService.getAssignmentStats();

      setMetrics({
        assignmentCount: stats.totalAssigned,
        averageAssignmentTime: 150, // ms - would come from actual monitoring
        bulkOperationCount: 12, // would come from actual monitoring
        errorRate: 0.02, // 2% - would come from actual monitoring
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const performanceRecommendations = [
    {
      title: 'Database Index Optimization',
      description: 'Monitor query performance on assignment operations',
      priority: 'high',
      action: 'Add composite indexes if needed for complex queries',
    },
    {
      title: 'Bulk Operation Batching',
      description: 'Implement batching for very large bulk assignments',
      priority: 'medium',
      action: 'Process assignments in chunks of 100-500 items',
    },
    {
      title: 'Caching Strategy',
      description: 'Cache team member lists to reduce database calls',
      priority: 'medium',
      action: 'Implement Redis caching for user profiles',
    },
    {
      title: 'Assignment Analytics',
      description: 'Track assignment patterns for insights',
      priority: 'low',
      action: 'Add analytics dashboard for assignment trends',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <RefreshCw className='h-4 w-4 animate-spin' />
          Loading performance metrics...
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Performance Monitoring</h2>
          <p className='text-muted-foreground'>
            Monitor assignment system performance and identify optimization
            opportunities
          </p>
        </div>
        <Button onClick={loadMetrics} variant='outline' size='sm'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Current Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Assignments
            </CardTitle>
            <Database className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {metrics?.assignmentCount || 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              All time assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg Response Time
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {metrics?.averageAssignmentTime || 0}ms
            </div>
            <p className='text-xs text-muted-foreground'>
              Assignment operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Bulk Operations
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {metrics?.bulkOperationCount || 0}
            </div>
            <p className='text-xs text-muted-foreground'>This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Error Rate</CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {((metrics?.errorRate || 0) * 100).toFixed(1)}%
            </div>
            <p className='text-xs text-muted-foreground'>Assignment failures</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>
            Based on current performance metrics and usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {performanceRecommendations.map((rec, index) => (
              <div
                key={index}
                className='flex items-start gap-3 p-3 border rounded-lg'
              >
                <div className='flex-shrink-0'>
                  <Badge
                    variant={
                      rec.priority === 'high'
                        ? 'destructive'
                        : rec.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                    }
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium'>{rec.title}</h4>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {rec.description}
                  </p>
                  <p className='text-sm font-medium text-sidebar-primary'>
                    {rec.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Card className='border-orange-200 bg-orange-50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-orange-800'>
            <AlertTriangle className='h-5 w-5' />
            Performance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-orange-800'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
              <span>
                Monitor bulk assignment performance with large datasets
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
              <span>
                Consider implementing assignment queues for high-volume
                operations
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
              <span>
                Set up monitoring alerts for assignment failure rates above 5%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

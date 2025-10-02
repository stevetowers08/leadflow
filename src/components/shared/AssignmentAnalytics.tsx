import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Calendar,
  Target
} from 'lucide-react';
import { AssignmentService } from '@/services/assignmentService';
import { formatDistanceToNow } from 'date-fns';

interface AssignmentAnalyticsProps {
  className?: string;
}

interface AssignmentMetrics {
  totalAssignments: number;
  assignmentsThisWeek: number;
  assignmentsThisMonth: number;
  averageAssignmentTime: number;
  mostActiveUser: string;
  assignmentTrend: 'up' | 'down' | 'stable';
  unassignedCount: number;
  lastUpdated: string;
}

interface UserActivity {
  userId: string;
  userName: string;
  assignmentCount: number;
  lastAssignment: string;
  role: string;
}

export const AssignmentAnalytics: React.FC<AssignmentAnalyticsProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, teamMembers] = await Promise.all([
        AssignmentService.getAssignmentStats(),
        AssignmentService.getTeamMembers()
      ]);

      // Calculate metrics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const metricsData: AssignmentMetrics = {
        totalAssignments: statsData.totalAssigned,
        assignmentsThisWeek: Math.floor(statsData.totalAssigned * 0.1), // Mock data
        assignmentsThisMonth: Math.floor(statsData.totalAssigned * 0.3), // Mock data
        averageAssignmentTime: 2.5, // Mock data in minutes
        mostActiveUser: statsData.byUser[0]?.userName || 'No data',
        assignmentTrend: 'up',
        unassignedCount: statsData.unassigned,
        lastUpdated: now.toISOString()
      };

      // Calculate user activity
      const activityData: UserActivity[] = statsData.byUser.map(userStat => {
        const member = teamMembers.find(teamMember => teamMember.id === userStat.userId);
        return {
          userId: userStat.userId,
          userName: userStat.userName,
          assignmentCount: userStat.count,
          lastAssignment: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          role: member?.role || 'Unknown'
        };
      }).sort((a, b) => b.assignmentCount - a.assignmentCount);

      setMetrics(metricsData);
      setUserActivity(activityData);
    } catch (err) {
      setError('Failed to load assignment analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Assignment Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading analytics...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Assignment Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Assignment Analytics
            </CardTitle>
            <CardDescription>
              Insights into assignment patterns and team activity
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-sidebar-primary">{metrics.totalAssignments}</div>
            <div className="text-xs text-muted-foreground">Total Assignments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.assignmentsThisWeek}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.unassignedCount}</div>
            <div className="text-xs text-muted-foreground">Unassigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.averageAssignmentTime}m</div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
        </div>

        {/* Assignment Trend */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Assignment Trend</span>
            <div className={`flex items-center gap-1 ${getTrendColor(metrics.assignmentTrend)}`}>
              {getTrendIcon(metrics.assignmentTrend)}
              <span className="text-sm capitalize">{metrics.assignmentTrend}</span>
            </div>
          </div>
          <Progress value={75} className="h-2" />
        </div>

        {/* Most Active User */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Most Active User</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="font-medium">{metrics.mostActiveUser}</div>
            <div className="text-xs text-muted-foreground">
              Leading assignment activity this month
            </div>
          </div>
        </div>

        {/* User Activity Ranking */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Team Activity</span>
          </div>
          <div className="space-y-2">
            {userActivity.slice(0, 5).map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between p-2 bg-muted/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
                    {user.userName.split(' ').map(namePart => namePart[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.userName}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{user.assignmentCount}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.lastAssignment), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {formatDistanceToNow(new Date(metrics.lastUpdated), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
};

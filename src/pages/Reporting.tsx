import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Page } from '@/design-system/components';
import { useReportingData } from '@/hooks/useReportingData';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { Suspense, lazy } from 'react';

// Lazy load heavy components for better performance
const OverviewCards = lazy(() => import('@/components/reporting/OverviewCards').then(m => ({ default: m.OverviewCards })));
const StageDistribution = lazy(() => import('@/components/reporting/StageDistribution').then(m => ({ default: m.StageDistribution })));
const MonthlyTrends = lazy(() => import('@/components/reporting/MonthlyTrends').then(m => ({ default: m.MonthlyTrends })));
const RecentInteractions = lazy(() => import('@/components/reporting/RecentInteractions').then(m => ({ default: m.RecentInteractions })));
const TopCompanies = lazy(() => import('@/components/reporting/TopCompanies').then(m => ({ default: m.TopCompanies })));

// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <Card className="mb-8">
    <CardContent className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    </CardContent>
  </Card>
);

const Reporting: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const { data, isLoading, error, refetch, isFetching } = useReportingData();

  // Check permissions
  if (!hasPermission('view_reporting')) {
    return (
      <Page>
        <div className="flex items-center justify-center h-64">
          <Card>
            <CardContent className="flex items-center space-x-2 p-6">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>You don't have permission to view reporting data.</span>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading reporting data...</span>
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Card className="mb-8">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load reporting data</h3>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <Card className="mb-8">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data available</h3>
              <p className="text-gray-600">No reporting data found for your account.</p>
            </div>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-6">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reporting Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights for your CRM data
            </p>
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            disabled={isFetching}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Overview Cards */}
        <Suspense fallback={<SectionLoader />}>
          <OverviewCards data={{
            totalPeople: data.totalPeople,
            totalCompanies: data.totalCompanies,
            totalJobs: data.totalJobs,
            totalInteractions: data.totalInteractions,
          }} />
        </Suspense>

        {/* Stage Distribution Charts */}
        <Suspense fallback={<SectionLoader />}>
          <StageDistribution 
            peopleByStage={data.peopleByStage}
            companiesByStage={data.companiesByStage}
          />
        </Suspense>

        {/* Monthly Trends */}
        <Suspense fallback={<SectionLoader />}>
          <MonthlyTrends monthlyStats={data.monthlyStats} />
        </Suspense>

        {/* Recent Interactions */}
        <Suspense fallback={<SectionLoader />}>
          <RecentInteractions recentInteractions={data.recentInteractions} />
        </Suspense>

        {/* Top Companies */}
        <Suspense fallback={<SectionLoader />}>
          <TopCompanies topCompanies={data.topCompanies} />
        </Suspense>

        {/* User Performance Stats */}
        {data.userStats && data.userStats.length > 0 && (
          <Suspense fallback={<SectionLoader />}>
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.userStats.map((user) => (
                    <Card key={user.user_id} className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{user.user_name}</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">People</div>
                            <div className="font-medium">{user.people_count}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Companies</div>
                            <div className="font-medium">{user.companies_count}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Interactions</div>
                            <div className="font-medium">{user.interactions_count}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Suspense>
        )}
      </div>
    </Page>
  );
};

export default Reporting;
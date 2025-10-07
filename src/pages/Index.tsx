import { RecentCompaniesTabs } from "@/components/dashboard/RecentCompaniesTabs";
import { RecentJobsTabs } from "@/components/dashboard/RecentJobsTabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { Page } from "@/design-system/components";
import {
    ModernLineChart,
    modernChartColors
} from "@/design-system/modern-charts";
import {
    ModernChartContainer,
    ModernLoadingState,
    ModernMetricCard,
    ModernSectionHeader
} from "@/design-system/modern-components";
import { DashboardServiceOptimized, type DashboardData } from "@/services/dashboardServiceOptimized";
import { ErrorBoundary, usePerformanceMonitoring } from '@/utils/performanceMonitor';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {
    MoreHorizontal
} from "lucide-react";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Index = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { logError, endTracking } = usePerformanceMonitoring('Dashboard');
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const data = await DashboardServiceOptimized.getDashboardData();
      setDashboardData(data);
      endTracking();
    } catch (error) {
      logError('fetch_dashboard_data', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = dashboardData?.metrics;

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10; // Round to 1 decimal place
  };

  const peopleTrend = calculateTrend(metrics?.peopleThisWeek || 0, (metrics?.peopleThisWeek || 0) - 5);
  const companiesTrend = calculateTrend(metrics?.companiesThisWeek || 0, (metrics?.companiesThisWeek || 0) - 3);
  const jobsTrend = calculateTrend(metrics?.jobsThisWeek || 0, (metrics?.jobsThisWeek || 0) - 2);
  const automationTrend = calculateTrend(metrics?.activeAutomations || 0, (metrics?.activeAutomations || 0) - 1);

  if (loading) {
    return (
      <Page title="Dashboard">
        <ModernLoadingState 
          title="Dashboard" 
          message="Loading your business insights..." 
        />
      </Page>
    );
  }

  return (
    <ErrorBoundary>
      <Page title="Dashboard">
      {/* Key Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <ModernMetricCard
          title="Total People"
          value={metrics?.totalPeople || 0}
          change={peopleTrend}
          changeType={peopleTrend > 0 ? 'increase' : peopleTrend < 0 ? 'decrease' : 'neutral'}
          subtitle="Total number of people in your database"
          loading={loading}
          onClick={() => openPopup('lead', '', 'All People')}
        />

        <ModernMetricCard
          title="Total Companies"
          value={metrics?.totalCompanies || 0}
          change={companiesTrend}
          changeType={companiesTrend > 0 ? 'increase' : companiesTrend < 0 ? 'decrease' : 'neutral'}
          subtitle="Total number of companies tracked"
          loading={loading}
          onClick={() => openPopup('company', '', 'All Companies')}
        />

        <ModernMetricCard
          title="Total Jobs"
          value={metrics?.totalJobs || 0}
          change={jobsTrend}
          changeType={jobsTrend > 0 ? 'increase' : jobsTrend < 0 ? 'decrease' : 'neutral'}
          subtitle="Total number of job postings"
          loading={loading}
          onClick={() => openPopup('job', '', 'All Jobs')}
        />

        <ModernMetricCard
          title="Automation Success"
          value={`${metrics?.automationSuccessRate?.toFixed(1) || 0}%`}
          change={automationTrend}
          changeType={automationTrend > 0 ? 'increase' : automationTrend < 0 ? 'decrease' : 'neutral'}
          subtitle="Percentage of successful automations"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        {/* Company Growth Chart */}
        <ModernChartContainer
          title="Company Growth & Automation"
          subtitle="Last 7 days performance"
          loading={loading}
          actions={
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <ModernLineChart
                data={{
              labels: (dashboardData?.companiesOverTime || []).length > 0 
                ? (dashboardData?.companiesOverTime || []).map(item => 
                    new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  )
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'New Companies',
                  data: (dashboardData?.companiesOverTime || []).length > 0
                    ? (dashboardData?.companiesOverTime || []).map(item => item.newCompanies)
                    : [12, 19, 3, 5, 2, 3, 7],
                  borderColor: modernChartColors.primary,
                  backgroundColor: modernChartColors.primary + '10',
                  fill: true,
                  tension: 0.4,
                    },
                    {
                      label: 'Automated Companies',
                  data: (dashboardData?.companiesOverTime || []).length > 0
                    ? (dashboardData?.companiesOverTime || []).map(item => item.automatedCompanies)
                    : [8, 15, 2, 4, 1, 2, 5],
                  borderColor: modernChartColors.success,
                  backgroundColor: modernChartColors.success + '10',
                  fill: true,
                  tension: 0.4,
                    },
                  ],
                }}
            height={300}
            loading={loading}
          />
        </ModernChartContainer>

        {/* People Automation Activity Chart */}
        <ModernChartContainer
          title="People Automation Activity"
          subtitle="Automation engagement trends"
          loading={loading}
          actions={
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <ModernLineChart
                data={{
              labels: (dashboardData?.peopleAutomationOverTime || []).length > 0
                ? (dashboardData?.peopleAutomationOverTime || []).map(item => 
                    new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  )
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'People with Automation',
                  data: (dashboardData?.peopleAutomationOverTime || []).length > 0
                    ? (dashboardData?.peopleAutomationOverTime || []).map(item => item.peopleWithAutomation)
                    : [45, 52, 38, 61, 55, 48, 67],
                  borderColor: modernChartColors.secondary,
                  backgroundColor: modernChartColors.secondary + '10',
                  fill: true,
                  tension: 0.4,
                    },
                    {
                      label: 'Automation Activity',
                  data: (dashboardData?.peopleAutomationOverTime || []).length > 0
                    ? (dashboardData?.peopleAutomationOverTime || []).map(item => item.automationActivity)
                    : [23, 28, 19, 31, 27, 24, 33],
                  borderColor: modernChartColors.accent,
                  backgroundColor: modernChartColors.accent + '10',
                  fill: true,
                  tension: 0.4,
                    },
                  ],
                }}
            height={300}
            loading={loading}
          />
        </ModernChartContainer>
      </div>

      {/* Recent Items Section */}
      <ModernSectionHeader
        title="Recent Activity"
        subtitle="Latest companies and job postings"
        actions={
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            View All
          </button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Companies */}
        <RecentCompaniesTabs 
          companies={dashboardData?.recentCompanies || []} 
          loading={loading} 
        />

        {/* Recent Jobs */}
        <RecentJobsTabs 
          jobs={dashboardData?.recentJobs || []} 
          loading={loading} 
        />
      </div>
      </Page>
    </ErrorBoundary>
  );
};

export default Index;
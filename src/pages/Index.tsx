import React, { useState, useEffect } from "react";
import { Page } from "@/design-system/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Target, 
  Activity, 
  Zap, 
  Star, 
  Clock, 
  MessageSquare,
  User,
  UserCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { designTokens } from "@/design-system/tokens";
import { DashboardService, type DashboardData } from "@/services/dashboardService";
import { RecentJobsTabs } from "@/components/dashboard/RecentJobsTabs";
import { RecentCompaniesTabs } from "@/components/dashboard/RecentCompaniesTabs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const { openPopup } = usePopupNavigation();

  useEffect(() => {
    // Only fetch data when user is authenticated
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]); // Depend on user.id to refetch when auth changes

  const fetchDashboardData = async () => {
    // Guard against calling without authenticated user
    if (!user?.id) {
      console.warn('Cannot fetch dashboard data: user not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await DashboardService.getDashboardData(user.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = dashboardData?.metrics;

  return (
    <Page title="Dashboard">
      {/* Key Metrics - Better Spacing */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {/* Total People */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total People</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : metrics?.totalPeople || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  +{loading ? '...' : metrics?.peopleThisWeek || 0} last 7 days
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                <Users className="h-6 w-6 text-sidebar-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : metrics?.totalCompanies || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  +{loading ? '...' : metrics?.companiesThisWeek || 0} last 7 days
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success/5 border border-success/10">
                <Building2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Jobs */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : metrics?.totalJobs || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  +{loading ? '...' : metrics?.jobsThisWeek || 0} last 7 days
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/5 border border-secondary/10">
                <Briefcase className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Success */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Companies Automated</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : `${metrics?.automationSuccessRate?.toFixed(1) || 0}%`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +{loading ? '...' : metrics?.activeAutomations || 0} last 7 days
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/5 border border-warning/10">
                <Zap className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Charts Section - Reporting Style */}
      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        {/* New Companies vs Automated Companies */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 border border-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              Company Growth & Automation (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <Line
                data={{
                  labels: (dashboardData?.companiesOverTime || []).map(item => 
                    new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  ),
                  datasets: [
                    {
                      label: 'New Companies',
                      data: (dashboardData?.companiesOverTime || []).map(item => item.newCompanies),
                      borderColor: '#3B82F6',
                      backgroundColor: '#3B82F6',
                      borderWidth: 2,
                      pointRadius: 3,
                      tension: 0.1,
                    },
                    {
                      label: 'Automated Companies',
                      data: (dashboardData?.companiesOverTime || []).map(item => item.automatedCompanies),
                      borderColor: '#10B981',
                      backgroundColor: '#10B981',
                      borderWidth: 2,
                      pointRadius: 3,
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      labels: {
                        font: { size: 13 }
                      }
                    },
                    tooltip: {
                      titleFont: { size: 11 },
                      bodyFont: { size: 11 }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { font: { size: 12 } }
                    },
                    y: {
                      ticks: { font: { size: 12 } }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* People Automation Activity */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
                <Users className="h-4 w-4 text-secondary" />
              </div>
              People Automation Activity (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <Line
                data={{
                  labels: (dashboardData?.peopleAutomationOverTime || []).map(item => 
                    new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  ),
                  datasets: [
                    {
                      label: 'People with Automation',
                      data: (dashboardData?.peopleAutomationOverTime || []).map(item => item.peopleWithAutomation),
                      borderColor: '#8B5CF6',
                      backgroundColor: '#8B5CF6',
                      borderWidth: 2,
                      pointRadius: 3,
                      tension: 0.1,
                    },
                    {
                      label: 'Automation Activity',
                      data: (dashboardData?.peopleAutomationOverTime || []).map(item => item.automationActivity),
                      borderColor: '#F59E0B',
                      backgroundColor: '#F59E0B',
                      borderWidth: 2,
                      pointRadius: 3,
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      labels: {
                        font: { size: 13 }
                      }
                    },
                    tooltip: {
                      titleFont: { size: 11 },
                      bodyFont: { size: 11 }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { font: { size: 12 } }
                    },
                    y: {
                      ticks: { font: { size: 12 } }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items with Tabs - Improved Layout */}
      <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-1 xl:grid-cols-2 lg:gap-8 mb-8">
        {/* Recent Companies with Tabs */}
        <RecentCompaniesTabs 
          companies={dashboardData?.recentCompanies || []} 
          loading={loading} 
        />

        {/* Recent Jobs with Tabs */}
        <RecentJobsTabs 
          jobs={dashboardData?.recentJobs || []} 
          loading={loading} 
        />
      </div>
    </Page>
  );
};

export default Index;

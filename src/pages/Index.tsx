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
import { RecentPeopleTabs } from "@/components/dashboard/RecentPeopleTabs";
import { RecentJobsTabs } from "@/components/dashboard/RecentJobsTabs";
import { RecentCompaniesTabs } from "@/components/dashboard/RecentCompaniesTabs";

const Index = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const { openPopup } = usePopupNavigation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getDashboardData(user?.id);
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
      {/* Key Metrics - Modern Design */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total People */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total People</p>
                <p className="text-3xl font-bold text-blue-900">{loading ? '...' : metrics?.totalPeople || 0}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{loading ? '...' : metrics?.peopleThisWeek || 0} this week
                </p>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Companies</p>
                <p className="text-3xl font-bold text-emerald-900">{loading ? '...' : metrics?.totalCompanies || 0}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{loading ? '...' : metrics?.companiesThisWeek || 0} this week
                </p>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500 shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Jobs */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Jobs</p>
                <p className="text-3xl font-bold text-purple-900">{loading ? '...' : metrics?.totalJobs || 0}</p>
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{loading ? '...' : metrics?.jobsThisWeek || 0} this week
                </p>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-purple-500 shadow-lg">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Success */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Automation Success</p>
                <p className="text-3xl font-bold text-amber-900">
                  {loading ? '...' : `${metrics?.automationSuccessRate?.toFixed(1) || 0}%`}
                </p>
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {loading ? '...' : metrics?.activeAutomations || 0} active
                </p>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats - Cleaner Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Pipeline Breakdown */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 border border-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              Pipeline Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : Object.keys(metrics?.pipelineBreakdown || {}).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(metrics?.pipelineBreakdown || {})
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 4)
                  .map(([stage, count]) => {
                    const total = Object.values(metrics?.pipelineBreakdown || {}).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-sm font-medium capitalize">{stage}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-sm">{count}</span>
                            <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Target className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No pipeline data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
                <Star className="h-4 w-4 text-secondary" />
              </div>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Favorite People</span>
                </div>
                <span className="font-semibold text-sm">{loading ? '...' : metrics?.favoritePeople || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Unassigned People</span>
                </div>
                <span className="font-semibold text-sm">{loading ? '...' : metrics?.unassignedPeople || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Unassigned Companies</span>
                </div>
                <span className="font-semibold text-sm">{loading ? '...' : metrics?.unassignedCompanies || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                <Activity className="h-4 w-4 text-success" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10 flex-shrink-0 mt-0.5">
                      <MessageSquare className="h-3 w-3 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.interaction_type}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.person_name || activity.company_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Activity className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner Distribution */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/5 border border-warning/10">
                <UserCheck className="h-4 w-4 text-warning" />
              </div>
              Team Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : Object.keys(metrics?.ownerStats || {}).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(metrics?.ownerStats || {})
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 4)
                  .map(([owner, count]) => {
                    const total = Object.values(metrics?.ownerStats || {}).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={owner} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-warning"></div>
                            <span className="text-sm font-medium truncate">{owner}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-sm">{count}</span>
                            <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-warning h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <UserCheck className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No assignment data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Items with Tabs - Better Spacing */}
      <div className="grid gap-6 xl:grid-cols-3 mb-8">
        {/* Recent People with Tabs */}
        <RecentPeopleTabs 
          people={dashboardData?.recentPeople || []} 
          loading={loading} 
        />

        {/* Recent Jobs with Tabs */}
        <RecentJobsTabs 
          jobs={dashboardData?.recentJobs || []} 
          loading={loading} 
        />

        {/* Recent Companies with Tabs */}
        <RecentCompaniesTabs 
          companies={dashboardData?.recentCompanies || []} 
          loading={loading} 
        />
      </div>
    </Page>
  );
};

export default Index;

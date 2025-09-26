import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
import { usePopup } from "@/contexts/PopupContext";
import { useDashboardStats, usePrefetchData } from "@/hooks/useSupabaseData";
import { getCompanyLogoUrlSync } from "@/utils/logoService";
import { formatDateForSydney } from "@/utils/timezoneUtils";
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

interface TodayJob {
  id: string;
  title: string;
  company_id: string;
  location: string;
  priority: string;
  lead_score_job: string;
  created_at: string;
  companies: {
    name: string;
    website?: string;
  };
  company_name?: string;
  company_logo_url?: string;
}

interface RecentLead {
  id: string;
  name: string;
  company_role: string;
  stage: string;
  lead_score: string;
  created_at: string;
}

export default function IndexOptimized() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { openJobPopup, openLeadPopup } = usePopup();
  const { prefetchJob, prefetchLead } = usePrefetchData();

  // Use optimized dashboard stats query
  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useDashboardStats({
    staleTime: 1 * 60 * 1000, // 1 minute for stats
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Handle job click with prefetching
  const handleJobClick = useCallback(async (job: TodayJob) => {
    try {
      // Prefetch job data for better UX
      prefetchJob(job.id);
      openJobPopup(job.id);
    } catch (error) {
      console.error('Error opening job popup:', error);
      // Fallback to basic job data
      openJobPopup(job.id);
    }
  }, [openJobPopup, prefetchJob]);

  // Handle lead click with prefetching
  const handleLeadClick = useCallback((lead: RecentLead) => {
    prefetchLead(lead.id);
    openLeadPopup(lead.id);
  }, [openLeadPopup, prefetchLead]);

  // Get priority color
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
      case 'VERY HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  // Memoized today's jobs with company information
  const todayJobs = useMemo(() => {
    if (!stats?.todayJobs) return [];
    
    return stats.todayJobs.map((job: TodayJob) => ({
      ...job,
      company_name: job.companies?.name || 'Unknown Company',
      company_logo_url: getCompanyLogoUrlSync(
        job.companies?.name || '', 
        job.companies?.website
      )
    }));
  }, [stats?.todayJobs]);

  // Error handling
  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">Error loading dashboard</div>
          <div className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back! Here's what's happening with your CRM.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active prospects in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">
              Companies in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Job opportunities tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Jobs Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newJobsToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              Jobs posted today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Jobs Alert */}
      {stats?.expiringJobs > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Expiring Jobs Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 text-sm">
              You have <strong>{stats.expiringJobs}</strong> jobs expiring in the next 7 days. 
              Review them to avoid missing opportunities.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={() => navigate('/jobs')}
            >
              View Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Today's Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's New Jobs</CardTitle>
              <CardDescription>
                Latest job opportunities posted today
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/jobs')}
            >
              View All Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todayJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No new jobs posted today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {job.company_logo_url ? (
                        <img
                          src={job.company_logo_url}
                          alt={job.company_name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold"
                        style={{ display: job.company_logo_url ? 'none' : 'flex' }}
                      >
                        {job.company_name?.charAt(0) || '?'}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{job.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.company_name} • {job.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        Score: {job.lead_score_job || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateForSydney(job.created_at, 'time')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/leads')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-800">Manage Leads</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              View and manage your lead pipeline
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Leads
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/companies')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Companies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Manage your target companies
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Companies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/jobs')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-purple-800">Job Opportunities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Track job opportunities
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/pipeline')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Sales Pipeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Visualize your sales pipeline
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Pipeline
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

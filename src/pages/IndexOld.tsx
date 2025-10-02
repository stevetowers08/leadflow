import React, { useState, useEffect } from "react";
import { Page } from "@/design-system/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, User, Calendar, MapPin, Building2, TrendingUp, Target, CheckCircle, Activity, Zap, Star, Plus, BarChart3, Clock, MessageSquare, FileText, StickyNote, ExternalLink, Mail, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { usePopupNavigation } from "@/contexts/PopupNavigationContext";
import { designTokens } from "@/design-system/tokens";
import { DashboardService, type DashboardData } from "@/services/dashboardService";

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
      
      // Fetch dashboard stats
      const [
        leadsCount, 
        jobsCount, 
        companiesCount, 
        recentPeopleData, 
        recentJobsData,
        recentActivitiesData,
        pipelineData,
        sourcesData,
        ownersData,
        favoritesData,
        unassignedData
      ] = await Promise.all([
        supabase.from("people").select("*", { count: 'exact', head: true }),
        supabase.from("jobs").select("*", { count: 'exact', head: true }),
        supabase.from("companies").select("*", { count: 'exact', head: true }),
        supabase.from("people").select(`
          id,
          name,
          email_address,
          company_role,
          employee_location,
          stage,
          created_at,
          companies(name)
        `).order("created_at", { ascending: false }).limit(5),
        supabase.from("jobs").select(`
          id,
          title,
          location,
          priority,
          created_at,
          companies(name)
        `).order("created_at", { ascending: false }).limit(5),
        supabase.from("interactions").select(`
          id,
          interaction_type,
          subject,
          content,
          occurred_at,
          created_at,
          people(name, companies(name))
        `).order("created_at", { ascending: false }).limit(5),
        // Pipeline breakdown
        supabase.from("people").select("stage").not("stage", "is", null),
        // Lead sources
        supabase.from("people").select("lead_source").not("lead_source", "is", null),
        // Owner stats
        supabase.from("people").select("owner_id").not("owner_id", "is", null),
        // Favorites
        supabase.from("people").select("*", { count: 'exact', head: true }).eq("is_favourite", true),
        // Unassigned
        supabase.from("people").select("*", { count: 'exact', head: true }).is("owner_id", null)
      ]);

      // Calculate stats
      const totalPeople = leadsCount.count || 0;
      const totalJobs = jobsCount.count || 0;
      const totalCompanies = companiesCount.count || 0;
      
      // Calculate people this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: peopleThisWeek } = await supabase
        .from("people")
        .select("*", { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Process pipeline breakdown
      const pipelineBreakdown: Record<string, number> = {};
      pipelineData.data?.forEach(lead => {
        const stage = lead.stage || 'unassigned';
        pipelineBreakdown[stage] = (pipelineBreakdown[stage] || 0) + 1;
      });

      // Process lead sources
      const leadSources: Record<string, number> = {};
      sourcesData.data?.forEach(lead => {
        const source = lead.lead_source || 'Unknown';
        leadSources[source] = (leadSources[source] || 0) + 1;
      });

      // Process owner stats
      const ownerStats: Record<string, number> = {};
      ownersData.data?.forEach(lead => {
        const ownerId = lead.owner_id || 'unassigned';
        ownerStats[ownerId] = (ownerStats[ownerId] || 0) + 1;
      });

      setDashboardStats({
        totalPeople,
        totalJobs,
        totalCompanies,
        activeAutomations: Math.floor(totalPeople * 0.3), // Mock calculation
        conversionRate: 12.5, // Mock calculation
        peopleThisWeek: peopleThisWeek || 0,
        pipelineBreakdown,
        leadSources,
        ownerStats,
        favoritePeople: favoritesData.count || 0,
        unassignedPeople: unassignedData.count || 0
      });

      // Set recent data
      const peopleWithCompany = (recentPeopleData.data || []).map(lead => ({
        ...lead,
        company_name: lead.companies?.name || null
      }));
      setRecentPeople(peopleWithCompany);

      const jobsWithCompany = (recentJobsData.data || []).map(job => ({
        ...job,
        company_name: job.companies?.name || null
      }));
      setRecentJobs(jobsWithCompany);


      // Process activities data
      const activitiesWithDetails = (recentActivitiesData.data || []).map(activity => ({
        ...activity,
        person_name: activity.people?.name || 'Unknown',
        company_name: activity.people?.companies?.name || null
      }));
      setRecentActivities(activitiesWithDetails);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    console.log('🔍 Lead clicked:', lead.name, lead.id);
    console.log('🔍 openPopup function:', openPopup);
    openPopup('lead', lead.id, lead.name);
    console.log('🔍 openPopup called');
  };

  const handleJobClick = (job: Job) => {
    console.log('🔍 Job clicked:', job.title, job.id);
    console.log('🔍 openPopup function:', openPopup);
    openPopup('job', job.id, job.title);
    console.log('🔍 openPopup called');
  };

  const renderLeadItem = (lead: Lead) => (
    <div 
      key={lead.id} 
      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      onClick={() => handleLeadClick(lead)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{lead.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {lead.company_role} • {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={lead.stage || "new"} size="sm" />
        </div>
      </div>
    </div>
  );

  const renderJobItem = (job: Job) => (
    <div 
      key={job.id} 
      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      onClick={() => handleJobClick(job)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{job.title}</div>
          <div className="text-xs text-gray-500 truncate">
            {job.location} • {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.priority || "Medium"} size="sm" />
        </div>
      </div>
    </div>
  );


  const renderActivityItem = (activity: Interaction) => (
    <div 
      key={activity.id} 
      className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-100">
          <Activity className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {activity.interaction_type} with {activity.person_name}
          </div>
          {activity.subject && (
            <div className="text-sm text-gray-600 mb-1 font-medium">
              {activity.subject}
            </div>
          )}
          {activity.content && (
            <div className="text-sm text-gray-600 mb-2 line-clamp-2">
              {activity.content}
            </div>
          )}
          <div className="text-xs text-gray-500">
            {activity.company_name && `${activity.company_name} • `}
            {formatDistanceToNow(new Date(activity.occurred_at || activity.created_at), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Page
      title="Dashboard"
    >
      {/* Key Metrics Overview */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4 mb-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total People</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalPeople}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success font-medium">+{dashboardStats.peopleThisWeek}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">this week</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                <Users className="h-5 w-5 text-sidebar-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalJobs}</p>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-sidebar-primary" />
                    <span className="text-xs text-sidebar-primary font-medium">{dashboardStats.totalCompanies}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">companies</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/5 border border-success/10">
                <Briefcase className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.conversionRate}%</p>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-success" />
                    <span className="text-xs text-success font-medium">Above target</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-success h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(dashboardStats.conversionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/5 border border-secondary/10">
                <Target className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automations</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900">{dashboardStats.activeAutomations}</p>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-warning" />
                    <span className="text-xs text-warning font-medium">Active</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">workflows running</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/5 border border-warning/10">
                <Zap className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
        {/* Pipeline Breakdown */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                <BarChart3 className="h-4 w-4 text-sidebar-primary" />
              </div>
              Pipeline Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : Object.keys(dashboardStats.pipelineBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(dashboardStats.pipelineBreakdown).map(([stage, count]) => {
                  const total = Object.values(dashboardStats.pipelineBreakdown).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={stage} size="sm" />
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-sm">{count}</span>
                          <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-sidebar-primary h-1.5 rounded-full transition-all duration-300" 
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

        {/* Lead Sources */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                <Filter className="h-4 w-4 text-success" />
              </div>
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : Object.keys(dashboardStats.leadSources).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(dashboardStats.leadSources)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([source, count]) => {
                    const total = Object.values(dashboardStats.leadSources).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            <span className="text-sm font-medium">{source}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-sm">{count}</span>
                            <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-success h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Filter className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No source data</p>
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
                <span className="font-semibold text-sm">{dashboardStats.favoritePeople}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Unassigned</span>
                </div>
                <span className="font-semibold text-sm">{dashboardStats.unassignedPeople}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sidebar-primary" />
                  <span className="text-sm font-medium">This Week</span>
                </div>
                <span className="font-semibold text-sm">{dashboardStats.peopleThisWeek}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent People Card */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                <Users className="h-4 w-4 text-sidebar-primary" />
              </div>
              Recent People
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : recentPeople.length > 0 ? (
              <div className="space-y-3">
                {recentPeople.map(renderLeadItem)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent people found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs Card */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                <Briefcase className="h-4 w-4 text-success" />
              </div>
              Recent Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-3">
                {recentJobs.map(renderJobItem)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent jobs found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-1 mb-8">
        {/* Recent Activities Card */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/5 border border-warning/10">
                <Activity className="h-4 w-4 text-warning" />
              </div>
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map(renderActivityItem)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent activities found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead and Job Detail Modals - Now handled by UnifiedPopup */}
    </Page>
  );
};

export default Index;
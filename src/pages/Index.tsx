import React, { useState, useEffect } from "react";
import { Page } from "@/design-system/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, Briefcase, User, Calendar, MapPin, Building2, TrendingUp, Target, CheckCircle, Activity, Zap, Star, Filter, Plus, BarChart3, Clock, MessageSquare, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { usePopup } from "@/contexts/OptimizedPopupContext";
import { designTokens } from "@/design-system/tokens";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"people"> & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

type Job = Tables<"jobs"> & {
  company_name?: string | null;
  company_logo_url?: string | null;
};

type Note = Tables<"notes"> & {
  author_name?: string | null;
  entity_name?: string | null;
};

type Interaction = Tables<"interactions"> & {
  person_name?: string | null;
  company_name?: string | null;
};

const Index = () => {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [recentActivities, setRecentActivities] = useState<Interaction[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalLeads: 0,
    totalJobs: 0,
    totalCompanies: 0,
    activeAutomations: 0,
    conversionRate: 0,
    leadsThisWeek: 0,
    pipelineBreakdown: {} as Record<string, number>,
    leadSources: {} as Record<string, number>,
    ownerStats: {} as Record<string, number>,
    favoriteLeads: 0,
    unassignedLeads: 0
  });
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
        recentLeadsData, 
        recentJobsData,
        recentNotesData,
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
        supabase.from("notes").select(`
          id,
          content,
          entity_type,
          created_at,
          author_id,
          entity_id
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
      const totalLeads = leadsCount.count || 0;
      const totalJobs = jobsCount.count || 0;
      const totalCompanies = companiesCount.count || 0;
      
      // Calculate leads this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: leadsThisWeek } = await supabase
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
        totalLeads,
        totalJobs,
        totalCompanies,
        activeAutomations: Math.floor(totalLeads * 0.3), // Mock calculation
        conversionRate: 12.5, // Mock calculation
        leadsThisWeek: leadsThisWeek || 0,
        pipelineBreakdown,
        leadSources,
        ownerStats,
        favoriteLeads: favoritesData.count || 0,
        unassignedLeads: unassignedData.count || 0
      });

      // Set recent data
      const leadsWithCompany = (recentLeadsData.data || []).map(lead => ({
        ...lead,
        company_name: lead.companies?.name || null
      }));
      setRecentLeads(leadsWithCompany);

      const jobsWithCompany = (recentJobsData.data || []).map(job => ({
        ...job,
        company_name: job.companies?.name || null
      }));
      setRecentJobs(jobsWithCompany);

      // Process notes data
      const notesWithDetails = (recentNotesData.data || []).map(note => ({
        ...note,
        author_name: note.user_profiles?.full_name || 'Unknown',
        entity_name: note.entity_type === 'lead' ? note.people?.name : 
                    note.entity_type === 'company' ? note.companies?.name :
                    note.entity_type === 'job' ? note.jobs?.title : 'Unknown'
      }));
      setRecentNotes(notesWithDetails);

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

  const renderNoteItem = (note: Note) => (
    <div 
      key={note.id} 
      className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
          <FileText className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 mb-1">
            Note on {note.entity_name}
          </div>
          <div className="text-sm text-gray-600 mb-2 line-clamp-2">
            {note.content}
          </div>
          <div className="text-xs text-gray-500">
            by {note.author_name} • {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
          </div>
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
        <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0">
          <Activity className="h-4 w-4 text-green-600" />
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
      subtitle="Welcome to your recruitment dashboard"
    >
      {/* Key Metrics Overview */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        <Card className={designTokens.shadows.card}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.totalLeads}</p>
                <p className="text-xs text-green-600 font-medium">+{dashboardStats.leadsThisWeek} this week</p>
              </div>
              <div className="p-3 bg-sidebar-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-sidebar-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={designTokens.shadows.card}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.totalJobs}</p>
                <p className="text-xs text-sidebar-primary font-medium">Across {dashboardStats.totalCompanies} companies</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={designTokens.shadows.card}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.conversionRate}%</p>
                <p className="text-xs text-green-600 font-medium">Above target</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Target className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={designTokens.shadows.card}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Automations</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.activeAutomations}</p>
                <p className="text-xs text-orange-600 font-medium">Active workflows</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        {/* Pipeline Breakdown */}
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-4 w-4 text-blue-600" />
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
                {Object.entries(dashboardStats.pipelineBreakdown).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={stage} size="sm" />
                    </div>
                    <span className="font-semibold text-sm">{count}</span>
                  </div>
                ))}
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
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Filter className="h-4 w-4 text-green-600" />
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
                  .map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source}</span>
                    <span className="font-semibold text-sm">{count}</span>
                  </div>
                ))}
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
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Favorite Leads</span>
                </div>
                <span className="font-semibold text-sm">{dashboardStats.favoriteLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Unassigned</span>
                </div>
                <span className="font-semibold text-sm">{dashboardStats.unassignedLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">This Week</span>
                </div>
                <span className="font-semibold text-sm">{dashboardStats.leadsThisWeek}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Leads Card */}
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-sidebar-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-sidebar-primary" />
              </div>
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map(renderLeadItem)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent leads found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs Card */}
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-green-600" />
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

      {/* Recent Notes and Activities */}
      <div className="grid gap-6 md:grid-cols-2 mb-6 sm:mb-8">
        {/* Recent Notes Card */}
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map(renderNoteItem)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent notes found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities Card */}
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-4 w-4 text-green-600" />
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
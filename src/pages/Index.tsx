import React, { useState, useEffect } from "react";
import { Page } from "@/design-system/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, Briefcase, User, Calendar, MapPin, Building2, TrendingUp, Target, CheckCircle, Activity, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { usePopup } from "@/contexts/PopupContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
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

const Index = () => {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalLeads: 0,
    totalJobs: 0,
    totalCompanies: 0,
    activeAutomations: 0,
    conversionRate: 0,
    leadsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const { openLeadPopup, openJobPopup } = usePopup();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const [leadsCount, jobsCount, companiesCount, recentLeadsData, recentJobsData] = await Promise.all([
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
        `).order("created_at", { ascending: false }).limit(5)
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

      setDashboardStats({
        totalLeads,
        totalJobs,
        totalCompanies,
        activeAutomations: Math.floor(totalLeads * 0.3), // Mock calculation
        conversionRate: 12.5, // Mock calculation
        leadsThisWeek: leadsThisWeek || 0
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

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    openLeadPopup(lead.id);
  };

  const handleJobClick = (job: Job) => {
    openJobPopup(job.id);
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

  return (
    <Page
      title="Dashboard"
      subtitle="Welcome to your recruitment dashboard"
    >
      {/* Key Metrics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className={designTokens.shadows.card}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">{dashboardStats.totalLeads}</p>
                <p className="text-xs text-green-600 font-medium">+{dashboardStats.leadsThisWeek} this week</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
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
                <p className="text-xs text-primary font-medium">Across {dashboardStats.totalCompanies} companies</p>
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

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Leads Card */}
        <Card className={designTokens.shadows.card}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
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

    </Page>
  );
};

export default Index;
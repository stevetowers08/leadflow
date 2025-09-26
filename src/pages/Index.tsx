import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { CompactStats } from "@/components/CompactStats";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { usePopup } from "@/contexts/PopupContext";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
import { usePageMeta } from "@/hooks/usePageMeta";
import { dashboardCache } from "@/utils/managedCache";
import { useDebouncedFetch } from "@/hooks/useDebouncedFetch";
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  ArrowRight,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfileImage } from '@/utils/linkedinProfileUtils';
import { getCompanyLogoUrlSync } from '@/utils/logoService';

// Use managed cache for better performance and memory management

interface DashboardStats {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  newJobsToday: number;
  expiringJobs: number;
}

interface TodayJob {
  id: string;
  title: string;
  company_id: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  location: string | null;
  priority: string | null;
  lead_score_job: number | null;
  created_at: string;
}

interface RecentLead {
  id: string;
  name: string;
  company_id: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  company_role: string | null;
  employee_location: string | null;
  stage: string | null;
  lead_score: string | null;
  created_at: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalCompanies: 0,
    totalJobs: 0,
    newJobsToday: 0,
    expiringJobs: 0,
  });
  const [todayJobs, setTodayJobs] = useState<TodayJob[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const { openJobPopup, openLeadPopup } = usePopup();

  // Define fetch function first to avoid circular dependency
  const fetchDashboardDataInternal = useCallback(async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      // OPTIMIZED: Fetch only counts, not full data
      const [leadsCount, companiesCount, jobsCount] = await Promise.all([
        supabase.from("people").select("id", { count: "exact", head: true }),
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
      ]);

      // Fetch jobs created today - Sydney timezone aware
      // Convert to Sydney timezone for accurate date calculation
      const sydneyDate = new Date(today.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
      const todayDateString = sydneyDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Fetch jobs created today with company information
      const { data: todayJobsData, error: jobsError } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          company_id,
          location,
          priority,
          lead_score_job,
          created_at,
          companies!inner(name, website)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      

      // OPTIMIZED: Fetch only fields needed for expiring jobs calculation
      const { data: allJobs } = await supabase.from("jobs").select("id, priority, valid_through");
      const expiringJobs = allJobs?.filter(job => {
        if (!job.valid_through) return false;
        const parseDate = (dateStr: string) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return new Date(`${year}-${month}-${day}`);
          }
          return new Date(dateStr);
        };
        
        const validThroughDate = parseDate(job.valid_through);
        return validThroughDate <= sevenDaysFromNow && validThroughDate >= today;
      }) || [];

      // Fetch recent leads with company information
      const { data: recentLeadsData } = await supabase
        .from("people")
        .select(`
          id,
          name,
          company_id,
          company_role,
          employee_location,
          email_address,
          linkedin_url,
          companies!inner(name, website),
          stage,
          lead_score,
          created_at
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      // Transform today's jobs data
      const transformedTodayJobs = todayJobsData?.map(job => {
        const logoUrl = getCompanyLogoUrlSync(
          job.companies?.name || '',
          job.companies?.website
        );
        
        return {
          ...job,
          company_name: job.companies?.name || null,
          company_logo_url: logoUrl,
          company_website: job.companies?.website || null
        };
      }) || [];

      const statsData = {
        totalLeads: leadsCount.count || 0,
        totalCompanies: companiesCount.count || 0,
        totalJobs: jobsCount.count || 0,
        newJobsToday: transformedTodayJobs.length,
        expiringJobs: expiringJobs.length,
      };

      // Transform recent leads data to include company info
      const transformedRecentLeads = recentLeadsData?.map(lead => {
        const logoUrl = getCompanyLogoUrlSync(
          lead.companies?.name || '',
          lead.companies?.website
        );
        
        return {
          id: lead.id,
          name: lead.name,
          company_id: lead.company_id,
          company_name: lead.companies?.name || null,
          company_logo_url: logoUrl,
          company_role: lead.company_role || null,
          employee_location: lead.employee_location || null,
          stage: lead.stage,
          lead_score: lead.lead_score,
          created_at: lead.created_at
        };
      }) || [];

      setStats(statsData);
      setTodayJobs(transformedTodayJobs);
      setRecentLeads(transformedRecentLeads);
      
      // Cache the data using managed cache
      dashboardCache.set('dashboard', {
        stats: statsData,
        todayJobs: transformedTodayJobs,
        recentLeads: transformedRecentLeads
      });

      return {
        stats: statsData,
        todayJobs: transformedTodayJobs,
        recentLeads: transformedRecentLeads
      };

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Use debounced fetch to prevent overlapping requests
  const { debouncedFetch, immediateFetch, isLoading: isFetching } = useDebouncedFetch(
    fetchDashboardDataInternal,
    { delay: 300 }
  );

  // Set page meta tags
  usePageMeta({
    title: 'Dashboard - Empowr CRM',
    description: 'Overview of your recruitment pipeline with key metrics, recent leads, and job opportunities. Track your progress and manage your CRM efficiently.',
    keywords: 'dashboard, CRM, recruitment, leads, jobs, pipeline, metrics, analytics',
    ogTitle: 'Dashboard - Empowr CRM',
    ogDescription: 'Overview of your recruitment pipeline with key metrics, recent leads, and job opportunities.',
    twitterTitle: 'Dashboard - Empowr CRM',
    twitterDescription: 'Overview of your recruitment pipeline with key metrics, recent leads, and job opportunities.'
  });

  useEffect(() => {
    // Check cache first
    const cachedData = dashboardCache.get('dashboard');
    if (cachedData) {
      setStats(cachedData.stats);
      setTodayJobs(cachedData.todayJobs);
      setRecentLeads(cachedData.recentLeads);
      setLoading(false);
    }

    // Fetch fresh data
    immediateFetch();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      debouncedFetch();
    }, 120000);

    return () => clearInterval(interval);
  }, [immediateFetch, debouncedFetch]);

  // OPTIMIZED: Memoize expensive calculations
  const formatDate = useMemo(() => (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const getPriorityColor = useMemo(() => (priority: string | null) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'VERY HIGH': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const handleJobClick = async (job: TodayJob) => {
    console.log('🔍 Job clicked:', job);
    try {
      // Fetch full job data with company information
      const { data: fullJobData, error } = await supabase
        .from("jobs")
        .select(`
          *,
          companies!inner(
            name,
            industry,
            head_office,
            company_size,
            website,
            lead_score,
            priority,
            automation_active,
            confidence_level,
            linkedin_url,
            score_reason
          )
        `)
        .eq("id", job.id)
        .single();

      console.log('🔍 Full job data:', fullJobData);
      console.log('🔍 Error:', error);

      if (error) throw error;

      const jobWithCompany = {
        ...fullJobData,
        company_name: fullJobData.companies?.name,
            company_logo_url: getCompanyLogoUrlSync(
              fullJobData.companies?.name || '',
              fullJobData.companies?.website
            )
      };
      
      console.log('🔍 Job with company:', jobWithCompany);
      openJobPopup(job.id);
    } catch (error) {
      console.error('Error fetching job details:', error);
      // Fallback to basic job data
      openJobPopup(job.id);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Good Morning! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening today and your key metrics</p>
        </div>
      </div>

      {/* Key Metrics - Mobile Optimized */}
      <CompactStats stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* New Jobs Today */}
        <Card className="shadow-sm !border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              New Jobs Today ({stats.newJobsToday})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {todayJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-4 w-4 mx-auto mb-2 opacity-50" />
                <p>No new jobs today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {job.company_logo_url ? (
                          <img 
                            src={job.company_logo_url} 
                            alt={job.company_name || 'Company'} 
                            className="w-8 h-8 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-500">
                              {job.company_name ? getStatusDisplayText(job.company_name.charAt(0)) : '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{job.title}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {job.company_name || 'Unknown Company'}
                          {job.location && ` • ${job.location}`}
                          {job.created_at && ` • ${new Date(job.created_at).toLocaleDateString()}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.lead_score_job && (
                          <AIScoreBadge
                            leadData={{
                              name: "Job Candidate",
                              company: job.company_name || "",
                              role: job.title || "",
                              location: job.location || "",
                              industry: "",
                              company_size: "Unknown"
                            }}
                            initialScore={job.lead_score_job}
                            showDetails={false}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New People */}
        <Card className="shadow-sm !border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              New People ({recentLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-4 w-4 mx-auto mb-2 opacity-50" />
                <p>No new people</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                    onClick={() => openLeadPopup(lead.id)}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const { avatarUrl, initials } = getProfileImage(lead.name, 32);
                        return (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                            <img 
                              src={avatarUrl} 
                              alt={lead.name || 'Lead'}
                              className="w-8 h-8 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                            <div 
                              className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold group-hover:bg-indigo-600 transition-colors"
                              style={{ display: 'none' }}
                            >
                              {initials}
                            </div>
                          </div>
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{lead.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {lead.company_role}
                          {lead.company_name && ` at ${lead.company_name}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={lead.lead_score || "Low"} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
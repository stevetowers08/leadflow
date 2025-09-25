import { useEffect, useState, useMemo, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { JobDetailPopup } from "@/components/JobDetailPopup";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
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

// Simple cache implementation for performance
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

interface DashboardStats {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  newJobsToday: number;
  expiringJobs: number;
}

interface TodayJob {
  id: string;
  "Job Title": string;
  Company: string;
  Logo: string | null;
  "Job Location": string | null;
  Industry: string | null;
  Function: string | null;
  "Lead Score": number | null;
  "Posted Date": string | null;
  "Valid Through": string | null;
  Priority: string | null;
  "Employment Type": string | null;
  "Seniority Level": string | null;
  Salary: string | null;
  "Job URL": string | null;
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
  const [selectedJob, setSelectedJob] = useState<TodayJob | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Check cache first
      const cachedData = getCachedData('dashboard');
      if (cachedData) {
        setStats(cachedData.stats);
        setTodayJobs(cachedData.todayJobs);
        setRecentLeads(cachedData.recentLeads);
        setLoading(false);
        return;
      }
      
      const today = new Date();
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      // OPTIMIZED: Fetch only counts, not full data
      const [leadsCount, companiesCount, jobsCount] = await Promise.all([
        supabase.from("people").select("id", { count: "exact", head: true }),
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
      ]);

      // Fetch jobs posted today
      const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      
      // OPTIMIZED: Fetch only essential fields for today's jobs
      const { data: todayJobsData } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          company_id,
          logo_url,
          location,
          industry,
          function,
          lead_score_job,
          posted_date,
          valid_through,
          priority,
          employment_type,
          seniority_level,
          salary,
          job_url,
          created_at
        `)
        .gte("created_at", todayStartOfDay)
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
        
        try {
          const expiryDate = parseDate(job.valid_through);
          return expiryDate <= sevenDaysFromNow && expiryDate >= today;
        } catch {
          return false;
        }
      }) || [];

      // OPTIMIZED: Fetch only essential fields for recent leads
      const { data: recentLeadsData } = await supabase
        .from("people")
        .select(`
          id,
          name,
          company_id,
          company_role,
          employee_location,
          stage,
          lead_score,
          created_at,
          companies!inner(name, profile_image_url)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      const statsData = {
        totalLeads: leadsCount.count || 0,
        totalCompanies: companiesCount.count || 0,
        totalJobs: jobsCount.count || 0,
        newJobsToday: todayJobsData?.length || 0,
        expiringJobs: expiringJobs.length,
      };

      // Transform recent leads data to include company info
      const transformedRecentLeads = recentLeadsData?.map(lead => ({
        ...lead,
        company_name: lead.companies?.name || null,
        company_logo_url: lead.companies?.profile_image_url || null
      })) || [];

      setStats(statsData);
      setTodayJobs(todayJobsData || []);
      setRecentLeads(transformedRecentLeads);
      
      // Cache the data
      setCachedData('dashboard', {
        stats: statsData,
        todayJobs: todayJobsData || [],
        recentLeads: transformedRecentLeads
      });

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // OPTIMIZED: Memoize expensive calculations
  const formatDate = useMemo(() => (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const getPriorityColor = useMemo(() => (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const handleJobClick = (job: TodayJob) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Good Morning! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening today and your key metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-base font-bold text-gray-900">{stats.totalLeads}</div>
                <div className="text-sm text-gray-600 font-medium">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Building2 className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-base font-bold text-gray-900">{stats.totalCompanies}</div>
                <div className="text-sm text-gray-600 font-medium">Companies</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Briefcase className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-base font-bold text-gray-900">{stats.totalJobs}</div>
                <div className="text-sm text-gray-600 font-medium">Total Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-base font-bold text-gray-900">{stats.newJobsToday}</div>
                <div className="text-sm text-gray-600 font-medium">New Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Jobs Today */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
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
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{job.title}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {job.company_id}
                          {job.location && ` • ${job.location}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.priority && (
                          <Badge className={`text-xs px-2 py-1 ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                          </Badge>
                        )}
                        {job.lead_score_job && (
                          <AIScoreBadge
                            leadData={{
                              name: "Job Candidate",
                              company: job.company_id || "",
                              role: job.title || "",
                              location: job.location || "",
                              industry: job.industry,
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/jobs')}
                >
                  View All Jobs
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Recent Leads ({recentLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-4 w-4 mx-auto mb-2 opacity-50" />
                <p>No recent leads</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/leads?filter=${encodeURIComponent(lead.name || "")}`)}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const { avatarUrl, initials } = getProfileImage(lead.name, 40);
                        return (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                            <img 
                              src={avatarUrl} 
                              alt={lead.name || 'Lead'}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                            <div 
                              className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold group-hover:bg-indigo-600 transition-colors"
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
                          {lead.company_id && ` at ${lead.company_id}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lead.lead_score && (
                          <AIScoreBadge
                            leadData={{
                              name: lead.name || "",
                              company: lead.company_id || "",
                              role: lead.company_role || "",
                              location: lead.employee_location || "",
                              industry: "",
                              company_size: "Unknown"
                            }}
                            initialScore={parseInt(lead.lead_score)}
                            showDetails={false}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/leads')}
                >
                  View All Leads
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expiring Jobs Alert */}
      {stats.expiringJobs > 0 && (
        <Card className="shadow-sm border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Jobs Expiring Soon</div>
                <div className="text-xs text-gray-600">
                  {stats.expiringJobs} jobs expire in the next 7 days
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/jobs')}
              >
                Review Jobs
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailPopup
          job={selectedJob}
          isOpen={isJobModalOpen}
          onClose={() => {
            setIsJobModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
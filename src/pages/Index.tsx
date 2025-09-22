import { useEffect, useState, useMemo, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { SimplifiedJobDetailModal } from "@/components/SimplifiedJobDetailModal";
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
  Name: string;
  Company: string | null;
  "Company Role": string | null;
  "Employee Location": string | null;
  Stage: string | null;
  stage_enum: string | null;
  "Lead Score": string | null;
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
        supabase.from("People").select("id", { count: "exact", head: true }),
        supabase.from("Companies").select("id", { count: "exact", head: true }),
        supabase.from("Jobs").select("id", { count: "exact", head: true }),
      ]);

      // Fetch jobs posted today
      const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      
      // OPTIMIZED: Fetch only essential fields for today's jobs
      const { data: todayJobsData } = await supabase
        .from("Jobs")
        .select(`
          id,
          "Job Title",
          Company,
          Logo,
          "Job Location",
          Industry,
          Function,
          "Lead Score",
          "Posted Date",
          "Valid Through",
          Priority,
          "Employment Type",
          "Seniority Level",
          Salary,
          "Job URL",
          created_at
        `)
        .gte("created_at", todayStartOfDay)
        .order("created_at", { ascending: false })
        .limit(5);

      // OPTIMIZED: Fetch only fields needed for expiring jobs calculation
      const { data: allJobs } = await supabase.from("Jobs").select("id, Priority, \"Valid Through\"");
      const expiringJobs = allJobs?.filter(job => {
        if (!job["Valid Through"]) return false;
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
          const expiryDate = parseDate(job["Valid Through"]);
          return expiryDate <= sevenDaysFromNow && expiryDate >= today;
        } catch {
          return false;
        }
      }) || [];

      // OPTIMIZED: Fetch only essential fields for recent leads
      const { data: recentLeadsData } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          "Company Role",
          "Employee Location",
          Stage,
          stage_enum,
          "Lead Score",
          priority_enum,
          automation_status_enum,
          created_at
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

      setStats(statsData);
      setTodayJobs(todayJobsData || []);
      setRecentLeads(recentLeadsData || []);
      
      // Cache the data
      setCachedData('dashboard', {
        stats: statsData,
        todayJobs: todayJobsData || [],
        recentLeads: recentLeadsData || []
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Good morning! Here's what's happening today.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{stats.totalLeads}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{stats.totalCompanies}</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{stats.totalJobs}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{stats.newJobsToday}</div>
                <div className="text-sm text-gray-600">New Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Jobs Today */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              New Jobs Today ({stats.newJobsToday})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {todayJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No new jobs today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-xs font-medium">
                        <Briefcase className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{job["Job Title"]}</div>
                        <div className="text-xs text-gray-600 truncate">
                          {job.Company}
                          {job["Job Location"] && ` • ${job["Job Location"]}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.Priority && (
                          <Badge className={`text-xs px-2 py-1 ${getPriorityColor(job.Priority)}`}>
                            {job.Priority}
                          </Badge>
                        )}
                        {job["Lead Score"] && (
                          <AIScoreBadge
                            leadData={{
                              name: "Job Candidate",
                              company: job.Company || "",
                              role: job["Job Title"] || "",
                              location: job["Job Location"] || "",
                              industry: job.Industry,
                              company_size: "Unknown"
                            }}
                            initialScore={job["Lead Score"]}
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
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recent Leads ({recentLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent leads</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/leads?filter=${encodeURIComponent(lead.Name || "")}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-xs font-medium">
                        {lead.Name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{lead.Name}</div>
                        <div className="text-xs text-gray-600 truncate">
                          {lead["Company Role"]}
                          {lead.Company && ` at ${lead.Company}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lead["Lead Score"] && (
                          <AIScoreBadge
                            leadData={{
                              name: lead.Name || "",
                              company: lead.Company || "",
                              role: lead["Company Role"] || "",
                              location: lead["Employee Location"] || "",
                              industry: "",
                              company_size: "Unknown"
                            }}
                            initialScore={parseInt(lead["Lead Score"])}
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
        <SimplifiedJobDetailModal
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
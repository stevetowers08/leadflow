import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Clock,
  AlertTriangle,
  Eye,
  ArrowRight,
  RefreshCw,
  Target,
  Zap,
  MessageSquare,
  UserPlus,
  CheckCircle,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  recentLeads: number;
  newJobsToday: number;
  expiringJobs: number;
  highPriorityJobs: number;
  activeAutomations: number;
}

interface TodayJob {
  id: string;
  "Job Title": string;
  Company: string;
  Logo: string | null;
  "Job Location": string | null;
  Industry: string | null;
  "Lead Score": number | null;
  "Posted Date": string | null;
  Priority: string | null;
  "Employment Type": string | null;
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
  priority_enum: string | null;
  automation_status_enum: string | null;
  created_at: string;
}

interface CompanyWithJobs {
  id: string;
  "Company Name": string;
  Industry: string | null;
  "Company Size": string | null;
  "Head Office": string | null;
  Logo: string | null;
  jobCount: number;
  leadCount: number;
  latestJobDate: string;
}

const OptimizedDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalCompanies: 0,
    totalJobs: 0,
    recentLeads: 0,
    newJobsToday: 0,
    expiringJobs: 0,
    highPriorityJobs: 0,
    activeAutomations: 0,
  });
  const [todayJobs, setTodayJobs] = useState<TodayJob[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [companiesWithJobs, setCompaniesWithJobs] = useState<CompanyWithJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      // OPTIMIZED: Only fetch essential fields for basic stats
      const [leadsCount, companiesCount, jobsCount, recentLeadsCount] = await Promise.all([
        supabase.from("People").select("id", { count: "exact", head: true }),
        supabase.from("Companies").select("id", { count: "exact", head: true }),
        supabase.from("Jobs").select("id", { count: "exact", head: true }),
        supabase
          .from("People")
          .select("id", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

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
          "Lead Score",
          "Posted Date",
          Priority,
          "Employment Type",
          created_at
        `)
        .gte("created_at", new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(10);

      // OPTIMIZED: Fetch only essential fields for expiring jobs
      const { data: allJobs } = await supabase
        .from("Jobs")
        .select("id, Priority, \"Valid Through\"");

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

      const highPriorityJobs = allJobs?.filter(job => job.Priority?.toLowerCase() === 'high').length || 0;

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
        .limit(8);

      // OPTIMIZED: Fetch only essential fields for companies
      const { data: companiesData } = await supabase
        .from("Companies")
        .select(`
          id,
          "Company Name",
          Industry,
          "Company Size",
          "Head Office",
          Logo
        `)
        .limit(6);

      // Get job counts for each company (optimized)
      const companiesWithJobCounts = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { data: companyJobs } = await supabase
            .from("Jobs")
            .select("created_at")
            .ilike("Company", `%${company["Company Name"]}%`)
            .order("created_at", { ascending: false });

          const { data: companyLeads } = await supabase
            .from("People")
            .select("id", { count: "exact", head: true })
            .ilike("Company", `%${company["Company Name"]}%`);

          return {
            ...company,
            jobCount: companyJobs?.length || 0,
            leadCount: companyLeads?.length || 0,
            latestJobDate: companyJobs?.[0]?.created_at || company.created_at
          };
        })
      );

      setStats({
        totalLeads: leadsCount.count || 0,
        totalCompanies: companiesCount.count || 0,
        totalJobs: jobsCount.count || 0,
        recentLeads: recentLeadsCount.count || 0,
        newJobsToday: todayJobsData?.length || 0,
        expiringJobs: expiringJobs.length,
        highPriorityJobs,
        activeAutomations: 0, // TODO: Implement automation tracking
      });

      setTodayJobs(todayJobsData || []);
      setRecentLeads(recentLeadsData || []);
      setCompaniesWithJobs(companiesWithJobCounts.sort((a, b) => b.jobCount - a.jobCount));

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleJobClick = (job: TodayJob) => {
    navigate(`/jobs`);
  };

  const handleCompanyClick = (company: CompanyWithJobs) => {
    navigate(`/companies`);
  };

  const handleLeadClick = (lead: RecentLead) => {
    navigate(`/leads`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Good Morning! 👋</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's new today and your key metrics
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="h-9 px-3"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics - Simplified */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50/50 border-blue-200/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentLeads} this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 border-green-200/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              In your network
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newJobsToday} posted today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/50 border-orange-200/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringJobs + stats.highPriorityJobs}</div>
            <p className="text-xs text-muted-foreground">
              Expiring + High Priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's New Jobs - Primary Focus */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    New Jobs Today
                  </CardTitle>
                  <CardDescription>
                    {stats.newJobsToday} jobs posted today - your morning priority
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/jobs')}
                  className="h-8 px-3"
                >
                  View All Jobs
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todayJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No new jobs posted today</p>
                  <p className="text-sm">Check back later or review existing jobs</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {job.Logo ? (
                              <img src={job.Logo} alt="Company logo" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-sm">{job["Job Title"]}</h3>
                              <p className="text-xs text-muted-foreground">{job.Company}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {job["Job Location"] && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job["Job Location"]}
                              </span>
                            )}
                            {job.Industry && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {job.Industry}
                              </span>
                            )}
                            {job["Employment Type"] && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {job["Employment Type"]}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Posted {formatDate(job.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.Priority && (
                            <StatusBadge status={job.Priority.toLowerCase()} size="sm" />
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
                              initialScore={job["Lead Score"] ? parseInt(job["Lead Score"]) : undefined}
                              showDetails={false}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Simplified */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/jobs')}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Review New Jobs
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/leads')}
              >
                <Users className="h-4 w-4 mr-2" />
                Check Lead Pipeline
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/companies')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Company Research
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/opportunities')}
              >
                <Target className="h-4 w-4 mr-2" />
                View Opportunities
              </Button>
            </CardContent>
          </Card>

          {/* Urgent Items */}
          {(stats.expiringJobs > 0 || stats.highPriorityJobs > 0) && (
            <Card className="shadow-sm border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Urgent Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.expiringJobs > 0 && (
                  <div className="flex items-center justify-between p-2 bg-orange-100 rounded">
                    <span className="text-sm font-medium">Jobs Expiring Soon</span>
                    <Badge variant="secondary">{stats.expiringJobs}</Badge>
                  </div>
                )}
                {stats.highPriorityJobs > 0 && (
                  <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                    <span className="text-sm font-medium">High Priority Jobs</span>
                    <Badge variant="destructive">{stats.highPriorityJobs}</Badge>
                  </div>
                )}
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => navigate('/jobs')}
                >
                  Review Urgent Items
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Leads - Simplified */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Leads
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/leads')}
                  className="h-7 px-2 text-xs"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.slice(0, 5).map((lead) => (
                  <div 
                    key={lead.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{lead.Name}</div>
                        <div className="text-xs text-muted-foreground">
                          {lead["Company Role"]} at {lead.Company}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lead["Employee Location"]}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {lead.stage_enum && (
                          <StatusBadge status={lead.stage_enum} size="sm" />
                        )}
                        {lead["Lead Score"] && (
                          <AIScoreBadge
                            leadData={{
                              name: lead.Name || "",
                              company: lead.Company || "",
                              role: lead["Company Role"] || "",
                              location: lead["Employee Location"] || "",
                              industry: "Unknown",
                              company_size: "Unknown"
                            }}
                            initialScore={lead["Lead Score"] ? parseInt(lead["Lead Score"]) : undefined}
                            showDetails={false}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Companies with Jobs - Simplified */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Companies with Active Jobs
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/companies')}
              className="h-8 px-3"
            >
              View All Companies
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <CardDescription>
            Companies with the most job postings - prioritize these for lead research
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companiesWithJobs.map((company) => (
              <div 
                key={company.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleCompanyClick(company)}
              >
                <div className="flex items-start gap-3">
                  {company.Logo ? (
                    <img src={company.Logo} alt="Company logo" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{company["Company Name"]}</h3>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {company.Industry && <div>{company.Industry}</div>}
                      {company["Company Size"] && <div>{company["Company Size"]} employees</div>}
                      {company["Head Office"] && <div>{company["Head Office"]}</div>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {company.jobCount} jobs
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {company.leadCount} leads
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedDashboard;

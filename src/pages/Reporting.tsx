import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Briefcase, 
  Target, 
  MessageCircle, 
  Mail, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from "lucide-react";
import { formatDistanceToNow, subDays, subWeeks, subMonths } from "date-fns";

interface ReportingStats {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  activeLeads: number;
  connectedLeads: number;
  repliedLeads: number;
  lostLeads: number;
  conversionRate: number;
  averageLeadScore: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  topPerformers: Array<{
    name: string;
    leadsCount: number;
  }>;
  stageDistribution: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  industryDistribution: Array<{
    industry: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const Reporting = () => {
  const [stats, setStats] = useState<ReportingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const { toast } = useToast();

  const fetchReportingData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected period
      let startDate: Date;
      switch (selectedPeriod) {
        case "7d":
          startDate = subDays(new Date(), 7);
          break;
        case "30d":
          startDate = subDays(new Date(), 30);
          break;
        case "90d":
          startDate = subDays(new Date(), 90);
          break;
        default:
          startDate = subDays(new Date(), 30);
      }

      // Fetch all data
      const [leadsResponse, companiesResponse, jobsResponse] = await Promise.all([
        supabase.from("People").select(`
          id,
          Name,
          Company,
          Stage,
          stage_enum,
          "Lead Score",
          Owner,
          "Last Contact Date",
          "Email Reply Date",
          "LinkedIn Connected",
          created_at
        `),
        supabase.from("Companies").select(`
          id,
          "Company Name",
          Industry,
          "Lead Score",
          created_at
        `),
        supabase.from("Jobs").select(`
          id,
          "Job Title",
          Company,
          "Posted Date",
          created_at
        `)
      ]);

      const leads = leadsResponse.data || [];
      const companies = companiesResponse.data || [];
      const jobs = jobsResponse.data || [];

      // Calculate metrics
      const totalLeads = leads.length;
      const totalCompanies = companies.length;
      const totalJobs = jobs.length;

      // Lead stage analysis
      const stageGroups = leads.reduce((acc, lead) => {
        const stage = lead.Stage || lead.stage_enum || 'NEW LEAD';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const activeLeads = leads.filter(lead => 
        !['LEAD LOST', 'LOST'].includes(lead.Stage || lead.stage_enum || '')
      ).length;
      
      const connectedLeads = leads.filter(lead => 
        ['CONNECTED', 'REPLIED'].includes(lead.Stage || lead.stage_enum || '')
      ).length;
      
      const repliedLeads = leads.filter(lead => 
        lead["Email Reply Date"] || ['REPLIED'].includes(lead.Stage || lead.stage_enum || '')
      ).length;
      
      const lostLeads = leads.filter(lead => 
        ['LEAD LOST', 'LOST'].includes(lead.Stage || lead.stage_enum || '')
      ).length;

      // Conversion rate (Connected + Replied / Total Active Leads)
      const conversionRate = activeLeads > 0 ? ((connectedLeads + repliedLeads) / activeLeads * 100) : 0;

      // Average lead score
      const scoresSum = leads.reduce((sum, lead) => {
        const score = parseInt(lead["Lead Score"] || "0");
        return sum + (isNaN(score) ? 0 : score);
      }, 0);
      const averageLeadScore = totalLeads > 0 ? scoresSum / totalLeads : 0;

      // Time-based metrics
      const oneWeekAgo = subWeeks(new Date(), 1);
      const oneMonthAgo = subMonths(new Date(), 1);
      
      const leadsThisWeek = leads.filter(lead => 
        new Date(lead.created_at) >= oneWeekAgo
      ).length;
      
      const leadsThisMonth = leads.filter(lead => 
        new Date(lead.created_at) >= oneMonthAgo
      ).length;

      // Top performers by assigned leads
      const ownerCounts = leads.reduce((acc, lead) => {
        if (lead.Owner) {
          acc[lead.Owner] = (acc[lead.Owner] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topPerformers = Object.entries(ownerCounts)
        .map(([name, count]) => ({ name, leadsCount: count }))
        .sort((a, b) => b.leadsCount - a.leadsCount)
        .slice(0, 5);

      // Stage distribution
      const stageDistribution = Object.entries(stageGroups)
        .map(([stage, count]) => ({
          stage,
          count,
          percentage: (count / totalLeads * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Industry distribution
      const industryGroups = companies.reduce((acc, company) => {
        const industry = company.Industry || 'Unknown';
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const industryDistribution = Object.entries(industryGroups)
        .map(([industry, count]) => ({
          industry,
          count,
          percentage: (count / totalCompanies * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Recent activity (mock data for demonstration)
      const recentActivity = [
        {
          id: "1",
          type: "lead_added",
          description: `${leadsThisWeek} new leads added this week`,
          timestamp: new Date().toISOString()
        },
        {
          id: "2", 
          type: "connection",
          description: `${connectedLeads} LinkedIn connections established`,
          timestamp: new Date().toISOString()
        },
        {
          id: "3",
          type: "reply",
          description: `${repliedLeads} email replies received`,
          timestamp: new Date().toISOString()
        }
      ];

      setStats({
        totalLeads,
        totalCompanies,
        totalJobs,
        activeLeads,
        connectedLeads,
        repliedLeads,
        lostLeads,
        conversionRate,
        averageLeadScore,
        leadsThisWeek,
        leadsThisMonth,
        topPerformers,
        stageDistribution,
        industryDistribution,
        recentActivity
      });

    } catch (error) {
      console.error("Error fetching reporting data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reporting data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportingData();
  }, [selectedPeriod]);

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h1 className="text-lg font-semibold tracking-tight">Reporting & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Performance metrics and insights</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Reporting & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Performance metrics and business insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchReportingData} size="sm" variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalLeads}</div>
            <p className="text-xs text-blue-700 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.leadsThisWeek} added this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-green-700">
              {stats.connectedLeads} connected + {stats.repliedLeads} replied
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              Active Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.totalCompanies}</div>
            <p className="text-xs text-purple-700">
              {stats.totalJobs} open job postings
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              Lead Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.averageLeadScore.toFixed(0)}</div>
            <p className="text-xs text-orange-700">Average lead score</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <PieChart className="h-4 w-4" />
              Pipeline Stage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.stageDistribution.map((stage, index) => (
              <div key={stage.stage} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: `hsl(${index * 50}, 60%, 60%)` }}
                  />
                  <span className="text-sm font-medium">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{stage.count}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stage.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Industries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              Top Industries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.industryDistribution.map((industry, index) => (
              <div key={industry.industry} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 45 + 200}, 55%, 55%)` }}
                  />
                  <span className="text-sm font-medium truncate">{industry.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{industry.count}</span>
                  <Badge variant="outline" className="text-xs">
                    {industry.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topPerformers.length > 0 ? (
              <div className="space-y-3">
                {stats.topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          {performer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{performer.name}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {performer.leadsCount} leads
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No assigned leads yet</div>
                <div className="text-xs">Assign leads to team members to track performance</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/20">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs mt-0.5">
                  <Activity className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{activity.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900">Active Leads</p>
                <p className="text-xl font-bold text-emerald-900">{stats.activeLeads}</p>
                <p className="text-xs text-emerald-700">In pipeline</p>
              </div>
              <Target className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-900">Lost Leads</p>
                <p className="text-xl font-bold text-rose-900">{stats.lostLeads}</p>
                <p className="text-xs text-rose-700">Need attention</p>
              </div>
              <TrendingDown className="h-8 w-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-900">This Month</p>
                <p className="text-xl font-bold text-cyan-900">{stats.leadsThisMonth}</p>
                <p className="text-xs text-cyan-700">New leads added</p>
              </div>
              <Calendar className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reporting;
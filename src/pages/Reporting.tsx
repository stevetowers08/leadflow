import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { DataTable } from "@/components/DataTable";
import { AIScoreBadge } from "@/components/AIScoreBadge";
import { 
  Search, 
  X, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Building2, 
  Briefcase,
  BarChart3,
  PieChart,
  Activity,
  Target,
  MessageSquare,
  UserPlus,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Eye,
  Filter,
  RefreshCw,
  TrendingDown,
  DollarSign,
  Percent,
  Timer,
  Mail,
  Phone,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PauseCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/utils/exportUtils";

interface ReportData {
  totalLeads: number;
  activeCampaigns: number;
  openJobs: number;
  conversionRate: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  companies: number;
  avgResponseTime: number;
  totalRevenue: number;
  avgDealSize: number;
  winRate: number;
  salesCycle: number;
}

interface LeadReport {
  id: string;
  name: string;
  company: string;
  stage: string;
  created_at: string;
  last_contact: string;
  lead_score: number;
  conversion_date?: string;
  "Message Sent"?: boolean;
  "Message Sent Date"?: string;
  "Connection Request"?: boolean;
  "Connection Request Date"?: string;
  "Connection Accepted Date"?: string;
  "LinkedIn Responded"?: boolean;
  "Response Date"?: string;
  "Email Sent"?: boolean;
  "Email Sent Date"?: string;
  "Email Reply"?: boolean;
  "Email Reply Date"?: string;
  "Meeting Booked"?: boolean;
  "Meeting Date"?: string;
  automation_status_enum?: string;
}

interface TimeSeriesData {
  date: string;
  leads: number;
  connections: number;
  responses: number;
  meetings: number;
  conversions: number;
}

interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface PerformanceMetrics {
  responseRate: number;
  connectionRate: number;
  meetingRate: number;
  conversionRate: number;
  avgResponseTime: number;
  avgConnectionTime: number;
  avgMeetingTime: number;
}

interface CompanyPerformance {
  company: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  avgScore: number;
}

export default function Reporting() {
  const [reportData, setReportData] = useState<ReportData>({
    totalLeads: 0,
    activeCampaigns: 0,
    openJobs: 0,
    conversionRate: 0,
    leadsThisMonth: 0,
    leadsLastMonth: 0,
    companies: 0,
    avgResponseTime: 0,
    totalRevenue: 0,
    avgDealSize: 0,
    winRate: 0,
    salesCycle: 0,
  });
  const [leadReports, setLeadReports] = useState<LeadReport[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnelData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    responseRate: 0,
    connectionRate: 0,
    meetingRate: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    avgConnectionTime: 0,
    avgMeetingTime: 0,
  });
  const [companyPerformance, setCompanyPerformance] = useState<CompanyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<string>("overview");
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
    
    // Auto-refresh every 3 minutes
    const interval = setInterval(() => {
      fetchReportData();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch comprehensive leads data
      const { data: leadsData, error: leadsError } = await supabase
        .from("People")
        .select(`
          id, 
          Name, 
          Company, 
          Stage, 
          stage_enum, 
          created_at, 
          "Lead Score",
          "Message Sent",
          "Message Sent Date",
          "Connection Request",
          "Connection Request Date",
          "Connection Accepted Date",
          "LinkedIn Responded",
          "Response Date",
          "Email Sent",
          "Email Sent Date",
          "Email Reply",
          "Email Reply Date",
          "Meeting Booked",
          "Meeting Date",
          automation_status_enum
        `);

      if (leadsError) throw leadsError;

      // Fetch jobs and companies data
      const [jobsResult, companiesResult] = await Promise.all([
        supabase.from("Jobs").select("id, status_enum, Company"),
        supabase.from("Companies").select("id, \"Company Name\"")
      ]);

      if (jobsResult.error) throw jobsResult.error;
      if (companiesResult.error) throw companiesResult.error;

      const jobsData = jobsResult.data || [];
      const companiesData = companiesResult.data || [];

      // Calculate comprehensive metrics
      const totalLeads = leadsData?.length || 0;
      const openJobs = jobsData.filter(job => job.status_enum === 'active').length;
      const companies = companiesData.length;
      
      // Calculate conversion metrics
      const qualifiedLeads = leadsData?.filter(lead => 
        lead.Stage === 'qualified' || lead.stage_enum === 'qualified'
      ).length || 0;
      const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;

      // Calculate monthly growth
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const leadsThisMonth = leadsData?.filter(lead => 
        new Date(lead.created_at) >= thisMonth
      ).length || 0;

      const leadsLastMonth = leadsData?.filter(lead => {
        const createdDate = new Date(lead.created_at);
        return createdDate >= lastMonth && createdDate <= endLastMonth;
      }).length || 0;

      // Calculate performance metrics
      const totalMessages = leadsData?.filter(lead => lead["Message Sent"]).length || 0;
      const totalConnections = leadsData?.filter(lead => lead["Connection Request"]).length || 0;
      const totalResponses = leadsData?.filter(lead => lead["LinkedIn Responded"]).length || 0;
      const totalMeetings = leadsData?.filter(lead => lead["Meeting Booked"]).length || 0;

      const responseRate = totalMessages > 0 ? (totalResponses / totalMessages) * 100 : 0;
      const connectionRate = totalMessages > 0 ? (totalConnections / totalMessages) * 100 : 0;
      const meetingRate = totalConnections > 0 ? (totalMeetings / totalConnections) * 100 : 0;

      // Calculate average response time
      const responseTimes = leadsData?.filter(lead => 
        lead["Message Sent Date"] && lead["Response Date"]
      ).map(lead => {
        const sentDate = new Date(lead["Message Sent Date"]);
        const responseDate = new Date(lead["Response Date"]);
        return (responseDate.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24);
      }) || [];

      const avgResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
        : 0;

      // Calculate active campaigns
      const activeCampaigns = leadsData?.filter(lead => 
        lead.automation_status_enum && lead.automation_status_enum !== 'idle'
      ).length || 0;

      // Mock revenue data (would come from actual sales data)
      const totalRevenue = totalMeetings * 50000; // $50k average deal
      const avgDealSize = totalMeetings > 0 ? totalRevenue / totalMeetings : 0;
      const winRate = totalMeetings > 0 ? (qualifiedLeads / totalMeetings) * 100 : 0;
      const salesCycle = 45; // Average days

      setReportData({
        totalLeads,
        activeCampaigns,
        openJobs,
        conversionRate,
        leadsThisMonth,
        leadsLastMonth,
        companies,
        avgResponseTime,
        totalRevenue,
        avgDealSize,
        winRate,
        salesCycle,
      });

      // Set performance metrics
      setPerformanceMetrics({
        responseRate,
        connectionRate,
        meetingRate,
        conversionRate,
        avgResponseTime,
        avgConnectionTime: avgResponseTime * 0.7, // Mock data
        avgMeetingTime: avgResponseTime * 1.5, // Mock data
      });

      // Process lead reports
      const processedReports: LeadReport[] = (leadsData || []).map(lead => ({
        id: lead.id,
        name: lead.Name || "Unknown",
        company: lead.Company || "Unknown",
        stage: lead.Stage || lead.stage_enum || "NEW LEAD",
        created_at: lead.created_at,
        last_contact: lead["Message Sent Date"] || lead["Connection Request Date"] || lead.created_at,
        lead_score: parseInt(lead["Lead Score"]) || 0,
        conversion_date: lead["Meeting Date"],
        "Message Sent": lead["Message Sent"],
        "Message Sent Date": lead["Message Sent Date"],
        "Connection Request": lead["Connection Request"],
        "Connection Request Date": lead["Connection Request Date"],
        "Connection Accepted Date": lead["Connection Accepted Date"],
        "LinkedIn Responded": lead["LinkedIn Responded"],
        "Response Date": lead["Response Date"],
        "Email Sent": lead["Email Sent"],
        "Email Sent Date": lead["Email Sent Date"],
        "Email Reply": lead["Email Reply"],
        "Email Reply Date": lead["Email Reply Date"],
        "Meeting Booked": lead["Meeting Booked"],
        "Meeting Date": lead["Meeting Date"],
        automation_status_enum: lead.automation_status_enum,
      }));

      setLeadReports(processedReports);

      // Generate time series data (last 30 days)
      const timeSeries: TimeSeriesData[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayLeads = leadsData?.filter(lead => 
          lead.created_at.startsWith(dateStr)
        ).length || 0;
        
        const dayConnections = leadsData?.filter(lead => 
          lead["Connection Request Date"]?.startsWith(dateStr)
        ).length || 0;
        
        const dayResponses = leadsData?.filter(lead => 
          lead["Response Date"]?.startsWith(dateStr)
        ).length || 0;
        
        const dayMeetings = leadsData?.filter(lead => 
          lead["Meeting Date"]?.startsWith(dateStr)
        ).length || 0;
        
        const dayConversions = leadsData?.filter(lead => 
          lead.created_at.startsWith(dateStr) && 
          (lead.Stage === 'qualified' || lead.stage_enum === 'qualified')
        ).length || 0;
        
        timeSeries.push({
          date: dateStr,
          leads: dayLeads,
          connections: dayConnections,
          responses: dayResponses,
          meetings: dayMeetings,
          conversions: dayConversions,
        });
      }
      setTimeSeriesData(timeSeries);

      // Generate conversion funnel
      const funnelStages = [
        { stage: "New Leads", count: totalLeads, color: "bg-blue-500" },
        { stage: "Messages Sent", count: totalMessages, color: "bg-purple-500" },
        { stage: "Connections", count: totalConnections, color: "bg-indigo-500" },
        { stage: "Responses", count: totalResponses, color: "bg-green-500" },
        { stage: "Meetings", count: totalMeetings, color: "bg-yellow-500" },
        { stage: "Qualified", count: qualifiedLeads, color: "bg-red-500" },
      ];

      const funnelData: ConversionFunnelData[] = funnelStages.map((stage, index) => {
        const previousCount = index > 0 ? funnelStages[index - 1].count : totalLeads;
        const percentage = previousCount > 0 ? (stage.count / previousCount) * 100 : 0;
        
        return {
          stage: stage.stage,
          count: stage.count,
          percentage: percentage,
          color: stage.color,
        };
      });
      
      setConversionFunnel(funnelData);

      // Generate company performance data
      const companyStats: Record<string, { leads: number; conversions: number; scores: number[] }> = {};
      
      leadsData?.forEach(lead => {
        const company = lead.Company || "Unknown";
        if (!companyStats[company]) {
          companyStats[company] = { leads: 0, conversions: 0, scores: [] };
        }
        companyStats[company].leads++;
        if (lead.Stage === 'qualified' || lead.stage_enum === 'qualified') {
          companyStats[company].conversions++;
        }
        if (lead["Lead Score"]) {
          companyStats[company].scores.push(parseInt(lead["Lead Score"]));
        }
      });

      const companyPerformanceData: CompanyPerformance[] = Object.entries(companyStats)
        .map(([company, stats]) => ({
          company,
          leads: stats.leads,
          conversions: stats.conversions,
          conversionRate: stats.leads > 0 ? (stats.conversions / stats.leads) * 100 : 0,
          avgScore: stats.scores.length > 0 
            ? stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length 
            : 0,
        }))
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 10);

      setCompanyPerformance(companyPerformanceData);

    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = leadReports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = !stageFilter || report.stage.toLowerCase() === stageFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const reportDate = new Date(report.created_at);
      const now = new Date();
      
      switch (dateRange) {
        case "today":
          matchesDate = reportDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = reportDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          matchesDate = reportDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStage && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStageFilter("");
    setDateRange("all");
  };

  const exportReports = () => {
    exportToCSV(filteredReports, { filename: "lead-reports-export.csv" });
    toast({
      title: "Export Complete",
      description: "Lead reports exported successfully",
    });
  };

  const getGrowthIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="h-3 w-3 text-green-600" />;
    if (current < previous) return <ArrowDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-600" />;
  };

  const getGrowthColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-600";
    if (current < previous) return "text-red-600";
    return "text-gray-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comprehensive reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Advanced Analytics & Reporting</h1>
          <p className="text-gray-600">Comprehensive insights into your lead generation and conversion performance</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownSelect
            options={[
              { label: "Overview", value: "overview" },
              { label: "Performance", value: "performance" },
              { label: "Revenue", value: "revenue" },
              { label: "Companies", value: "companies" }
            ]}
            value={selectedMetric}
            onValueChange={setSelectedMetric}
            placeholder="View"
          />
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{reportData.totalLeads}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
                <div className="flex items-center gap-1 text-xs">
                  {getGrowthIcon(reportData.leadsThisMonth, reportData.leadsLastMonth)}
                  <span className={getGrowthColor(reportData.leadsThisMonth, reportData.leadsLastMonth)}>
                    {reportData.leadsThisMonth} this month
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{reportData.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
                <div className="text-xs text-gray-500">Qualified leads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{formatCurrency(reportData.totalRevenue)}</div>
                <div className="text-sm text-gray-600">Pipeline Value</div>
                <div className="text-xs text-gray-500">Estimated revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Timer className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{reportData.salesCycle}</div>
                <div className="text-sm text-gray-600">Sales Cycle</div>
                <div className="text-xs text-gray-500">Average days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{performanceMetrics.responseRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
                <div className="text-xs text-gray-500">LinkedIn responses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <UserPlus className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{performanceMetrics.connectionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Connection Rate</div>
                <div className="text-xs text-gray-500">Accepted connections</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{performanceMetrics.meetingRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Meeting Rate</div>
                <div className="text-xs text-gray-500">Meetings booked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold">{performanceMetrics.avgResponseTime.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
                <div className="text-xs text-gray-500">Days to respond</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{stage.count}</span>
                      {index > 0 && (
                        <span className="text-xs text-gray-500">
                          ({stage.percentage.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${stage.color}`}
                      style={{ width: `${(stage.count / conversionFunnel[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Trends Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Activity Trends (30 Days)
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant={selectedMetric === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("bar")}
                  className="h-6 px-2 text-xs"
                >
                  Bar
                </Button>
                <Button
                  variant={selectedMetric === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("line")}
                  className="h-6 px-2 text-xs"
                >
                  Line
        </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {selectedMetric === "bar" ? (
              // Vertical Bar Chart
              <div className="space-y-4">
                <div className="flex items-end justify-between h-48 gap-1">
                  {timeSeriesData.slice(-7).map((data, index) => {
                    const maxValue = Math.max(
                      ...timeSeriesData.slice(-7).map(d => Math.max(d.leads, d.connections, d.responses, d.meetings))
                    );
                    
                    return (
                      <div key={data.date} className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex flex-col items-center gap-1 h-40 justify-end">
                          {/* Leads Bar */}
                          <div 
                            className="w-full bg-blue-500 rounded-t-sm"
                            style={{ height: `${(data.leads / maxValue) * 100}%` }}
                            title={`Leads: ${data.leads}`}
                          ></div>
                          {/* Connections Bar */}
                          <div 
                            className="w-full bg-green-500"
                            style={{ height: `${(data.connections / maxValue) * 100}%` }}
                            title={`Connections: ${data.connections}`}
                          ></div>
                          {/* Responses Bar */}
                          <div 
                            className="w-full bg-purple-500"
                            style={{ height: `${(data.responses / maxValue) * 100}%` }}
                            title={`Responses: ${data.responses}`}
                          ></div>
                          {/* Meetings Bar */}
                          <div 
                            className="w-full bg-yellow-500 rounded-b-sm"
                            style={{ height: `${(data.meetings / maxValue) * 100}%` }}
                            title={`Meetings: ${data.meetings}`}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span>Leads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span>Connections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                    <span>Responses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                    <span>Meetings</span>
                  </div>
                </div>
              </div>
            ) : (
              // Line Chart
              <div className="space-y-4">
                <div className="relative h-48">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Data points and lines */}
                    {timeSeriesData.slice(-7).map((data, index) => {
                      const x = (index / 6) * 360 + 20;
                      const maxValue = Math.max(
                        ...timeSeriesData.slice(-7).map(d => Math.max(d.leads, d.connections, d.responses, d.meetings))
                      );
                      
                      const leadsY = 180 - (data.leads / maxValue) * 160;
                      const connectionsY = 180 - (data.connections / maxValue) * 160;
                      const responsesY = 180 - (data.responses / maxValue) * 160;
                      const meetingsY = 180 - (data.meetings / maxValue) * 160;
                      
                      return (
                        <g key={data.date}>
                          {/* Leads line and point */}
                          <circle cx={x} cy={leadsY} r="3" fill="#3b82f6" />
                          {/* Connections line and point */}
                          <circle cx={x} cy={connectionsY} r="3" fill="#10b981" />
                          {/* Responses line and point */}
                          <circle cx={x} cy={responsesY} r="3" fill="#8b5cf6" />
                          {/* Meetings line and point */}
                          <circle cx={x} cy={meetingsY} r="3" fill="#f59e0b" />
                        </g>
                      );
                    })}
                    
                    {/* Lines connecting points */}
                    {timeSeriesData.slice(-7).map((data, index) => {
                      if (index === 0) return null;
                      const x1 = ((index - 1) / 6) * 360 + 20;
                      const x2 = (index / 6) * 360 + 20;
                      const maxValue = Math.max(
                        ...timeSeriesData.slice(-7).map(d => Math.max(d.leads, d.connections, d.responses, d.meetings))
                      );
                      
                      const prevData = timeSeriesData.slice(-7)[index - 1];
                      const leadsY1 = 180 - (prevData.leads / maxValue) * 160;
                      const leadsY2 = 180 - (data.leads / maxValue) * 160;
                      const connectionsY1 = 180 - (prevData.connections / maxValue) * 160;
                      const connectionsY2 = 180 - (data.connections / maxValue) * 160;
                      const responsesY1 = 180 - (prevData.responses / maxValue) * 160;
                      const responsesY2 = 180 - (data.responses / maxValue) * 160;
                      const meetingsY1 = 180 - (prevData.meetings / maxValue) * 160;
                      const meetingsY2 = 180 - (data.meetings / maxValue) * 160;
                      
                      return (
                        <g key={`lines-${index}`}>
                          <line x1={x1} y1={leadsY1} x2={x2} y2={leadsY2} stroke="#3b82f6" strokeWidth="2" />
                          <line x1={x1} y1={connectionsY1} x2={x2} y2={connectionsY2} stroke="#10b981" strokeWidth="2" />
                          <line x1={x1} y1={responsesY1} x2={x2} y2={responsesY2} stroke="#8b5cf6" strokeWidth="2" />
                          <line x1={x1} y1={meetingsY1} x2={x2} y2={meetingsY2} stroke="#f59e0b" strokeWidth="2" />
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-5">
                    {timeSeriesData.slice(-7).map((data, index) => (
                      <div key={data.date} className="text-xs text-gray-600">
                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    <span>Leads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-green-500"></div>
                    <span>Connections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-purple-500"></div>
                    <span>Responses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-yellow-500"></div>
                    <span>Meetings</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Company Performance */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Top Performing Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {companyPerformance.map((company, index) => (
              <div key={company.company} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{company.company}</div>
                  <div className="text-xs text-gray-600">
                    {company.leads} leads • {company.conversions} conversions
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{company.conversionRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{company.avgScore.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
        
        <DropdownSelect
          options={[
            { label: "All Stages", value: "all" },
            { label: "New Lead", value: "new lead" },
            { label: "Contacted", value: "contacted" },
            { label: "Qualified", value: "qualified" },
            { label: "Interview", value: "interview" }
          ]}
          value={stageFilter || "all"}
          onValueChange={(value) => setStageFilter(value === "all" ? "" : value)}
          placeholder="Filter by stage"
        />
        
        <DropdownSelect
          options={[
            { label: "All Time", value: "all" },
            { label: "Today", value: "today" },
            { label: "This Week", value: "week" },
            { label: "This Month", value: "month" }
          ]}
          value={dateRange}
          onValueChange={setDateRange}
          placeholder="Date range"
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3"
          onClick={clearFilters}
          disabled={!searchTerm && !stageFilter && dateRange === "all"}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3"
          onClick={exportReports}
        >
          <Download className="h-3 w-3 mr-1" />
          Export
        </Button>
      </div>

      {/* Lead Reports Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Detailed Lead Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
      <DataTable
        data={filteredReports}
            columns={[
              {
                key: "name",
                label: "Lead Name",
                render: (report: LeadReport) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{report.name}</span>
                    <span className="text-xs text-gray-600">{report.company}</span>
                  </div>
                ),
              },
              {
                key: "stage",
                label: "Stage",
                render: (report: LeadReport) => (
                  <span className="text-sm">{report.stage}</span>
                ),
              },
              {
                key: "lead_score",
                label: "AI Score",
                headerAlign: "center",
                cellAlign: "center",
                render: (report: LeadReport) => (
                  <div className="text-center">
                    <AIScoreBadge
                      leadData={{
                        name: report.name,
                        company: report.company,
                        role: "",
                        location: "",
                        industry: "",
                        company_size: "Unknown"
                      }}
                      initialScore={report.lead_score}
                      showDetails={false}
                    />
                  </div>
                ),
              },
              {
                key: "created_at",
                label: "Created",
                render: (report: LeadReport) => (
                  <span className="text-sm text-gray-600">
                    {formatDate(report.created_at)}
                  </span>
                ),
              },
              {
                key: "last_contact",
                label: "Last Activity",
                render: (report: LeadReport) => (
                  <span className="text-sm text-gray-600">
                    {formatDate(report.last_contact)}
                  </span>
                ),
              },
              {
                key: "automation_status",
                label: "Automation",
                render: (report: LeadReport) => {
                  const status = report.automation_status_enum || "idle";
                  let color = "bg-gray-100 text-gray-700";
                  let icon = <Activity className="h-3 w-3" />;
                  
                  if (status === "running") {
                    color = "bg-green-100 text-green-700";
                    icon = <CheckCircle className="h-3 w-3" />;
                  } else if (status === "completed") {
                    color = "bg-blue-100 text-blue-700";
                    icon = <CheckCircle className="h-3 w-3" />;
                  } else if (status === "paused") {
                    color = "bg-yellow-100 text-yellow-700";
                    icon = <PauseCircle className="h-3 w-3" />;
                  }
                  
                  return (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                      {icon}
                      <span className="capitalize">{status}</span>
                    </div>
                  );
                },
              },
            ]}
        loading={loading}
        enableExport={true}
        exportFilename="lead-reports-export.csv"
        pagination={{
          enabled: true,
              pageSize: 10,
          showPageSizeSelector: true,
          showItemCount: true,
        }}
      />
        </CardContent>
      </Card>
    </div>
  );
}
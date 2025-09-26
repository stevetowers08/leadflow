import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
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
  Brain,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { formatDistanceToNow, subDays, subWeeks, subMonths } from "date-fns";
import { getLabel } from '@/utils/labels';

interface ReportingStats {
  totalLeads: number;
  totalCompanies: number;
  totalJobs: number;
  activeLeads: number;
  connectedLeads: number;
  repliedLeads: number;
  lostLeads: number;
  conversionRate: number;
  averageAILeadScore: number;
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
  automationMetrics: {
    totalAutomationStarted: number;
    automationRate: number;
    automationByStage: Array<{
      stage: string;
      count: number;
      automationActive: number;
    }>;
  };
  dailyTrends: Array<{
    date: string;
    newLeads: number;
    automationsStarted: number;
  }>;
  topCompanies: Array<{
    companyName: string;
    industry: string;
    leadCount: number;
    automationActive: number;
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
      
      // Verify authentication status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', { session: !!session, user: session?.user?.email, error: sessionError });
      
      if (!session) {
        console.log('No session found - user needs to authenticate');
        throw new Error('Authentication required. Please sign in to view reporting data.');
      }
      
      console.log('Fetching data for user:', session.user.email);
      
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

      // Fetch comprehensive data
      const [leadsResponse, companiesResponse, jobsResponse] = await Promise.all([
        supabase.from("people").select(`
          id,
          name,
          company_id,
          email_address,
          linkedin_url,
          stage,
          lead_score,
          owner_id,
          connected_at,
          last_reply_at,
          last_interaction_at,
          automation_started_at,
          created_at
        `),
        supabase.from("companies").select(`
          id,
          name,
          industry,
          lead_score,
          created_at
        `),
        supabase.from("jobs").select(`
          id,
          title,
          company_id,
          posted_date,
          created_at
        `)
      ]);

      // Check for errors in responses
      console.log('Query responses:', {
        leads: { data: leadsResponse.data?.length, error: leadsResponse.error },
        companies: { data: companiesResponse.data?.length, error: companiesResponse.error },
        jobs: { data: jobsResponse.data?.length, error: jobsResponse.error }
      });

      if (leadsResponse.error) {
        console.error('Leads query error:', leadsResponse.error);
        throw new Error(`Failed to fetch leads: ${leadsResponse.error.message}`);
      }
      if (companiesResponse.error) {
        console.error('Companies query error:', companiesResponse.error);
        throw new Error(`Failed to fetch companies: ${companiesResponse.error.message}`);
      }
      if (jobsResponse.error) {
        console.error('Jobs query error:', jobsResponse.error);
        throw new Error(`Failed to fetch jobs: ${jobsResponse.error.message}`);
      }

      const leads = leadsResponse.data || [];
      const companies = companiesResponse.data || [];
      const jobs = jobsResponse.data || [];

      // Debug logging to verify data
      console.log('Reporting Data Verification:', {
        totalLeads: leads.length,
        totalCompanies: companies.length,
        totalJobs: jobs.length,
        automationStarted: leads.filter(lead => lead.automation_started_at).length,
        stageBreakdown: leads.reduce((acc, lead) => {
          acc[lead.stage || 'new'] = (acc[lead.stage || 'new'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

      // Calculate basic metrics
      const totalLeads = leads.length;
      const totalCompanies = companies.length;
      const totalJobs = jobs.length;

      // Lead stage analysis
      const stageGroups = leads.reduce((acc, lead) => {
        const stage = lead.stage || 'new';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const activeLeads = leads.filter(lead => 
        !['lead_lost', 'disqualified'].includes(lead.stage || '')
      ).length;
      
      const connectedLeads = leads.filter(lead => 
        ['connected', 'messaged', 'replied'].includes(lead.stage || '')
      ).length;
      
      const repliedLeads = leads.filter(lead => 
        lead.last_reply_at || ['replied'].includes(lead.stage || '')
      ).length;
      
      const lostLeads = leads.filter(lead => 
        ['lead_lost', 'disqualified'].includes(lead.stage || '')
      ).length;

      // Conversion rate
      const conversionRate = activeLeads > 0 ? ((connectedLeads + repliedLeads) / activeLeads * 100) : 0;

      // Average AI lead score
      const scoresSum = leads.reduce((sum, lead) => {
        const score = parseInt(lead.lead_score || "0");
        return sum + (isNaN(score) ? 0 : score);
      }, 0);
      const averageAILeadScore = totalLeads > 0 ? scoresSum / totalLeads : 0;

      // Time-based metrics
      const oneWeekAgo = subWeeks(new Date(), 1);
      const oneMonthAgo = subMonths(new Date(), 1);
      
      const leadsThisWeek = leads.filter(lead => 
        new Date(lead.created_at) >= oneWeekAgo
      ).length;
      
      const leadsThisMonth = leads.filter(lead => 
        new Date(lead.created_at) >= oneMonthAgo
      ).length;

      // Automation metrics
      const totalAutomationStarted = leads.filter(lead => lead.automation_started_at).length;
      const automationRate = totalLeads > 0 ? (totalAutomationStarted / totalLeads * 100) : 0;

      // Automation by stage
      const automationByStage = Object.entries(stageGroups).map(([stage, count]) => ({
        stage,
        count,
        automationActive: leads.filter(lead => lead.stage === stage && lead.automation_started_at).length
      }));

      // Top performers by assigned leads
      const ownerCounts = leads.reduce((acc, lead) => {
        if (lead.owner_id) {
          acc[lead.owner_id] = (acc[lead.owner_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topPerformers = Object.entries(ownerCounts)
        .map(([userId, count]) => ({ 
          name: `User ${userId.slice(0, 8)}`, 
          leadsCount: count 
        }))
        .sort((a, b) => b.leadsCount - a.leadsCount)
        .slice(0, 5);

      // Stage distribution with better labels
      const stageLabels: Record<string, string> = {
        'new': 'New Lead',
        'connection_requested': 'Connection Requested',
        'connected': 'Connected',
        'messaged': 'Messaged',
        'replied': 'Replied',
        'meeting_booked': 'Meeting Booked',
        'meeting_held': 'Meeting Held',
        'disqualified': 'Disqualified',
        'in queue': 'In Queue',
        'lead_lost': 'Lead Lost'
      };

      const stageDistribution = Object.entries(stageGroups)
        .map(([stage, count]) => ({
          stage: stageLabels[stage] || stage,
          count,
          percentage: (count / totalLeads * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Industry distribution
      const industryGroups = companies.reduce((acc, company) => {
        const industry = company.industry || 'Unknown';
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

      // Debug logging for industry distribution
      console.log('Top Industries:', industryDistribution.slice(0, 5));

      // Top companies by lead count
      const companyLeadCounts = leads.reduce((acc, lead) => {
        if (lead.company_id) {
          const company = companies.find(c => c.id === lead.company_id);
          if (company) {
            const companyName = company.name;
            if (!acc[companyName]) {
              acc[companyName] = {
                companyName,
                industry: company.industry || 'Unknown',
                leadCount: 0,
                automationActive: 0
              };
            }
            acc[companyName].leadCount++;
            if (lead.automation_started_at) {
              acc[companyName].automationActive++;
            }
          }
        }
        return acc;
      }, {} as Record<string, any>);

      const topCompanies = Object.values(companyLeadCounts)
        .sort((a: any, b: any) => b.leadCount - a.leadCount)
        .slice(0, 10);

      // Daily trends (last 30 days)
      const dailyTrends = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const newLeads = leads.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= dayStart && leadDate <= dayEnd;
        }).length;
        
        const automationsStarted = leads.filter(lead => {
          if (!lead.automation_started_at) return false;
          const autoDate = new Date(lead.automation_started_at);
          return autoDate >= dayStart && autoDate <= dayEnd;
        }).length;
        
        dailyTrends.push({
          date: dayStart.toISOString().split('T')[0],
          newLeads,
          automationsStarted
        });
      }

      // Debug logging for daily trends
      console.log('Daily Trends (Last 7 days):', dailyTrends.slice(-7));

      // Recent activity
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
          description: `${stageDistribution.find(s => s.stage === 'Connection Requested')?.count || 0} connection requests sent`,
          timestamp: new Date().toISOString()
        },
        {
          id: "3",
          type: "reply",
          description: `${repliedLeads} responses received`,
          timestamp: new Date().toISOString()
        },
        {
          id: "4",
          type: "automation",
          description: `${totalAutomationStarted} automations started`,
          timestamp: new Date().toISOString()
        }
      ];

      const finalStats = {
        totalLeads,
        totalCompanies,
        totalJobs,
        activeLeads,
        connectedLeads,
        repliedLeads,
        lostLeads,
        conversionRate,
        averageAILeadScore,
        leadsThisWeek,
        leadsThisMonth,
        topPerformers,
        stageDistribution,
        industryDistribution,
        recentActivity,
        automationMetrics: {
          totalAutomationStarted,
          automationRate,
          automationByStage
        },
        dailyTrends,
        topCompanies
      };

      console.log('Final stats object:', finalStats);
      setStats(finalStats);

    } catch (error) {
      console.error("Error fetching reporting data:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch reporting data";
      toast({
        title: "Error",
        description: errorMessage,
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
          <h1 className="text-xl font-semibold tracking-tight">Reporting & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance metrics and insights</p>
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
          <h1 className="text-xl font-semibold tracking-tight">Reporting & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance metrics and business insights</p>
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

      {/* Stats Cards */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Users className="h-4 w-4" />
          </div>
          <span className="font-medium">{stats.totalLeads} total leads</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-medium">{stats.totalCompanies} companies</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-medium">{stats.totalJobs} jobs</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Target className="h-4 w-4" />
          </div>
          <span className="font-medium">{stats.conversionRate.toFixed(1)}% conversion</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="text-muted-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <span className="font-medium">{stats.averageAILeadScore.toFixed(1)} avg {getLabel('table', 'ai_score').toLowerCase()}</span>
        </div>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-primary-subtle border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Automation Rate</p>
                <p className="text-xl font-bold text-primary">{stats.automationMetrics.automationRate.toFixed(1)}%</p>
                <p className="text-xs text-primary/70">{stats.automationMetrics.totalAutomationStarted} automations active</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-success-subtle border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Pipeline Velocity</p>
                <p className="text-xl font-bold text-green-700">{stats.stageDistribution.find(s => s.stage === 'Connection Requested')?.count || 0}</p>
                <p className="text-xs text-green-600">Connection requests sent</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-warning-subtle border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Response Rate</p>
                <p className="text-xl font-bold text-orange-700">{stats.repliedLeads}</p>
                <p className="text-xs text-orange-600">Total responses received</p>
              </div>
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stage Distribution - Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <PieChart className="h-4 w-4" />
              Pipeline Stage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Donut Chart Visualization */}
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {stats.stageDistribution.map((stage, index) => {
                    const percentage = stage.percentage;
                    const offset = stats.stageDistribution.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                    const circumference = 2 * Math.PI * 40;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((offset / 100) * circumference);
                    
                    return (
                      <circle
                        key={stage.stage}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={`hsl(${index * 50}, 60%, 60%)`}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">{stats.totalLeads}</div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-2">
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
                      <StatusBadge status={`${stage.percentage.toFixed(1)}%`} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Distribution - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="h-4 w-4" />
              Top Industries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Bar Chart Visualization */}
              <div className="space-y-3">
                {stats.industryDistribution.map((industry, index) => (
                  <div key={industry.industry} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{industry.industry}</span>
                      <span className="text-sm text-muted-foreground">{industry.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${industry.percentage}%`,
                          backgroundColor: `hsl(${index * 45 + 200}, 55%, 55%)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trends Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="h-4 w-4" />
            Daily Trends (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Line Chart Visualization */}
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* New Leads Line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={stats.dailyTrends.map((trend, index) => 
                    `${(index / (stats.dailyTrends.length - 1)) * 760 + 20},${200 - (trend.newLeads / Math.max(...stats.dailyTrends.map(t => t.newLeads))) * 160 + 20}`
                  ).join(' ')}
                />
                
                {/* Automation Line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  points={stats.dailyTrends.map((trend, index) => 
                    `${(index / (stats.dailyTrends.length - 1)) * 760 + 20},${200 - (trend.automationsStarted / Math.max(...stats.dailyTrends.map(t => t.automationsStarted))) * 160 + 20}`
                  ).join(' ')}
                />
                
                {/* Data points */}
                {stats.dailyTrends.map((trend, index) => (
                  <g key={index}>
                    <circle
                      cx={(index / (stats.dailyTrends.length - 1)) * 760 + 20}
                      cy={200 - (trend.newLeads / Math.max(...stats.dailyTrends.map(t => t.newLeads))) * 160 + 20}
                      r="3"
                      fill="#3b82f6"
                    />
                    <circle
                      cx={(index / (stats.dailyTrends.length - 1)) * 760 + 20}
                      cy={200 - (trend.automationsStarted / Math.max(...stats.dailyTrends.map(t => t.automationsStarted))) * 160 + 20}
                      r="3"
                      fill="#10b981"
                    />
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">New Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Automations Started</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
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
                    <StatusBadge status={`${performer.leadsCount} leads`} size="sm" />
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
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
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

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Building2 className="h-4 w-4" />
            Top Companies by Lead Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topCompanies.map((company, index) => (
              <div key={company.companyName} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{company.companyName}</div>
                    <div className="text-sm text-muted-foreground">{company.industry}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{company.leadCount} leads</div>
                    <div className="text-sm text-muted-foreground">{company.automationActive} automated</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(company.automationActive / company.leadCount) * 100}%` }}
                    />
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

export default Reporting;
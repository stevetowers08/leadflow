import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Briefcase, 
  Target, 
  BarChart3,
  Activity,
  Brain,
  Clock,
  Zap,
  MessageSquare,
  UserPlus,
  Reply,
  CheckCircle,
  XCircle,
  HelpCircle,
  MapPin,
  Calendar,
  Star,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getLabel } from '@/utils/labels';
import { Page } from "@/design-system/components";
import type { ReportingMetrics } from "@/services/reportingService";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reporting = () => {
  const [stats, setStats] = useState<ReportingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Chart color configurations
  const chartColors = {
    primary: "hsl(201 100% 35%)",      // LinkedIn Blue
    secondary: "hsl(201 100% 43%)",    // Electric Blue
    success: "hsl(142 76% 36%)",       // Green
    warning: "hsl(38 92% 50%)",        // Orange
    accent: "hsl(201 100% 35%)",       // Primary accent
    muted: "hsl(240 3.8% 46.1%)"       // Muted text
  };

  const pieColors = [chartColors.primary, chartColors.secondary, chartColors.success, chartColors.warning];

  const fetchReportingData = async () => {
    try {
      setLoading(true);
      console.log('Fetching reporting data...');
      
      // Dynamic import to prevent initialization issues
      const { ReportingService } = await import("@/services/reportingService");
      const data = await ReportingService.getReportingData(selectedPeriod as '7d' | '30d' | '90d');
      console.log('Received data:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching reporting data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reporting data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportingData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <Page title="Reporting & Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reporting data...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (!stats) {
    return (
      <Page title="Reporting & Analytics">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No reporting data available</p>
          <Button onClick={fetchReportingData}>Retry</Button>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Reporting & Analytics">
      <div className="mb-6 flex items-center justify-between">
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
          <Button onClick={fetchReportingData} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
      {/* Key Metrics Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total People</p>
                <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-semibold text-gray-900">{stats?.totalLeads.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-success font-medium">+{stats?.leadsThisWeek}</span>
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
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-semibold text-gray-900">{stats?.totalJobs.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-success font-medium">+{stats?.jobMetrics.jobsThisWeek}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">this week</p>
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
                    <p className="text-sm font-medium text-gray-600">Automation Success</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.automationMetrics.automationSuccessRate.toFixed(1)}%</p>
                    <p className="text-xs text-success font-medium">{stats?.automationMetrics.repliesReceived} replies</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/5 border border-secondary/10">
                    <Zap className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm font-medium text-gray-600">LinkedIn Response</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.automationMetrics.messageResponseRate.toFixed(1)}%</p>
                    <p className="text-xs text-warning font-medium">{stats?.automationMetrics.positiveResponseRate.toFixed(1)}% positive</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/5 border border-warning/10">
                    <MessageSquare className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Charts Row */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* LinkedIn Automation Funnel */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <BarChart3 className="h-4 w-4 text-sidebar-primary" />
                  </div>
                  LinkedIn Automation Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    requests: { label: "Connection Requests", color: chartColors.primary },
                    connections: { label: "Connections Accepted", color: chartColors.secondary },
                    messages: { label: "Messages Sent", color: chartColors.success },
                    replies: { label: "Replies Received", color: chartColors.warning }
                  }}
                  className="h-64"
                >
                  <BarChart data={[
                    { 
                      stage: "Connection Requests", 
                      value: stats?.automationMetrics.connectionRequestsSent || 0,
                      fill: chartColors.primary
                    },
                    { 
                      stage: "Connections Accepted", 
                      value: stats?.automationMetrics.connectionsAccepted || 0,
                      fill: chartColors.secondary
                    },
                    { 
                      stage: "Messages Sent", 
                      value: stats?.automationMetrics.messagesSent || 0,
                      fill: chartColors.success
                    },
                    { 
                      stage: "Replies Received", 
                      value: stats?.automationMetrics.repliesReceived || 0,
                      fill: chartColors.warning
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill={chartColors.primary} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Reply Type Analysis */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <Reply className="h-4 w-4 text-success" />
              </div>
                  Reply Type Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
                <ChartContainer
                  config={{
                    interested: { label: "Interested", color: chartColors.success },
                    not_interested: { label: "Not Interested", color: chartColors.warning },
                    maybe: { label: "Maybe", color: chartColors.muted }
                  }}
                  className="h-64"
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Interested", value: stats?.automationMetrics.interestedReplies || 0, fill: chartColors.success },
                        { name: "Not Interested", value: stats?.automationMetrics.notInterestedReplies || 0, fill: chartColors.warning },
                        { name: "Maybe", value: stats?.automationMetrics.maybeReplies || 0, fill: chartColors.muted }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Interested", value: stats?.automationMetrics.interestedReplies || 0, fill: chartColors.success },
                        { name: "Not Interested", value: stats?.automationMetrics.notInterestedReplies || 0, fill: chartColors.warning },
                        { name: "Maybe", value: stats?.automationMetrics.maybeReplies || 0, fill: chartColors.muted }
                      ].map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Trends - Full Width */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
                  <Activity className="h-4 w-4 text-secondary" />
                </div>
                Daily Activity Trends (People & Jobs)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer
                config={{
                  newLeads: { label: "New People", color: chartColors.primary },
                  automationsStarted: { label: "Automations Started", color: chartColors.secondary },
                  newJobs: { label: "New Jobs", color: chartColors.success }
                }}
                className="h-64 w-full"
              >
                <LineChart data={stats?.dailyTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <ChartTooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <ChartLegend />
                  <Line
                    type="monotone"
                    dataKey="newLeads"
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    name="New People"
                    dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="automationsStarted"
                    stroke={chartColors.secondary}
                    strokeWidth={3}
                    name="Automations Started"
                    dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          {/* Automation Metrics Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Automation Started</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.automationMetrics.totalAutomationStarted}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats?.automationMetrics.automationRate.toFixed(1)}% of people</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <Zap className="h-5 w-5 text-sidebar-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.automationMetrics.automationSuccessRate.toFixed(1)}%</p>
                    <p className="text-xs text-success font-medium">{stats?.automationMetrics.repliesReceived} replies</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/5 border border-success/10">
                <Target className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm font-medium text-gray-600">Connection Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.automationMetrics.connectionAcceptanceRate.toFixed(1)}%</p>
                    <p className="text-xs text-secondary font-medium">{stats?.automationMetrics.connectionsAccepted} accepted</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/5 border border-secondary/10">
                    <UserPlus className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm font-medium text-gray-600">Response Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.automationMetrics.messageResponseRate.toFixed(1)}%</p>
                    <p className="text-xs text-warning font-medium">{stats?.automationMetrics.positiveResponseRate.toFixed(1)}% positive</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/5 border border-warning/10">
                    <MessageSquare className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Automation Performance Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Automation by Stage */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <BarChart3 className="h-4 w-4 text-sidebar-primary" />
              </div>
                  Automation by Stage (People)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    automationActive: { label: "Automation Active", color: chartColors.primary },
                    total: { label: "Total People", color: chartColors.muted }
                  }}
                  className="h-64"
                >
                  <BarChart data={stats?.automationMetrics.automationByStage || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="automationActive" fill={chartColors.primary} name="Automation Active" />
                    <Bar dataKey="count" fill={chartColors.muted} name="Total People" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Reply Type Breakdown */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <Reply className="h-4 w-4 text-success" />
                  </div>
                  Reply Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    interested: { label: "Interested", color: chartColors.success },
                    not_interested: { label: "Not Interested", color: chartColors.warning },
                    maybe: { label: "Maybe", color: chartColors.muted }
                  }}
                  className="h-64"
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Interested", value: stats?.automationMetrics.interestedReplies || 0, fill: chartColors.success },
                        { name: "Not Interested", value: stats?.automationMetrics.notInterestedReplies || 0, fill: chartColors.warning },
                        { name: "Maybe", value: stats?.automationMetrics.maybeReplies || 0, fill: chartColors.muted }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Interested", value: stats?.automationMetrics.interestedReplies || 0, fill: chartColors.success },
                        { name: "Not Interested", value: stats?.automationMetrics.notInterestedReplies || 0, fill: chartColors.warning },
                        { name: "Maybe", value: stats?.automationMetrics.maybeReplies || 0, fill: chartColors.muted }
                      ].map((entry, index) => (
                        <Cell key={`reply-cell-${entry.name}-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* LinkedIn Activity Timeline - Full Width */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
                  <Activity className="h-4 w-4 text-secondary" />
                </div>
                LinkedIn Activity Timeline (via Expandi/Prosp)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer
                config={{
                  connectionRequests: { label: "Connection Requests", color: chartColors.primary },
                  connectionsAccepted: { label: "Connections Accepted", color: chartColors.secondary },
                  messagesSent: { label: "Messages Sent", color: chartColors.success },
                  repliesReceived: { label: "Replies Received", color: chartColors.warning }
                }}
                className="h-64 w-full"
              >
                <LineChart data={stats?.linkedinMetrics.dailyLinkedinActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <ChartTooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <ChartLegend />
                  <Line 
                    type="monotone" 
                    dataKey="connectionRequests" 
                    stroke={chartColors.primary} 
                    strokeWidth={3}
                    name="Connection Requests"
                    dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="connectionsAccepted" 
                    stroke={chartColors.secondary} 
                    strokeWidth={3}
                    name="Connections Accepted"
                    dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="messagesSent" 
                    stroke={chartColors.success} 
                    strokeWidth={3}
                    name="Messages Sent"
                    dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="repliesReceived" 
                    stroke={chartColors.warning} 
                    strokeWidth={3}
                    name="Replies Received"
                    dot={{ fill: chartColors.warning, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Automation Performance Summary */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Key Metrics */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/5 border border-warning/10">
                    <Brain className="h-4 w-4 text-warning" />
                  </div>
                  Key Automation Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sidebar-primary"></div>
                      <span className="text-sm font-medium">Total LinkedIn Activities (via Expandi/Prosp)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.linkedinMetrics.totalLinkedinActivities}</span>
                    </div>
              </div>
              <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium">Connection Requests Sent</span>
              </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.connectionRequestsSent}</span>
                      </div>
                    </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="text-sm font-medium">Connections Accepted</span>
                  </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.connectionsAccepted}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-sm font-medium">Messages Sent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.messagesSent}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium">Replies Received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.repliesReceived}</span>
                    </div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Reply Analysis */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
              </div>
                  Reply Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Interested Replies</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-success">{stats?.automationMetrics.interestedReplies}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.automationMetrics.repliesReceived > 0 ? 
                          ((stats?.automationMetrics.interestedReplies || 0) / stats?.automationMetrics.repliesReceived * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Not Interested</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-warning">{stats?.automationMetrics.notInterestedReplies}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.automationMetrics.repliesReceived > 0 ? 
                          ((stats?.automationMetrics.notInterestedReplies || 0) / stats?.automationMetrics.repliesReceived * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-muted" />
                      <span className="text-sm font-medium">Maybe Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-muted">{stats?.automationMetrics.maybeReplies}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.automationMetrics.repliesReceived > 0 ? 
                          ((stats?.automationMetrics.maybeReplies || 0) / stats?.automationMetrics.repliesReceived * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LinkedIn Tab */}
        <TabsContent value="linkedin" className="space-y-6">
          {/* LinkedIn Metrics Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Activities</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.linkedinMetrics.totalLinkedinActivities}</p>
                    <p className="text-xs text-gray-500 mt-1">via Expandi/Prosp</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <Activity className="h-5 w-5 text-sidebar-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connection Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.linkedinMetrics.connectionRequestsSent}</p>
                    <p className="text-xs text-primary font-medium">Sent this period</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 border border-primary/10">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connections Accepted</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.linkedinMetrics.connectionsAccepted}</p>
                    <p className="text-xs text-secondary font-medium">{stats?.automationMetrics.connectionAcceptanceRate.toFixed(1)}% acceptance rate</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/5 border border-secondary/10">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.linkedinMetrics.messagesSent}</p>
                    <p className="text-xs text-success font-medium">{stats?.linkedinMetrics.repliesReceived} replies</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/5 border border-success/10">
                    <MessageSquare className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LinkedIn Performance Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Reply Type Analysis */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <Reply className="h-4 w-4 text-success" />
                  </div>
                  Reply Type Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    interested: { label: "Interested", color: chartColors.success },
                    not_interested: { label: "Not Interested", color: chartColors.warning },
                    maybe: { label: "Maybe", color: chartColors.muted }
                  }}
                  className="h-64"
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Interested", value: stats?.linkedinMetrics.replyTypes.interested || 0, fill: chartColors.success },
                        { name: "Not Interested", value: stats?.linkedinMetrics.replyTypes.not_interested || 0, fill: chartColors.warning },
                        { name: "Maybe", value: stats?.linkedinMetrics.replyTypes.maybe || 0, fill: chartColors.muted }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Interested", value: stats?.linkedinMetrics.replyTypes.interested || 0, fill: chartColors.success },
                        { name: "Not Interested", value: stats?.linkedinMetrics.replyTypes.not_interested || 0, fill: chartColors.warning },
                        { name: "Maybe", value: stats?.linkedinMetrics.replyTypes.maybe || 0, fill: chartColors.muted }
                      ].map((entry, index) => (
                        <Cell key={`linkedin-reply-cell-${entry.name}-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* LinkedIn Activity Funnel */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <BarChart3 className="h-4 w-4 text-sidebar-primary" />
            </div>
                  LinkedIn Activity Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    connectionRequests: { label: "Connection Requests", color: chartColors.primary },
                    connectionsAccepted: { label: "Connections Accepted", color: chartColors.secondary },
                    messagesSent: { label: "Messages Sent", color: chartColors.success },
                    repliesReceived: { label: "Replies Received", color: chartColors.warning }
                  }}
                  className="h-64"
                >
                  <BarChart data={[
                    {
                      stage: "Connection Requests",
                      value: stats?.linkedinMetrics.connectionRequestsSent || 0,
                      fill: chartColors.primary
                    },
                    {
                      stage: "Connections Accepted",
                      value: stats?.linkedinMetrics.connectionsAccepted || 0,
                      fill: chartColors.secondary
                    },
                    {
                      stage: "Messages Sent",
                      value: stats?.linkedinMetrics.messagesSent || 0,
                      fill: chartColors.success
                    },
                    {
                      stage: "Replies Received",
                      value: stats?.linkedinMetrics.repliesReceived || 0,
                      fill: chartColors.warning
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="value" fill={chartColors.primary} />
                  </BarChart>
                </ChartContainer>
          </CardContent>
        </Card>
      </div>

          {/* LinkedIn Activity Timeline - Full Width */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
                  <Activity className="h-4 w-4 text-secondary" />
                </div>
                LinkedIn Activity Timeline (via Expandi/Prosp)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer
                config={{
                  connectionRequests: { label: "Connection Requests", color: chartColors.primary },
                  connectionsAccepted: { label: "Connections Accepted", color: chartColors.secondary },
                  messagesSent: { label: "Messages Sent", color: chartColors.success },
                  repliesReceived: { label: "Replies Received", color: chartColors.warning }
                }}
                className="h-64 w-full"
              >
                <LineChart data={stats?.linkedinMetrics.dailyLinkedinActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <ChartTooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <ChartLegend />
                  <Line 
                    type="monotone" 
                    dataKey="connectionRequests" 
                    stroke={chartColors.primary} 
                    strokeWidth={3}
                    name="Connection Requests"
                    dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="connectionsAccepted" 
                    stroke={chartColors.secondary} 
                    strokeWidth={3}
                    name="Connections Accepted"
                    dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="messagesSent" 
                    stroke={chartColors.success} 
                    strokeWidth={3}
                    name="Messages Sent"
                    dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="repliesReceived" 
                    stroke={chartColors.warning} 
                    strokeWidth={3}
                    name="Replies Received"
                    dot={{ fill: chartColors.warning, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* LinkedIn Performance Summary */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Response Analysis */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  Response Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Interested Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-success">{stats?.linkedinMetrics.replyTypes.interested}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.linkedinMetrics.repliesReceived > 0 ? 
                          ((stats?.linkedinMetrics.replyTypes.interested || 0) / stats?.linkedinMetrics.repliesReceived * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Not Interested</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-warning">{stats?.linkedinMetrics.replyTypes.not_interested}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.linkedinMetrics.repliesReceived > 0 ? 
                          ((stats?.linkedinMetrics.replyTypes.not_interested || 0) / stats?.linkedinMetrics.repliesReceived * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-muted" />
                      <span className="text-sm font-medium">Maybe Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-muted">{stats?.linkedinMetrics.replyTypes.maybe}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.linkedinMetrics.repliesReceived > 0 ? 
                          ((stats?.linkedinMetrics.replyTypes.maybe || 0) / stats?.linkedinMetrics.repliesReceived * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Metrics */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/5 border border-warning/10">
                    <Brain className="h-4 w-4 text-warning" />
                  </div>
                  LinkedIn Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium">Connection Acceptance Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.connectionAcceptanceRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium">Message Response Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.messageResponseRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="text-sm font-medium">Positive Response Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.automationMetrics.positiveResponseRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-sm font-medium">Total Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stats?.linkedinMetrics.repliesReceived}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-6">
          {/* Company Metrics Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Companies</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalCompanies}</p>
                    <p className="text-xs text-gray-500 mt-1">In pipeline</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <Building2 className="h-5 w-5 text-sidebar-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Companies with Automation</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.companyPipelineMetrics?.companiesWithAutomation || 0}</p>
                    <p className="text-xs text-success font-medium">Active outreach</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/5 border border-success/10">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Function</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.industryDistribution?.[0]?.industry || 'N/A'}</p>
                    <p className="text-xs text-secondary font-medium">{stats?.industryDistribution?.[0]?.count || 0} companies</p>
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
                    <p className="text-sm font-medium text-gray-600">Pipeline Velocity</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.companyPipelineMetrics?.pipelineVelocity?.[0]?.averageDaysInStage?.toFixed(0) || 'N/A'}</p>
                    <p className="text-xs text-warning font-medium">avg days in stage</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/5 border border-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Analytics Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Companies by Stage */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <BarChart3 className="h-4 w-4 text-sidebar-primary" />
                  </div>
                  Companies by Stage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: { label: "Companies", color: chartColors.primary }
                  }}
                  className="h-64"
                >
                  <BarChart data={stats?.companyPipelineMetrics?.companiesByStage || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="count" fill={chartColors.primary} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

      {/* Industry Distribution */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <Building2 className="h-4 w-4 text-success" />
            </div>
                  Function Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
                <ChartContainer
                  config={{
                    count: { label: "Companies", color: chartColors.success }
                  }}
                  className="h-64"
                >
                  <PieChart>
                    <Pie
                      data={stats?.industryDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="industry"
                    >
                      {(stats?.industryDistribution || []).map((entry, index) => (
                        <Cell key={`industry-cell-${entry.industry}-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Companies */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                  <Star className="h-4 w-4 text-sidebar-primary" />
                </div>
                Top Companies by People Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(stats?.topCompanies || []).map((company, index) => (
                  <div key={company.companyName} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary text-white text-sm font-bold">
                        {index + 1}
                      </div>
                <div>
                        <div className="font-medium text-gray-900">{company.companyName}</div>
                        <div className="text-sm text-gray-600">{company.industry}</div>
                      </div>
                </div>
                <div className="text-right">
                      <div className="font-medium text-gray-900">{company.leadCount} people</div>
                      <div className="text-xs text-gray-500">
                        {company.automationActive > 0 ? `${company.automationActive} automation` : 'No automation'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

          {/* Pipeline Performance */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Pipeline Velocity */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/5 border border-warning/10">
                    <Clock className="h-4 w-4 text-warning" />
            </div>
                  Pipeline Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
                <div className="space-y-3">
                  {(stats?.companyPipelineMetrics?.pipelineVelocity || []).map((stage) => (
                    <div key={stage.stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span className="text-sm font-medium">{stage.stage}</span>
                </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{stage.averageDaysInStage.toFixed(0)} days</span>
                      </div>
              </div>
            ))}
          </div>
              </CardContent>
            </Card>

            {/* User Performance */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                  User Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(stats?.companyPipelineMetrics?.userPerformance || []).map((user) => (
                    <div key={user.userName} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-sm font-medium">{user.userName}</span>
            </div>
            <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{user.companiesMoved} companies</span>
                        <span className="text-xs text-gray-500">({user.averageTimeToMove.toFixed(0)}d avg)</span>
            </div>
                    </div>
                  ))}
          </div>
        </CardContent>
      </Card>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          {/* Job Metrics Overview */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
              <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.jobMetrics.totalJobs}</p>
                    <p className="text-xs text-gray-500 mt-1">all time</p>
              </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <Briefcase className="h-5 w-5 text-sidebar-primary" />
                      </div>
                    </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.jobMetrics.jobsThisWeek}</p>
                    <p className="text-xs text-success font-medium">+{stats?.jobMetrics.jobsThisWeek}</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/5 border border-success/10">
                    <Calendar className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.jobMetrics.jobsThisMonth}</p>
                    <p className="text-xs text-secondary font-medium">+{stats?.jobMetrics.jobsThisMonth}</p>
              </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/5 border border-secondary/10">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Company</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.jobMetrics.topJobCompanies[0]?.companyName || 'N/A'}</p>
                    <p className="text-xs text-warning font-medium">{stats?.jobMetrics.topJobCompanies[0]?.jobCount || 0} jobs</p>
                    </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/5 border border-warning/10">
                    <Star className="h-5 w-5 text-warning" />
                  </div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Job Analytics Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Jobs by Priority */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                    <Filter className="h-4 w-4 text-sidebar-primary" />
            </div>
                  Jobs by Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    High: { label: "High Priority", color: chartColors.warning },
                    Medium: { label: "Medium Priority", color: chartColors.primary },
                    Low: { label: "Low Priority", color: chartColors.muted }
                  }}
                  className="h-64"
                >
                  <PieChart>
                    <Pie
                      data={stats?.jobMetrics.jobsByPriority || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="priority"
                    >
                      {(stats?.jobMetrics.jobsByPriority || []).map((entry, index) => (
                        <Cell key={`priority-cell-${entry.priority}-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Jobs by Function */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                    <Building2 className="h-4 w-4 text-success" />
            </div>
                  Jobs by Function
          </CardTitle>
        </CardHeader>
        <CardContent>
                <ChartContainer
                  config={{
                    Engineering: { label: "Engineering", color: chartColors.primary },
                    Sales: { label: "Sales", color: chartColors.secondary },
                    Marketing: { label: "Marketing", color: chartColors.success },
                    Operations: { label: "Operations", color: chartColors.warning }
                  }}
                  className="h-64"
                >
                  <BarChart data={stats?.jobMetrics.jobsByFunction || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="function" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill={chartColors.primary} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
                </div>

          {/* Job Location and Employment Type */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Jobs by Location */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10">
                    <MapPin className="h-4 w-4 text-secondary" />
                  </div>
                  Jobs by Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
                  {(stats?.jobMetrics.jobsByLocation || []).map((location, index) => (
                    <div key={`location-${location.location}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span className="text-sm font-medium">{location.location}</span>
                </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{location.count}</span>
                        <span className="text-xs text-gray-500">({location.percentage.toFixed(1)}%)</span>
                  </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

            {/* Jobs by Employment Type */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/5 border border-warning/10">
                    <Clock className="h-4 w-4 text-warning" />
            </div>
                  Jobs by Employment Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
                  {(stats?.jobMetrics.jobsByEmploymentType || []).map((type, index) => (
                    <div key={`employment-${type.employmentType}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span className="text-sm font-medium">{type.employmentType}</span>
                </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{type.count}</span>
                        <span className="text-xs text-gray-500">({type.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
          </div>

          {/* Daily Job Trends - Full Width */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/5 border border-success/10">
                  <Activity className="h-4 w-4 text-success" />
            </div>
                Daily Job Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer
                config={{
                  newJobs: { label: "New Jobs", color: chartColors.success }
                }}
                className="h-64 w-full"
              >
                <AreaChart data={stats?.jobMetrics.dailyJobTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <ChartTooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <ChartLegend />
                  <Area
                    type="monotone"
                    dataKey="newJobs"
                    stroke={chartColors.success}
                    fill={chartColors.success}
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="New Jobs"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Job Companies */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                  <Star className="h-4 w-4 text-sidebar-primary" />
            </div>
                Top Companies by Job Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
                {(stats?.jobMetrics.topJobCompanies || []).map((company, index) => (
              <div key={company.companyName} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{company.companyName}</div>
                    <div className="text-sm text-gray-600">{company.industry}</div>
                  </div>
                </div>
                  <div className="text-right">
                      <div className="font-medium text-gray-900">{company.jobCount} jobs</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Reporting;
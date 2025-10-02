import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getLabel } from '@/utils/labels';
import { Page } from "@/design-system/components";
import { ReportingService, ReportingMetrics } from "@/services/reportingService";

const Reporting = () => {
  const [stats, setStats] = useState<ReportingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const { toast } = useToast();

  const fetchReportingData = async () => {
    try {
      setLoading(true);
      console.log('Fetching reporting data...');
      
      const reportingData = await ReportingService.getReportingData(selectedPeriod as '7d' | '30d' | '90d');
      
      console.log('Reporting data fetched:', reportingData);
      setStats(reportingData);

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

  if (loading) {
    return (
      <Page title="Reporting & Analytics">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading analytics...</p>
        </div>
      </Page>
    );
  }

  if (!stats) {
    return (
      <Page title="Reporting & Analytics">
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No data available</p>
          <Button onClick={fetchReportingData} className="mt-4">
            Retry
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Reporting & Analytics"
      actions={
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
      }
    >
      {/* Key Metrics Overview */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalLeads.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success font-medium">+{stats.leadsThisWeek}</span>
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
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeLeads.toLocaleString()}</p>
                <p className="text-xs text-success font-medium">{stats.connectedLeads} connected</p>
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
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-secondary font-medium">{stats.repliedLeads} replies received</p>
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
                <p className="text-sm font-medium text-gray-600">Avg Lead Score</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageAILeadScore.toFixed(0)}</p>
                <p className="text-xs text-warning font-medium">AI-powered scoring</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/5 border border-warning/10">
                <Brain className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/5 border border-sidebar-primary/10">
                <Zap className="h-4 w-4 text-sidebar-primary" />
              </div>
              Automation Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Automation Rate</span>
                <Badge variant="outline" className="bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">{stats.automationMetrics.automationRate.toFixed(1)}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Active Automations</span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">{stats.automationMetrics.totalAutomationStarted}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Automation by Stage</p>
                {stats.automationMetrics.automationByStage.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-700">{getLabel(stage.stage)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{stage.automationActive}/{stage.count}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-sidebar-primary"
                          style={{ width: `${stage.count > 0 ? (stage.automationActive / stage.count) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <BarChart3 className="h-6 w-6 text-secondary" />
              </div>
              Lead Pipeline Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.stageDistribution.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={stage.stage} />
                    <span className="text-sm font-medium text-gray-700">{getLabel(stage.stage)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{stage.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-sidebar-primary"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {stage.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Distribution */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="p-2 bg-success/10 rounded-xl">
              <Building2 className="h-6 w-6 text-success" />
            </div>
            Industry Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.industryDistribution.map((industry) => (
              <div key={industry.industry} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <div className="font-medium text-gray-900">{industry.industry}</div>
                  <div className="text-sm text-gray-600">{industry.count} companies</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{industry.percentage.toFixed(1)}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full bg-sidebar-primary"
                      style={{ width: `${industry.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Trends Chart */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="p-2 bg-secondary/10 rounded-xl">
              <Activity className="h-6 w-6 text-secondary" />
            </div>
            Daily Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1">
            {stats.dailyTrends.map((trend, index) => (
              <div key={trend.date} className="flex flex-col items-center flex-1">
                <div className="flex flex-col gap-1 w-full">
                  <div 
                    className="bg-sidebar-primary rounded-t"
                    style={{ height: `${Math.max(4, (trend.newLeads / Math.max(...stats.dailyTrends.map(t => t.newLeads))) * 100)}px` }}
                    title={`${trend.newLeads} new leads`}
                  />
                  <div 
                    className="bg-success rounded-t"
                    style={{ height: `${Math.max(4, (trend.automationsStarted / Math.max(...stats.dailyTrends.map(t => t.automationsStarted))) * 100)}px` }}
                    title={`${trend.automationsStarted} automations started`}
                  />
                </div>
                {index % 7 === 0 && (
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                    {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sidebar-primary rounded"></div>
              <span className="text-gray-700">New Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-gray-700">Automations Started</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="p-2 bg-warning/10 rounded-xl">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200">
                  {activity.type === 'lead' && <Users className="h-5 w-5 text-sidebar-primary" />}
                  {activity.type === 'company' && <Building2 className="h-5 w-5 text-success" />}
                  {activity.type === 'job' && <Briefcase className="h-5 w-5 text-secondary" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{activity.description}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="p-2 bg-sidebar-primary/10 rounded-xl">
              <Building2 className="h-6 w-6 text-sidebar-primary" />
            </div>
            Top Companies by Lead Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topCompanies.map((company, index) => (
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
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{company.leadCount} leads</div>
                    <div className="text-sm text-gray-600">{company.automationActive} automated</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-sidebar-primary"
                      style={{ width: `${(company.automationActive / company.leadCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default Reporting;
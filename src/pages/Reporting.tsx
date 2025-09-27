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
      <Page title="Reporting & Analytics" subtitle="Performance metrics and insights">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading analytics...</p>
        </div>
      </Page>
    );
  }

  if (!stats) {
    return (
      <Page title="Reporting & Analytics" subtitle="Performance metrics and insights">
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
      subtitle="Performance metrics and insights"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.leadsThisWeek} this week
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold">{stats.activeLeads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.connectedLeads} connected
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">
                  {stats.repliedLeads} replies received
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Lead Score</p>
                <p className="text-2xl font-bold">{stats.averageAILeadScore.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">
                  AI-powered scoring
                </p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Zap className="h-4 w-4" />
              Automation Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Automation Rate</span>
                <Badge variant="outline">{stats.automationMetrics.automationRate.toFixed(1)}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Automations</span>
                <Badge variant="outline">{stats.automationMetrics.totalAutomationStarted}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Automation by Stage</p>
                {stats.automationMetrics.automationByStage.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{getLabel(stage.stage)}</span>
                    <div className="flex items-center gap-2">
                      <span>{stage.automationActive}/{stage.count}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="h-4 w-4" />
              Lead Pipeline Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.stageDistribution.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={stage.stage} />
                    <span className="text-sm font-medium">{getLabel(stage.stage)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{stage.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Building2 className="h-4 w-4" />
            Industry Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.industryDistribution.map((industry) => (
              <div key={industry.industry} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{industry.industry}</div>
                  <div className="text-sm text-muted-foreground">{industry.count} companies</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{industry.percentage.toFixed(1)}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full bg-primary"
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="h-4 w-4" />
            Daily Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1">
            {stats.dailyTrends.map((trend, index) => (
              <div key={trend.date} className="flex flex-col items-center flex-1">
                <div className="flex flex-col gap-1 w-full">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${Math.max(4, (trend.newLeads / Math.max(...stats.dailyTrends.map(t => t.newLeads))) * 100)}px` }}
                    title={`${trend.newLeads} new leads`}
                  />
                  <div 
                    className="bg-green-500 rounded-t"
                    style={{ height: `${Math.max(4, (trend.automationsStarted / Math.max(...stats.dailyTrends.map(t => t.automationsStarted))) * 100)}px` }}
                    title={`${trend.automationsStarted} automations started`}
                  />
                </div>
                {index % 7 === 0 && (
                  <span className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
                    {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>New Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Automations Started</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  {activity.type === 'lead' && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'company' && <Building2 className="h-4 w-4 text-green-600" />}
                  {activity.type === 'job' && <Briefcase className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
    </Page>
  );
};

export default Reporting;
/**
 * Modern Reporting Page - Enterprise CRM Design 2025
 * 
 * Features:
 * - Enhanced reporting with modern card and chart components
 * - Interactive data visualization
 * - Enterprise-grade accessibility and responsiveness
 * - Aligned with dashboard design patterns
 * - Advanced filtering and export capabilities
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ActivityCard,
    ChartCard,
    PerformanceCard
} from "@/components/ui/enterprise-cards";
import {
    BarChart,
    DonutChart,
    LineChart,
    MiniChart
} from "@/components/ui/enterprise-charts";
import { useReportingData } from "@/hooks/useReportingData";
import {
    BarChart3,
    Building2,
    Calendar as CalendarIcon,
    DollarSign,
    MessageSquare,
    Minus,
    PieChart,
    RefreshCw,
    Target,
    TrendingDown,
    TrendingUp,
    Users
} from "lucide-react";
import { useState } from "react";

export default function Reporting() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const { data, isLoading } = useReportingData();

  const periodOptions = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last year", value: "1y" },
  ];

  const metricOptions = [
    { label: "All Metrics", value: "all" },
    { label: "Leads", value: "leads" },
    { label: "Companies", value: "companies" },
    { label: "Revenue", value: "revenue" },
    { label: "Conversions", value: "conversions" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6">
        {/* Period and Metric Selection - Clean Design */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Period:</span>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Metric:</span>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {metricOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Performance Indicators - Clean Spacing */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total People</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : (data?.totalPeople ?? 0).toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : (data?.totalCompanies ?? 0).toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jobs</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : (data?.totalJobs ?? 0).toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interactions</p>
                <p className="text-2xl font-bold text-foreground">{isLoading ? "-" : (data?.totalInteractions ?? 0).toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 flex items-center justify-center">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Analytics Grid - Clean Design */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Lead Generation Trend */}
          <ChartCard
            title="Lead Generation Trend"
            description="Daily people added"
            actions={
              <Button variant="ghost" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            }
            variant="elevated"
          >
            <LineChart
              data={(data?.monthlyStats ?? []).slice(-30).map(m => ({ label: m.month.slice(5), value: m.people }))}
              height={280}
              showGrid={true}
              showValues={false}
            />
          </ChartCard>

          {/* People by Stage */}
          <ChartCard
            title="People by Stage"
            description="Distribution across stages"
            actions={
              <Button variant="ghost" size="sm" className="gap-2">
                <PieChart className="h-4 w-4" />
                View Details
              </Button>
            }
            variant="elevated"
          >
            <DonutChart
              data={(data?.peopleByStage ?? []).map(s => ({ label: s.stage, value: s.count }))}
              size={220}
              showLegend={true}
              showValues={true}
            />
          </ChartCard>
        </div>

        {/* Secondary Analytics Grid - Clean Layout */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Company Growth */}
          <ChartCard
            title="Companies by Stage"
            description="Pipeline distribution"
            size="sm"
            variant="elevated"
          >
            <BarChart
              data={(data?.companiesByStage ?? []).map(s => ({ label: s.stage, value: s.count }))}
              height={200}
              showValues={true}
            />
          </ChartCard>

          {/* Conversion Funnel */}
          <ChartCard
            title="Interactions by Type"
            description="LinkedIn activity"
            size="sm"
            variant="elevated"
          >
            <BarChart
              data={(data?.interactionsByType ?? []).map(i => ({ label: i.type, value: i.count }))}
              height={200}
              showValues={true}
              orientation="horizontal"
            />
          </ChartCard>

          {/* Performance Metrics */}
          <PerformanceCard
            title="Team Performance"
            metrics={[
              {
                id: "response-time",
                label: "Avg Response Time",
                value: 92,
                color: "success"
              },
              {
                id: "follow-up-rate",
                label: "Follow-up Rate",
                value: 78,
                color: "primary"
              },
              {
                id: "meeting-conversion",
                label: "Meeting Conversion",
                value: 65,
                color: "warning"
              }
            ]}
            variant="elevated"
          />
        </div>

        {/* Detailed Reports Section - Clean Design */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Recent Activity Report */}
          <ActivityCard
            title="Recent Activity"
            description="Latest updates from your CRM"
            activities={(data?.recentInteractions ?? []).slice(0,8).map((a) => ({
              id: a.id,
              icon: a.type === 'lead' ? Users : a.type === 'company' ? Building2 : a.type === 'job' ? DollarSign : MessageSquare,
              title: a.description,
              description: '',
              time: new Date(a.occurred_at).toLocaleString(),
              status: a.type === 'lead' ? 'new' : 'info'
            }))}
            onViewAll={() => {}}
            variant="elevated"
          />

          {/* Mini Charts Row - Clean Cards */}
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2">
              <Card className="p-6" variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Weekly Growth</span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <MiniChart
                  data={[45, 52, 48, 61, 68, 72, 78]}
                  type="line"
                  color="#22c55e"
                  showTrend={true}
                />
              </Card>

              <Card className="p-6" variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Conversion Rate</span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <MiniChart
                  data={[12, 15, 18, 16, 20, 22, 18]}
                  type="line"
                  color="#0077B5"
                  showTrend={true}
                />
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <Card className="p-6" variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Response Time</span>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </div>
                <MiniChart
                  data={[120, 110, 95, 88, 92, 85, 78]}
                  type="line"
                  color="#f59e0b"
                  showTrend={true}
                />
              </Card>

              <Card className="p-6" variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Customer Satisfaction</span>
                  <Minus className="h-4 w-4 text-muted-foreground" />
                </div>
                <MiniChart
                  data={[85, 87, 89, 88, 90, 92, 91]}
                  type="line"
                  color="#22c55e"
                  showTrend={true}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

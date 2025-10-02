import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Briefcase, 
  Target, 
  BarChart3,
  Activity,
  MessageSquare,
  Zap,
  CheckCircle
} from "lucide-react";

const Reporting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const mockStats = {
    totalLeads: 1250,
    leadsThisWeek: 45,
    totalJobs: 89,
    jobsThisWeek: 12,
    automationSuccessRate: 78.5,
    repliesReceived: 156,
    messageResponseRate: 34.2,
    positiveResponseRate: 67.8
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reporting & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>

        {/* Controls */}
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
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                        <p className="text-2xl font-semibold text-gray-900">{mockStats.totalLeads.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+{mockStats.leadsThisWeek}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">this week</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 border border-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
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
                        <p className="text-2xl font-semibold text-gray-900">{mockStats.totalJobs}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+{mockStats.jobsThisWeek}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">this week</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 border border-green-100">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Automation Success</p>
                      <p className="text-2xl font-semibold text-gray-900">{mockStats.automationSuccessRate}%</p>
                      <p className="text-xs text-green-600 font-medium">{mockStats.repliesReceived} replies</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 border border-purple-100">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-semibold text-gray-900">{mockStats.messageResponseRate}%</p>
                      <p className="text-xs text-orange-600 font-medium">{mockStats.positiveResponseRate}% positive</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50 border border-orange-100">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Placeholder */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Chart visualization would go here</p>
                      <p className="text-sm text-gray-400">Connect your data source to see live charts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Target className="h-5 w-5 text-green-600" />
                    Goal Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Goal tracking visualization</p>
                      <p className="text-sm text-gray-400">Set up goals to track progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed automation performance metrics would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Comprehensive performance analysis would be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced analytics and insights would be presented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reporting;


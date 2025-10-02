import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  BarChart3,
  Activity,
  MessageSquare,
  Zap,
  CheckCircle,
  Share2,
  Download,
  Mail,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  Phone,
  Globe,
  Facebook,
  Settings,
  Plus,
  Filter
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  status: 'active' | 'paused' | 'inactive';
  monthlySpend: number;
  lastReportSent: string;
}

const AgencyDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock client data
  const clients: Client[] = [
    { id: "client1", name: "TechStart Inc", industry: "Technology", status: "active", monthlySpend: 15000, lastReportSent: "2024-01-15" },
    { id: "client2", name: "Local Restaurant", industry: "Food & Beverage", status: "active", monthlySpend: 5000, lastReportSent: "2024-01-14" },
    { id: "client3", name: "Fashion Boutique", industry: "Retail", status: "active", monthlySpend: 8500, lastReportSent: "2024-01-13" },
    { id: "client4", name: "Fitness Studio", industry: "Health & Fitness", status: "paused", monthlySpend: 3000, lastReportSent: "2024-01-10" },
  ];

  // Mock performance data
  const mockStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalMonthlySpend: clients.reduce((sum, c) => sum + c.monthlySpend, 0),
    avgROAS: 4.2,
    totalImpressions: 2450000,
    totalClicks: 45600,
    totalConversions: 1890,
    totalLeads: 756,
    ctr: 1.86,
    cpc: 2.45,
    cpl: 42.50,
    conversionRate: 4.14
  };

  const selectedClientData = selectedClient === "all" ? null : clients.find(c => c.id === selectedClient);

  const handleShareReport = () => {
    // Implementation for sharing report
    console.log("Sharing report for client:", selectedClient);
  };

  const handleExportReport = () => {
    // Implementation for exporting report
    console.log("Exporting report for client:", selectedClient);
  };

  const handleScheduleEmail = () => {
    // Implementation for scheduling automated emails
    console.log("Scheduling email for client:", selectedClient);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Dashboard</h1>
              <p className="text-gray-600">
                {selectedClientData ? `Reporting for ${selectedClientData.name}` : "Multi-client performance overview"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShareReport}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="default" size="sm" onClick={handleScheduleEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Schedule Email
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        client.status === 'active' ? 'bg-green-500' : 
                        client.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {client.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Integrations
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="facebook">Facebook Ads</TabsTrigger>
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="ghl">Go High Level</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Overview */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Ad Spend</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">${mockStats.totalMonthlySpend.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+12%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">this month</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 border border-green-100">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ROAS</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">{mockStats.avgROAS}x</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+0.3x</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">return on ad spend</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 border border-blue-100">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">{mockStats.totalLeads.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+18%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">this month</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 border border-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Clients</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">{mockStats.activeClients}</p>
                        <span className="text-xs text-gray-500">/ {mockStats.totalClients}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">total clients</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50 border border-orange-100">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Impressions</p>
                      <p className="text-xl font-semibold text-gray-900">{(mockStats.totalImpressions / 1000000).toFixed(1)}M</p>
                    </div>
                    <Eye className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Clicks</p>
                      <p className="text-xl font-semibold text-gray-900">{mockStats.totalClicks.toLocaleString()}</p>
                    </div>
                    <MousePointer className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">CTR</p>
                      <p className="text-xl font-semibold text-gray-900">{mockStats.ctr}%</p>
                    </div>
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversions</p>
                      <p className="text-xl font-semibold text-gray-900">{mockStats.totalConversions.toLocaleString()}</p>
                    </div>
                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Performance chart visualization</p>
                      <p className="text-sm text-gray-400">Connect integrations to see live data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Target className="h-5 w-5 text-green-600" />
                    Client Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.slice(0, 3).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            client.status === 'active' ? 'bg-green-500' : 
                            client.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.industry}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${client.monthlySpend.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">monthly spend</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Facebook Ads Tab */}
          <TabsContent value="facebook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  Facebook Ads Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Facebook className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Facebook Ads</h3>
                  <p className="text-gray-500 mb-4">Connect your Facebook Ads account to see campaign performance</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Facebook Ads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Ads Tab */}
          <TabsContent value="google" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-600" />
                  Google Ads Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Google Ads</h3>
                  <p className="text-gray-500 mb-4">Connect your Google Ads account to see campaign performance</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Google Ads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Go High Level Tab */}
          <TabsContent value="ghl" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Go High Level Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Go High Level</h3>
                  <p className="text-gray-500 mb-4">Connect your GHL account to see CRM and automation data</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Go High Level
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Client Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
            
            <div className="grid gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${
                          client.status === 'active' ? 'bg-green-500' : 
                          client.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h3 className="font-medium text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${client.monthlySpend.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Monthly spend</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{client.lastReportSent}</p>
                          <p className="text-sm text-gray-500">Last report</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Automated Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Weekly Performance Report</h3>
                      <p className="text-sm text-gray-500">Sent every Monday at 9:00 AM</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Monthly Summary Report</h3>
                      <p className="text-sm text-gray-500">Sent on the 1st of each month</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Automated Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyDashboard;


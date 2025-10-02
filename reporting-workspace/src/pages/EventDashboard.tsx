import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Share2,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Facebook,
  Globe,
  Zap,
  FileSpreadsheet,
  Eye,
  MousePointer,
  ShoppingCart,
  Percent
} from "lucide-react";
import { EventMetricsService, EventDashboardData } from "@/services/eventMetricsService";

const EventDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<string>("venue1");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<EventDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock client data for event venues
  const venues = [
    { id: "venue1", name: "Grand Ballroom Hotel", type: "Hotel", location: "Downtown" },
    { id: "venue2", name: "Riverside Conference Center", type: "Conference Center", location: "Waterfront" },
    { id: "venue3", name: "Garden Pavilion", type: "Outdoor Venue", location: "Suburbs" },
  ];

  const selectedVenue = venues.find(v => v.id === selectedClient);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedClient, selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case "7d":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      const dateRange = {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      };

      const data = await EventMetricsService.getComprehensiveMetrics(selectedClient, dateRange);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demonstration
      setDashboardData(getMockDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const getMockDashboardData = (): EventDashboardData => ({
    totalLeads: 156,
    totalSpend: 8500,
    totalRevenue: 285000,
    roi: 33.5,
    facebookMetrics: {
      impressions: 125000,
      clicks: 2340,
      spend: 4200,
      conversions: 89,
      ctr: 1.87,
      cpc: 1.79,
      cpm: 33.60,
      roas: 15.2,
      reach: 45000,
      frequency: 2.8,
      costPerLead: 47.19
    },
    googleMetrics: {
      impressions: 89000,
      clicks: 1890,
      cost: 4300,
      conversions: 67,
      ctr: 2.12,
      cpc: 2.28,
      conversionRate: 3.55,
      costPerConversion: 64.18,
      searchImpressionShare: 78.5,
      qualityScore: 7.2,
      costPerLead: 64.18
    },
    ghlMetrics: {
      totalContacts: 156,
      newContacts: 156,
      totalOpportunities: 89,
      wonOpportunities: 34,
      lostOpportunities: 12,
      totalRevenue: 285000,
      conversionRate: 38.2,
      averageDealSize: 8382,
      pipelineValue: 358000,
      appointmentsScheduled: 67,
      appointmentsCompleted: 52,
      emailsSent: 450,
      emailsOpened: 315,
      emailsClicked: 89,
      smsSent: 234,
      smsReplies: 78
    },
    eventMetrics: {
      totalSubmissions: 156,
      averageGuests: 85,
      totalGuests: 13260,
      eventTypeBreakdown: [
        { type: "Corporate Events", count: 45, percentage: 28.8, averageGuests: 120, averageBudget: 15000 },
        { type: "Weddings", count: 38, percentage: 24.4, averageGuests: 95, averageBudget: 25000 },
        { type: "Birthday Parties", count: 32, percentage: 20.5, averageGuests: 45, averageBudget: 5000 },
        { type: "Anniversary Celebrations", count: 25, percentage: 16.0, averageGuests: 65, averageBudget: 8000 },
        { type: "Other", count: 16, percentage: 10.3, averageGuests: 55, averageBudget: 6000 }
      ],
      monthlyTrends: [
        { month: "2024-01", submissions: 42, averageGuests: 78, totalRevenue: 89000 },
        { month: "2024-02", submissions: 38, averageGuests: 82, totalRevenue: 95000 },
        { month: "2024-03", submissions: 45, averageGuests: 88, totalRevenue: 125000 },
        { month: "2024-04", submissions: 31, averageGuests: 91, totalRevenue: 78000 }
      ],
      leadSourceBreakdown: [
        { source: "Facebook", count: 89, percentage: 57.1, conversionRate: 38.2 },
        { source: "Google", count: 67, percentage: 42.9, conversionRate: 35.8 }
      ],
      budgetRanges: [
        { range: "$0 - $5,000", count: 32, percentage: 20.5 },
        { range: "$5,001 - $15,000", count: 45, percentage: 28.8 },
        { range: "$15,001 - $30,000", count: 38, percentage: 24.4 },
        { range: "$30,001 - $50,000", count: 25, percentage: 16.0 },
        { range: "$50,000+", count: 16, percentage: 10.3 }
      ]
    },
    leadMetrics: {
      facebookCostPerLead: 47.19,
      googleCostPerLead: 64.18,
      overallCostPerLead: 54.49,
      leadToOpportunityRate: 57.1,
      opportunityToWinRate: 38.2,
      averageEventValue: 8382,
      averageGuestsPerEvent: 85,
      mostPopularEventType: "Corporate Events",
      seasonalTrends: [
        { month: "2024-01", leads: 42, events: 16, revenue: 89000 },
        { month: "2024-02", leads: 38, events: 14, revenue: 95000 },
        { month: "2024-03", leads: 45, events: 17, revenue: 125000 },
        { month: "2024-04", leads: 31, events: 12, revenue: 78000 }
      ],
      landingPageConversionRate: 3.2,
      formCompletionRate: 87.5,
      leadSourceBreakdown: [
        { source: "Facebook", leads: 89, cost: 4200, costPerLead: 47.19, conversionRate: 38.2, revenue: 165000, roi: 39.3 },
        { source: "Google", leads: 67, cost: 4300, costPerLead: 64.18, conversionRate: 35.8, revenue: 120000, roi: 27.9 }
      ]
    },
    dateRange: {
      start: "2024-01-01",
      end: "2024-04-30"
    }
  });

  const insights = dashboardData ? EventMetricsService.generateInsights(dashboardData) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading event analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Marketing Dashboard</h1>
              <p className="text-gray-600">
                {selectedVenue ? `${selectedVenue.name} - ${selectedVenue.type}` : "Event Venue Performance"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="default" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Client
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map(venue => (
                  <SelectItem key={venue.id} value={venue.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{venue.name}</div>
                        <div className="text-sm text-gray-500">{venue.type} • {venue.location}</div>
                      </div>
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
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Insights */}
        {insights.length > 0 && (
          <div className="mb-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.type === 'success' ? 'border-l-green-500 bg-green-50' :
                insight.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {insight.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    {insight.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                    {insight.type === 'info' && <Info className="h-5 w-5 text-blue-600 mt-0.5" />}
                    <div>
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      {insight.metric && (
                        <p className="text-sm font-medium text-gray-900 mt-2">{insight.metric}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="facebook">Facebook Ads</TabsTrigger>
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="events">Event Analytics</TabsTrigger>
            <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="forms">Form Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">{dashboardData?.totalLeads}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+12%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">this period</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cost Per Lead</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">${dashboardData?.leadMetrics.overallCostPerLead.toFixed(2)}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">-8%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">average</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">${dashboardData?.totalRevenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+23%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">generated</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ROI</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-gray-900">{dashboardData?.roi.toFixed(1)}x</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">+15%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">return on ad spend</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance Comparison */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Platform Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Facebook className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Facebook Ads</p>
                          <p className="text-sm text-gray-600">{dashboardData?.facebookMetrics.conversions} leads</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${dashboardData?.facebookMetrics.costPerLead.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">cost per lead</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">Google Ads</p>
                          <p className="text-sm text-gray-600">{dashboardData?.googleMetrics.conversions} leads</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${dashboardData?.googleMetrics.costPerLead.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">cost per lead</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Event Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Average Guests per Event</span>
                      <span className="font-semibold text-gray-900">{dashboardData?.leadMetrics.averageGuestsPerEvent}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Most Popular Event Type</span>
                      <span className="font-semibold text-gray-900">{dashboardData?.leadMetrics.mostPopularEventType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Average Event Value</span>
                      <span className="font-semibold text-gray-900">${dashboardData?.leadMetrics.averageEventValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-gray-900">{dashboardData?.leadMetrics.opportunityToWinRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly with specific metrics for each platform */}
          <TabsContent value="facebook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  Facebook Ads Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Eye className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData?.facebookMetrics.impressions.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Impressions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MousePointer className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData?.facebookMetrics.clicks.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Clicks</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Percent className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData?.facebookMetrics.ctr.toFixed(2)}%</p>
                    <p className="text-sm text-gray-600">CTR</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData?.facebookMetrics.conversions}</p>
                    <p className="text-sm text-gray-600">Conversions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tabs would follow similar patterns */}
        </Tabs>
      </div>
    </div>
  );
};

export default EventDashboard;


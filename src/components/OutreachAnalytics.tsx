import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  UserPlus, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Target, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Users,
  Building2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OutreachMetrics {
  totalLeads: number;
  messagesSent: number;
  connectionRequests: number;
  connectionsAccepted: number;
  responsesReceived: number;
  meetingsBooked: number;
  emailsSent: number;
  emailReplies: number;
  automatedLeads: number;
  activeAutomations: number;
  conversionRate: number;
  responseRate: number;
  connectionRate: number;
}

interface StageBreakdown {
  stage: string;
  count: number;
  percentage: number;
}

interface AutomationBreakdown {
  status: string;
  count: number;
  percentage: number;
}

interface RecentActivity {
  name: string;
  company: string;
  action: string;
  date: string;
  status: string;
}

export function OutreachAnalytics() {
  const [metrics, setMetrics] = useState<OutreachMetrics>({
    totalLeads: 0,
    messagesSent: 0,
    connectionRequests: 0,
    connectionsAccepted: 0,
    responsesReceived: 0,
    meetingsBooked: 0,
    emailsSent: 0,
    emailReplies: 0,
    automatedLeads: 0,
    activeAutomations: 0,
    conversionRate: 0,
    responseRate: 0,
    connectionRate: 0,
  });
  
  const [stageBreakdown, setStageBreakdown] = useState<StageBreakdown[]>([]);
  const [automationBreakdown, setAutomationBreakdown] = useState<AutomationBreakdown[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutreachData();
  }, []);

  const fetchOutreachData = async () => {
    try {
      setLoading(true);
      
      // Fetch all leads with outreach data
      const { data: leads, error } = await supabase
        .from("People")
        .select(`
          id,
          Name,
          Company,
          Stage,
          stage_enum,
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
          automation_status_enum,
          "Automation Status",
          created_at,
          updated_at
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Calculate metrics
      const totalLeads = leads?.length || 0;
      const messagesSent = leads?.filter(l => l["Message Sent"]).length || 0;
      const connectionRequests = leads?.filter(l => l["Connection Request"]).length || 0;
      const connectionsAccepted = leads?.filter(l => l["Connection Accepted Date"]).length || 0;
      const responsesReceived = leads?.filter(l => l["LinkedIn Responded"] || l["Email Reply"]).length || 0;
      const meetingsBooked = leads?.filter(l => l["Meeting Booked"]).length || 0;
      const emailsSent = leads?.filter(l => l["Email Sent"]).length || 0;
      const emailReplies = leads?.filter(l => l["Email Reply"]).length || 0;
      const automatedLeads = leads?.filter(l => l.automation_status_enum && l.automation_status_enum !== 'idle').length || 0;
      const activeAutomations = leads?.filter(l => l.automation_status_enum === 'running').length || 0;

      // Calculate rates
      const conversionRate = totalLeads > 0 ? (meetingsBooked / totalLeads) * 100 : 0;
      const responseRate = totalLeads > 0 ? (responsesReceived / totalLeads) * 100 : 0;
      const connectionRate = connectionRequests > 0 ? (connectionsAccepted / connectionRequests) * 100 : 0;

      setMetrics({
        totalLeads,
        messagesSent,
        connectionRequests,
        connectionsAccepted,
        responsesReceived,
        meetingsBooked,
        emailsSent,
        emailReplies,
        automatedLeads,
        activeAutomations,
        conversionRate,
        responseRate,
        connectionRate,
      });

      // Calculate stage breakdown
      const stageCounts: Record<string, number> = {};
      leads?.forEach(lead => {
        const stage = lead.Stage || lead.stage_enum || 'Unknown';
        stageCounts[stage] = (stageCounts[stage] || 0) + 1;
      });

      const stageBreakdownData = Object.entries(stageCounts)
        .map(([stage, count]) => ({
          stage,
          count,
          percentage: totalLeads > 0 ? (count / totalLeads) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

      setStageBreakdown(stageBreakdownData);

      // Calculate automation breakdown
      const automationCounts: Record<string, number> = {};
      leads?.forEach(lead => {
        const status = lead.automation_status_enum || 'idle';
        automationCounts[status] = (automationCounts[status] || 0) + 1;
      });

      const automationBreakdownData = Object.entries(automationCounts)
        .map(([status, count]) => ({
          status,
          count,
          percentage: totalLeads > 0 ? (count / totalLeads) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

      setAutomationBreakdown(automationBreakdownData);

      // Get recent activity (last 10 updates)
      const recentActivityData = leads?.slice(0, 10).map(lead => {
        let action = "Updated";
        let status = "info";
        
        if (lead["Meeting Booked"]) {
          action = "Meeting Booked";
          status = "success";
        } else if (lead["LinkedIn Responded"]) {
          action = "LinkedIn Response";
          status = "success";
        } else if (lead["Email Reply"]) {
          action = "Email Reply";
          status = "success";
        } else if (lead["Connection Accepted Date"]) {
          action = "Connection Accepted";
          status = "success";
        } else if (lead["Message Sent"]) {
          action = "Message Sent";
          status = "info";
        } else if (lead["Connection Request"]) {
          action = "Connection Requested";
          status = "info";
        }

        return {
          name: lead.Name || lead.name || "Unknown",
          company: lead.Company || lead.company || "Unknown",
          action,
          date: lead.updated_at || lead.created_at || "",
          status
        };
      }) || [];

      setRecentActivity(recentActivityData);

    } catch (error) {
      console.error('Error fetching outreach data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'error': return <XCircle className="h-3 w-3 text-red-600" />;
      case 'warning': return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      default: return <Clock className="h-3 w-3 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return "bg-green-100 text-green-800 border-green-200";
      case 'error': return "bg-red-100 text-red-800 border-red-200";
      case 'warning': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Outreach Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Track your outreach performance and conversion metrics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOutreachData}
          className="h-8 px-3 text-xs"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">In pipeline</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 border-green-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.messagesSent}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.responseRate.toFixed(1)}% response rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.connectionsAccepted}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.connectionRate.toFixed(1)}% acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/50 border-orange-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meetings Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.meetingsBooked}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversionRate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-50/50 border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Emails Sent</span>
              <span className="font-medium">{metrics.emailsSent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Email Replies</span>
              <span className="font-medium">{metrics.emailReplies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Reply Rate</span>
              <span className="font-medium">
                {metrics.emailsSent > 0 ? ((metrics.emailReplies / metrics.emailsSent) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50/50 border-indigo-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Automation Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Automated Leads</span>
              <span className="font-medium">{metrics.automatedLeads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Automations</span>
              <span className="font-medium">{metrics.activeAutomations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Automation Rate</span>
              <span className="font-medium">
                {metrics.totalLeads > 0 ? ((metrics.automatedLeads / metrics.totalLeads) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Rate</span>
                <span>{metrics.responseRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.responseRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Connection Rate</span>
                <span>{metrics.connectionRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.connectionRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate</span>
                <span>{metrics.conversionRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.conversionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage and Automation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-amber-50/50 border-amber-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lead Stage Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stageBreakdown.slice(0, 5).map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stage.count}</span>
                    <span className="text-xs text-muted-foreground">({stage.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-50/50 border-rose-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Automation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {automationBreakdown.map((automation, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      automation.status === 'running' ? 'bg-green-500' :
                      automation.status === 'completed' ? 'bg-blue-500' :
                      automation.status === 'paused' ? 'bg-yellow-500' :
                      automation.status === 'failed' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm capitalize">{automation.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{automation.count}</span>
                    <span className="text-xs text-muted-foreground">({automation.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-50/50 border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white/70">
                <div className="flex items-center gap-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <div className="text-sm font-medium">{activity.name}</div>
                    <div className="text-xs text-muted-foreground">{activity.company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={activity.action} size="sm" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

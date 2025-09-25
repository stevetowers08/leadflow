import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  UserPlus, 
  MessageSquare, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Users,
  Building2,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface AutomationActivity {
  id: string;
  type: 'automation_started' | 'connection_request' | 'message_sent' | 'response_received' | 'meeting_booked' | 'email_sent' | 'email_reply' | 'stage_updated';
  person_name: string;
  company_name: string;
  company_role?: string;
  occurred_at: string;
  details?: string;
  stage?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const Automations = () => {
  const [activities, setActivities] = useState<AutomationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    connectionsSent: 0,
    messagesSent: 0,
    responsesReceived: 0,
    meetingsBooked: 0
  });

  const fetchAutomationActivities = async () => {
    try {
      setLoading(true);
      
      // Fetch people with automation activities
      const { data: peopleData, error } = await supabase
        .from("people")
        .select(`
          id,
          name,
          company_role,
          automation_started_at,
          connection_request_date,
          connection_accepted_date,
          message_sent_date,
          response_date,
          meeting_booked,
          meeting_date,
          email_sent_date,
          email_reply_date,
          stage_updated,
          last_interaction_at,
          stage,
          companies!inner(name)
        `)
        .not('automation_started_at', 'is', null)
        .order('last_interaction_at', { ascending: false });

      if (error) throw error;

      // Transform data into activities
      const activitiesList: AutomationActivity[] = [];
      
      peopleData?.forEach(person => {
        const companyName = person.companies?.name || 'Unknown Company';
        
        // Automation started
        if (person.automation_started_at) {
          activitiesList.push({
            id: `${person.id}-automation-started`,
            type: 'automation_started',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.automation_started_at,
            details: `Automation started for ${person.name} at ${companyName}`,
            stage: person.stage,
            icon: <Bot className="h-4 w-4" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          });
        }

        // Connection request sent
        if (person.connection_request_date) {
          activitiesList.push({
            id: `${person.id}-connection-request`,
            type: 'connection_request',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.connection_request_date,
            details: `Connection request sent to ${person.name}`,
            stage: person.stage,
            icon: <UserPlus className="h-4 w-4" />,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          });
        }

        // Message sent
        if (person.message_sent_date) {
          activitiesList.push({
            id: `${person.id}-message-sent`,
            type: 'message_sent',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.message_sent_date,
            details: `Message sent to ${person.name}`,
            stage: person.stage,
            icon: <MessageSquare className="h-4 w-4" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          });
        }

        // Response received
        if (person.response_date) {
          activitiesList.push({
            id: `${person.id}-response-received`,
            type: 'response_received',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.response_date,
            details: `Response received from ${person.name}`,
            stage: person.stage,
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
          });
        }

        // Meeting booked
        if (person.meeting_booked === 'true' && person.meeting_date) {
          activitiesList.push({
            id: `${person.id}-meeting-booked`,
            type: 'meeting_booked',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.meeting_date,
            details: `Meeting booked with ${person.name}`,
            stage: person.stage,
            icon: <Calendar className="h-4 w-4" />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          });
        }

        // Email sent
        if (person.email_sent_date) {
          activitiesList.push({
            id: `${person.id}-email-sent`,
            type: 'email_sent',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.email_sent_date,
            details: `Email sent to ${person.name}`,
            stage: person.stage,
            icon: <Mail className="h-4 w-4" />,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
          });
        }

        // Email reply
        if (person.email_reply_date) {
          activitiesList.push({
            id: `${person.id}-email-reply`,
            type: 'email_reply',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.email_reply_date,
            details: `Email reply received from ${person.name}`,
            stage: person.stage,
            icon: <Mail className="h-4 w-4" />,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50'
          });
        }
      });

      // Sort by occurred_at date
      activitiesList.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());

      setActivities(activitiesList);

      // Calculate stats
      const statsData = {
        totalAutomations: peopleData?.length || 0,
        activeAutomations: peopleData?.filter(p => p.automation_started_at).length || 0,
        connectionsSent: activitiesList.filter(a => a.type === 'connection_request').length,
        messagesSent: activitiesList.filter(a => a.type === 'message_sent').length,
        responsesReceived: activitiesList.filter(a => a.type === 'response_received').length,
        meetingsBooked: activitiesList.filter(a => a.type === 'meeting_booked').length
      };

      setStats(statsData);

    } catch (error) {
      console.error('Error fetching automation activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomationActivities();
  }, []);

  const getActivityTypeLabel = (type: string) => {
    const labels = {
      'automation_started': 'Automation Started',
      'connection_request': 'Connection Request',
      'message_sent': 'Message Sent',
      'response_received': 'Response Received',
      'meeting_booked': 'Meeting Booked',
      'email_sent': 'Email Sent',
      'email_reply': 'Email Reply',
      'stage_updated': 'Stage Updated'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStageBadgeColor = (stage?: string) => {
    const colors = {
      'new': 'bg-gray-100 text-gray-800',
      'connection_requested': 'bg-blue-100 text-blue-800',
      'connected': 'bg-green-100 text-green-800',
      'messaged': 'bg-purple-100 text-purple-800',
      'replied': 'bg-emerald-100 text-emerald-800',
      'meeting_booked': 'bg-orange-100 text-orange-800',
      'meeting_held': 'bg-yellow-100 text-yellow-800',
      'disqualified': 'bg-red-100 text-red-800',
      'in queue': 'bg-indigo-100 text-indigo-800',
      'lead_lost': 'bg-gray-100 text-gray-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h1 className="text-base font-semibold tracking-tight">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Recent automation activities and performance metrics
          </p>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading automations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats in Top Right */}
      <div className="grid grid-cols-12 gap-4 items-center border-b pb-3">
        <div className="col-span-6">
          <h1 className="text-base font-semibold tracking-tight">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Recent automation activities and performance metrics
          </p>
        </div>
        
        {/* Stats Cards - Top Right */}
        <div className="col-span-6 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">{stats.totalAutomations}</span>
                <span className="text-sm text-gray-600">Total</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">{stats.activeAutomations}</span>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">{stats.connectionsSent}</span>
                <span className="text-sm text-gray-600">Sent</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[120px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">{stats.messagesSent}</span>
                <span className="text-sm text-gray-600">Messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {activities.length === 0 ? (
        <div className="p-8 text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automation activities yet</h3>
          <p className="text-gray-500">Automation activities will appear here as they occur.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
              <div className="col-span-1">Type</div>
              <div className="col-span-3">Person</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-3">Time</div>
            </div>
          </div>
          
          {/* List Items */}
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <div key={activity.id} className="px-4 py-3 hover:bg-gray-50/80 hover:shadow-sm hover:border-gray-200 hover:scale-[1.01] hover:z-10 relative transition-all duration-200">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Type */}
                  <div className="col-span-1">
                    <div className={`p-1.5 rounded-full ${activity.bgColor} w-fit`}>
                      <div className={activity.color}>
                        {activity.icon}
                      </div>
                    </div>
                  </div>

                  {/* Person */}
                  <div className="col-span-3">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {activity.person_name}
                    </div>
                    {activity.company_role && (
                      <div className="text-xs text-gray-500 truncate">
                        {activity.company_role}
                      </div>
                    )}
                  </div>

                  {/* Company */}
                  <div className="col-span-3">
                    <div className="text-sm text-gray-600 truncate">
                      {activity.company_name}
                    </div>
                  </div>

                  {/* Stage */}
                  <div className="col-span-2">
                    {activity.stage ? (
                      <Badge className={`text-xs ${getStageBadgeColor(activity.stage)}`}>
                        {activity.stage.replace('_', ' ')}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>

                  {/* Time */}
                  <div className="col-span-3">
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(activity.occurred_at).toLocaleString('en-AU', {
                        timeZone: 'Australia/Sydney',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
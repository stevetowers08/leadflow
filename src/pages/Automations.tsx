import { StatusBadge } from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Page } from '@/design-system/components';
import { supabase } from '@/integrations/supabase/client';
import { format, isThisMonth, isThisWeek, isToday } from 'date-fns';
import {
  Bot,
  Calendar,
  CheckCircle,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AutomationActivity {
  id: string;
  type:
    | 'automation_started'
    | 'connection_request'
    | 'message_sent'
    | 'response_received'
    | 'meeting_booked'
    | 'email_sent'
    | 'email_reply'
    | 'stage_updated';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fetchAutomationActivities = async () => {
    try {
      setLoading(true);

      // Fetch people with automation activities - join with companies to get company names
      const { data: peopleData, error } = await supabase
        .from('people')
        .select(
          `
          id,
          name,
          company_role,
          automation_started_at,
          connection_request_date,
          connection_accepted_date,
          last_reply_at,
          response_date,
          meeting_booked,
          meeting_date,
          email_reply_date,
          stage_updated,
          last_interaction_at,
          people_stage,
          companies(name)
        `
        )
        .not('automation_started_at', 'is', null)
        .order('last_interaction_at', { ascending: false })
        .limit(50); // Limit results to avoid performance issues

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
            stage: person.people_stage,
            icon: <Bot className='h-4 w-4' />,
            color: 'text-primary',
            bgColor: 'bg-primary-light',
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
            stage: person.people_stage,
            icon: <UserPlus className='h-4 w-4' />,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          });
        }

        // Message sent
        if (person.last_reply_at) {
          activitiesList.push({
            id: `${person.id}-message-sent`,
            type: 'message_sent',
            person_name: person.name,
            company_name: companyName,
            company_role: person.company_role,
            occurred_at: person.last_reply_at,
            details: `Message sent to ${person.name}`,
            stage: person.people_stage,
            icon: <MessageSquare className='h-4 w-4' />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
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
            stage: person.people_stage,
            icon: <CheckCircle className='h-4 w-4' />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
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
            stage: person.people_stage,
            icon: <Calendar className='h-4 w-4' />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
          });
        }

        // Email sent - removed since email_sent_date column doesn't exist
        // TODO: Implement email tracking when email_sends table is properly integrated

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
            stage: person.people_stage,
            icon: <Mail className='h-4 w-4' />,
            color: 'text-accent',
            bgColor: 'bg-accent/10',
          });
        }
      });

      // Sort by occurred_at date
      activitiesList.sort(
        (a, b) =>
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
      );

      setActivities(activitiesList);

      // Calculate stats
      const statsData = {
        totalAutomations: peopleData?.length || 0,
        activeAutomations:
          peopleData?.filter(person => person.automation_started_at).length ||
          0,
        connectionsSent: activitiesList.filter(
          activity => activity.type === 'connection_request'
        ).length,
        messagesSent: activitiesList.filter(
          activity => activity.type === 'message_sent'
        ).length,
        responsesReceived: activitiesList.filter(
          activity => activity.type === 'response_received'
        ).length,
        meetingsBooked: activitiesList.filter(
          activity => activity.type === 'meeting_booked'
        ).length,
      };
    } catch (error) {
      console.error('Error fetching automation activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group activities by day
  const groupActivitiesByDay = (activities: AutomationActivity[]) => {
    const grouped: { [key: string]: AutomationActivity[] } = {};

    activities.forEach(activity => {
      const date = new Date(activity.occurred_at);
      const dateKey = format(date, 'EEE, d MMMM yy').toUpperCase();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    return grouped;
  };

  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      searchTerm === '' ||
      activity.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.company_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || activity.type === filterType;

    const matchesTime =
      filterTime === 'all' ||
      (filterTime === 'today' && isToday(new Date(activity.occurred_at))) ||
      (filterTime === 'week' && isThisWeek(new Date(activity.occurred_at))) ||
      (filterTime === 'month' && isThisMonth(new Date(activity.occurred_at)));

    return matchesSearch && matchesType && matchesTime;
  });

  const groupedActivities = groupActivitiesByDay(filteredActivities);

  // Pagination logic
  const totalPages = Math.ceil(filteredActivities.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
  const paginatedGroupedActivities = groupActivitiesByDay(paginatedActivities);

  useEffect(() => {
    fetchAutomationActivities();
  }, []);

  const getActivityTypeLabel = (type: string) => {
    const labels = {
      automation_started: 'Automation Started',
      connection_request: 'Connection Request',
      message_sent: 'Message Sent',
      response_received: 'Response Received',
      meeting_booked: 'Meeting Booked',
      email_sent: 'Email Sent',
      email_reply: 'Email Reply',
      stage_updated: 'Stage Updated',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStageBadgeColor = (stage?: string) => {
    const colors = {
      new: 'bg-muted text-muted-foreground',
      connection_requested:
        'bg-primary-light text-primary border-primary-medium',
      connected: 'bg-green-100 text-green-800',
      messaged: 'bg-purple-100 text-purple-800',
      replied: 'bg-emerald-100 text-emerald-800',
      meeting_booked: 'bg-orange-100 text-orange-800',
      meeting_held: 'bg-yellow-100 text-yellow-800',
      disqualified: 'bg-red-100 text-red-800',
      'in queue': 'bg-accent/20 text-accent',
      lead_lost: 'bg-muted text-muted-foreground',
    };
    return (
      colors[stage as keyof typeof colors] || 'bg-muted text-muted-foreground'
    );
  };

  return (
    <Page title='Automations' hideHeader>
      <div className='space-y-6'>
        {/* Filters and Search - Full Width */}
        <div className='flex items-center gap-4 w-full'>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className='px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white'
          >
            <option value='all'>All automation types</option>
            <option value='automation_started'>Automation Started</option>
            <option value='connection_request'>Connection Request</option>
            <option value='message_sent'>Message Sent</option>
            <option value='response_received'>Response Received</option>
            <option value='meeting_booked'>Meeting Booked</option>
            <option value='email_sent'>Email Sent</option>
            <option value='email_reply'>Email Reply</option>
          </select>

          <select
            value={filterTime}
            onChange={e => setFilterTime(e.target.value)}
            className='px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white'
          >
            <option value='all'>All time</option>
            <option value='today'>Today</option>
            <option value='week'>This week</option>
            <option value='month'>This month</option>
          </select>

          <Sparkles className='h-4 w-4 text-green-500' />

          <div className='flex-1 max-w-md'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
        </div>

        {/* Activities grouped by day */}
        {Object.keys(paginatedGroupedActivities).length === 0 ? (
          <div className='p-8 text-center'>
            <Bot className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-medium text-foreground mb-2'>
              No automation activities yet
            </h3>
            <p className='text-muted-foreground'>
              Automation activities will appear here as they occur.
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {Object.entries(paginatedGroupedActivities).map(
              ([date, dayActivities]) => (
                <div key={date} className='space-y-3'>
                  {/* Date Header */}
                  <div className='text-sm font-semibold text-foreground bg-muted px-4 py-2 rounded-lg'>
                    {date}
                  </div>

                  {/* Activities for this day */}
                  <div className='space-y-2'>
                    {dayActivities.map(activity => (
                      <div
                        key={activity.id}
                        className='bg-white border border-gray-200 rounded-lg px-4 py-1.5 hover:shadow-sm transition-shadow'
                      >
                        <div className='grid grid-cols-12 gap-4 items-center'>
                          {/* Activity Icon */}
                          <div className='col-span-1'>
                            <div
                              className={`p-1 rounded-full ${activity.bgColor} w-fit`}
                            >
                              <div className={activity.color}>
                                {activity.icon}
                              </div>
                            </div>
                          </div>

                          {/* Activity Type */}
                          <div className='col-span-2'>
                            <span className='text-sm font-medium text-foreground'>
                              {getActivityTypeLabel(activity.type)}
                            </span>
                          </div>

                          {/* Person Name */}
                          <div className='col-span-3'>
                            <div className='text-sm font-medium text-foreground truncate'>
                              {activity.person_name}
                            </div>
                            {activity.company_role && (
                              <div className='text-xs text-muted-foreground truncate'>
                                {activity.company_role}
                              </div>
                            )}
                          </div>

                          {/* Company */}
                          <div className='col-span-3'>
                            <div className='text-sm text-muted-foreground truncate'>
                              {activity.company_name}
                            </div>
                          </div>

                          {/* Stage */}
                          <div className='col-span-2'>
                            {activity.stage ? (
                              <StatusBadge status={activity.stage} size='sm' />
                            ) : (
                              <span className='text-xs text-muted-foreground'>
                                -
                              </span>
                            )}
                          </div>

                          {/* Time */}
                          <div className='col-span-1 text-right'>
                            <div className='text-sm text-muted-foreground'>
                              {format(
                                new Date(activity.occurred_at),
                                'dd/MM/yyyy'
                              )}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {format(new Date(activity.occurred_at), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && filteredActivities.length === 0 && (
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='border rounded-lg p-4 animate-pulse'>
                <div className='flex items-center gap-4'>
                  <div className='h-10 w-10 bg-gray-200 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-3/4' />
                    <div className='h-3 bg-gray-100 rounded w-1/2' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredActivities.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredActivities.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={size => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </Page>
  );
};

export default Automations;

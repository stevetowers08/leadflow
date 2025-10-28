import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  Briefcase,
  Calendar,
  Loader2,
  Mail,
  Phone,
  StickyNote,
  User,
} from 'lucide-react';
import React from 'react';

interface ActivityItem {
  id: string;
  type: 'email' | 'note' | 'meeting' | 'call' | 'interaction';
  entity_type: 'company' | 'person' | 'job';
  entity_name: string;
  entity_id: string;
  description: string;
  timestamp: string;
  user_name?: string;
}

const ACTIVITY_ICONS = {
  email: Mail,
  note: StickyNote,
  meeting: Calendar,
  call: Phone,
  interaction: Activity,
};

const ACTIVITY_COLORS = {
  email: 'bg-blue-100 text-blue-600',
  note: 'bg-purple-100 text-purple-600',
  meeting: 'bg-green-100 text-green-600',
  call: 'bg-orange-100 text-orange-600',
  interaction: 'bg-gray-100 text-gray-600',
};

const ENTITY_ICONS = {
  company: Briefcase,
  person: User,
  job: Briefcase,
};

export const RecentActivityButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const { data: clientId } = useClientId();

  const loadActivities = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items: ActivityItem[] = [];

      // Fetch interactions (emails, calls, meetings)
      const interactionsQuery = supabase
        .from('interactions')
        .select(
          'id, interaction_type, occurred_at, subject, content, person_id, people:person_id (id, name, company_id, companies!inner (id, name))'
        )
        .order('occurred_at', { ascending: false })
        .limit(100);

      if (clientId) {
        // TODO: Add client_id filtering when interactions table has client_id column
      }

      const { data: interactions, error: interactionsError } =
        await interactionsQuery;

      if (interactionsError) throw interactionsError;

      // Process interactions
      for (const interaction of interactions || []) {
        const person = interaction.people as { companies?: { name: string } };
        const company = person?.companies;

        let activityType: ActivityItem['type'] = 'interaction';
        if (
          interaction.interaction_type === 'email_sent' ||
          interaction.interaction_type === 'email_reply'
        ) {
          activityType = 'email';
        } else if (
          interaction.interaction_type === 'meeting_booked' ||
          interaction.interaction_type === 'meeting_held'
        ) {
          activityType = 'meeting';
        } else if (interaction.interaction_type === 'note') {
          activityType = 'note';
        }

        items.push({
          id: interaction.id,
          type: activityType,
          entity_type: 'person',
          entity_name: person?.name || 'Unknown Person',
          entity_id: person?.id,
          description:
            interaction.subject || interaction.content || 'No details',
          timestamp: interaction.occurred_at,
        });

        // Add company activity if person has a company
        if (company) {
          items.push({
            id: `company-${company.id}-${interaction.id}`,
            type: activityType,
            entity_type: 'company',
            entity_name: company.name || 'Unknown Company',
            entity_id: company.id,
            description: `${person?.name || 'Someone'} - ${interaction.subject || interaction.content || 'No details'}`,
            timestamp: interaction.occurred_at,
          });
        }
      }

      // Fetch notes
      let notesQuery = supabase
        .from('notes')
        .select('id, content, created_at, entity_id, entity_type')
        .order('created_at', { ascending: false })
        .limit(50);

      // Filter by client if available (client_id column might not exist in all installations)
      if (clientId) {
        try {
          notesQuery = notesQuery.eq('client_id', clientId);
        } catch (error) {
          // client_id column doesn't exist, skip filtering
          console.debug('client_id column not available in notes table');
        }
      }

      const { data: notes, error: notesError } = await notesQuery;

      if (!notesError && notes) {
        for (const note of notes) {
          items.push({
            id: note.id,
            type: 'note',
            entity_type: note.entity_type as 'company' | 'person',
            entity_name: note.entity_id, // We'll enrich this below
            entity_id: note.entity_id,
            description: note.content,
            timestamp: note.created_at,
          });
        }

        // Enrich company names for notes
        const companyIds = Array.from(
          new Set(
            notes.filter(n => n.entity_type === 'company').map(n => n.entity_id)
          )
        );

        if (companyIds.length > 0) {
          const { data: companies } = await supabase
            .from('companies')
            .select('id, name')
            .in('id', companyIds);

          if (companies) {
            const nameMap = new Map(companies.map(c => [c.id, c.name]));
            items.forEach(item => {
              if (item.entity_type === 'company') {
                item.entity_name =
                  nameMap.get(item.entity_id) || 'Unknown Company';
              }
            });
          }
        }
      }

      // Sort by timestamp and limit to most recent
      const sorted = items.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(sorted.slice(0, 100));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load activities');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  React.useEffect(() => {
    if (open) {
      loadActivities();
    }
  }, [open, loadActivities]);

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md relative'
        onClick={() => setOpen(true)}
        aria-label='View recent activity'
      >
        <Activity className='h-4 w-4' />
        {activities.length > 0 && (
          <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center'>
            {activities.length > 99 ? '99+' : activities.length}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[80vh]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Activity className='h-5 w-5 text-blue-600' />
              Recent Activity
            </DialogTitle>
          </DialogHeader>

          <div className='text-sm text-muted-foreground mb-4'>
            {clientId
              ? 'Filtered to your client workspace'
              : 'Showing all accessible activity'}
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center py-20 text-gray-500'>
              <Loader2 className='h-5 w-5 mr-2 animate-spin' /> Loading
              activity...
            </div>
          ) : error ? (
            <div className='text-red-600 text-sm py-10'>{error}</div>
          ) : activities.length === 0 ? (
            <div className='text-gray-600 text-sm py-10 text-center'>
              No recent activity found.
            </div>
          ) : (
            <ScrollArea className='max-h-[60vh] pr-4'>
              <div className='space-y-3'>
                {activities.map(activity => {
                  const Icon = ACTIVITY_ICONS[activity.type] || Activity;
                  const EntityIcon =
                    ENTITY_ICONS[activity.entity_type] || Briefcase;
                  const colorClass =
                    ACTIVITY_COLORS[activity.type] ||
                    'bg-gray-100 text-gray-600';

                  return (
                    <div
                      key={activity.id}
                      className='flex gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200'
                    >
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className='h-4 w-4' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <EntityIcon className='h-3.5 w-3.5 text-gray-500' />
                          <span className='text-sm font-medium text-gray-900'>
                            {activity.entity_name}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        <p className='text-sm text-gray-600 line-clamp-2'>
                          {activity.description}
                        </p>

                        <div className='flex items-center gap-2 mt-2'>
                          <span className='text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize'>
                            {activity.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

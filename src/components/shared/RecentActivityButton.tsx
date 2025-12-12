import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SmallSlidePanel } from '@/components/ui/SmallSlidePanel';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import {
  generateMockRecentActivity,
  shouldUseMockData,
} from '@/utils/mockData';
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
import { useSlidePanel } from '@/contexts/SlidePanelContext';

interface ActivityItem {
  id: string;
  type: 'email' | 'note' | 'meeting' | 'call' | 'interaction';
  entity_type: 'company' | 'person' | 'contact';
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
  email: 'bg-blue-100 text-primary',
  note: 'bg-purple-100 text-primary',
  meeting: 'bg-green-100 text-success',
  call: 'bg-orange-100 text-warning',
  interaction: 'bg-gray-100 text-muted-foreground',
};

const ENTITY_ICONS = {
  company: Briefcase,
  person: User,
  job: Briefcase,
};

export const RecentActivityButton: React.FC = () => {
  const { openPanel, setOpenPanel, closePanel } = useSlidePanel();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const { data: clientId } = useClientId();
  const open = openPanel === 'activity';

  const loadActivities = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use mock data in development if enabled
      if (shouldUseMockData()) {
        const mockActivities = generateMockRecentActivity();
        setActivities(mockActivities);
        setIsLoading(false);
        return;
      }

      const items: ActivityItem[] = [];

      // Interactions table removed - no longer used

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
        className='h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-gray-200 rounded-md relative'
        aria-label='View recent activity'
        onClick={() => setOpenPanel(open ? null : 'activity')}
      >
        <Activity className='h-4 w-4' />
        {activities.length > 0 && (
          <span className='absolute -top-1 -right-1'>
            <Badge className='h-4 min-w-[1rem] text-xs px-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none'>
              {activities.length > 99 ? '99+' : activities.length}
            </Badge>
          </span>
        )}
      </Button>

      <SmallSlidePanel
        isOpen={open}
        onClose={closePanel}
        title='Recent Activity'
        headerActions={
          clientId ? (
            <span className='text-xs text-muted-foreground'>
              Your workspace
            </span>
          ) : undefined
        }
      >
        <div className='flex-1 overflow-hidden -mx-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <div className='flex flex-col items-center gap-3'>
                <Loader2 className='h-6 w-6 animate-spin text-primary' />
                <p className='text-sm text-muted-foreground'>
                  Loading activity...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center py-16 px-4'>
              <div className='h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3'>
                <Activity className='h-6 w-6 text-destructive' />
              </div>
              <p className='text-sm font-medium text-destructive mb-1'>
                Error loading activity
              </p>
              <p className='text-xs text-destructive text-center'>{error}</p>
            </div>
          ) : activities.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-4'>
              <div className='h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
                <Activity className='h-8 w-8 text-muted-foreground' />
              </div>
              <p className='text-sm font-medium text-foreground mb-1'>
                No recent activity
              </p>
              <p className='text-xs text-muted-foreground text-center'>
                Activity will appear here as things happen
              </p>
            </div>
          ) : (
            <ScrollArea className='h-full'>
              <div className='py-3'>
                {activities.map(activity => {
                  const Icon = ACTIVITY_ICONS[activity.type] || Activity;
                  const EntityIcon =
                    ENTITY_ICONS[activity.entity_type] || Briefcase;
                  const colorClass =
                    ACTIVITY_COLORS[activity.type] ||
                    'bg-gray-100 text-muted-foreground';

                  return (
                    <div
                      key={activity.id}
                      className='flex gap-3 px-3 py-3.5 hover:bg-muted/80 active:bg-gray-100 transition-all'
                    >
                      <div
                        className={`p-2.5 rounded-xl flex-shrink-0 shadow-sm ${colorClass}`}
                      >
                        <Icon className='h-4 w-4' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1.5'>
                          <EntityIcon className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='text-sm font-semibold text-foreground line-clamp-1'>
                            {activity.entity_name}
                          </span>
                        </div>

                        <p className='text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed'>
                          {activity.description}
                        </p>

                        <div className='flex items-center gap-2'>
                          <span className='text-xs px-2 py-0.5 rounded-md bg-gray-100 text-foreground capitalize font-medium'>
                            {activity.type}
                          </span>
                          <span className='text-xs text-muted-foreground font-medium'>
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </SmallSlidePanel>
    </>
  );
};

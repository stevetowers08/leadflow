import React, { useMemo, useState, useCallback } from 'react';
import { PersonReplyAnalytics } from '@/components/analytics/PersonReplyAnalytics';
import { LeadDetailsSlideOut } from '@/components/slide-out/LeadDetailsSlideOut';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { formatDistanceToNow } from 'date-fns';
import {
  Building2,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  StickyNote,
  User,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from 'lucide-react';

// RecentPerson type - inline definition
type RecentPerson = {
  id: string;
  name: string;
  email_address?: string | null;
  company_role?: string | null;
  employee_location?: string | null;
  company_name?: string | null;
  company_logo_url?: string | null;
  people_stage?: string | null;
  reply_type?: string | null;
  created_at: string;
  [key: string]: unknown;
};

interface RecentPeopleTabsProps {
  people: RecentPerson[];
  loading: boolean;
}

export const RecentPeopleTabs: React.FC<RecentPeopleTabsProps> = ({
  people,
  loading,
}) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('unassigned');

  // Filter people by assignment status
  const filteredPeople = useMemo(() => {
    const unassigned = people.filter(person => !person.assigned_to);
    const assignedToMe = people.filter(
      person => person.assigned_to === user?.id
    );
    const recentlyAssigned = people.filter(
      person => person.assigned_to && person.assigned_to !== user?.id
    );

    return {
      unassigned,
      assignedToMe,
      recentlyAssigned,
    };
  }, [people, user?.id]);

  const renderPersonCard = React.useCallback(
    (person: RecentPerson) => (
      <div
        key={person.id}
        className='group p-6 bg-white rounded-lg border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer'
        onClick={() => {
          setSelectedPersonId(person.id);
          setIsSlideOutOpen(true);
        }}
      >
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-2'>
              <h4 className='font-medium text-foreground truncate'>
                {person.name}
              </h4>
              {person.notes_count &&
              typeof person.notes_count === 'number' &&
              person.notes_count > 0 ? (
                <div className='flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full'>
                  <StickyNote className='h-3 w-3' />
                  <span>{person.notes_count}</span>
                </div>
              ) : null}
              {/* Reply Type Badge */}
              {person.reply_type && (
                <div
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    person.reply_type === 'interested'
                      ? 'text-success bg-success/10'
                      : person.reply_type === 'not_interested'
                        ? 'text-destructive bg-destructive/10'
                        : 'text-warning bg-warning/10'
                  }`}
                >
                  {person.reply_type === 'interested' && (
                    <CheckCircle className='h-3 w-3' />
                  )}
                  {person.reply_type === 'not_interested' && (
                    <XCircle className='h-3 w-3' />
                  )}
                  {person.reply_type === 'maybe' && (
                    <HelpCircle className='h-3 w-3' />
                  )}
                  <span>{getStatusDisplayText(person.reply_type)}</span>
                </div>
              )}
            </div>

            {person.email_address && (
              <div className='flex items-center gap-1 text-sm text-muted-foreground mb-1'>
                <Mail className='h-3 w-3' />
                <span className='truncate'>{person.email_address}</span>
              </div>
            )}

            {person.company_name && (
              <div className='flex items-center gap-1 text-sm text-muted-foreground mb-1'>
                <Building2 className='h-3 w-3' />
                <span className='truncate'>{person.company_name}</span>
              </div>
            )}

            {person.company_role && (
              <div className='text-sm text-muted-foreground mb-1 truncate'>
                {person.company_role}
              </div>
            )}

            {person.employee_location && (
              <div className='flex items-center gap-1 text-sm text-muted-foreground mb-2'>
                <MapPin className='h-3 w-3' />
                <span className='truncate'>{person.employee_location}</span>
              </div>
            )}

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                {person.people_stage && (
                  <Badge variant='outline' className='text-xs'>
                    {getStatusDisplayText(person.people_stage)}
                  </Badge>
                )}
                <span className='text-xs text-muted-foreground'>
                  {formatDistanceToNow(new Date(person.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <Button
                variant='ghost'
                size='sm'
                className='opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={e => {
                  e.stopPropagation();
                  setSelectedPersonId(person.id);
                  setIsSlideOutOpen(true);
                }}
              >
                <ExternalLink className='h-3 w-3' />
              </Button>
            </div>
          </div>

          {person.company_logo_url && (
            <div className='ml-3 flex-shrink-0'>
              <img
                src={person.company_logo_url}
                alt={person.company_name || 'Company'}
                className='w-8 h-8 rounded-full object-cover'
              />
            </div>
          )}
        </div>

        {/* Reply Analytics Summary */}
        <div className='mt-3 pt-3 border-t border-gray-100'>
          <PersonReplyAnalytics
            person={{
              id: person.id,
              name: person.name,
              people_stage: person.people_stage || null,
              reply_type: (person.reply_type === 'interested' ||
              person.reply_type === 'not_interested' ||
              person.reply_type === 'maybe'
                ? person.reply_type
                : null) as 'interested' | 'not_interested' | 'maybe' | null,
            }}
            showDetails={false}
          />
        </div>
      </div>
    ),
    [setSelectedPersonId, setIsSlideOutOpen]
  );

  const renderPeopleList = React.useCallback(
    (peopleList: RecentPerson[], emptyMessage: string) => {
      if (loading) {
        return (
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='p-4 bg-muted rounded-lg animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2 mb-1'></div>
                <div className='h-3 bg-gray-200 rounded w-2/3'></div>
              </div>
            ))}
          </div>
        );
      }

      if (peopleList.length === 0) {
        return (
          <div className='text-center py-8 text-muted-foreground'>
            <Users className='h-8 w-8 mx-auto mb-2 opacity-50' />
            <p className='text-sm'>{emptyMessage}</p>
          </div>
        );
      }

      return (
        <div className='space-y-4 max-h-[500px] overflow-y-auto'>
          {peopleList.map(renderPersonCard)}
        </div>
      );
    },
    [renderPersonCard, loading]
  );

  return (
    <>
      <Card className='bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-base font-medium text-foreground'>
            <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 border border-primary/10'>
              <Users className='h-4 w-4 text-primary' />
            </div>
            Recent People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger
                value='unassigned'
                className='flex items-center gap-1'
              >
                <UserX className='h-3 w-3' />
                Unassigned
                {filteredPeople.unassigned.length > 0 && (
                  <Badge variant='secondary' className='ml-1 text-xs'>
                    {filteredPeople.unassigned.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value='assignedToMe'
                className='flex items-center gap-1'
              >
                <User className='h-3 w-3' />
                Mine
                {filteredPeople.assignedToMe.length > 0 && (
                  <Badge variant='secondary' className='ml-1 text-xs'>
                    {filteredPeople.assignedToMe.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value='recentlyAssigned'
                className='flex items-center gap-1'
              >
                <UserCheck className='h-3 w-3' />
                Assigned
                {filteredPeople.recentlyAssigned.length > 0 && (
                  <Badge variant='secondary' className='ml-1 text-xs'>
                    {filteredPeople.recentlyAssigned.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='unassigned' className='mt-4'>
              {renderPeopleList(
                filteredPeople.unassigned,
                'No unassigned people found'
              )}
            </TabsContent>

            <TabsContent value='assignedToMe' className='mt-4'>
              {renderPeopleList(
                filteredPeople.assignedToMe,
                'No people assigned to you'
              )}
            </TabsContent>

            <TabsContent value='recentlyAssigned' className='mt-4'>
              {renderPeopleList(
                filteredPeople.recentlyAssigned,
                'No recently assigned people'
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lead Details Slide-Out */}
      <LeadDetailsSlideOut
        leadId={selectedPersonId}
        isOpen={isSlideOutOpen}
        onClose={() => {
          setIsSlideOutOpen(false);
          setSelectedPersonId(null);
        }}
      />
    </>
  );
};

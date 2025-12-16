'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShows, createShow } from '@/services/showsService';
import { getCompaniesForShow } from '@/services/showCompaniesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Building2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Page } from '@/design-system/components';

export default function ShowsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    city: '',
    venue: '',
  });

  const queryClient = useQueryClient();

  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: () => getShows(),
  });

  const createMutation = useMutation({
    mutationFn: createShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows'] });
      setIsCreateOpen(false);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        city: '',
        venue: '',
      });
      toast.success('Show created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create show', {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Show name is required');
      return;
    }
    createMutation.mutate({
      name: formData.name.trim(),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      city: formData.city.trim() || null,
      venue: formData.venue.trim() || null,
    });
  };

  return (
    <Page title='Shows' loading={isLoading}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                Create Show
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Show</DialogTitle>
                  <DialogDescription>
                    Add a new exhibition show to track your leads
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Show Name *</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder='e.g., Tech Expo 2025'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='start_date'>Start Date</Label>
                      <Input
                        id='start_date'
                        type='date'
                        value={formData.start_date}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            start_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='end_date'>End Date</Label>
                      <Input
                        id='end_date'
                        type='date'
                        value={formData.end_date}
                        onChange={e =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      value={formData.city}
                      onChange={e =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder='e.g., San Francisco'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='venue'>Venue</Label>
                    <Input
                      id='venue'
                      value={formData.venue}
                      onChange={e =>
                        setFormData({ ...formData, venue: e.target.value })
                      }
                      placeholder='e.g., Moscone Center'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create Show'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {shows.length === 0 ? (
          <div className='text-center py-12 space-y-4'>
            <Calendar className='h-12 w-12 mx-auto text-muted-foreground' />
            <div>
              <h3 className='text-lg font-semibold'>No shows yet</h3>
              <p className='text-muted-foreground'>
                Create your first show to start tracking leads
              </p>
            </div>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {shows.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

function ShowCard({
  show,
}: {
  show: {
    id: string;
    name: string;
    start_date: string | null;
    end_date: string | null;
    city: string | null;
    venue: string | null;
    status: string;
  };
}) {
  const { data: companies = [] } = useQuery({
    queryKey: ['show-companies', show.id],
    queryFn: () => getCompaniesForShow(show.id),
  });

  const getStatusBadge = (show: {
    start_date: string | null;
    end_date: string | null;
    status: string;
  }) => {
    const now = new Date();
    if (show.start_date && show.end_date) {
      const start = new Date(show.start_date);
      const end = new Date(show.end_date);
      if (now >= start && now <= end) {
        return <Badge variant='default'>Live</Badge>;
      }
      if (now < start) {
        return <Badge variant='secondary'>Upcoming</Badge>;
      }
    }
    return <Badge variant='outline'>Ended</Badge>;
  };

  return (
    <div className='border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors'>
      <div className='flex items-start justify-between'>
        <h3 className='font-semibold'>{show.name}</h3>
        {getStatusBadge(show)}
      </div>
      {show.start_date && (
        <div className='text-sm text-muted-foreground'>
          {format(new Date(show.start_date), 'MMM d, yyyy')}
          {show.end_date &&
            ` - ${format(new Date(show.end_date), 'MMM d, yyyy')}`}
        </div>
      )}
      {(show.city || show.venue) && (
        <div className='text-sm text-muted-foreground'>
          {[show.city, show.venue].filter(Boolean).join(', ')}
        </div>
      )}
      {companies.length > 0 && (
        <div className='pt-2 border-t'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
            <Building2 className='h-4 w-4' />
            <span>
              {companies.length}{' '}
              {companies.length === 1 ? 'company' : 'companies'}
            </span>
          </div>
          <div className='flex flex-wrap gap-1'>
            {companies.slice(0, 3).map(company => (
              <Badge key={company.id} variant='outline' className='text-xs'>
                {company.name}
              </Badge>
            ))}
            {companies.length > 3 && (
              <Badge variant='outline' className='text-xs'>
                +{companies.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/database';
import { registerNewClient } from '@/services/clientRegistrationService';
import { Building2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const ClientManagementTab: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    name: '', // User's full name
    // Password removed - invitation link will be sent instead
  });

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.companyName.trim()) {
        toast({
          title: 'Error',
          description: 'Company name is required',
          variant: 'destructive',
        });
        setSubmitting(false);
        return;
      }

      if (!formData.email || !formData.name) {
        toast({
          title: 'Error',
          description: 'Email and owner name are required',
          variant: 'destructive',
        });
        setSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: 'Error',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
        setSubmitting(false);
        return;
      }

      // Use registerNewClient service which creates org + user atomically
      // No password - invitation link will be sent instead
      const result = await registerNewClient({
        name: formData.companyName,
        email: formData.email,
        companyName: formData.companyName,
        fullName: formData.name,
        // No password - invitation link will be generated
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create client and user');
      }

      toast({
        title: 'Success',
        description: 'Client created successfully. Invitation link has been sent to the email address.',
      });

      // Reset form and close dialog
      setFormData({
        companyName: '',
        email: '',
        name: '',
      });
      setShowAddDialog(false);
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);

      // Better error messages for common cases
      let errorMessage = 'Failed to add client';
      if (error instanceof Error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please use a different email address.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Password validation failed. Please ensure password meets requirements.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });

      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const filteredClients = clients.filter(
    client =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-sidebar-primary' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Client Management
          </h2>
          <p className='text-sm text-gray-600 mt-1'>
            Manage agency clients and subscriptions
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
        <Input
          placeholder='Search clients...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Clients List */}
      <div className='grid gap-4'>
        {filteredClients.length === 0 ? (
          <div className='text-center py-12 text-gray-500'>
            <Building2 className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p>No clients found</p>
          </div>
        ) : (
          filteredClients.map(client => (
            <div
              key={client.id}
              className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <Building2 className='h-5 w-5 text-gray-400' />
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {client.name}
                      </h3>
                      {client.company_name &&
                        client.company_name !== client.name && (
                          <p className='text-sm text-gray-600'>
                            {client.company_name}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className='mt-3 grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-600'>Contact:</span>
                      <span className='ml-2 text-gray-900'>
                        {client.contact_email || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Tier:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeClass(
                          client.subscription_tier || 'starter'
                        )}`}
                      >
                        {client.subscription_tier || 'starter'}
                      </span>
                    </div>
                    {client.monthly_budget && (
                      <div>
                        <span className='text-gray-600'>Budget:</span>
                        <span className='ml-2 text-gray-900'>
                          ${client.monthly_budget}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className='text-gray-600'>Status:</span>
                      <span className='ml-2 text-gray-900'>
                        {client.subscription_status || 'trial'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  {client.contact_phone && (
                    <span className='text-sm text-gray-600'>
                      {client.contact_phone}
                    </span>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDeleteClient(client.id)}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold'>
              Add New Client
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddClient} className='space-y-5 mt-6'>
            {/* Company Name */}
            <div className='space-y-2'>
              <Label htmlFor='companyName' className='text-sm font-medium'>
                Company Name
              </Label>
              <Input
                id='companyName'
                value={formData.companyName}
                onChange={e =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder='Acme Corporation'
                required
                className='h-11'
                autoFocus
              />
            </div>

            {/* User Name */}
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-sm font-medium'>
                Owner Name
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='John Doe'
                required
                className='h-11'
              />
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm font-medium'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder='user@example.com'
                required
                className='h-11'
              />
            </div>

            {/* Info Message */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <p className='text-sm text-blue-800'>
                <strong>Invitation will be sent:</strong> The user will receive an email with a link to set their password or sign in with Google.
              </p>
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-3 pt-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => {
                  setShowAddDialog(false);
                  setFormData({
                    companyName: '',
                    email: '',
                    name: '',
                  });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={submitting} className='min-w-[120px]'>
                {submitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Client'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

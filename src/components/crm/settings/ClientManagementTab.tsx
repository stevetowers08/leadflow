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
import { Building2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const ClientManagementTab: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    contact_email: '',
    contact_phone: '',
    industry: '',
    subscription_tier: 'starter' as 'starter' | 'professional' | 'enterprise',
    monthly_budget: '',
  });

  useEffect(() => {
    fetchClients();
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

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: formData.name,
          company_name: formData.company_name || formData.name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          industry: formData.industry || null,
          subscription_tier: formData.subscription_tier,
          monthly_budget: formData.monthly_budget
            ? parseFloat(formData.monthly_budget)
            : null,
          subscription_status: 'trial',
          is_active: true,
          settings: {},
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Client added successfully',
      });

      // Reset form and close dialog
      setFormData({
        name: '',
        company_name: '',
        contact_email: '',
        contact_phone: '',
        industry: '',
        subscription_tier: 'starter',
        monthly_budget: '',
      });
      setShowAddDialog(false);
      fetchClients();
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add client',
        variant: 'destructive',
      });
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
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete client',
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
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddClient} className='space-y-4 mt-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>
                  Client Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='company_name'>Company Name</Label>
                <Input
                  id='company_name'
                  value={formData.company_name}
                  onChange={e =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='contact_email'>
                  Contact Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='contact_email'
                  type='email'
                  value={formData.contact_email}
                  onChange={e =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='contact_phone'>Phone</Label>
                <Input
                  id='contact_phone'
                  value={formData.contact_phone}
                  onChange={e =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='industry'>Industry</Label>
                <Input
                  id='industry'
                  value={formData.industry}
                  onChange={e =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='subscription_tier'>Subscription Tier</Label>
                <select
                  id='subscription_tier'
                  value={formData.subscription_tier}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      subscription_tier: e.target.value as any,
                    })
                  }
                  className='w-full h-10 px-3 border border-gray-200 rounded-md'
                >
                  <option value='starter'>Starter</option>
                  <option value='professional'>Professional</option>
                  <option value='enterprise'>Enterprise</option>
                </select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='monthly_budget'>Monthly Budget ($)</Label>
              <Input
                id='monthly_budget'
                type='number'
                value={formData.monthly_budget}
                onChange={e =>
                  setFormData({ ...formData, monthly_budget: e.target.value })
                }
                placeholder='0.00'
              />
            </div>

            <div className='flex justify-end gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Add Client</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

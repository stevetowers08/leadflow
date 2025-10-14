import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import {
    Calendar,
    Edit,
    Linkedin,
    Mail,
    MessageSquare,
    Pause,
    Phone,
    Play,
    Plus,
    Target,
    Trash2,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: string;
  target_audience?: string;
  messaging_template?: string;
  linkedin_message?: string;
  email_subject?: string;
  email_template?: string;
  follow_up_message?: string;
  call_script?: string;
  start_date?: string;
  end_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  participant_count?: number;
}

interface CampaignFormData {
  name: string;
  description: string;
  campaign_type: string;
  target_audience: string;
  messaging_template: string;
  linkedin_message: string;
  email_subject: string;
  email_template: string;
  follow_up_message: string;
  call_script: string;
  start_date: string;
  end_date: string;
}

const CAMPAIGN_TYPES = [
  { value: 'linkedin', label: 'LinkedIn Outreach', icon: Linkedin },
  { value: 'email', label: 'Email Campaign', icon: Mail },
  { value: 'cold_call', label: 'Cold Calling', icon: Phone },
  { value: 'social_media', label: 'Social Media', icon: MessageSquare },
  { value: 'referral', label: 'Referral Program', icon: Users },
  { value: 'event', label: 'Event Marketing', icon: Calendar },
  { value: 'other', label: 'Other', icon: Target }
];

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function Campaigns() {
  console.log('🚀 Campaigns component loaded');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    campaign_type: 'linkedin',
    target_audience: '',
    messaging_template: '',
    linkedin_message: '',
    email_subject: '',
    email_template: '',
    follow_up_message: '',
    call_script: '',
    start_date: '',
    end_date: ''
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const queryClient = useQueryClient();

  // Fetch campaigns
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_participants(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(campaign => ({
        ...campaign,
        participant_count: campaign.campaign_participants?.[0]?.count || 0
      }));
    }
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          ...data,
          created_by: user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create campaign: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update campaign mutation
  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CampaignFormData> }) => {
      const { error } = await supabase
        .from('campaigns')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setEditingCampaign(null);
      resetForm();
      toast({
        title: "Campaign Updated",
        description: "Your campaign has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update campaign: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update campaign status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Status Updated",
        description: "Campaign status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete campaign: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      campaign_type: 'linkedin',
      target_audience: '',
      messaging_template: '',
      linkedin_message: '',
      email_subject: '',
      email_template: '',
      follow_up_message: '',
      call_script: '',
      start_date: '',
      end_date: ''
    });
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      campaign_type: campaign.campaign_type,
      target_audience: campaign.target_audience || '',
      messaging_template: campaign.messaging_template || '',
      linkedin_message: campaign.linkedin_message || '',
      email_subject: campaign.email_subject || '',
      email_template: campaign.email_template || '',
      follow_up_message: campaign.follow_up_message || '',
      call_script: campaign.call_script || '',
      start_date: campaign.start_date ? format(new Date(campaign.start_date), 'yyyy-MM-dd') : '',
      end_date: campaign.end_date ? format(new Date(campaign.end_date), 'yyyy-MM-dd') : ''
    });
  };

  const handleSubmit = () => {
    if (editingCampaign) {
      updateCampaignMutation.mutate({ id: editingCampaign.id, data: formData });
    } else {
      createCampaignMutation.mutate(formData);
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    const campaignType = CAMPAIGN_TYPES.find(type => type.value === type);
    return campaignType ? campaignType.icon : Target;
  };

  const getStatusActions = (campaign: Campaign) => {
    switch (campaign.status) {
      case 'draft':
        return (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              updateStatusMutation.mutate({ id: campaign.id, status: 'active' });
            }}
            disabled={updateStatusMutation.isPending}
          >
            <Play className="h-4 w-4 mr-1" />
            Launch
          </Button>
        );
      case 'active':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              updateStatusMutation.mutate({ id: campaign.id, status: 'paused' });
            }}
            disabled={updateStatusMutation.isPending}
          >
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </Button>
        );
      case 'paused':
        return (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              updateStatusMutation.mutate({ id: campaign.id, status: 'active' });
            }}
            disabled={updateStatusMutation.isPending}
          >
            <Play className="h-4 w-4 mr-1" />
            Resume
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header - Full Width */}
      <div className="flex justify-between items-center w-full mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your outreach campaigns and messaging
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="h-8 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <DialogDescription>
                Set up your outreach campaign with messaging templates and targeting.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="messaging">Messaging</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Q1 LinkedIn Outreach"
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign_type">Campaign Type</Label>
                    <Select
                      value={formData.campaign_type}
                      onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              <type.icon className="h-4 w-4 mr-2" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the purpose and goals of this campaign..."
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="messaging" className="space-y-4">
                <div>
                  <Label htmlFor="messaging_template">General Messaging Template</Label>
                  <Textarea
                    id="messaging_template"
                    value={formData.messaging_template}
                    onChange={(e) => setFormData({ ...formData, messaging_template: e.target.value })}
                    placeholder="General messaging guidelines and tone..."
                    rows={3}
                  />
                </div>
                
                {formData.campaign_type === 'linkedin' && (
                  <div>
                    <Label htmlFor="linkedin_message">LinkedIn Message Template</Label>
                    <Textarea
                      id="linkedin_message"
                      value={formData.linkedin_message}
                      onChange={(e) => setFormData({ ...formData, linkedin_message: e.target.value })}
                      placeholder="Hi {{name}}, I noticed you're {{title}} at {{company}}. I'd love to connect..."
                      rows={4}
                    />
                  </div>
                )}
                
                {formData.campaign_type === 'email' && (
                  <>
                    <div>
                      <Label htmlFor="email_subject">Email Subject Line</Label>
                      <Input
                        id="email_subject"
                        value={formData.email_subject}
                        onChange={(e) => setFormData({ ...formData, email_subject: e.target.value })}
                        placeholder="Quick question about {{company}}'s hiring plans"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email_template">Email Template</Label>
                      <Textarea
                        id="email_template"
                        value={formData.email_template}
                        onChange={(e) => setFormData({ ...formData, email_template: e.target.value })}
                        placeholder="Hi {{name}}, I hope this email finds you well..."
                        rows={6}
                      />
                    </div>
                  </>
                )}
                
                {formData.campaign_type === 'cold_call' && (
                  <div>
                    <Label htmlFor="call_script">Call Script</Label>
                    <Textarea
                      id="call_script"
                      value={formData.call_script}
                      onChange={(e) => setFormData({ ...formData, call_script: e.target.value })}
                      placeholder="Hi {{name}}, this is {{your_name}} from {{company}}. I'm calling because..."
                      rows={6}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="follow_up_message">Follow-up Message</Label>
                  <Textarea
                    id="follow_up_message"
                    value={formData.follow_up_message}
                    onChange={(e) => setFormData({ ...formData, follow_up_message: e.target.value })}
                    placeholder="Follow-up message for non-responders..."
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="targeting" className="space-y-4">
                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Textarea
                    id="target_audience"
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    placeholder="Describe your target audience: job titles, industries, company sizes, etc."
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingCampaign(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createCampaignMutation.isPending || updateCampaignMutation.isPending}
              >
                {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first campaign to start organizing your outreach efforts.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const IconComponent = getCampaignTypeIcon(campaign.campaign_type);
            
            return (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openPopup('campaign', campaign.id, campaign.name)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-sidebar-primary" />
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>
                          {CAMPAIGN_TYPES.find(type => type.value === campaign.campaign_type)?.label}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {campaign.participant_count} participants
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(campaign);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCampaignMutation.mutate(campaign.id);
                        }}
                        disabled={deleteCampaignMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {getStatusActions(campaign)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}





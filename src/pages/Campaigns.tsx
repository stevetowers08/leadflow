import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { usePopupNavigation } from '@/contexts/PopupNavigationContext';
import { CampaignWithStats, mockCampaigns } from '@/data/mockCampaigns';
import { Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Edit,
  ExternalLink,
  Filter,
  Linkedin,
  Mail,
  MailOpen,
  MessageSquare,
  Phone,
  Plus,
  Reply,
  Search,
  Target,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

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
  { value: 'other', label: 'Other', icon: Target },
];

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Campaigns() {
  console.log('🚀 Campaigns component loaded');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<CampaignWithStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    end_date: '',
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { openPopup } = usePopupNavigation();
  const queryClient = useQueryClient();

  // Use mock data for now
  const campaigns = mockCampaigns;
  const isLoading = false;

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
      end_date: '',
    });
  };

  const handleEdit = (campaign: CampaignWithStats) => {
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
      start_date: campaign.start_date
        ? format(new Date(campaign.start_date), 'yyyy-MM-dd')
        : '',
      end_date: campaign.end_date
        ? format(new Date(campaign.end_date), 'yyyy-MM-dd')
        : '',
    });
  };

  const handleSubmit = () => {
    // Handle form submission
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: 'Campaign Created',
      description: 'Your campaign has been created successfully.',
    });
  };

  const getCampaignTypeIcon = (type: string) => {
    const campaignType = CAMPAIGN_TYPES.find(t => t.value === type);
    return campaignType ? campaignType.icon : Target;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const StatIcon = ({
    icon: Icon,
    count,
    label,
    color = 'text-gray-600',
  }: {
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    label: string;
    color?: string;
  }) => (
    <div className='flex flex-col items-center justify-center min-w-[80px]'>
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className='flex items-center gap-1 mt-1'>
        <Icon className='h-4 w-4 text-gray-500' />
        <span className='text-xs text-gray-600'>{label}</span>
      </div>
    </div>
  );

  return (
    <Page title='Campaigns' hideHeader>
      <div className='space-y-4'>
        {/* Header Section with Filters and Search */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            {/* Filter Dropdown */}
            <Select defaultValue='all'>
              <SelectTrigger className='w-[200px] h-8 border-gray-300'>
                <SelectValue placeholder='Email Sent, Opened...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Campaigns</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='paused'>Paused</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Icon */}
            <Button
              variant='outline'
              size='sm'
              className='h-8 w-8 p-0 border-gray-300'
            >
              <Filter className='h-4 w-4' />
            </Button>

            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search Campaigns'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 h-8 w-[200px] border-gray-300'
              />
            </div>
          </div>

          {/* Create Campaign Button */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className='h-8 bg-purple-600 hover:bg-purple-700 text-white'
              >
                <Plus className='h-4 w-4 mr-2' />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </DialogTitle>
                <DialogDescription>
                  Set up your outreach campaign with messaging templates and
                  targeting.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue='basic' className='w-full'>
                <TabsList className='grid w-full grid-cols-4'>
                  <TabsTrigger value='basic'>Basic Info</TabsTrigger>
                  <TabsTrigger value='messaging'>Messaging</TabsTrigger>
                  <TabsTrigger value='targeting'>Targeting</TabsTrigger>
                  <TabsTrigger value='schedule'>Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value='basic' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='name'>Campaign Name</Label>
                      <Input
                        id='name'
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder='e.g., Q1 LinkedIn Outreach'
                      />
                    </div>
                    <div>
                      <Label htmlFor='campaign_type'>Campaign Type</Label>
                      <Select
                        value={formData.campaign_type}
                        onValueChange={value =>
                          setFormData({ ...formData, campaign_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CAMPAIGN_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className='flex items-center'>
                                <type.icon className='h-4 w-4 mr-2' />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Describe the purpose and goals of this campaign...'
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='messaging' className='space-y-4'>
                  <div>
                    <Label htmlFor='messaging_template'>
                      General Messaging Template
                    </Label>
                    <Textarea
                      id='messaging_template'
                      value={formData.messaging_template}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          messaging_template: e.target.value,
                        })
                      }
                      placeholder='General messaging guidelines and tone...'
                      rows={3}
                    />
                  </div>

                  {formData.campaign_type === 'linkedin' && (
                    <div>
                      <Label htmlFor='linkedin_message'>
                        LinkedIn Message Template
                      </Label>
                      <Textarea
                        id='linkedin_message'
                        value={formData.linkedin_message}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            linkedin_message: e.target.value,
                          })
                        }
                        placeholder="Hi {{name}}, I noticed you're {{title}} at {{company}}. I'd love to connect..."
                        rows={4}
                      />
                    </div>
                  )}

                  {formData.campaign_type === 'email' && (
                    <>
                      <div>
                        <Label htmlFor='email_subject'>
                          Email Subject Line
                        </Label>
                        <Input
                          id='email_subject'
                          value={formData.email_subject}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              email_subject: e.target.value,
                            })
                          }
                          placeholder="Quick question about {{company}}'s hiring plans"
                        />
                      </div>
                      <div>
                        <Label htmlFor='email_template'>Email Template</Label>
                        <Textarea
                          id='email_template'
                          value={formData.email_template}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              email_template: e.target.value,
                            })
                          }
                          placeholder='Hi {{name}}, I hope this email finds you well...'
                          rows={6}
                        />
                      </div>
                    </>
                  )}

                  {formData.campaign_type === 'cold_call' && (
                    <div>
                      <Label htmlFor='call_script'>Call Script</Label>
                      <Textarea
                        id='call_script'
                        value={formData.call_script}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            call_script: e.target.value,
                          })
                        }
                        placeholder="Hi {{name}}, this is {{your_name}} from {{company}}. I'm calling because..."
                        rows={6}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor='follow_up_message'>Follow-up Message</Label>
                    <Textarea
                      id='follow_up_message'
                      value={formData.follow_up_message}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          follow_up_message: e.target.value,
                        })
                      }
                      placeholder='Follow-up message for non-responders...'
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='targeting' className='space-y-4'>
                  <div>
                    <Label htmlFor='target_audience'>Target Audience</Label>
                    <Textarea
                      id='target_audience'
                      value={formData.target_audience}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          target_audience: e.target.value,
                        })
                      }
                      placeholder='Describe your target audience: job titles, industries, company sizes, etc.'
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='schedule' className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
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
                    <div>
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
                </TabsContent>
              </Tabs>

              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingCampaign(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Table */}
        {isLoading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='bg-gray-100 rounded-lg h-20 animate-pulse'
              ></div>
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Target className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No campaigns found</h3>
              <p className='text-muted-foreground text-center mb-4'>
                {searchTerm
                  ? 'No campaigns match your search criteria.'
                  : 'Create your first campaign to start organizing your outreach efforts.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
            {/* Table Header */}
            <div className='bg-gray-50 border-b border-gray-300 px-6 py-3'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Campaign Details
                </h3>
                <h3 className='text-lg font-semibold text-gray-900'>Report</h3>
              </div>
            </div>

            {/* Campaign Rows */}
            <div className='divide-y divide-gray-300'>
              {filteredCampaigns.map(campaign => {
                const IconComponent = getCampaignTypeIcon(
                  campaign.campaign_type
                );
                const statusColor =
                  STATUS_COLORS[
                    campaign.status as keyof typeof STATUS_COLORS
                  ] || 'bg-gray-100 text-gray-800';

                return (
                  <div
                    key={campaign.id}
                    className='px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer'
                    onClick={() => {
                      // Handle campaign click - could open a campaign details modal or navigate
                      console.log('Campaign clicked:', campaign.name);
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      {/* Campaign Details */}
                      <div className='flex items-center space-x-4 flex-1'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center'>
                            <Edit className='h-4 w-4 text-gray-600' />
                          </div>
                          <div>
                            <div className='flex items-center space-x-2'>
                              <h4 className='text-sm font-medium text-purple-600 hover:text-purple-700'>
                                {campaign.name}
                              </h4>
                              <ExternalLink className='h-3 w-3 text-gray-400' />
                            </div>
                            <div className='flex items-center space-x-2 text-xs text-gray-500 mt-1'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {campaign.status.charAt(0).toUpperCase() +
                                  campaign.status.slice(1)}
                              </span>
                              <span>•</span>
                              <span>
                                Created At:{' '}
                                {format(
                                  new Date(campaign.created_at),
                                  'dd MMM, hh:mm a'
                                )}
                              </span>
                              <span>•</span>
                              <span>{campaign.sequences} sequences</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className='flex items-center space-x-6'>
                        <StatIcon
                          icon={Mail}
                          count={campaign.stats.sent}
                          label='Sent'
                          color='text-purple-600'
                        />
                        <StatIcon
                          icon={MailOpen}
                          count={campaign.stats.opened}
                          label='Opened'
                          color='text-purple-600'
                        />
                        <StatIcon
                          icon={Reply}
                          count={campaign.stats.repliedWithOOO}
                          label='Replied w/OOO'
                          color='text-blue-500'
                        />

                        {/* Go To Master Inbox Button */}
                        <Button
                          variant='link'
                          size='sm'
                          className='text-blue-600 hover:text-blue-700 h-auto p-0 text-xs'
                          onClick={e => {
                            e.stopPropagation();
                            // Handle master inbox navigation
                          }}
                        >
                          Go To Master Inbox
                        </Button>

                        <StatIcon
                          icon={DollarSign}
                          count={campaign.stats.positiveReply}
                          label='Positive Reply'
                          color='text-green-600'
                        />
                        <StatIcon
                          icon={AlertTriangle}
                          count={campaign.stats.bounced}
                          label='Bounced'
                          color='text-red-600'
                        />
                        <StatIcon
                          icon={X}
                          count={campaign.stats.senderBounced}
                          label='Sender Bounced'
                          color='text-red-600'
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Save,
  Building2,
  Target,
  Users,
  TrendingUp,
} from 'lucide-react';

interface BusinessProfile {
  id?: string;
  user_id: string;
  company_name: string;
  industry: string;
  target_audience: string;
  ideal_customer_profile: {
    company_size?: string;
    industry?: string;
    location?: string;
    revenue?: string;
    technologies?: string[];
    pain_points?: string[];
  };
  business_goals: string;
  created_at?: string;
  updated_at?: string;
}

const BusinessProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<BusinessProfile>({
    user_id: user?.id || '',
    company_name: '',
    industry: '',
    target_audience: '',
    ideal_customer_profile: {
      company_size: '',
      industry: '',
      location: '',
      revenue: '',
      technologies: [],
      pain_points: [],
    },
    business_goals: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchBusinessProfile();
    }
  }, [user?.id, fetchBusinessProfile]);

  const fetchBusinessProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching business profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load business profile.',
          variant: 'destructive',
        });
      } else if (data) {
        setProfile({
          ...data,
          ideal_customer_profile: data.ideal_customer_profile || {
            company_size: '',
            industry: '',
            location: '',
            revenue: '',
            technologies: [],
            pain_points: [],
          },
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching business profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load business profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const profileData = {
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (profile.id) {
        // Update existing profile
        const { error } = await supabase
          .from('business_profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('business_profiles')
          .insert(profileData)
          .select()
          .single();

        if (error) throw error;
        setProfile({ ...profile, id: data.id });
      }

      toast({
        title: 'Success',
        description: 'Business profile saved successfully.',
      });
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save business profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleIdealCustomerProfileChange = (
    field: string,
    value: string | string[]
  ) => {
    setProfile(prev => ({
      ...prev,
      ideal_customer_profile: {
        ...prev.ideal_customer_profile,
        [field]: value,
      },
    }));
  };

  const addArrayItem = (
    field: 'technologies' | 'pain_points',
    value: string
  ) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      ideal_customer_profile: {
        ...prev.ideal_customer_profile,
        [field]: [...(prev.ideal_customer_profile[field] || []), value.trim()],
      },
    }));
  };

  const removeArrayItem = (
    field: 'technologies' | 'pain_points',
    index: number
  ) => {
    setProfile(prev => ({
      ...prev,
      ideal_customer_profile: {
        ...prev.ideal_customer_profile,
        [field]:
          prev.ideal_customer_profile[field]?.filter((_, i) => i !== index) ||
          [],
      },
    }));
  };

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-primary' />
            <p className='text-muted-foreground'>Loading business profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Targeting Profiles
        </h1>
        <p className='text-gray-600'>
          Configure your targeting criteria to improve lead filtering and
          qualification. This data will help the system better match leads to
          your ideal customer profile.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              Company Information
            </CardTitle>
            <CardDescription>
              Your company's basic details and industry information for
              targeting
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='company_name'>Company Name</Label>
                <Input
                  id='company_name'
                  value={profile.company_name}
                  onChange={e =>
                    setProfile(prev => ({
                      ...prev,
                      company_name: e.target.value,
                    }))
                  }
                  placeholder='Your company name'
                />
              </div>
              <div>
                <Label htmlFor='industry'>Industry</Label>
                <Input
                  id='industry'
                  value={profile.industry}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, industry: e.target.value }))
                  }
                  placeholder='e.g., Technology, Healthcare, Finance'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='target_audience'>Target Audience</Label>
              <Textarea
                id='target_audience'
                value={profile.target_audience}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    target_audience: e.target.value,
                  }))
                }
                placeholder='Describe your ideal customer demographic, role, or market segment'
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ideal Customer Profile */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Ideal Customer Profile (ICP)
            </CardTitle>
            <CardDescription>
              Define the characteristics of your perfect customer
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='company_size'>Company Size</Label>
                <Input
                  id='company_size'
                  value={profile.ideal_customer_profile.company_size || ''}
                  onChange={e =>
                    handleIdealCustomerProfileChange(
                      'company_size',
                      e.target.value
                    )
                  }
                  placeholder='e.g., 10-50 employees, Enterprise'
                />
              </div>
              <div>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  value={profile.ideal_customer_profile.location || ''}
                  onChange={e =>
                    handleIdealCustomerProfileChange('location', e.target.value)
                  }
                  placeholder='e.g., North America, Remote, San Francisco'
                />
              </div>
              <div>
                <Label htmlFor='revenue'>Revenue Range</Label>
                <Input
                  id='revenue'
                  value={profile.ideal_customer_profile.revenue || ''}
                  onChange={e =>
                    handleIdealCustomerProfileChange('revenue', e.target.value)
                  }
                  placeholder='e.g., $1M-$10M, $10M+'
                />
              </div>
              <div>
                <Label htmlFor='industry_match'>Industry Match</Label>
                <Input
                  id='industry_match'
                  value={profile.ideal_customer_profile.industry || ''}
                  onChange={e =>
                    handleIdealCustomerProfileChange('industry', e.target.value)
                  }
                  placeholder='e.g., SaaS, E-commerce, Manufacturing'
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <Label>Technologies Used</Label>
              <div className='flex flex-wrap gap-2 mt-2 mb-2'>
                {profile.ideal_customer_profile.technologies?.map(
                  (tech, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center gap-1'
                    >
                      {tech}
                      <button
                        onClick={() => removeArrayItem('technologies', index)}
                        className='ml-1 text-blue-600 hover:text-blue-800'
                      >
                        ×
                      </button>
                    </span>
                  )
                )}
              </div>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add technology (e.g., Salesforce, HubSpot)'
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      addArrayItem('technologies', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  variant='outline'
                  onClick={e => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addArrayItem('technologies', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <Label>Pain Points</Label>
              <div className='flex flex-wrap gap-2 mt-2 mb-2'>
                {profile.ideal_customer_profile.pain_points?.map(
                  (pain, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm flex items-center gap-1'
                    >
                      {pain}
                      <button
                        onClick={() => removeArrayItem('pain_points', index)}
                        className='ml-1 text-red-600 hover:text-red-800'
                      >
                        ×
                      </button>
                    </span>
                  )
                )}
              </div>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add pain point (e.g., Manual processes, Data silos)'
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      addArrayItem('pain_points', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  variant='outline'
                  onClick={e => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addArrayItem('pain_points', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Goals */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Business Goals
            </CardTitle>
            <CardDescription>
              Define your business objectives and growth targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor='business_goals'>Goals & Objectives</Label>
              <Textarea
                id='business_goals'
                value={profile.business_goals}
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    business_goals: e.target.value,
                  }))
                }
                placeholder='Describe your business goals, growth targets, and key objectives'
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Button onClick={handleSave} disabled={isSaving} className='min-w-32'>
            {isSaving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Save Targeting Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileSettings;

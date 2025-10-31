// src/pages/JobFilteringSettingsPage.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabNavigation, TabOption } from '@/components/ui/tab-navigation';
import { Page } from '@/design-system/components';
import {
  useCreateJobFilterConfig,
  useJobFilterConfigs,
  useUpdateJobFilterConfig,
} from '@/hooks/useJobFilterConfigs';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  CreateJobFilterConfigRequest,
  JobFilterConfig,
} from '@/types/jobFiltering';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Simple options based on actual database data
const JOB_TITLES = [
  'Account Executive',
  'Sales Development Representative',
  'Business Development Manager',
  'Sales Executive',
  'Software Engineer',
  'Product Manager',
  'Marketing Manager',
  'Data Analyst',
  'UX Designer',
  'DevOps Engineer',
];

const LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'Denver, CO',
  'Los Angeles, CA',
  'Remote',
  'Hybrid',
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Media',
  'Real Estate',
  'Government',
];

const WORK_ARRANGEMENTS = [
  'full_time',
  'part_time',
  'contract',
  'remote',
  'hybrid',
];
const SENIORITY_LEVELS = [
  'entry',
  'associate',
  'mid-senior',
  'director',
  'executive',
];
const COMPANY_SIZES = ['startup', 'small', 'medium', 'large', 'enterprise'];

function JobFilteringSettingsPage() {
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'seek'>(
    'linkedin'
  );
  const [formData, setFormData] = useState<Partial<JobFilterConfig>>({
    config_name: '',
    platform: 'linkedin',
    is_active: true,
    primary_location: '',
    search_radius: 25,
    target_job_titles: [],
    excluded_job_titles: [],
    seniority_levels: [],
    work_arrangements: ['full_time'],
    company_size_preferences: [],
    included_industries: [],
    excluded_industries: [],
    included_companies: [],
    excluded_companies: [],
    required_keywords: [],
    excluded_keywords: [],
    max_days_old: 7,
    job_functions: [],
  });

  const { data: configs = [], isLoading } = useJobFilterConfigs();
  const createConfig = useCreateJobFilterConfig();
  const updateConfig = useUpdateJobFilterConfig();

  usePageMeta({
    title: 'Job Discovery Configuration',
    description: 'Set up automated job posting monitoring',
  });

  const linkedinConfig = configs.find(c => c.platform === 'linkedin');
  const seekConfig = configs.find(c => c.platform === 'seek');

  // Load existing config when switching platforms
  useEffect(() => {
    const existingConfig =
      activePlatform === 'linkedin' ? linkedinConfig : seekConfig;
    if (existingConfig) {
      setFormData(existingConfig);
    } else {
      setFormData(prev => ({
        ...prev,
        platform: activePlatform,
        config_name: `${activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} Jobs`,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlatform]);

  const handleSave = async () => {
    if (
      !formData.config_name?.trim() ||
      !formData.primary_location?.trim() ||
      !formData.target_job_titles?.length
    ) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      const existingConfig =
        activePlatform === 'linkedin' ? linkedinConfig : seekConfig;
      if (existingConfig?.id) {
        await updateConfig.mutateAsync({ id: existingConfig.id, ...formData });
      } else {
        await createConfig.mutateAsync(
          formData as CreateJobFilterConfigRequest
        );
      }
      toast.success('Configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  const toggleArrayItem = (
    array: string[] | undefined,
    item: string,
    field: keyof JobFilterConfig
  ) => {
    const current = array || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const togglePlatform = async () => {
    const existingConfig =
      activePlatform === 'linkedin' ? linkedinConfig : seekConfig;
    if (!existingConfig?.id) {
      toast.error('No configuration found to toggle');
      return;
    }

    try {
      await updateConfig.mutateAsync({
        id: existingConfig.id,
        is_active: !existingConfig.is_active,
      });
      toast.success(
        `Configuration ${existingConfig.is_active ? 'disabled' : 'enabled'}`
      );
    } catch (error) {
      toast.error('Failed to toggle configuration');
    }
  };

  if (isLoading) {
    return (
      <Page title='Job Discovery Configuration' hideHeader>
        <div className='max-w-4xl mx-auto space-y-8'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-200 rounded w-1/3'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
          </div>
        </div>
      </Page>
    );
  }

  const currentConfig =
    activePlatform === 'linkedin' ? linkedinConfig : seekConfig;

  // Create tabs for TabNavigation
  const tabs: TabOption[] = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      count: linkedinConfig ? (linkedinConfig.is_active ? 1 : 0) : 0,
    },
    {
      id: 'seek',
      label: 'Seek',
      count: seekConfig ? (seekConfig.is_active ? 1 : 0) : 0,
    },
  ];

  return (
    <Page title='Job Discovery Configuration' hideHeader allowScroll>
      <div className='space-y-6'>
        {/* Platform Tabs - Using App's TabNavigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activePlatform}
          onTabChange={tabId => setActivePlatform(tabId as 'linkedin' | 'seek')}
        />

        {/* Platform Toggle */}
        <div className='flex items-center justify-between p-4 border rounded-lg'>
          <div>
            <h3 className='font-medium'>
              {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)}{' '}
              Configuration
            </h3>
            <p className='text-sm text-muted-foreground'>
              {currentConfig?.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <Button
            variant={currentConfig?.is_active ? 'destructive' : 'default'}
            onClick={togglePlatform}
            disabled={!currentConfig}
          >
            {currentConfig?.is_active ? 'Off' : 'On'}
          </Button>
        </div>

        {/* Configuration Form */}
        <div className='space-y-4'>
          {/* Basic Setup */}
          <div className='space-y-3'>
            <h2 className='text-lg font-semibold'>Basic Setup</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='config_name'>Configuration Name</Label>
                <Input
                  id='config_name'
                  value={formData.config_name || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      config_name: e.target.value,
                    }))
                  }
                  placeholder='e.g., LinkedIn Software Jobs'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='primary_location'>Location</Label>
                <Select
                  value={formData.primary_location || ''}
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      primary_location: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select location' />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Job Titles */}
          <div className='space-y-3'>
            <h2 className='text-lg font-semibold'>Job Titles</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
              {JOB_TITLES.map(title => (
                <Button
                  key={title}
                  type='button'
                  variant={
                    formData.target_job_titles?.includes(title)
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    toggleArrayItem(
                      formData.target_job_titles,
                      title,
                      'target_job_titles'
                    )
                  }
                  className='justify-start'
                >
                  {formData.target_job_titles?.includes(title) ? (
                    <X className='h-3 w-3 mr-2' />
                  ) : (
                    <span className='mr-2'>+</span>
                  )}
                  {title}
                </Button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Industries</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
              {INDUSTRIES.map(industry => (
                <Button
                  key={industry}
                  type='button'
                  variant={
                    formData.included_industries?.includes(industry)
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    toggleArrayItem(
                      formData.included_industries,
                      industry,
                      'included_industries'
                    )
                  }
                  className='justify-start'
                >
                  {formData.included_industries?.includes(industry) ? (
                    <X className='h-3 w-3 mr-2' />
                  ) : (
                    <span className='mr-2'>+</span>
                  )}
                  {industry}
                </Button>
              ))}
            </div>
          </div>

          {/* Work Arrangements */}
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Work Arrangements</h2>
            <div className='flex flex-wrap gap-2'>
              {WORK_ARRANGEMENTS.map(arrangement => (
                <Button
                  key={arrangement}
                  type='button'
                  variant={
                    formData.work_arrangements?.includes(arrangement)
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    toggleArrayItem(
                      formData.work_arrangements,
                      arrangement,
                      'work_arrangements'
                    )
                  }
                >
                  {arrangement
                    .replace('_', ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>

          {/* Seniority Levels */}
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Seniority Levels</h2>
            <div className='flex flex-wrap gap-2'>
              {SENIORITY_LEVELS.map(level => (
                <Button
                  key={level}
                  type='button'
                  variant={
                    formData.seniority_levels?.includes(level)
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    toggleArrayItem(
                      formData.seniority_levels,
                      level,
                      'seniority_levels'
                    )
                  }
                >
                  {level
                    .replace('-', ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>

          {/* Company Size */}
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Company Size</h2>
            <div className='flex flex-wrap gap-2'>
              {COMPANY_SIZES.map(size => (
                <Button
                  key={size}
                  type='button'
                  variant={
                    formData.company_size_preferences?.includes(size)
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    toggleArrayItem(
                      formData.company_size_preferences,
                      size,
                      'company_size_preferences'
                    )
                  }
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-end pt-6 border-t'>
            <Button
              onClick={handleSave}
              className='gap-2'
              disabled={createConfig.isPending || updateConfig.isPending}
            >
              <Check className='h-4 w-4' />
              {createConfig.isPending || updateConfig.isPending
                ? 'Saving...'
                : currentConfig
                  ? 'Update Configuration'
                  : 'Create Configuration'}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default JobFilteringSettingsPage;

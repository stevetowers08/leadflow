// src/components/jobFiltering/JobFilteringFormHubSpot.tsx
// HubSpot-style simplified job filtering form

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateJobFilterConfig,
  useUpdateJobFilterConfig,
} from '@/hooks/useJobFilterConfigs';
import {
  CreateJobFilterConfigRequest,
  JobFilterConfig,
} from '@/types/jobFiltering';
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface JobFilteringFormHubSpotProps {
  config: JobFilterConfig | null;
  onSave: () => void;
  onCancel: () => void;
}

// Smart defaults - HubSpot style
const getSmartDefaults = () => ({
  config_name: '',
  platform: 'linkedin' as const,
  is_active: true,
  primary_location: '',
  search_radius: 25,
  target_job_titles: [] as string[],
  excluded_job_titles: [] as string[],
  seniority_levels: [] as string[],
  work_arrangements: ['full_time'] as string[],
  included_industries: [] as string[],
  excluded_industries: [] as string[],
  max_days_old: 7,
  job_functions: [] as string[],
});

// Pre-defined options for quick selection
const QUICK_JOB_TITLES = [
  'Software Engineer',
  'Product Manager',
  'Sales Manager',
  'Marketing Manager',
  'Data Analyst',
  'UX Designer',
  'DevOps Engineer',
  'Business Analyst',
  'Project Manager',
  'Account Executive',
];

const QUICK_LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'Denver, CO',
  'Remote',
  'Hybrid',
];

const QUICK_INDUSTRIES = [
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

export function JobFilteringFormHubSpot({
  config,
  onSave,
  onCancel,
}: JobFilteringFormHubSpotProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<JobFilterConfig>>(
    config || getSmartDefaults()
  );
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customRequiredKeyword, setCustomRequiredKeyword] = useState('');
  const [customExcludedKeyword, setCustomExcludedKeyword] = useState('');

  const createConfig = useCreateJobFilterConfig();
  const updateConfig = useUpdateJobFilterConfig();

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.config_name ||
      !formData.primary_location ||
      !formData.target_job_titles?.length
    ) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      if (config?.id) {
        await updateConfig.mutateAsync({
          id: config.id,
          ...formData,
        });
      } else {
        await createConfig.mutateAsync(
          formData as CreateJobFilterConfigRequest
        );
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  const addQuickJobTitle = (title: string) => {
    if (!formData.target_job_titles?.includes(title)) {
      setFormData(prev => ({
        ...prev,
        target_job_titles: [...(prev.target_job_titles || []), title],
      }));
    }
  };

  const addCustomJobTitle = () => {
    if (
      customJobTitle.trim() &&
      !formData.target_job_titles?.includes(customJobTitle.trim())
    ) {
      setFormData(prev => ({
        ...prev,
        target_job_titles: [
          ...(prev.target_job_titles || []),
          customJobTitle.trim(),
        ],
      }));
      setCustomJobTitle('');
    }
  };

  const removeJobTitle = (title: string) => {
    setFormData(prev => ({
      ...prev,
      target_job_titles: prev.target_job_titles?.filter(t => t !== title) || [],
    }));
  };

  const addQuickLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      primary_location: location,
    }));
  };

  // Keyword handlers
  const addRequiredKeyword = () => {
    if (customRequiredKeyword.trim()) {
      if (!formData.required_keywords?.includes(customRequiredKeyword.trim())) {
        setFormData(prev => ({
          ...prev,
          required_keywords: [
            ...(prev.required_keywords || []),
            customRequiredKeyword.trim(),
          ],
        }));
      }
      setCustomRequiredKeyword('');
    }
  };

  const removeRequiredKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      required_keywords:
        prev.required_keywords?.filter(k => k !== keyword) || [],
    }));
  };

  const addExcludedKeyword = () => {
    if (customExcludedKeyword.trim()) {
      if (!formData.excluded_keywords?.includes(customExcludedKeyword.trim())) {
        setFormData(prev => ({
          ...prev,
          excluded_keywords: [
            ...(prev.excluded_keywords || []),
            customExcludedKeyword.trim(),
          ],
        }));
      }
      setCustomExcludedKeyword('');
    }
  };

  const removeExcludedKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      excluded_keywords:
        prev.excluded_keywords?.filter(k => k !== keyword) || [],
    }));
  };

  const addQuickIndustry = (industry: string) => {
    if (!formData.included_industries?.includes(industry)) {
      setFormData(prev => ({
        ...prev,
        included_industries: [...(prev.included_industries || []), industry],
      }));
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      included_industries:
        prev.included_industries?.filter(i => i !== industry) || [],
    }));
  };

  return (
    <Card className='max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>{config?.id ? 'Edit Job Filter' : 'Create Job Filter'}</span>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            Step {currentStep} of {totalSteps}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <div className='mb-8'>
          <div className='flex items-center'>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className='flex items-center'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i + 1 < currentStep ? <Check className='h-4 w-4' /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`h-1 w-16 mx-2 ${
                      i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Setup */}
          {currentStep === 1 && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-4'>Basic Setup</h3>
                <p className='text-gray-600 mb-6'>
                  Let's start with the essentials. What should we call this job
                  filter?
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <Label htmlFor='config_name'>Filter Name *</Label>
                  <Input
                    id='config_name'
                    value={formData.config_name || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        config_name: e.target.value,
                      }))
                    }
                    placeholder='e.g., Senior Software Engineers in SF'
                    required
                    className='mt-1'
                  />
                </div>

                <div>
                  <Label htmlFor='platform'>Platform</Label>
                  <Select
                    value={formData.platform || 'linkedin'}
                    onValueChange={value =>
                      setFormData(prev => ({
                        ...prev,
                        platform: value as 'linkedin' | 'indeed' | 'seek',
                      }))
                    }
                  >
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='linkedin'>LinkedIn</SelectItem>
                      <SelectItem value='indeed'>Indeed</SelectItem>
                      <SelectItem value='seek'>Seek</SelectItem>
                      <SelectItem value='glassdoor'>Glassdoor</SelectItem>
                      <SelectItem value='ziprecruiter'>ZipRecruiter</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='is_active'
                    checked={formData.is_active || false}
                    onCheckedChange={checked =>
                      setFormData(prev => ({
                        ...prev,
                        is_active: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor='is_active'>
                    Activate this filter immediately
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Targeting */}
          {currentStep === 2 && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-4'>Job Targeting</h3>
                <p className='text-gray-600 mb-6'>
                  What types of jobs are you looking for? We'll help you find
                  the right matches.
                </p>
              </div>

              <div className='space-y-6'>
                {/* Job Titles */}
                <div>
                  <Label>Job Titles *</Label>
                  <p className='text-sm text-gray-600 mb-3'>
                    Select the job titles you want to target
                  </p>

                  {/* Quick Selection */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mb-4'>
                    {QUICK_JOB_TITLES.map(title => (
                      <Button
                        key={title}
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => addQuickJobTitle(title)}
                        disabled={formData.target_job_titles?.includes(title)}
                        className='justify-start'
                      >
                        <Plus className='h-3 w-3 mr-1' />
                        {title}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Job Title */}
                  <div className='flex gap-2 mb-4'>
                    <Input
                      value={customJobTitle}
                      onChange={e => setCustomJobTitle(e.target.value)}
                      placeholder='Add custom job title...'
                      onKeyPress={e =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), addCustomJobTitle())
                      }
                    />
                    <Button type='button' onClick={addCustomJobTitle} size='sm'>
                      Add
                    </Button>
                  </div>

                  {/* Selected Job Titles */}
                  {formData.target_job_titles &&
                    formData.target_job_titles.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {formData.target_job_titles.map(title => (
                          <Badge
                            key={title}
                            variant='secondary'
                            className='gap-1'
                          >
                            {title}
                            <button
                              type='button'
                              onClick={() => removeJobTitle(title)}
                              className='ml-1 hover:bg-gray-300 rounded-full p-0.5'
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor='primary_location'>Location *</Label>
                  <p className='text-sm text-gray-600 mb-3'>
                    Where should we look for jobs?
                  </p>

                  {/* Quick Location Selection */}
                  <div className='grid grid-cols-3 md:grid-cols-4 gap-2 mb-4'>
                    {QUICK_LOCATIONS.map(location => (
                      <Button
                        key={location}
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => addQuickLocation(location)}
                        className='justify-start'
                      >
                        {location}
                      </Button>
                    ))}
                  </div>

                  <Input
                    id='primary_location'
                    value={formData.primary_location || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        primary_location: e.target.value,
                      }))
                    }
                    placeholder='Enter location...'
                    required
                  />
                </div>

                {/* Industries */}
                <div>
                  <Label>Industries (Optional)</Label>
                  <p className='text-sm text-gray-600 mb-3'>
                    Focus on specific industries
                  </p>

                  <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mb-4'>
                    {QUICK_INDUSTRIES.map(industry => (
                      <Button
                        key={industry}
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => addQuickIndustry(industry)}
                        disabled={formData.included_industries?.includes(
                          industry
                        )}
                        className='justify-start'
                      >
                        <Plus className='h-3 w-3 mr-1' />
                        {industry}
                      </Button>
                    ))}
                  </div>

                  {/* Selected Industries */}
                  {formData.included_industries &&
                    formData.included_industries.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {formData.included_industries.map(industry => (
                          <Badge
                            key={industry}
                            variant='secondary'
                            className='gap-1'
                          >
                            {industry}
                            <button
                              type='button'
                              onClick={() => removeIndustry(industry)}
                              className='ml-1 hover:bg-gray-300 rounded-full p-0.5'
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Options */}
          {currentStep === 3 && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold mb-4'>Advanced Options</h3>
                <p className='text-gray-600 mb-6'>
                  Fine-tune your search with these optional settings.
                </p>
              </div>

              <div className='space-y-6'>
                {/* Work Arrangements */}
                <div>
                  <Label>Work Arrangements</Label>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {[
                      'full_time',
                      'part_time',
                      'contract',
                      'remote',
                      'hybrid',
                    ].map(arrangement => (
                      <Button
                        key={arrangement}
                        type='button'
                        variant={
                          formData.work_arrangements?.includes(arrangement)
                            ? 'default'
                            : 'outline'
                        }
                        size='sm'
                        onClick={() => {
                          const current = formData.work_arrangements || [];
                          const updated = current.includes(arrangement)
                            ? current.filter(a => a !== arrangement)
                            : [...current, arrangement];
                          setFormData(prev => ({
                            ...prev,
                            work_arrangements: updated,
                          }));
                        }}
                      >
                        {arrangement
                          .replace('_', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Experience Levels */}
                <div>
                  <Label>Experience Levels</Label>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {[
                      'entry',
                      'associate',
                      'mid-senior',
                      'director',
                      'executive',
                    ].map(level => (
                      <Button
                        key={level}
                        type='button'
                        variant={
                          formData.seniority_levels?.includes(level)
                            ? 'default'
                            : 'outline'
                        }
                        size='sm'
                        onClick={() => {
                          const current = formData.seniority_levels || [];
                          const updated = current.includes(level)
                            ? current.filter(l => l !== level)
                            : [...current, level];
                          setFormData(prev => ({
                            ...prev,
                            seniority_levels: updated,
                          }));
                        }}
                      >
                        {level
                          .replace('-', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <Label>Keywords</Label>
                  <p className='text-sm text-gray-600 mb-3'>
                    Add required or excluded keywords
                  </p>

                  <div className='space-y-3'>
                    <div>
                      <Label className='text-sm text-green-700'>
                        Required Keywords
                      </Label>
                      <div className='flex gap-2 mt-1'>
                        <Input
                          value={customRequiredKeyword}
                          onChange={e =>
                            setCustomRequiredKeyword(e.target.value)
                          }
                          placeholder='Add required keyword...'
                          className='flex-1'
                        />
                        <Button
                          type='button'
                          onClick={addRequiredKeyword}
                          size='sm'
                        >
                          Add
                        </Button>
                      </div>
                      {formData.required_keywords &&
                        formData.required_keywords.length > 0 && (
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {formData.required_keywords.map(keyword => (
                              <Badge
                                key={keyword}
                                variant='secondary'
                                className='bg-green-100 text-green-800'
                              >
                                {keyword}
                                <button
                                  type='button'
                                  onClick={() => removeRequiredKeyword(keyword)}
                                  className='ml-1 hover:bg-green-200 rounded-full p-0.5'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>

                    <div>
                      <Label className='text-sm text-red-700'>
                        Excluded Keywords
                      </Label>
                      <div className='flex gap-2 mt-1'>
                        <Input
                          value={customExcludedKeyword}
                          onChange={e =>
                            setCustomExcludedKeyword(e.target.value)
                          }
                          placeholder='Add keyword to exclude...'
                          className='flex-1'
                        />
                        <Button
                          type='button'
                          onClick={addExcludedKeyword}
                          size='sm'
                        >
                          Add
                        </Button>
                      </div>
                      {formData.excluded_keywords &&
                        formData.excluded_keywords.length > 0 && (
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {formData.excluded_keywords.map(keyword => (
                              <Badge
                                key={keyword}
                                variant='secondary'
                                className='bg-red-100 text-red-800'
                              >
                                {keyword}
                                <button
                                  type='button'
                                  onClick={() => removeExcludedKeyword(keyword)}
                                  className='ml-1 hover:bg-red-200 rounded-full p-0.5'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className='flex justify-between mt-8 pt-6 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={currentStep === 1 ? onCancel : handlePrevious}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type='button'
                onClick={handleNext}
                className='flex items-center gap-2'
              >
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            ) : (
              <Button type='submit' className='flex items-center gap-2'>
                <Check className='h-4 w-4' />
                {config?.id ? 'Update Filter' : 'Create Filter'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

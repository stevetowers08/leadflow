// src/components/jobFiltering/JobFilteringForm.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Plus, Settings, Target, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ExcludedItemsModal } from './modals/ExcludedItemsModal';
import { JobTitlesModal } from './modals/JobTitlesModal';
import { SeniorityLevelsModal } from './modals/SeniorityLevelsModal';
import { WorkArrangementsModal } from './modals/WorkArrangementsModal';

interface JobFilteringFormProps {
  config: JobFilterConfig | null;
  onSave: () => void;
  onCancel: () => void;
}

const getDefaultConfig = (): Partial<JobFilterConfig> => ({
  config_name: '',
  platform: 'linkedin',
  is_active: true,
  primary_location: '',
  search_radius: 25,
  remote_options: [],
  target_job_titles: [],
  excluded_job_titles: [],
  seniority_levels: [],
  work_arrangements: [],
  company_size_preferences: [],
  included_industries: [],
  excluded_industries: [],
  excluded_companies: [],
  required_keywords: [],
  excluded_keywords: [],
  max_days_old: 7,
  job_functions: [],
});

export function JobFilteringForm({
  config,
  onSave,
  onCancel,
}: JobFilteringFormProps) {
  const [formData, setFormData] = useState<Partial<JobFilterConfig>>(
    config || getDefaultConfig()
  );

  // Modal state management
  const [showSeniorityModal, setShowSeniorityModal] = useState(false);
  const [showWorkArrangementsModal, setShowWorkArrangementsModal] =
    useState(false);
  const [showJobTitlesModal, setShowJobTitlesModal] = useState(false);
  const [showExcludedModal, setShowExcludedModal] = useState(false);

  const createConfig = useCreateJobFilterConfig();
  const updateConfig = useUpdateJobFilterConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.config_name || !formData.primary_location) {
      toast.error('Please fill in all required fields');
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

  return (
    <Card variant='minimal'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings className='h-5 w-5' />
          {config?.id
            ? 'Edit Configuration'
            : 'Create Job Discovery Configuration'}
        </CardTitle>
        <CardDescription>
          {config?.id
            ? 'Update your job discovery configuration settings'
            : 'Set up automated job posting monitoring for LinkedIn, Indeed, or Seek. Configure search parameters, targeting criteria, and AI processing rules to discover relevant executive deals in your market.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Basic Configuration */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-5 h-5 bg-gray-400 rounded flex items-center justify-center'>
                <Settings className='h-3 w-3 text-white' />
              </div>
              <h3 className='text-lg font-semibold'>Basic Configuration</h3>
            </div>
            <p className='text-sm text-gray-600 mb-6'>
              Platform selection, naming, and activation settings for this
              monitoring setup.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='config_name'>Configuration Name *</Label>
                <p className='text-sm text-gray-600 mb-2'>
                  Choose a descriptive name that identifies the platform,
                  location, and focus. Examples: 'Albany Executive Jobs -
                  LinkedIn', 'Boston Tech Leadership - Indeed', 'NYC Finance
                  Directors - LinkedIn'
                </p>
                <Input
                  id='config_name'
                  value={formData.config_name || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      config_name: e.target.value,
                    }))
                  }
                  placeholder="e.g., 'Albany Executive Jobs - LinkedIn'"
                  required
                />
              </div>

              <div>
                <Label htmlFor='platform'>Platform *</Label>
                <p className='text-sm text-gray-600 mb-2'>
                  Job board platform for this configuration. Each platform
                  requires specific query format and AI enrichment
                  configuration. Supports multi-platform strategies with
                  separate configs per platform.
                </p>
                <Select
                  value={formData.platform || 'linkedin'}
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      platform: value as
                        | 'linkedin'
                        | 'indeed'
                        | 'glassdoor'
                        | 'ziprecruiter'
                        | 'other',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select platform' />
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
            </div>
          </div>

          {/* Targeting & Location */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-5 h-5 bg-gray-400 rounded flex items-center justify-center'>
                <Target className='h-3 w-3 text-white' />
              </div>
              <h3 className='text-lg font-semibold'>
                Targeting &amp; Location
              </h3>
            </div>
            <p className='text-sm text-gray-600 mb-6'>
              Define geographic scope, job titles, experience levels, and role
              requirements.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='primary_location'>Primary Location *</Label>
                <Input
                  id='primary_location'
                  value={formData.primary_location || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      primary_location: e.target.value,
                    }))
                  }
                  placeholder='e.g., San Francisco, CA'
                  required
                />
              </div>

              <div>
                <Label htmlFor='search_radius'>Search Radius</Label>
                <Input
                  id='search_radius'
                  type='number'
                  value={formData.search_radius || 25}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      search_radius: parseInt(e.target.value),
                    }))
                  }
                  placeholder='25'
                />
              </div>

              <div>
                <Label>Seniority Levels</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setShowSeniorityModal(true)}
                  className='w-full justify-start gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Seniority Levels
                </Button>
                {formData.seniority_levels &&
                  formData.seniority_levels.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {formData.seniority_levels.map((level, index) => (
                        <Badge key={index} variant='outline' className='gap-1'>
                          {level}
                          <button
                            type='button'
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                seniority_levels:
                                  prev.seniority_levels?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              }))
                            }
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Label>Work Arrangements</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setShowWorkArrangementsModal(true)}
                  className='w-full justify-start gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Work Arrangements
                </Button>
                {formData.work_arrangements &&
                  formData.work_arrangements.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {formData.work_arrangements.map((arrangement, index) => (
                        <Badge key={index} variant='outline' className='gap-1'>
                          {arrangement}
                          <button
                            type='button'
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                work_arrangements:
                                  prev.work_arrangements?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              }))
                            }
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Label>Target Job Titles *</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setShowJobTitlesModal(true)}
                  className='w-full justify-start gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Job Titles
                </Button>
                {formData.target_job_titles &&
                  formData.target_job_titles.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {formData.target_job_titles.map((title, index) => (
                        <Badge key={index} variant='outline' className='gap-1'>
                          {title}
                          <button
                            type='button'
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                target_job_titles:
                                  prev.target_job_titles?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              }))
                            }
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>

              <div>
                <Label>Excluded Industries / Keywords</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setShowExcludedModal(true)}
                  className='w-full justify-start gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Exclusions
                </Button>
                {(formData.excluded_industries &&
                  formData.excluded_industries.length > 0) ||
                (formData.excluded_keywords &&
                  formData.excluded_keywords.length > 0) ? (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {formData.excluded_industries?.map((industry, index) => (
                      <Badge
                        key={`industry-${index}`}
                        variant='destructive'
                        className='gap-1'
                      >
                        {industry}
                        <button
                          type='button'
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              excluded_industries:
                                prev.excluded_industries?.filter(
                                  (_, i) => i !== index
                                ) || [],
                            }))
                          }
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                    {formData.excluded_keywords?.map((keyword, index) => (
                      <Badge
                        key={`keyword-${index}`}
                        variant='destructive'
                        className='gap-1'
                      >
                        {keyword}
                        <button
                          type='button'
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              excluded_keywords:
                                prev.excluded_keywords?.filter(
                                  (_, i) => i !== index
                                ) || [],
                            }))
                          }
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-between pt-6 border-t'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <div className='flex gap-3'>
              <Button type='button' variant='outline'>
                Test Configuration
              </Button>
              <Button type='submit'>
                {config?.id ? 'Update Configuration' : 'Create Configuration'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>

      {/* Modals */}
      {showSeniorityModal && (
        <SeniorityLevelsModal
          selectedLevels={formData.seniority_levels || []}
          onSave={levels => {
            setFormData(prev => ({ ...prev, seniority_levels: levels }));
            setShowSeniorityModal(false);
          }}
          onCancel={() => setShowSeniorityModal(false)}
        />
      )}

      {showWorkArrangementsModal && (
        <WorkArrangementsModal
          selectedArrangements={formData.work_arrangements || []}
          onSave={arrangements => {
            setFormData(prev => ({ ...prev, work_arrangements: arrangements }));
            setShowWorkArrangementsModal(false);
          }}
          onCancel={() => setShowWorkArrangementsModal(false)}
        />
      )}

      {showJobTitlesModal && (
        <JobTitlesModal
          selectedTitles={formData.target_job_titles || []}
          onSave={titles => {
            setFormData(prev => ({ ...prev, target_job_titles: titles }));
            setShowJobTitlesModal(false);
          }}
          onCancel={() => setShowJobTitlesModal(false)}
        />
      )}

      {showExcludedModal && (
        <ExcludedItemsModal
          excludedIndustries={formData.excluded_industries || []}
          excludedKeywords={formData.excluded_keywords || []}
          onSave={(industries, keywords) => {
            setFormData(prev => ({
              ...prev,
              excluded_industries: industries,
              excluded_keywords: keywords,
            }));
            setShowExcludedModal(false);
          }}
          onCancel={() => setShowExcludedModal(false)}
        />
      )}
    </Card>
  );
}

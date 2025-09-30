import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  Target, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface BusinessProfile {
  id: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  target_company_size?: string[];
  target_industries?: string[];
  target_job_titles?: string[];
  target_seniority_levels?: string[];
  target_locations?: string[];
  ideal_customer_profile?: string;
  pain_points?: string[];
  budget_range?: string;
  decision_makers?: string[];
  sales_process_stages?: string[];
  qualification_criteria?: any;
  lead_scoring_rules?: any;
  automation_preferences?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface BusinessProfileFormData {
  company_name: string;
  industry: string;
  company_size: string;
  target_company_size: string[];
  target_industries: string[];
  target_job_titles: string[];
  target_seniority_levels: string[];
  target_locations: string[];
  ideal_customer_profile: string;
  pain_points: string[];
  budget_range: string;
  decision_makers: string[];
  sales_process_stages: string[];
  qualification_criteria: any;
  lead_scoring_rules: any;
  automation_preferences: any;
}

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees', 
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5000+ employees'
];

const INDUSTRIES = [
  'Technology',
  'Software',
  'SaaS',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Consulting',
  'Marketing',
  'Other'
];

const SENIORITY_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior',
  'Lead',
  'Manager',
  'Director',
  'VP',
  'C-Level',
  'Executive'
];

const AUSTRALIAN_LOCATIONS = [
  'Sydney',
  'Melbourne',
  'Brisbane',
  'Perth',
  'Adelaide',
  'Canberra',
  'Gold Coast',
  'Newcastle',
  'Wollongong',
  'Geelong',
  'Hobart',
  'Darwin',
  'Remote',
  'Other'
];

const COMMON_JOB_TITLES = [
  'CEO',
  'CTO',
  'VP Engineering',
  'Head of Technology',
  'Engineering Manager',
  'Senior Developer',
  'Product Manager',
  'Head of Product',
  'VP Sales',
  'Sales Manager',
  'Marketing Manager',
  'Head of Marketing',
  'HR Manager',
  'Head of Talent',
  'Operations Manager',
  'Finance Manager',
  'CFO',
  'Other'
];

const COMMON_PAIN_POINTS = [
  'Talent shortage',
  'High recruitment costs',
  'Time to hire',
  'Quality of candidates',
  'Retention issues',
  'Skills gap',
  'Competition for talent',
  'Budget constraints',
  'Process inefficiency',
  'Technology limitations',
  'Market competition',
  'Customer acquisition',
  'Revenue growth',
  'Operational costs',
  'Other'
];

const SALES_STAGES = [
  'Initial Contact',
  'Qualification',
  'Needs Analysis',
  'Demo',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

export default function BusinessProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessProfileFormData>({
    company_name: '',
    industry: '',
    company_size: '',
    target_company_size: [],
    target_industries: [],
    target_job_titles: [],
    target_seniority_levels: [],
    target_locations: [],
    ideal_customer_profile: '',
    pain_points: [],
    budget_range: '',
    decision_makers: [],
    sales_process_stages: [],
    qualification_criteria: {},
    lead_scoring_rules: {},
    automation_preferences: {}
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch business profile
  const { data: businessProfile, isLoading } = useQuery({
    queryKey: ['business-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('created_by', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Update business profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: BusinessProfileFormData) => {
      if (businessProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('business_profiles')
          .update(data)
          .eq('id', businessProfile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('business_profiles')
          .insert({
            ...data,
            created_by: user?.id
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile'] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your business profile has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save profile: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Load form data when profile is fetched
  useEffect(() => {
    if (businessProfile) {
      setFormData({
        company_name: businessProfile.company_name || '',
        industry: businessProfile.industry || '',
        company_size: businessProfile.company_size || '',
        target_company_size: businessProfile.target_company_size || [],
        target_industries: businessProfile.target_industries || [],
        target_job_titles: businessProfile.target_job_titles || [],
        target_seniority_levels: businessProfile.target_seniority_levels || [],
        target_locations: businessProfile.target_locations || [],
        ideal_customer_profile: businessProfile.ideal_customer_profile || '',
        pain_points: businessProfile.pain_points || [],
        budget_range: businessProfile.budget_range || '',
        decision_makers: businessProfile.decision_makers || [],
        sales_process_stages: businessProfile.sales_process_stages || [],
        qualification_criteria: businessProfile.qualification_criteria || {},
        lead_scoring_rules: businessProfile.lead_scoring_rules || {},
        automation_preferences: businessProfile.automation_preferences || {}
      });
    }
  }, [businessProfile]);

  const handleArrayFieldChange = (field: keyof BusinessProfileFormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      setFormData({ ...formData, [field]: [...currentArray, value] });
    } else {
      setFormData({ ...formData, [field]: currentArray.filter(item => item !== value) });
    }
  };

  const handleSubmit = () => {
    updateProfileMutation.mutate(formData);
  };

  const renderArrayField = (
    field: keyof BusinessProfileFormData,
    options: string[],
    label: string,
    description?: string
  ) => {
    const currentArray = formData[field] as string[];
    
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentArray.includes(option)}
                onChange={(e) => handleArrayFieldChange(field, option, e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
        {currentArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {currentArray.map((item) => (
              <Badge key={item} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Profile</h1>
          <p className="text-muted-foreground">
            Define your ideal customer profile to improve lead filtering and qualification
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="qualification">Qualification</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company_size">Company Size</Label>
                  <Select
                    value={formData.company_size}
                    onValueChange={(value) => setFormData({ ...formData, company_size: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget_range">Budget Range</Label>
                  <Input
                    id="budget_range"
                    value={formData.budget_range}
                    onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., $50,000 - $200,000"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ideal_customer_profile">Ideal Customer Profile</Label>
                <Textarea
                  id="ideal_customer_profile"
                  value={formData.ideal_customer_profile}
                  onChange={(e) => setFormData({ ...formData, ideal_customer_profile: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Describe your ideal customer profile..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targeting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Target Audience
              </CardTitle>
              <CardDescription>
                Define who you want to target for your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(
                'target_company_size',
                COMPANY_SIZES,
                'Target Company Sizes',
                'Select the company sizes you want to target'
              )}
              
              {renderArrayField(
                'target_industries',
                INDUSTRIES,
                'Target Industries',
                'Select the industries you want to focus on'
              )}
              
              {renderArrayField(
                'target_job_titles',
                COMMON_JOB_TITLES,
                'Target Job Titles',
                'Select the job titles of your ideal prospects'
              )}
              
              {renderArrayField(
                'target_seniority_levels',
                SENIORITY_LEVELS,
                'Target Seniority Levels',
                'Select the seniority levels you want to target'
              )}
              
              {renderArrayField(
                'target_locations',
                AUSTRALIAN_LOCATIONS,
                'Target Locations',
                'Select the locations where your prospects are based'
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Qualification Criteria
              </CardTitle>
              <CardDescription>
                Define what makes a lead qualified for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(
                'pain_points',
                COMMON_PAIN_POINTS,
                'Pain Points',
                'Select the pain points your prospects typically have'
              )}
              
              {renderArrayField(
                'decision_makers',
                COMMON_JOB_TITLES,
                'Decision Makers',
                'Select the job titles that typically make purchasing decisions'
              )}
              
              {renderArrayField(
                'sales_process_stages',
                SALES_STAGES,
                'Sales Process Stages',
                'Define your sales process stages'
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Automation Preferences
              </CardTitle>
              <CardDescription>
                Configure how leads should be automatically processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium text-blue-900">Lead Scoring Rules</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your business profile will automatically influence lead scoring. 
                      Leads matching your criteria will receive higher scores.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium text-green-900">Automatic Qualification</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Leads matching your target criteria will be automatically marked as qualified.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Smart Filtering</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      The system will prioritize leads that match your business profile 
                      and filter out irrelevant prospects.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}





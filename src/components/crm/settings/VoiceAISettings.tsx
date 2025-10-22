import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RetellVoice, retellAIService } from '@/services/retellAIService';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BarChart3,
  CheckCircle,
  Clock,
  MessageSquare,
  Phone,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form schemas
const voiceSettingsSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(['retell', 'twilio', 'dialogflow']),
  voiceId: z.string(),
  language: z.string(),
  // AI Behavior Controls
  aiPersonality: z.enum([
    'professional',
    'friendly',
    'authoritative',
    'casual',
  ]),
  conversationStyle: z.enum(['formal', 'conversational', 'brief', 'detailed']),
  interruptionHandling: z.enum(['polite', 'immediate', 'wait']),
  // Prompt Management
  systemPrompt: z.string(),
  greetingMessage: z.string(),
  fallbackMessage: z.string(),
  escalationMessage: z.string(),
  // Voice Quality
  speechRate: z.number().min(0.5).max(2.0),
  voiceVolume: z.number().min(0.1).max(1.0),
  voicePitch: z.number().min(0.5).max(2.0),
  // Escalation Controls
  escalationTriggers: z.array(z.string()),
  maxConversationLength: z.number().min(1).max(60),
  silenceTimeout: z.number().min(1).max(30),
  confidenceThreshold: z.number().min(0.1).max(1.0),
  maxRetryAttempts: z.number().min(1).max(5),
  // Privacy & Compliance
  privacyCompliance: z.array(z.string()),
  callRecordingConsent: z.boolean(),
  dataRetentionDays: z.number().min(1).max(365),
  // Integration Status
  integrationStatus: z.enum(['connected', 'disconnected', 'error']),
  lastSyncTime: z.string().optional(),
});

const phoneNumberSchema = z.object({
  number: z.string().min(10, 'Phone number must be at least 10 digits'),
  type: z.enum(['voice', 'sms', 'both']),
  retellAgentId: z.string().optional(),
  smsFallback: z.boolean(),
  smsDelay: z.number().min(1).max(60),
  smsTemplate: z.string(),
});

const analyticsSchema = z.object({
  trackCallVolume: z.boolean(),
  trackSuccessRate: z.boolean(),
  trackSentiment: z.boolean(),
  trackDuration: z.boolean(),
  reportFrequency: z.enum(['daily', 'weekly', 'monthly']),
});

type VoiceSettingsForm = z.infer<typeof voiceSettingsSchema>;
type PhoneNumberForm = z.infer<typeof phoneNumberSchema>;
type AnalyticsForm = z.infer<typeof analyticsSchema>;

// Voice interface for Retell AI API
interface RetellVoice {
  voice_id: string;
  name: string;
  gender?: string;
  accent?: string;
  language?: string;
  provider?: string;
}

// Mock data - will be replaced with API call
const mockVoiceOptions: RetellVoice[] = [
  {
    voice_id: '11labs-Adrian',
    name: 'Adrian',
    gender: 'Male',
    accent: 'American',
    language: 'en-US',
    provider: 'ElevenLabs',
  },
  {
    voice_id: '11labs-Sarah',
    name: 'Sarah',
    gender: 'Female',
    accent: 'American',
    language: 'en-US',
    provider: 'ElevenLabs',
  },
  {
    voice_id: '11labs-Michael',
    name: 'Michael',
    gender: 'Male',
    accent: 'British',
    language: 'en-GB',
    provider: 'ElevenLabs',
  },
  {
    voice_id: '11labs-Emma',
    name: 'Emma',
    gender: 'Female',
    accent: 'Australian',
    language: 'en-AU',
    provider: 'ElevenLabs',
  },
  {
    voice_id: 'playht-David',
    name: 'David',
    gender: 'Male',
    accent: 'Canadian',
    language: 'en-CA',
    provider: 'PlayHT',
  },
  {
    voice_id: 'playht-Lisa',
    name: 'Lisa',
    gender: 'Female',
    accent: 'American',
    language: 'en-US',
    provider: 'PlayHT',
  },
];

const personalityOptions = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal, business-focused tone',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, approachable, conversational',
  },
  {
    value: 'authoritative',
    label: 'Authoritative',
    description: 'Confident, expert tone',
  },
  { value: 'casual', label: 'Casual', description: 'Relaxed, informal tone' },
];

const conversationStyleOptions = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Structured, professional language',
  },
  {
    value: 'conversational',
    label: 'Conversational',
    description: 'Natural, flowing dialogue',
  },
  {
    value: 'brief',
    label: 'Brief',
    description: 'Concise, to-the-point responses',
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Comprehensive, thorough explanations',
  },
];

const interruptionHandlingOptions = [
  {
    value: 'polite',
    label: 'Polite',
    description: 'Wait for natural pause, then respond',
  },
  {
    value: 'immediate',
    label: 'Immediate',
    description: 'Respond immediately when interrupted',
  },
  {
    value: 'wait',
    label: 'Wait',
    description: 'Always wait for customer to finish',
  },
];

const escalationTriggerOptions = [
  'Customer requests human agent',
  'Customer expresses frustration',
  'Technical issue detected',
  'Payment/billing inquiry',
  'Complaint or negative feedback',
  'Complex technical question',
  'Customer asks for supervisor',
  'Conversation exceeds time limit',
];

const languageOptions = [
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { value: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { value: 'es-ES', label: 'Spanish (Spain)', flag: '🇪🇸' },
  { value: 'es-MX', label: 'Spanish (Mexico)', flag: '🇲🇽' },
  { value: 'fr-FR', label: 'French (France)', flag: '🇫🇷' },
  { value: 'de-DE', label: 'German (Germany)', flag: '🇩🇪' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { value: 'it-IT', label: 'Italian (Italy)', flag: '🇮🇹' },
  { value: 'ja-JP', label: 'Japanese (Japan)', flag: '🇯🇵' },
  { value: 'ko-KR', label: 'Korean (South Korea)', flag: '🇰🇷' },
  { value: 'zh-CN', label: 'Chinese (Simplified)', flag: '🇨🇳' },
  { value: 'zh-TW', label: 'Chinese (Traditional)', flag: '🇹🇼' },
];

const privacyOptions = [
  {
    value: 'gdpr',
    label: 'GDPR Compliance',
    description: 'European data protection standards',
  },
  {
    value: 'ccpa',
    label: 'CCPA Compliance',
    description: 'California consumer privacy act',
  },
  {
    value: 'hipaa',
    label: 'HIPAA Compliance',
    description: 'Healthcare data protection',
  },
  {
    value: 'sox',
    label: 'SOX Compliance',
    description: 'Financial data protection',
  },
];

const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
];

const VoiceAISettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [phoneNumbers, setPhoneNumbers] = useState([
    {
      id: '1',
      number: '+1 (555) 123-4567',
      type: 'both',
      status: 'active',
      callsToday: 12,
      smsToday: 8,
    },
  ]);

  // Fetch voices from Retell AI API
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setVoicesLoading(true);
        const availableVoices = await retellAIService.getVoices();
        setVoices(availableVoices);
      } catch (error) {
        console.error('Failed to fetch voices:', error);
        toast({
          title: 'Warning',
          description:
            'Using fallback voice options. Check your Retell AI API configuration.',
          variant: 'destructive',
        });
        // Use mock data as fallback
        setVoices(mockVoiceOptions);
      } finally {
        setVoicesLoading(false);
      }
    };

    fetchVoices();
  }, [toast]);

  // Voice Settings Form
  const voiceForm = useForm<VoiceSettingsForm>({
    resolver: zodResolver(voiceSettingsSchema),
    defaultValues: {
      enabled: false,
      provider: 'retell',
      voiceId: '11labs-Adrian',
      language: 'en-US',
      // AI Behavior Controls
      aiPersonality: 'professional',
      conversationStyle: 'conversational',
      interruptionHandling: 'polite',
      // Prompt Management
      systemPrompt:
        'You are a helpful AI assistant for ABC Company. Your role is to assist customers with inquiries, provide information about our products and services, and escalate complex issues to human agents when necessary. Always be polite, professional, and helpful.',
      greetingMessage:
        "Hello! Thank you for calling ABC Company. My name is Sarah, and I'm here to help you today. How can I assist you?",
      fallbackMessage:
        "I apologize, but I didn't quite catch that. Could you please repeat your question or let me know how I can help you?",
      escalationMessage:
        "I understand you'd like to speak with a human agent. Let me transfer you to one of our representatives who can better assist you.",
      // Voice Quality
      speechRate: 1.0,
      voiceVolume: 0.8,
      voicePitch: 1.0,
      // Escalation Controls
      escalationTriggers: [
        'Customer requests human agent',
        'Customer expresses frustration',
      ],
      maxConversationLength: 15,
      silenceTimeout: 5,
      confidenceThreshold: 0.7,
      maxRetryAttempts: 3,
      // Privacy & Compliance
      privacyCompliance: ['gdpr'],
      callRecordingConsent: true,
      dataRetentionDays: 90,
      // Integration Status
      integrationStatus: 'connected',
      lastSyncTime: '2024-01-15 10:30:00',
    },
  });

  // Phone Number Form
  const phoneForm = useForm<PhoneNumberForm>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      number: '',
      type: 'both',
      smsFallback: true,
      smsDelay: 2,
      smsTemplate:
        'Hi {{name}}, I tried calling you about {{deal}}. Please call me back at {{phone}} or reply to this text.',
    },
  });

  // Analytics Form
  const analyticsForm = useForm<AnalyticsForm>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: {
      trackCallVolume: true,
      trackSuccessRate: true,
      trackSentiment: true,
      trackDuration: true,
      reportFrequency: 'weekly',
    },
  });

  const onVoiceSettingsSubmit = async (data: VoiceSettingsForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Voice AI Settings Updated',
        description: 'Your voice AI configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update voice AI settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneNumberSubmit = async (data: PhoneNumberForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newNumber = {
        id: Date.now().toString(),
        number: data.number,
        type: data.type,
        status: 'active',
        callsToday: 0,
        smsToday: 0,
      };
      setPhoneNumbers(prev => [...prev, newNumber]);
      phoneForm.reset();
      toast({
        title: 'Phone Number Added',
        description: 'Your new phone number has been configured successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add phone number. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onAnalyticsSubmit = async (data: AnalyticsForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Analytics Settings Updated',
        description:
          'Your analytics configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update analytics settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoneNumber = (id: string) => {
    setPhoneNumbers(prev => prev.filter(num => num.id !== id));
    toast({
      title: 'Phone Number Removed',
      description: 'The phone number has been removed from your account.',
    });
  };

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Voice AI Settings
        </h1>
        <p className='text-gray-600'>
          Configure your voice AI integration with Retell AI for automated
          calls, SMS fallback, and comprehensive analytics.
        </p>
      </div>

      <Tabs defaultValue='agents' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='agents' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            Agents
          </TabsTrigger>
          <TabsTrigger
            value='phone-numbers'
            className='flex items-center gap-2'
          >
            <Phone className='h-4 w-4' />
            Phone Numbers
          </TabsTrigger>
          <TabsTrigger value='logs' className='flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            Logs & Analytics
          </TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value='agents' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Voice AI Agents
              </CardTitle>
              <CardDescription>
                Create and manage your Retell AI voice agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...voiceForm}>
                <form
                  onSubmit={voiceForm.handleSubmit(onVoiceSettingsSubmit)}
                  className='space-y-6'
                >
                  {/* Enable Voice AI */}
                  <FormField
                    control={voiceForm.control}
                    name='enabled'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base font-medium'>
                            Enable Voice AI
                          </FormLabel>
                          <FormDescription>
                            Turn on voice AI for automated calls and
                            conversations
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Integration Status */}
                  <div className='p-4 border rounded-lg bg-gray-50'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium'>Integration Status</h4>
                        <p className='text-sm text-gray-600'>
                          Retell AI Connection
                        </p>
                      </div>
                      <div className='text-right'>
                        <Badge
                          variant='default'
                          className='bg-green-100 text-green-800'
                        >
                          Connected
                        </Badge>
                        <p className='text-xs text-gray-500 mt-1'>
                          Last sync: 2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Voice Selection */}
                  <FormField
                    control={voiceForm.control}
                    name='voiceId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voice Selection</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={voicesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  voicesLoading
                                    ? 'Loading voices...'
                                    : 'Select voice'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {voices.map(voice => (
                              <SelectItem
                                key={voice.voice_id}
                                value={voice.voice_id}
                              >
                                <div className='flex flex-col'>
                                  <div className='flex items-center gap-2'>
                                    <span className='font-medium'>
                                      {voice.name}
                                    </span>
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      {voice.provider}
                                    </Badge>
                                  </div>
                                  <span className='text-xs text-muted-foreground'>
                                    {voice.gender} • {voice.accent} •{' '}
                                    {voice.language}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose from available Retell AI voices. Voices are
                          loaded from the Retell AI API.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Language */}
                  <FormField
                    control={voiceForm.control}
                    name='language'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language & Locale</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select language' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                <div className='flex items-center gap-2'>
                                  <span>{lang.flag}</span>
                                  <span>{lang.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Primary language and locale for voice AI conversations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AI Personality */}
                  <FormField
                    control={voiceForm.control}
                    name='aiPersonality'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Personality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select personality' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {personalityOptions.map(personality => (
                              <SelectItem
                                key={personality.value}
                                value={personality.value}
                              >
                                <div className='flex flex-col'>
                                  <span>{personality.label}</span>
                                  <span className='text-xs text-muted-foreground'>
                                    {personality.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the personality that best represents your brand
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* System Prompt */}
                  <FormField
                    control={voiceForm.control}
                    name='systemPrompt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter the main system prompt that defines the AI agent behavior...'
                            className='min-h-[120px]'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the core instruction that defines how your AI
                          agent should behave
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' disabled={isLoading} className='w-full'>
                    {isLoading ? 'Saving...' : 'Save Agent Configuration'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phone Numbers Tab */}
        <TabsContent value='phone-numbers' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Phone className='h-5 w-5' />
                Phone Number Management
              </CardTitle>
              <CardDescription>
                Manage your business phone numbers for voice AI calls
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Current Phone Numbers */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Current Phone Numbers</h3>
                <div className='space-y-3'>
                  {phoneNumbers.map(number => (
                    <div
                      key={number.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2'>
                          <Phone className='h-4 w-4 text-gray-500' />
                          <span className='font-medium'>{number.number}</span>
                          <Badge
                            variant={
                              number.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {number.status}
                          </Badge>
                        </div>
                        <div className='flex items-center gap-4 text-sm text-gray-500'>
                          <span className='flex items-center gap-1'>
                            <Phone className='h-3 w-3' />
                            {number.callsToday} calls today
                          </span>
                          <span className='flex items-center gap-1'>
                            <MessageSquare className='h-3 w-3' />
                            {number.smsToday} SMS today
                          </span>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => removePhoneNumber(number.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Phone Number */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Add New Phone Number</h3>
                <Form {...phoneForm}>
                  <form
                    onSubmit={phoneForm.handleSubmit(onPhoneNumberSubmit)}
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={phoneForm.control}
                        name='number'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='+1 (555) 123-4567'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include country code (e.g., +1 for US)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={phoneForm.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capabilities</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='voice'>
                                  Voice Only
                                </SelectItem>
                                <SelectItem value='sms'>SMS Only</SelectItem>
                                <SelectItem value='both'>
                                  Voice & SMS
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='w-full'
                    >
                      {isLoading ? 'Adding...' : 'Add Phone Number'}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs & Analytics Tab */}
        <TabsContent value='logs' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Call Logs & Analytics
              </CardTitle>
              <CardDescription>
                Monitor call performance and view detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Quick Stats */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-blue-500' />
                      <span className='text-sm font-medium'>Total Calls</span>
                    </div>
                    <p className='text-2xl font-bold mt-2'>1,247</p>
                    <p className='text-xs text-green-600 flex items-center gap-1'>
                      <TrendingUp className='h-3 w-3' />
                      +12% this week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <span className='text-sm font-medium'>Success Rate</span>
                    </div>
                    <p className='text-2xl font-bold mt-2'>87%</p>
                    <p className='text-xs text-green-600 flex items-center gap-1'>
                      <TrendingUp className='h-3 w-3' />
                      +3% this week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-orange-500' />
                      <span className='text-sm font-medium'>Avg Duration</span>
                    </div>
                    <p className='text-2xl font-bold mt-2'>4.2m</p>
                    <p className='text-xs text-gray-600 flex items-center gap-1'>
                      <TrendingUp className='h-3 w-3' />
                      -0.3m this week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2'>
                      <MessageSquare className='h-4 w-4 text-purple-500' />
                      <span className='text-sm font-medium'>Escalations</span>
                    </div>
                    <p className='text-2xl font-bold mt-2'>23</p>
                    <p className='text-xs text-red-600 flex items-center gap-1'>
                      <TrendingUp className='h-3 w-3' />
                      +2 this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Calls */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Recent Calls</h3>
                <div className='space-y-3'>
                  <div className='p-4 border rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <Phone className='h-4 w-4 text-gray-500' />
                        <span className='font-medium'>+1 (555) 123-4567</span>
                        <Badge
                          variant='default'
                          className='bg-green-100 text-green-800'
                        >
                          Completed
                        </Badge>
                      </div>
                      <span className='text-sm text-gray-500'>
                        2 minutes ago
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 mb-2'>
                      Duration: 4:32 • Sentiment: Positive
                    </p>
                    <p className='text-sm'>
                      Customer called about billing inquiry. Issue resolved
                      successfully.
                    </p>
                  </div>

                  <div className='p-4 border rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <Phone className='h-4 w-4 text-gray-500' />
                        <span className='font-medium'>+1 (555) 987-6543</span>
                        <Badge
                          variant='secondary'
                          className='bg-yellow-100 text-yellow-800'
                        >
                          No Answer
                        </Badge>
                      </div>
                      <span className='text-sm text-gray-500'>
                        5 minutes ago
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 mb-2'>
                      Duration: 0:00 • Sentiment: Neutral
                    </p>
                    <p className='text-sm'>No answer - SMS sent as fallback.</p>
                  </div>

                  <div className='p-4 border rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <Phone className='h-4 w-4 text-gray-500' />
                        <span className='font-medium'>+1 (555) 456-7890</span>
                        <Badge
                          variant='default'
                          className='bg-green-100 text-green-800'
                        >
                          Completed
                        </Badge>
                      </div>
                      <span className='text-sm text-gray-500'>
                        8 minutes ago
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 mb-2'>
                      Duration: 6:15 • Sentiment: Positive
                    </p>
                    <p className='text-sm'>
                      Customer interested in premium package. Scheduled
                      follow-up call.
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Settings */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Analytics Configuration</h3>
                <Form {...analyticsForm}>
                  <form
                    onSubmit={analyticsForm.handleSubmit(onAnalyticsSubmit)}
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={analyticsForm.control}
                        name='trackCallVolume'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base font-medium'>
                                Track Call Volume
                              </FormLabel>
                              <FormDescription>
                                Monitor total calls made and received
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={analyticsForm.control}
                        name='trackSuccessRate'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base font-medium'>
                                Track Success Rate
                              </FormLabel>
                              <FormDescription>
                                Monitor call completion rates
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={analyticsForm.control}
                        name='trackSentiment'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base font-medium'>
                                Track Sentiment
                              </FormLabel>
                              <FormDescription>
                                Analyze caller mood and satisfaction
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={analyticsForm.control}
                        name='trackDuration'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                            <div className='space-y-0.5'>
                              <FormLabel className='text-base font-medium'>
                                Track Duration
                              </FormLabel>
                              <FormDescription>
                                Monitor average call length
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='w-full'
                    >
                      {isLoading ? 'Saving...' : 'Save Analytics Settings'}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceAISettings;

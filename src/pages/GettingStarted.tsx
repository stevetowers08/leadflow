/**
 * Getting Started Page
 * Two sections: App information + Setup progress
 */

import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Page } from '@/design-system/components';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StepStatus {
  id: string;
  title: string;
  description: string;
  href: string;
  completed: boolean;
}

export default function GettingStarted() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<StepStatus[]>([
    {
      id: 'job_filtering',
      title: 'Set up job filtering',
      description:
        'Configure automated job discovery from LinkedIn and job boards',
      href: '/job-filtering',
      completed: false,
    },
    {
      id: 'gmail',
      title: 'Connect Gmail',
      description: 'Link your Gmail account to send emails and track replies',
      href: '/crm/communications',
      completed: false,
    },
    {
      id: 'crm',
      title: 'Configure business profile',
      description:
        'Set up company settings, targeting criteria, and permissions',
      href: '/settings',
      completed: false,
    },
    {
      id: 'first_message',
      title: 'Send first outreach',
      description: 'Contact decision makers at target companies',
      href: '/jobs',
      completed: false,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProgress = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const [gmailConnected, jobFilterSet, hasSentMessage] =
          await Promise.all([
            checkGmailConnection(),
            checkJobFilterSetup(),
            checkFirstMessageSent(),
          ]);

        setSteps(prev =>
          prev.map(step => {
            if (step.id === 'gmail')
              return { ...step, completed: gmailConnected };
            if (step.id === 'job_filtering')
              return { ...step, completed: jobFilterSet };
            if (step.id === 'first_message')
              return { ...step, completed: hasSentMessage };
            return step;
          })
        );
      } catch (error) {
        console.error('Error checking progress:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProgress();
  }, [user]);

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <Page title='Getting Started' hideHeader>
      <div className='space-y-12 max-w-4xl'>
        {/* Section 1: App Information */}
        <div>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Turn job postings into client relationships
          </h1>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
            RECRUITEDGE automatically discovers companies hiring on LinkedIn,
            qualifies them as potential clients, and helps you reach out to
            decision makers to build your recruitment pipeline.
          </p>

          <div className='bg-white rounded-lg border border-gray-200 p-8 space-y-8'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                How it works
              </h2>
              <div className='space-y-4 text-gray-700'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    Automated job discovery
                  </h3>
                  <p className='text-gray-600'>
                    Jobs are automatically discovered based on your filtering
                    criteria from LinkedIn and other job boards. Review job
                    postings to identify companies that are actively hiring.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    Company pipeline management
                  </h3>
                  <p className='text-gray-600'>
                    Each qualified job automatically creates a company profile
                    in your pipeline. Research companies, add notes, and track
                    your progress through stages from new lead to closed deal.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>
                    Decision maker outreach
                  </h3>
                  <p className='text-gray-600'>
                    Find and connect with hiring managers, HR directors, and
                    CTOs at target companies. Send personalized messages and
                    track responses to build relationships and close deals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Getting Started */}
        <div>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              Getting started
            </h2>
            {!loading && (
              <span className='text-sm text-gray-500'>
                {completedCount} of {steps.length} steps complete
              </span>
            )}
          </div>

          <div className='bg-white rounded-lg border border-gray-200 p-8'>
            {loading ? (
              <div className='text-center py-8 text-gray-500'>
                Loading progress...
              </div>
            ) : (
              <>
                <Progress value={progressPercentage} className='h-3 mb-6' />

                <div className='space-y-3'>
                  {steps.map(step => (
                    <button
                      key={step.id}
                      onClick={() => navigate(step.href)}
                      className={`w-full text-left transition-all rounded-lg border p-4 ${
                        step.completed
                          ? 'border-green-200 bg-green-50/30 hover:bg-green-50/50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className='flex items-start gap-4'>
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center text-sm font-medium ${
                            step.completed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className='h-5 w-5 text-green-600' />
                          ) : (
                            <span>{steps.indexOf(step) + 1}</span>
                          )}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-4'>
                            <div>
                              <h3
                                className={`text-base font-semibold mb-1 ${
                                  step.completed
                                    ? 'text-green-900'
                                    : 'text-gray-900'
                                }`}
                              >
                                {step.title}
                              </h3>
                              <p
                                className={`text-sm ${
                                  step.completed
                                    ? 'text-green-700'
                                    : 'text-gray-600'
                                }`}
                              >
                                {step.description}
                              </p>
                            </div>
                            <ChevronRight
                              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                step.completed
                                  ? 'text-green-600'
                                  : 'text-gray-400 group-hover:text-gray-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

// Helper functions
async function checkGmailConnection(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('email_accounts')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', 'gmail')
      .eq('is_active', true)
      .limit(1);

    if (error) return false;
    return !!data && data.length > 0;
  } catch {
    return false;
  }
}

async function checkJobFilterSetup(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('job_filter_configs')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1);

    if (error) return false;
    return !!data && data.length > 0;
  } catch {
    return false;
  }
}

async function checkFirstMessageSent(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('interactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('interaction_type', 'email_sent')
      .limit(1);

    if (error) return false;
    return !!data && data.length > 0;
  } catch {
    return false;
  }
}

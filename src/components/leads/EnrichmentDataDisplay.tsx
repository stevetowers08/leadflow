'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lead } from '@/types/database';
import type {
  SimplifiedEnrichmentData,
  PDLExperience,
  PDLEducation,
} from '@/types/peopleDataLabs';
import {
  Building2,
  Briefcase,
  GraduationCap,
  Linkedin,
  MapPin,
  Twitter,
} from 'lucide-react';
import { logger } from '@/utils/productionLogger';

interface EnrichmentDataDisplayProps {
  lead: Lead;
}

/**
 * Format URL to ensure it has protocol
 */
function formatUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `https://${url}`;
}

/**
 * Get numeric likelihood value
 */
function getLikelihood(
  enrichmentData: SimplifiedEnrichmentData
): number | null {
  if (!enrichmentData.likelihood) return null;
  return typeof enrichmentData.likelihood === 'string'
    ? parseInt(enrichmentData.likelihood, 10)
    : enrichmentData.likelihood;
}

export function EnrichmentDataDisplay({ lead }: EnrichmentDataDisplayProps) {
  // Debug logging
  const data = lead.enrichment_data as unknown as SimplifiedEnrichmentData;
  logger.debug('[EnrichmentDataDisplay] Lead data:', {
    id: lead.id,
    enrichment_status: lead.enrichment_status,
    has_enrichment_data: !!lead.enrichment_data,
    enrichment_data_type: typeof lead.enrichment_data,
    enrichment_data_keys: lead.enrichment_data
      ? Object.keys(lead.enrichment_data as Record<string, unknown>)
      : null,
    likelihood: data?.likelihood,
    linkedin_url: data?.linkedin_url,
    job_title: data?.job_title,
    job_company: data?.job_company,
    skills_length: data?.skills?.length,
    experience_length: data?.experience?.length,
    education_length: data?.education?.length,
  });

  if (!lead.enrichment_data || lead.enrichment_status !== 'completed') {
    logger.debug(
      '[EnrichmentDataDisplay] Returning null - missing data or wrong status',
      {
        has_data: !!lead.enrichment_data,
        status: lead.enrichment_status,
      }
    );
    return null;
  }

  const enrichmentData =
    lead.enrichment_data as unknown as SimplifiedEnrichmentData;
  const likelihood = getLikelihood(enrichmentData);

  // Early return if no meaningful data
  if (
    !likelihood &&
    !enrichmentData.linkedin_url &&
    !enrichmentData.job_title &&
    !enrichmentData.job_company &&
    !enrichmentData.skills?.length &&
    !enrichmentData.experience?.length &&
    !enrichmentData.education?.length
  ) {
    logger.debug(
      '[EnrichmentDataDisplay] Returning null - no meaningful data',
      {
        likelihood,
        linkedin_url: enrichmentData.linkedin_url,
        job_title: enrichmentData.job_title,
        job_company: enrichmentData.job_company,
        skills_length: enrichmentData.skills?.length,
        experience_length: enrichmentData.experience?.length,
        education_length: enrichmentData.education?.length,
      }
    );
    return null;
  }

  return (
    <div className='space-y-4'>
      {likelihood && (
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Confidence:</span>
          <Badge variant={likelihood >= 8 ? 'default' : 'secondary'}>
            {likelihood}/10
          </Badge>
        </div>
      )}

      {(enrichmentData.linkedin_url ||
        enrichmentData.twitter_url ||
        enrichmentData.github_url) && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Social Profiles</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {enrichmentData.linkedin_url && (
              <a
                href={formatUrl(enrichmentData.linkedin_url) || '#'}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-blue-600 hover:underline'
              >
                <Linkedin className='h-4 w-4' />
                {enrichmentData.linkedin_username || 'LinkedIn Profile'}
              </a>
            )}
            {enrichmentData.twitter_url && (
              <a
                href={formatUrl(enrichmentData.twitter_url) || '#'}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-blue-400 hover:underline'
              >
                <Twitter className='h-4 w-4' />
                Twitter Profile
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {(enrichmentData.job_title || enrichmentData.job_company) && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Current Position</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {enrichmentData.job_title && (
              <div className='flex items-start gap-2'>
                <Briefcase className='h-4 w-4 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{enrichmentData.job_title}</p>
                  {enrichmentData.job_company && (
                    <p className='text-sm text-muted-foreground'>
                      {enrichmentData.job_company}
                    </p>
                  )}
                </div>
              </div>
            )}
            {enrichmentData.job_company_website && (
              <div className='flex items-center gap-2'>
                <Building2 className='h-4 w-4 text-muted-foreground' />
                <a
                  href={formatUrl(enrichmentData.job_company_website) || '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 hover:underline'
                >
                  {enrichmentData.job_company_website}
                </a>
              </div>
            )}
            {enrichmentData.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  {enrichmentData.location}
                </p>
              </div>
            )}
            {(enrichmentData.job_company_industry ||
              enrichmentData.job_company_size) && (
              <div className='flex items-center gap-2'>
                {enrichmentData.job_company_industry && (
                  <Badge variant='outline'>
                    {enrichmentData.job_company_industry}
                  </Badge>
                )}
                {enrichmentData.job_company_size && (
                  <Badge variant='outline'>
                    {enrichmentData.job_company_size} employees
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {enrichmentData.skills && enrichmentData.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {enrichmentData.skills.slice(0, 15).map(skill => (
                <Badge key={skill} variant='secondary'>
                  {skill}
                </Badge>
              ))}
              {enrichmentData.skills.length > 15 && (
                <Badge variant='outline'>
                  +{enrichmentData.skills.length - 15} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {enrichmentData.experience && enrichmentData.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Work History</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {enrichmentData.experience
              .slice(0, 3)
              .map((exp: PDLExperience, i: number) => (
                <div key={i} className='border-l-2 border-muted pl-4 space-y-1'>
                  <p className='font-medium'>{exp.title.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {exp.company.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {exp.start_date} - {exp.end_date || 'Present'}
                    {exp.is_primary && (
                      <Badge variant='outline' className='ml-2'>
                        Current
                      </Badge>
                    )}
                  </p>
                </div>
              ))}
            {enrichmentData.experience.length > 3 && (
              <p className='text-sm text-muted-foreground'>
                +{enrichmentData.experience.length - 3} more positions
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {enrichmentData.education && enrichmentData.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Education</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {enrichmentData.education.map((edu: PDLEducation, i: number) => (
              <div key={i} className='flex items-start gap-2'>
                <GraduationCap className='h-4 w-4 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{edu.school.name}</p>
                  {edu.degrees && edu.degrees.length > 0 && (
                    <p className='text-sm text-muted-foreground'>
                      {edu.degrees.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {lead.enrichment_timestamp && (
        <p className='text-xs text-muted-foreground'>
          Enriched {new Date(lead.enrichment_timestamp).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

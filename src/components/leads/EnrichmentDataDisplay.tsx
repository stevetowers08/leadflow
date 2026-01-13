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

interface EnrichmentDataDisplayProps {
  lead: Lead;
}

export function EnrichmentDataDisplay({ lead }: EnrichmentDataDisplayProps) {
  // Check if lead has enrichment data
  if (!lead.enrichment_data || lead.enrichment_status !== 'completed') {
    return null;
  }

  const data = lead.enrichment_data as unknown as SimplifiedEnrichmentData;

  return (
    <div className='space-y-4'>
      {/* Confidence Badge */}
      {data.likelihood && (
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Enrichment Confidence:</span>
          <Badge variant={data.likelihood >= 8 ? 'default' : 'secondary'}>
            {data.likelihood}/10
          </Badge>
        </div>
      )}

      {/* Social Profiles */}
      {(data.linkedin_url || data.twitter_url || data.github_url) && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Social Profiles</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {data.linkedin_url && (
              <a
                href={`https://${data.linkedin_url}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-blue-600 hover:underline'
              >
                <Linkedin className='h-4 w-4' />
                {data.linkedin_username || 'LinkedIn Profile'}
              </a>
            )}
            {data.twitter_url && (
              <a
                href={`https://${data.twitter_url}`}
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

      {/* Current Position */}
      {(data.job_title || data.job_company) && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Current Position</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {data.job_title && (
              <div className='flex items-start gap-2'>
                <Briefcase className='h-4 w-4 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{data.job_title}</p>
                  {data.job_company && (
                    <p className='text-sm text-muted-foreground'>
                      {data.job_company}
                    </p>
                  )}
                </div>
              </div>
            )}
            {data.job_company_website && (
              <div className='flex items-center gap-2'>
                <Building2 className='h-4 w-4 text-muted-foreground' />
                <a
                  href={`https://${data.job_company_website}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 hover:underline'
                >
                  {data.job_company_website}
                </a>
              </div>
            )}
            {data.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>{data.location}</p>
              </div>
            )}
            {data.job_company_industry && (
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>{data.job_company_industry}</Badge>
                {data.job_company_size && (
                  <Badge variant='outline'>
                    {data.job_company_size} employees
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {data.skills.slice(0, 15).map((skill: string) => (
                <Badge key={skill} variant='secondary'>
                  {skill}
                </Badge>
              ))}
              {data.skills.length > 15 && (
                <Badge variant='outline'>+{data.skills.length - 15} more</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Work History</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {data.experience
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
            {data.experience.length > 3 && (
              <p className='text-sm text-muted-foreground'>
                +{data.experience.length - 3} more positions
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Education</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {data.education.map((edu: PDLEducation, i: number) => (
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

      {/* Metadata */}
      {lead.enrichment_timestamp && (
        <p className='text-xs text-muted-foreground'>
          Enriched on {new Date(lead.enrichment_timestamp).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

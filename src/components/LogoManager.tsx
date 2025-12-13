import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  getCompanyLogoUrlSync,
  setCompanyLogoManually,
  testLogoUrl,
  updateCompanyLogo,
} from '@/services/logoService';
import { getStatusDisplayText } from '@/utils/statusUtils';
import { Image as ImageIcon, RefreshCw, Upload } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Company {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
}

export const LogoManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [autoUpdateProgress, setAutoUpdateProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const { toast } = useToast();

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, website, logo_url')
        .order('name');

      if (error) throw error;
      setCompanies((data as Company[]) || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch companies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Auto-fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleAutoUpdate = async () => {
    if (companies.length === 0) {
      toast({
        title: 'No Companies',
        description: 'Please load companies first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setAutoUpdateProgress({ current: 0, total: companies.length });

    try {
      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        setAutoUpdateProgress({ current: i + 1, total: companies.length });

        try {
          // Skip if already has a Clearbit logo
          if (
            company.logo_url &&
            (company.logo_url.includes('logo.clearbit.com') ||
              company.logo_url.includes('img.logo.dev'))
          ) {
            skippedCount++;
            continue;
          }

          const logoUrl = getCompanyLogoUrlSync(company.name, company.website);
          if (logoUrl) {
            const isValid = await testLogoUrl(logoUrl);
            if (isValid) {
              await updateCompanyLogo(company.id, logoUrl);
              successCount++;
            } else {
              errorCount++;
            }
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(`Failed to update logo for ${company.name}:`, error);
        }

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await fetchCompanies(); // Refresh data

      toast({
        title: 'Logo Update Complete',
        description: `Updated ${successCount} logos successfully. ${errorCount} failed. ${skippedCount} already had Clearbit logos.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update logos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setAutoUpdateProgress(null);
    }
  };

  const handleReplaceLinkedInLogos = async () => {
    if (companies.length === 0) {
      toast({
        title: 'No Companies',
        description: 'Please load companies first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setAutoUpdateProgress({ current: 0, total: companies.length });

    try {
      let replacedCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        setAutoUpdateProgress({ current: i + 1, total: companies.length });

        try {
          // Only replace LinkedIn URLs
          if (
            company.logo_url &&
            company.logo_url.includes('media.licdn.com')
          ) {
            const logoUrl = getCompanyLogoUrlSync(
              company.name,
              company.website
            );
            if (logoUrl) {
              const isValid = await testLogoUrl(logoUrl);
              if (isValid) {
                await updateCompanyLogo(company.id, logoUrl);
                replacedCount++;
                console.log(
                  `Replaced LinkedIn logo for ${company.name} with Clearbit URL: ${logoUrl}`
                );
              } else {
                errorCount++;
              }
            } else {
              errorCount++;
            }
          } else {
            skippedCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(`Failed to replace logo for ${company.name}:`, error);
        }

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await fetchCompanies(); // Refresh data

      toast({
        title: 'LinkedIn Logo Replacement Complete',
        description: `Replaced ${replacedCount} LinkedIn logos with Clearbit URLs. ${errorCount} failed. ${skippedCount} skipped (not LinkedIn URLs).`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to replace LinkedIn logos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setAutoUpdateProgress(null);
    }
  };

  const handleManualUpdate = async () => {
    if (!selectedCompany || !manualUrl.trim()) return;

    setLoading(true);
    try {
      await setCompanyLogoManually(selectedCompany.id, manualUrl.trim());
      await fetchCompanies(); // Refresh data
      setManualUrl('');
      toast({
        title: 'Success',
        description: 'Logo updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update logo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogo = async (url: string) => {
    try {
      const isValid = await testLogoUrl(url);
      return isValid;
    } catch {
      return false;
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Upload className='h-5 w-5' />
            Company Logo Manager
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Button
              onClick={handleAutoUpdate}
              disabled={loading || companies.length === 0}
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Auto-Update All Logos
            </Button>
            <Button
              onClick={handleReplaceLinkedInLogos}
              disabled={loading || companies.length === 0}
              variant='outline'
            >
              <ImageIcon className='h-4 w-4 mr-2' />
              Replace LinkedIn Logos
            </Button>
            <Button
              onClick={fetchCompanies}
              disabled={loading}
              variant='outline'
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh Companies
            </Button>
          </div>

          {autoUpdateProgress && (
            <div className='bg-primary/10 border border-primary/20 rounded-lg p-3'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-blue-900'>
                  Updating Logos...
                </span>
                <span className='text-sm text-primary'>
                  {autoUpdateProgress.current} / {autoUpdateProgress.total}
                </span>
              </div>
              <div className='w-full bg-blue-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${(autoUpdateProgress.current / autoUpdateProgress.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className='text-sm text-muted-foreground'>
            <p>
              • <strong>Auto-Update:</strong> Fetches logos from Clearbit API
              using company websites (free, no credentials needed)
            </p>
            <p>
              • <strong>Replace LinkedIn Logos:</strong> Replaces problematic
              LinkedIn URLs with reliable Clearbit URLs
            </p>
            <p>
              • <strong>Manual Update:</strong> Set custom logo URLs for
              specific companies
            </p>
            <p>
              • <strong>Fallback:</strong> Companies without logos show initials
            </p>
            <p>
              • <strong>Companies Loaded:</strong> {companies.length} companies
              found
            </p>
          </div>
        </CardContent>
      </Card>

      {loading && companies.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-sm text-muted-foreground'>
              Loading companies...
            </p>
          </CardContent>
        </Card>
      ) : companies.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {companies.map(company => (
            <Card
              key={company.id}
              className='cursor-pointer hover:shadow-md transition-shadow'
            >
              <CardContent className='p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className='w-8 h-8 rounded-full object-cover'
                        onError={e => {
                          console.log(
                            `Failed to load logo for ${company.name}: ${company.logo_url}`
                          );
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                        onLoad={() => {
                          console.log(
                            `Successfully loaded logo for ${company.name}: ${company.logo_url}`
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className='w-8 h-8 rounded-full bg-primary/100 text-white flex items-center justify-center text-xs font-semibold'
                      style={{
                        display: company.logo_url ? 'none' : 'flex',
                      }}
                    >
                      {getStatusDisplayText(company.name.charAt(0))}
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-sm truncate'>
                      {company.name}
                    </h3>
                    {company.website && (
                      <p className='text-xs text-muted-foreground truncate'>
                        {company.website}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex gap-1'>
                    {company.logo_url ? (
                      <StatusBadge status='Has Logo' size='sm' />
                    ) : (
                      <StatusBadge status='No Logo' size='sm' />
                    )}
                  </div>

                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => setSelectedCompany(company)}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='p-8 text-center'>
            <Upload className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-medium text-foreground mb-2'>
              No companies found
            </h3>
            <p className='text-muted-foreground'>
              No companies were found in the database.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Manual URL Update Modal */}
      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Update Logo for {selectedCompany.name}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='logo-url'>Logo URL</Label>
              <Input
                id='logo-url'
                value={manualUrl}
                onChange={e => setManualUrl(e.target.value)}
                placeholder='https://example.com/logo.png'
                className='mt-1'
              />
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={handleManualUpdate}
                disabled={loading || !manualUrl.trim()}
              >
                Update Logo
              </Button>
              <Button
                variant='outline'
                onClick={() => setSelectedCompany(null)}
              >
                Cancel
              </Button>
            </div>

            {selectedCompany.website && (
              <div className='text-sm text-muted-foreground'>
                <p>
                  <strong>Suggested Clearbit URL:</strong>
                </p>
                <p className='font-mono text-xs bg-gray-100 p-2 rounded'>
                  {getCompanyLogoUrlSync(
                    selectedCompany.name,
                    selectedCompany.website
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

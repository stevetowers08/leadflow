import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getOrStoreCompanyLogo } from '@/services/logoService';

/**
 * Fetch Logos for All Companies
 * POST /api/fetch-all-logos
 *
 * Fetches logos for all companies that don't have logos yet
 * Optional query params:
 * - force: boolean - Force re-fetch even if logo exists
 * - limit: number - Limit number of companies to process
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    // Get all companies (with pagination to handle large datasets)
    let allCompanies: Array<{
      id: string;
      name: string;
      website: string | null;
      logo_url: string | null;
    }> = [];
    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      let query = supabase
        .from('companies')
        .select('id, name, website, logo_url')
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      // Only get companies without logos unless force is true
      if (!force) {
        query = query.or('logo_url.is.null,logo_url.eq.');
      }

      if (limit > 0 && allCompanies.length >= limit) {
        break;
      }

      const { data: companies, error: queryError } = await query;

      if (queryError) {
        console.error('Error fetching companies:', queryError);
        return NextResponse.json(
          { error: 'Failed to fetch companies', details: queryError.message },
          { status: 500 }
        );
      }

      if (companies && companies.length > 0) {
        allCompanies = allCompanies.concat(companies);
        offset += pageSize;
        hasMore = companies.length === pageSize;
      } else {
        hasMore = false;
      }

      // Apply limit if specified
      if (limit > 0 && allCompanies.length >= limit) {
        allCompanies = allCompanies.slice(0, limit);
        hasMore = false;
      }
    }

    const companies = allCompanies;

    if (!companies || companies.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No companies found to process',
        processed: 0,
        successCount: 0,
        failCount: 0,
        skipCount: 0,
      });
    }

    console.log(`Processing ${companies.length} companies...`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    const results: Array<{
      company: string;
      status: 'success' | 'failed' | 'skipped';
      logoUrl?: string;
      error?: string;
    }> = [];

    for (let i = 0; i < companies.length; i += batchSize) {
      const batch = companies.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async company => {
          try {
            // Skip if already has a logo URL and not forcing
            if (!force && company.logo_url && company.logo_url.trim()) {
              results.push({
                company: company.name,
                status: 'skipped',
              });
              skipCount++;
              return;
            }

            const logoUrl = await getOrStoreCompanyLogo({
              id: company.id,
              name: company.name,
              website: company.website,
              logo_url: company.logo_url,
            });

            if (logoUrl) {
              results.push({
                company: company.name,
                status: 'success',
                logoUrl: logoUrl.substring(0, 80) + '...',
              });
              successCount++;
            } else {
              results.push({
                company: company.name,
                status: 'failed',
                error: 'No logo found',
              });
              failCount++;
            }
          } catch (error) {
            results.push({
              company: company.name,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            failCount++;
          }
        })
      );

      // Small delay between batches to respect rate limits
      if (i + batchSize < companies.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${companies.length} companies`,
      processed: companies.length,
      successCount,
      failCount,
      skipCount,
      results: results.slice(0, 20), // Return first 20 results for preview
    });
  } catch (error) {
    console.error('Error in fetch-all-logos endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

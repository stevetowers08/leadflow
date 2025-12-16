import { showCompaniesQueries } from '@/utils/typeSafeSupabase';
import type { ShowCompany } from '@/types/missingTables';

/**
 * Link a company to a show
 */
export async function linkCompanyToShow(
  showId: string,
  companyId: string
): Promise<ShowCompany> {
  // Use type-safe helper
  return showCompaniesQueries.link(showId, companyId);
}

/**
 * Unlink a company from a show
 */
export async function unlinkCompanyFromShow(
  showId: string,
  companyId: string
): Promise<void> {
  // Use type-safe helper
  return showCompaniesQueries.unlink(showId, companyId);
}

/**
 * Get all companies for a show
 */
export async function getCompaniesForShow(showId: string): Promise<
  Array<{
    id: string;
    name: string;
    logo_url: string | null;
  }>
> {
  // Note: show_companies table doesn't exist in TypeScript types - using type assertion
  const { data, error } = await supabase
    .from('show_companies' as never)
    .select('company_id, companies(id, name, logo_url)')
    .eq('show_id', showId);

  if (error) {
    throw new Error(`Failed to get companies for show: ${error.message}`);
  }

  return (data || [])
    .map(
      (item: {
        company_id: string;
        companies: { id: string; name: string; logo_url: string | null } | null;
      }) => item.companies
    )
    .filter(
      (
        company
      ): company is { id: string; name: string; logo_url: string | null } =>
        company !== null
    );
}

/**
 * Get all shows for a company
 */
export async function getShowsForCompany(companyId: string): Promise<
  Array<{
    id: string;
    name: string;
    start_date: string | null;
    end_date: string | null;
  }>
> {
  // Note: show_companies table doesn't exist in TypeScript types - using type assertion
  const { data, error } = await supabase
    .from('show_companies' as never)
    .select('show_id, shows(id, name, start_date, end_date)')
    .eq('company_id', companyId);

  if (error) {
    throw new Error(`Failed to get shows for company: ${error.message}`);
  }

  return (data || [])
    .map(
      (item: {
        show_id: string;
        shows: {
          id: string;
          name: string;
          start_date: string | null;
          end_date: string | null;
        } | null;
      }) => item.shows
    )
    .filter(
      (
        show
      ): show is {
        id: string;
        name: string;
        start_date: string | null;
        end_date: string | null;
      } => show !== null
    );
}

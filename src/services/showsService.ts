import { supabase } from '@/integrations/supabase/client';
import type { Show } from '@/types/missingTables';
import { showsQueries } from '@/utils/typeSafeSupabase';

export interface CreateShowInput {
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  city?: string | null;
  venue?: string | null;
  timezone?: string;
}

export async function getShows(): Promise<Show[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use type-safe helper
  return showsQueries.getAll(user?.id);
}

export async function getShow(showId: string): Promise<Show | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use type-safe helper
  return showsQueries.getById(showId, user?.id);
}

export async function createShow(input: CreateShowInput): Promise<Show> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Note: shows table doesn't exist in TypeScript types - using type assertion
  const { data, error } = await supabase
    .from('shows' as never)
    .insert({
      ...input,
      owner_id: user?.id,
      status: 'upcoming',
      timezone: input.timezone || 'UTC',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create show: ${error.message}`);
  }

  return data as Show;
}

export async function getCurrentShow(): Promise<Show | null> {
  try {
    const shows = await getShows();
    if (shows.length === 0) return null;

    const now = new Date();

    // Find live show (current date between start and end)
    const live = shows.find(show => {
      if (!show.start_date || !show.end_date) return false;
      try {
        const start = new Date(show.start_date);
        const end = new Date(show.end_date);
        return now >= start && now <= end;
      } catch {
        return false;
      }
    });

    if (live) return live;

    // Find next upcoming show
    const upcoming = shows
      .filter(show => {
        if (!show.start_date) return false;
        try {
          return new Date(show.start_date) > now;
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        if (!a.start_date || !b.start_date) return 0;
        try {
          return (
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );
        } catch {
          return 0;
        }
      })[0];

    return upcoming || shows[0] || null;
  } catch (error) {
    console.error('Error getting current show:', error);
    return null;
  }
}

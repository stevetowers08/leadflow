import { supabase } from '@/integrations/supabase/client';

export interface TablePreferences {
  columnSizing?: Record<string, number>;
  columnOrder?: string[];
}

export interface UserPreferencesPayload {
  [tableId: string]: TablePreferences;
}

const USER_SETTINGS_TABLE = 'user_settings';

export async function getUserTablePreferences(
  tableId: string
): Promise<TablePreferences | null> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) return null;

    const { data, error } = await supabase
      .from(USER_SETTINGS_TABLE)
      .select('preferences')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    const prefs =
      (data?.preferences as UserPreferencesPayload | undefined) || {};
    return prefs[tableId] || null;
  } catch (err) {
    console.error('Failed to load user table preferences:', err);
    return null;
  }
}

export async function saveUserTablePreferences(
  tableId: string,
  preferences: TablePreferences
): Promise<void> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) return;

    // Fetch existing preferences to merge
    const { data: existing, error: selectError } = await supabase
      .from(USER_SETTINGS_TABLE)
      .select('id, preferences')
      .eq('user_id', user.id)
      .maybeSingle();

    if (selectError) throw selectError;

    const merged: UserPreferencesPayload = {
      ...(existing?.preferences as UserPreferencesPayload | undefined),
      [tableId]: {
        ...(existing?.preferences?.[tableId] || {}),
        ...preferences,
      },
    } as UserPreferencesPayload;

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from(USER_SETTINGS_TABLE)
        .update({ preferences: merged })
        .eq('id', existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from(USER_SETTINGS_TABLE)
        .insert({ user_id: user.id, preferences: merged });
      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('Failed to save user table preferences:', err);
  }
}

export function persistLocalTablePreferences(
  tableId: string,
  preferences: TablePreferences
) {
  try {
    const key = `table_prefs:${tableId}`;
    const existingRaw = localStorage.getItem(key);
    const existing = existingRaw
      ? (JSON.parse(existingRaw) as TablePreferences)
      : {};
    const merged: TablePreferences = { ...existing, ...preferences };
    localStorage.setItem(key, JSON.stringify(merged));
  } catch (e) {
    // ignore localStorage errors
  }
}

export function loadLocalTablePreferences(
  tableId: string
): TablePreferences | null {
  try {
    const key = `table_prefs:${tableId}`;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as TablePreferences) : null;
  } catch (e) {
    return null;
  }
}

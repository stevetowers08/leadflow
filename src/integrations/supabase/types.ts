export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          triggered_by: string | null
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          triggered_by?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          triggered_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      // ... other tables would be here, using Record for now to allow compilation
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
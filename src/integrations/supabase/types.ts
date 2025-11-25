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
      people: {
        Row: {
          ai_user_message: string | null
          company_id: string | null
          company_role: string | null
          created_at: string | null
          email_address: string | null
          email_ai_message: string | null
          email_draft: string | null
          email_sent: boolean | null
          employee_location: string | null
          id: string
          jobs: string | null
          last_activity: string | null
          last_interaction_at: string | null
          last_reply_at: string | null
          last_reply_channel: string | null
          last_reply_message: string | null
          lead_source: string | null
          linkedin_ai_message: string | null
          linkedin_url: string | null
          name: string
          owner_id: string | null
          people_stage: Database["public"]["Enums"]["people_stage_enum"] | null
          reply_type: Database["public"]["Enums"]["reply_type"] | null
          score: number | null
          stage_updated: string | null
          updated_at: string | null
        }
        Insert: {
          ai_user_message?: string | null
          company_id?: string | null
          company_role?: string | null
          created_at?: string | null
          email_address?: string | null
          email_ai_message?: string | null
          email_draft?: string | null
          email_sent?: boolean | null
          employee_location?: string | null
          id?: string
          jobs?: string | null
          last_activity?: string | null
          last_interaction_at?: string | null
          last_reply_at?: string | null
          last_reply_channel?: string | null
          last_reply_message?: string | null
          lead_source?: string | null
          linkedin_ai_message?: string | null
          linkedin_url?: string | null
          name: string
          owner_id?: string | null
          people_stage?: Database["public"]["Enums"]["people_stage_enum"] | null
          reply_type?: Database["public"]["Enums"]["reply_type"] | null
          score?: number | null
          stage_updated?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_user_message?: string | null
          company_id?: string | null
          company_role?: string | null
          created_at?: string | null
          email_address?: string | null
          email_ai_message?: string | null
          email_draft?: string | null
          email_sent?: boolean | null
          employee_location?: string | null
          id?: string
          jobs?: string | null
          last_activity?: string | null
          last_interaction_at?: string | null
          last_reply_at?: string | null
          last_reply_channel?: string | null
          last_reply_message?: string | null
          lead_source?: string | null
          linkedin_ai_message?: string | null
          linkedin_url?: string | null
          name?: string
          owner_id?: string | null
          people_stage?: Database["public"]["Enums"]["people_stage_enum"] | null
          reply_type?: Database["public"]["Enums"]["reply_type"] | null
          score?: number | null
          stage_updated?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          city: string | null
          company_id: string | null
          country: string | null
          created_at: string | null
          description: string | null
          employment_type: string | null
          filter_config_id: string | null
          filter_reason: string | null
          function: string | null
          id: string
          job_url: string | null
          linkedin_job_id: string | null
          location: string | null
          logo_url: string | null
          owner_id: string | null
          posted_date: string | null
          qualification_notes: string | null
          qualification_status: string | null
          qualified_at: string | null
          qualified_by: string | null
          region: string | null
          salary: string | null
          seniority_level: string | null
          source: string | null
          summary: string | null
          title: string
          updated_at: string | null
          valid_through: string | null
        }
        Insert: {
          city?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          filter_config_id?: string | null
          filter_reason?: string | null
          function?: string | null
          id?: string
          job_url?: string | null
          linkedin_job_id?: string | null
          location?: string | null
          logo_url?: string | null
          owner_id?: string | null
          posted_date?: string | null
          qualification_notes?: string | null
          qualification_status?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          region?: string | null
          salary?: string | null
          seniority_level?: string | null
          source?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          valid_through?: string | null
        }
        Update: {
          city?: string | null
          company_id?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          filter_config_id?: string | null
          filter_reason?: string | null
          function?: string | null
          id?: string
          job_url?: string | null
          linkedin_job_id?: string | null
          location?: string | null
          logo_url?: string | null
          owner_id?: string | null
          posted_date?: string | null
          qualification_notes?: string | null
          qualification_status?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          region?: string | null
          salary?: string | null
          seniority_level?: string | null
          source?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          valid_through?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_filter_config_id_fkey"
            columns: ["filter_config_id"]
            isOneToOne: false
            referencedRelation: "job_filter_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Enums: {
      people_stage_enum:
        | "new_lead"
        | "message_sent"
        | "replied"
        | "interested"
        | "meeting_scheduled"
        | "meeting_completed"
        | "follow_up"
        | "not_interested"
      reply_type: "interested" | "not_interested" | "maybe"
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never


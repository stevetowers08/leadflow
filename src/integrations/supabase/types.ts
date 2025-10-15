export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      campaign_participants: {
        Row: {
          campaign_id: string;
          completed_at: string | null;
          id: string;
          joined_at: string | null;
          person_id: string;
        };
        Insert: {
          campaign_id: string;
          completed_at?: string | null;
          id?: string;
          joined_at?: string | null;
          person_id: string;
        };
        Update: {
          campaign_id?: string;
          completed_at?: string | null;
          id?: string;
          joined_at?: string | null;
          person_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaign_participants_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'campaign_participants_person_id_fkey';
            columns: ['person_id'];
            isOneToOne: false;
            referencedRelation: 'people';
            referencedColumns: ['id'];
          },
        ];
      };
      campaigns: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          name: string;
          start_date: string | null;
          status: Database['public']['Enums']['campaign_status_enum'];
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          start_date?: string | null;
          status?: Database['public']['Enums']['campaign_status_enum'];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string | null;
          status?: Database['public']['Enums']['campaign_status_enum'];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          ai_info: Json | null;
          automation_active: boolean | null;
          automation_started_at: string | null;
          company_size: string | null;
          confidence_level:
            | Database['public']['Enums']['confidence_level_enum']
            | null;
          created_at: string | null;
          head_office: string | null;
          id: string;
          industry: string | null;
          industry_id: string | null;
          is_favourite: boolean | null;
          key_info_raw: Json | null;
          lead_score: string | null;
          linkedin_url: string | null;
          loxo_company_id: string | null;
          name: string;
          owner_id: string | null;
          pipeline_stage:
            | Database['public']['Enums']['company_pipeline_stage']
            | null;
          priority: string | null;
          score_reason: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          ai_info?: Json | null;
          automation_active?: boolean | null;
          automation_started_at?: string | null;
          company_size?: string | null;
          confidence_level?:
            | Database['public']['Enums']['confidence_level_enum']
            | null;
          created_at?: string | null;
          head_office?: string | null;
          id?: string;
          industry?: string | null;
          industry_id?: string | null;
          is_favourite?: boolean | null;
          key_info_raw?: Json | null;
          lead_score?: string | null;
          linkedin_url?: string | null;
          loxo_company_id?: string | null;
          name: string;
          owner_id?: string | null;
          pipeline_stage?:
            | Database['public']['Enums']['company_pipeline_stage']
            | null;
          priority?: string | null;
          score_reason?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          ai_info?: Json | null;
          automation_active?: boolean | null;
          automation_started_at?: string | null;
          company_size?: string | null;
          confidence_level?:
            | Database['public']['Enums']['confidence_level_enum']
            | null;
          head_office?: string | null;
          industry?: string | null;
          industry_id?: string | null;
          is_favourite?: boolean | null;
          key_info_raw?: Json | null;
          lead_score?: string | null;
          linkedin_url?: string | null;
          loxo_company_id?: string | null;
          name?: string;
          owner_id?: string;
          pipeline_stage?:
            | Database['public']['Enums']['company_pipeline_stage']
            | null;
          priority?: string | null;
          score_reason?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      email_messages: {
        Row: {
          attachments: Json | null;
          bcc_emails: string[] | null;
          body_html: string | null;
          body_text: string | null;
          cc_emails: string[] | null;
          created_at: string | null;
          from_email: string;
          gmail_message_id: string;
          id: string;
          is_read: boolean | null;
          is_sent: boolean | null;
          person_id: string | null;
          received_at: string | null;
          sent_at: string | null;
          subject: string | null;
          sync_status: string | null;
          thread_id: string | null;
          to_emails: string[];
          updated_at: string | null;
        };
        Insert: {
          attachments?: Json | null;
          bcc_emails?: string[] | null;
          body_html?: string | null;
          body_text?: string | null;
          cc_emails?: string[] | null;
          created_at?: string | null;
          from_email: string;
          gmail_message_id: string;
          id?: string;
          is_read?: boolean | null;
          is_sent?: boolean | null;
          person_id?: string | null;
          received_at?: string | null;
          sent_at?: string | null;
          subject?: string | null;
          sync_status?: string | null;
          thread_id?: string | null;
          to_emails: string[];
          updated_at?: string | null;
        };
        Update: {
          attachments?: Json | null;
          bcc_emails?: string[] | null;
          body_html?: string | null;
          body_text?: string | null;
          cc_emails?: string[] | null;
          created_at?: string | null;
          from_email?: string;
          gmail_message_id?: string;
          id?: string;
          is_read?: boolean | null;
          is_sent?: boolean | null;
          person_id?: string | null;
          received_at?: string | null;
          sent_at?: string | null;
          subject?: string | null;
          sync_status?: string | null;
          thread_id?: string | null;
          to_emails?: string[];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_messages_person_id_fkey';
            columns: ['person_id'];
            isOneToOne: false;
            referencedRelation: 'people';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'email_messages_thread_id_fkey';
            columns: ['thread_id'];
            isOneToOne: false;
            referencedRelation: 'email_threads';
            referencedColumns: ['id'];
          },
        ];
      };
      email_sync_logs: {
        Row: {
          created_at: string | null;
          error_message: string | null;
          id: string;
          message_count: number | null;
          metadata: Json | null;
          operation_type: string;
          status: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          message_count?: number | null;
          metadata?: Json | null;
          operation_type: string;
          status: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          message_count?: number | null;
          metadata?: Json | null;
          operation_type?: string;
          status?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      email_templates: {
        Row: {
          body_html: string;
          body_text: string | null;
          category: string | null;
          created_at: string | null;
          created_by: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          subject: string;
          updated_at: string | null;
        };
        Insert: {
          body_html: string;
          body_text?: string | null;
          category?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          subject: string;
          updated_at?: string | null;
        };
        Update: {
          body_html?: string;
          body_text?: string | null;
          category?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          subject?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      email_threads: {
        Row: {
          created_at: string | null;
          gmail_thread_id: string;
          id: string;
          is_read: boolean | null;
          last_message_at: string | null;
          participants: Json;
          person_id: string | null;
          subject: string | null;
          sync_status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          gmail_thread_id: string;
          id?: string;
          is_read?: boolean | null;
          last_message_at?: string | null;
          participants?: Json;
          person_id?: string | null;
          subject?: string | null;
          sync_status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          gmail_thread_id?: string;
          id?: string;
          is_read?: boolean | null;
          last_message_at?: string | null;
          participants?: Json;
          person_id?: string | null;
          subject?: string | null;
          sync_status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_threads_person_id_fkey';
            columns: ['person_id'];
            isOneToOne: false;
            referencedRelation: 'people';
            referencedColumns: ['id'];
          },
        ];
      };
      interactions: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          interaction_type: Database['public']['Enums']['interaction_type_enum'];
          metadata: Json | null;
          occurred_at: string;
          person_id: string;
          subject: string | null;
          template_id: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          interaction_type: Database['public']['Enums']['interaction_type_enum'];
          metadata?: Json | null;
          occurred_at?: string;
          person_id: string;
          subject?: string | null;
          template_id?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          interaction_type?: Database['public']['Enums']['interaction_type_enum'];
          metadata?: Json | null;
          occurred_at?: string;
          person_id?: string;
          subject?: string | null;
          template_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'interactions_person_id_fkey';
            columns: ['person_id'];
            isOneToOne: false;
            referencedRelation: 'people';
            referencedColumns: ['id'];
          },
        ];
      };
      jobs: {
        Row: {
          automation_active: boolean | null;
          automation_started_at: string | null;
          company_id: string | null;
          created_at: string | null;
          description: string | null;
          employment_type: string | null;
          function: string | null;
          id: string;
          job_url: string | null;
          lead_score_job: number | null;
          linkedin_job_id: string | null;
          location: string | null;
          logo_url: string | null;
          posted_date: string | null;
          priority: string | null;
          salary: string | null;
          seniority_level: string | null;
          summary: string | null;
          title: string;
          updated_at: string | null;
          valid_through: string | null;
        };
        Insert: {
          automation_active?: boolean | null;
          automation_started_at?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          employment_type?: string | null;
          function?: string | null;
          id?: string;
          job_url?: string | null;
          lead_score_job?: number | null;
          linkedin_job_id?: string | null;
          location?: string | null;
          logo_url?: string | null;
          posted_date?: string | null;
          priority?: string | null;
          salary?: string | null;
          seniority_level?: string | null;
          summary?: string | null;
          title: string;
          updated_at?: string | null;
          valid_through?: string | null;
        };
        Update: {
          automation_active?: boolean | null;
          automation_started_at?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          employment_type?: string | null;
          function?: string | null;
          id?: string;
          job_url?: string | null;
          lead_score_job?: number | null;
          linkedin_job_id?: string | null;
          location?: string | null;
          logo_url?: string | null;
          posted_date?: string | null;
          priority?: string | null;
          salary?: string | null;
          seniority_level?: string | null;
          summary?: string | null;
          title?: string;
          updated_at?: string | null;
          valid_through?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'jobs_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
        ];
      };
      linkedin_user_settings: {
        Row: {
          auto_sync_enabled: boolean | null;
          created_at: string | null;
          id: string;
          last_sync_at: string | null;
          sync_frequency_minutes: number | null;
          updated_at: string | null;
          user_id: string | null;
          webhook_enabled: boolean | null;
        };
        Insert: {
          auto_sync_enabled?: boolean | null;
          created_at?: string | null;
          id?: string;
          last_sync_at?: string | null;
          sync_frequency_minutes?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          webhook_enabled?: boolean | null;
        };
        Update: {
          auto_sync_enabled?: boolean | null;
          created_at?: string | null;
          id?: string;
          last_sync_at?: string | null;
          sync_frequency_minutes?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          webhook_enabled?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'linkedin_user_settings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      linkedin_user_tokens: {
        Row: {
          access_token: string;
          created_at: string | null;
          expires_at: string;
          id: string;
          is_active: boolean | null;
          linkedin_profile_id: string | null;
          refresh_token: string | null;
          scope: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          access_token: string;
          created_at?: string | null;
          expires_at: string;
          id?: string;
          is_active?: boolean | null;
          linkedin_profile_id?: string | null;
          refresh_token?: string | null;
          scope?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          access_token?: string;
          created_at?: string | null;
          expires_at?: string;
          id?: string;
          is_active?: boolean | null;
          linkedin_profile_id?: string | null;
          refresh_token?: string | null;
          scope?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'linkedin_user_tokens_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      linkedin_user_webhook_events: {
        Row: {
          created_at: string | null;
          event_type: string;
          id: string;
          linkedin_id: string;
          payload: Json;
          processed: boolean | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_type: string;
          id?: string;
          linkedin_id: string;
          payload: Json;
          processed?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_type?: string;
          id?: string;
          linkedin_id?: string;
          payload?: Json;
          processed?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'linkedin_user_webhook_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      people: {
        Row: {
          automation_started_at: string | null;
          campaign_finished: string | null;
          company_id: string | null;
          company_role: string | null;
          confidence_level: string | null;
          connected_at: string | null;
          connection_accepted_date: string | null;
          connection_request_date: string | null;
          connection_request_sent: string | null;
          created_at: string | null;
          email_address: string | null;
          email_draft: string | null;
          email_reply: string | null;
          email_reply_date: string | null;
          email_sent: string | null;
          email_sent_date: string | null;
          employee_location: string | null;
          favourite: boolean | null;
          id: string;
          is_favourite: string | null;
          jobs: string | null;
          last_interaction_at: string | null;
          last_reply_at: string | null;
          last_reply_channel: string | null;
          last_reply_message: string | null;
          lead_score: string | null;
          linkedin_connected: string | null;
          linkedin_connected_message: string | null;
          linkedin_follow_up_message: string | null;
          linkedin_profile_id: string | null;
          linkedin_request_message: string | null;
          linkedin_responded: string | null;
          linkedin_url: string | null;
          meeting_booked: string | null;
          meeting_date: string | null;
          message_sent: string | null;
          message_sent_date: string | null;
          name: string;
          owner_id: string | null | null;
          response_date: string | null;
          reply_type: Database['public']['Enums']['reply_type'] | null;
          stage: Database['public']['Enums']['stage_enum'];
          stage_updated: string | null;
          updated_at: string | null;
        };
        Insert: {
          automation_started_at?: string | null;
          campaign_finished?: string | null;
          company_id?: string | null;
          company_role?: string | null;
          confidence_level?: string | null;
          connected_at?: string | null;
          connection_accepted_date?: string | null;
          connection_request_date?: string | null;
          connection_request_sent?: string | null;
          created_at?: string | null;
          email_address?: string | null;
          email_draft?: string | null;
          email_reply?: string | null;
          email_reply_date?: string | null;
          email_sent?: string | null;
          email_sent_date?: string | null;
          employee_location?: string | null;
          favourite?: boolean | null;
          id?: string;
          is_favourite?: string | null;
          jobs?: string | null;
          last_interaction_at?: string | null;
          last_reply_at?: string | null;
          last_reply_channel?: string | null;
          last_reply_message?: string | null;
          lead_score?: string | null;
          linkedin_connected?: string | null;
          linkedin_connected_message?: string | null;
          linkedin_follow_up_message?: string | null;
          linkedin_profile_id?: string | null;
          linkedin_request_message?: string | null;
          linkedin_responded?: string | null;
          linkedin_url?: string | null;
          meeting_booked?: string | null;
          meeting_date?: string | null;
          message_sent?: string | null;
          message_sent_date?: string | null;
          name: string;
          owner_id?: string | null;
          response_date?: string | null;
          reply_type?: Database['public']['Enums']['reply_type'] | null;
          stage?: Database['public']['Enums']['stage_enum'];
          stage_updated?: string | null;
          updated_at?: string | null;
        };
        Update: {
          automation_started_at?: string | null;
          campaign_finished?: string | null;
          company_id?: string | null;
          company_role?: string | null;
          confidence_level?: string | null;
          connected_at?: string | null;
          connection_accepted_date?: string | null;
          connection_request_date?: string | null;
          connection_request_sent?: string | null;
          created_at?: string | null;
          email_address?: string | null;
          email_draft?: string | null;
          email_reply?: string | null;
          email_reply_date?: string | null;
          email_sent?: string | null;
          email_sent_date?: string | null;
          employee_location?: string | null;
          favourite?: boolean | null;
          id?: string;
          is_favourite?: string | null;
          jobs?: string | null;
          last_interaction_at?: string | null;
          last_reply_at?: string | null;
          last_reply_channel?: string | null;
          last_reply_message?: string | null;
          lead_score?: string | null;
          linkedin_connected?: string | null;
          linkedin_connected_message?: string | null;
          linkedin_follow_up_message?: string | null;
          linkedin_profile_id?: string | null;
          linkedin_request_message?: string | null;
          linkedin_responded?: string | null;
          linkedin_url?: string | null;
          meeting_booked?: string | null;
          meeting_date?: string | null;
          message_sent?: string | null;
          message_sent_date?: string | null;
          name?: string;
          owner_id?: string | null;
          response_date?: string | null;
          reply_type?: Database['public']['Enums']['reply_type'] | null;
          stage?: Database['public']['Enums']['stage_enum'];
          stage_updated?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'people_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
        ];
      };
      system_settings: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          key: string;
          updated_at: string | null;
          value: Json;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key: string;
          updated_at?: string | null;
          value: Json;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string;
          updated_at?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean | null;
          role: string | null;
          updated_at: string | null;
          user_limit: number | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean | null;
          role?: string | null;
          updated_at?: string | null;
          user_limit?: number | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          role?: string | null;
          updated_at?: string | null;
          user_limit?: number | null;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          created_at: string | null;
          id: string;
          notifications: Json | null;
          preferences: Json | null;
          security: Json | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notifications?: Json | null;
          preferences?: Json | null;
          security?: Json | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notifications?: Json | null;
          preferences?: Json | null;
          security?: Json | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      backfill_people_timestamps: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_dashboard_counts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          companies: number;
          expiring_jobs: number;
          jobs: number;
          leads: number;
          new_jobs_today: number;
        }[];
      };
      get_dropdown_options: {
        Args: { dropdown_type: string };
        Returns: {
          label: string;
          value: string;
        }[];
      };
      get_enum_values: {
        Args: { enum_type: string };
        Returns: string[];
      };
      gtrgm_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { '': unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      set_limit: {
        Args: { '': number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { '': string };
        Returns: string[];
      };
    };
    Enums: {
      campaign_status_enum: 'draft' | 'active' | 'paused';
      company_pipeline_stage:
        | 'new_lead'
        | 'automated'
        | 'replied'
        | 'meeting_scheduled'
        | 'proposal_sent'
        | 'negotiation'
        | 'closed_won'
        | 'closed_lost'
        | 'on_hold';
      confidence_level_enum: 'low' | 'medium' | 'high';
      interaction_type_enum:
        | 'linkedin_connection_request_sent'
        | 'linkedin_connected'
        | 'linkedin_message_sent'
        | 'linkedin_message_reply'
        | 'email_sent'
        | 'email_reply'
        | 'meeting_booked'
        | 'meeting_held'
        | 'disqualified'
        | 'note';
      reply_type: 'interested' | 'not_interested' | 'maybe';
      stage_enum:
        | 'new'
        | 'connection_requested'
        | 'connected'
        | 'messaged'
        | 'replied'
        | 'meeting_booked'
        | 'meeting_held'
        | 'disqualified'
        | 'in queue'
        | 'lead_lost';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      campaign_status_enum: ['draft', 'active', 'paused'],
      confidence_level_enum: ['low', 'medium', 'high'],
      interaction_type_enum: [
        'linkedin_connection_request_sent',
        'linkedin_connected',
        'linkedin_message_sent',
        'linkedin_message_reply',
        'email_sent',
        'email_reply',
        'meeting_booked',
        'meeting_held',
        'disqualified',
        'note',
      ],
      stage_enum: [
        'new',
        'connection_requested',
        'connected',
        'messaged',
        'replied',
        'meeting_booked',
        'meeting_held',
        'disqualified',
        'in queue',
        'lead_lost',
      ],
    },
  },
} as const;

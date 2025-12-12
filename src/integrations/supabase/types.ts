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
      activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          timestamp: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          timestamp?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequence_executions: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string | null
          email_body: string | null
          email_send_id: string | null
          email_subject: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          lead_id: string
          opened_at: string | null
          replied_at: string | null
          retry_count: number | null
          scheduled_at: string | null
          sequence_id: string
          sequence_lead_id: string
          status: string | null
          step_id: string
          updated_at: string | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string | null
          email_body?: string | null
          email_send_id?: string | null
          email_subject?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          lead_id: string
          opened_at?: string | null
          replied_at?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          sequence_id: string
          sequence_lead_id: string
          status?: string | null
          step_id: string
          updated_at?: string | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string | null
          email_body?: string | null
          email_send_id?: string | null
          email_subject?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          lead_id?: string
          opened_at?: string | null
          replied_at?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          sequence_id?: string
          sequence_lead_id?: string
          status?: string | null
          step_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sequence_executions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_executions_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_executions_sequence_lead_id_fkey"
            columns: ["sequence_lead_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequence_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_executions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequence_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequence_leads: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_step_id: string | null
          exited_at: string | null
          id: string
          last_activity_at: string | null
          lead_id: string
          sequence_id: string
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_step_id?: string | null
          exited_at?: string | null
          id?: string
          last_activity_at?: string | null
          lead_id: string
          sequence_id: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_step_id?: string | null
          exited_at?: string | null
          id?: string
          last_activity_at?: string | null
          lead_id?: string
          sequence_id?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sequence_leads_current_step_id_fkey"
            columns: ["current_step_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequence_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_leads_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequence_steps: {
        Row: {
          business_hours_only: boolean | null
          condition_type: string | null
          condition_wait_duration: number | null
          created_at: string | null
          email_body: string | null
          email_subject: string | null
          email_template_id: string | null
          false_next_step_id: string | null
          id: string
          name: string | null
          order_position: number
          send_immediately: string | null
          send_time: string | null
          sequence_id: string
          step_type: string
          timezone: string | null
          true_next_step_id: string | null
          updated_at: string | null
          wait_duration: number | null
          wait_unit: string | null
        }
        Insert: {
          business_hours_only?: boolean | null
          condition_type?: string | null
          condition_wait_duration?: number | null
          created_at?: string | null
          email_body?: string | null
          email_subject?: string | null
          email_template_id?: string | null
          false_next_step_id?: string | null
          id?: string
          name?: string | null
          order_position: number
          send_immediately?: string | null
          send_time?: string | null
          sequence_id: string
          step_type: string
          timezone?: string | null
          true_next_step_id?: string | null
          updated_at?: string | null
          wait_duration?: number | null
          wait_unit?: string | null
        }
        Update: {
          business_hours_only?: boolean | null
          condition_type?: string | null
          condition_wait_duration?: number | null
          created_at?: string | null
          email_body?: string | null
          email_subject?: string | null
          email_template_id?: string | null
          false_next_step_id?: string | null
          id?: string
          name?: string | null
          order_position?: number
          send_immediately?: string | null
          send_time?: string | null
          sequence_id?: string
          step_type?: string
          timezone?: string | null
          true_next_step_id?: string | null
          updated_at?: string | null
          wait_duration?: number | null
          wait_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sequence_steps_false_next_step_id_fkey"
            columns: ["false_next_step_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequence_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_steps_true_next_step_id_fkey"
            columns: ["true_next_step_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequence_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequences: {
        Row: {
          active_leads: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          total_leads: number | null
          updated_at: string | null
        }
        Insert: {
          active_leads?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          total_leads?: number | null
          updated_at?: string | null
        }
        Update: {
          active_leads?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          total_leads?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          ai_company_intelligence: Json | null
          ai_funding: Json | null
          ai_marketi_info: Json | null
          ai_new_location: Json | null
          company_size: string | null
          confidence_level: string | null
          created_at: string | null
          estimated_arr: number | null
          funding_raised: number | null
          head_office: string | null
          id: string
          industry: string | null
          is_favourite: boolean | null
          key_info_raw: Json | null
          last_activity: string | null
          lead_score: string | null
          lead_source: string | null
          linkedin_url: string | null
          logo_cached_at: string | null
          logo_url: string | null
          loxo_company_id: string | null
          name: string
          owner_id: string | null
          pipeline_stage: string | null
          priority: string | null
          score_reason: string | null
          source_date: string | null
          source_details: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          ai_company_intelligence?: Json | null
          ai_funding?: Json | null
          ai_marketi_info?: Json | null
          ai_new_location?: Json | null
          company_size?: string | null
          confidence_level?: string | null
          created_at?: string | null
          estimated_arr?: number | null
          funding_raised?: number | null
          head_office?: string | null
          id?: string
          industry?: string | null
          is_favourite?: boolean | null
          key_info_raw?: Json | null
          last_activity?: string | null
          lead_score?: string | null
          lead_source?: string | null
          linkedin_url?: string | null
          logo_cached_at?: string | null
          logo_url?: string | null
          loxo_company_id?: string | null
          name: string
          owner_id?: string | null
          pipeline_stage?: string | null
          priority?: string | null
          score_reason?: string | null
          source_date?: string | null
          source_details?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          ai_company_intelligence?: Json | null
          ai_funding?: Json | null
          ai_marketi_info?: Json | null
          ai_new_location?: Json | null
          company_size?: string | null
          confidence_level?: string | null
          created_at?: string | null
          estimated_arr?: number | null
          funding_raised?: number | null
          head_office?: string | null
          id?: string
          industry?: string | null
          is_favourite?: boolean | null
          key_info_raw?: Json | null
          last_activity?: string | null
          lead_score?: string | null
          lead_source?: string | null
          linkedin_url?: string | null
          logo_cached_at?: string | null
          logo_url?: string | null
          loxo_company_id?: string | null
          name?: string
          owner_id?: string | null
          pipeline_stage?: string | null
          priority?: string | null
          score_reason?: string | null
          source_date?: string | null
          source_details?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
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
          lead_score_job: number | null
          linkedin_job_id: string | null
          location: string | null
          logo_url: string | null
          owner_id: string | null
          posted_date: string | null
          priority: string | null
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
          lead_score_job?: number | null
          linkedin_job_id?: string | null
          location?: string | null
          logo_url?: string | null
          owner_id?: string | null
          posted_date?: string | null
          priority?: string | null
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
          lead_score_job?: number | null
          linkedin_job_id?: string | null
          location?: string | null
          logo_url?: string | null
          owner_id?: string | null
          posted_date?: string | null
          priority?: string | null
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
        ]
      }
      leadflow_leads: {
        Row: {
          ai_icebreaker: string | null
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          gmail_thread_id: string | null
          id: string
          image_url: string | null
          job_title: string | null
          last_name: string | null
          lemlist_lead_id: string | null
          notes: string | null
          quality_score: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_icebreaker?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          gmail_thread_id?: string | null
          id?: string
          image_url?: string | null
          job_title?: string | null
          last_name?: string | null
          lemlist_lead_id?: string | null
          notes?: string | null
          quality_score?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_icebreaker?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          gmail_thread_id?: string | null
          id?: string
          image_url?: string | null
          job_title?: string | null
          last_name?: string | null
          lemlist_lead_id?: string | null
          notes?: string | null
          quality_score?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_icebreaker: string | null
          ai_summary: string | null
          company: string | null
          created_at: string | null
          email: string | null
          enrichment_data: Json | null
          enrichment_timestamp: string | null
          first_name: string | null
          gmail_thread_id: string | null
          id: string
          job_title: string | null
          last_name: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          quality_rank: string | null
          scan_image_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          workflow_id: string | null
          workflow_status: string | null
        }
        Insert: {
          ai_icebreaker?: string | null
          ai_summary?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_data?: Json | null
          enrichment_timestamp?: string | null
          first_name?: string | null
          gmail_thread_id?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          quality_rank?: string | null
          scan_image_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          workflow_id?: string | null
          workflow_status?: string | null
        }
        Update: {
          ai_icebreaker?: string | null
          ai_summary?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_data?: Json | null
          enrichment_timestamp?: string | null
          first_name?: string | null
          gmail_thread_id?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          quality_rank?: string | null
          scan_image_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          workflow_id?: string | null
          workflow_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          ai_user_message: string | null
          company_id: string | null
          company_role: string | null
          confidence_level: string | null
          created_at: string | null
          decision_maker_notes: string | null
          email_address: string | null
          email_ai_message: string | null
          email_draft: string | null
          email_sent: boolean | null
          employee_location: string | null
          id: string
          is_favourite: boolean | null
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
          people_stage: string | null
          reply_type: string | null
          score: number | null
          source_date: string | null
          source_details: string | null
          stage_updated: string | null
          updated_at: string | null
        }
        Insert: {
          ai_user_message?: string | null
          company_id?: string | null
          company_role?: string | null
          confidence_level?: string | null
          created_at?: string | null
          decision_maker_notes?: string | null
          email_address?: string | null
          email_ai_message?: string | null
          email_draft?: string | null
          email_sent?: boolean | null
          employee_location?: string | null
          id?: string
          is_favourite?: boolean | null
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
          people_stage?: string | null
          reply_type?: string | null
          score?: number | null
          source_date?: string | null
          source_details?: string | null
          stage_updated?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_user_message?: string | null
          company_id?: string | null
          company_role?: string | null
          confidence_level?: string | null
          created_at?: string | null
          decision_maker_notes?: string | null
          email_address?: string | null
          email_ai_message?: string | null
          email_draft?: string | null
          email_sent?: boolean | null
          employee_location?: string | null
          id?: string
          is_favourite?: boolean | null
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
          people_stage?: string | null
          reply_type?: string | null
          score?: number | null
          source_date?: string | null
          source_details?: string | null
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
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          default_client_id: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          role: string | null
          updated_at: string | null
          user_limit: number | null
        }
        Insert: {
          created_at?: string | null
          default_client_id?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          metadata?: Json | null
          role?: string | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Update: {
          created_at?: string | null
          default_client_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          role?: string | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          notifications: Json | null
          preferences: Json | null
          security: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notifications?: Json | null
          preferences?: Json | null
          security?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notifications?: Json | null
          preferences?: Json | null
          security?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workflows: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          email_provider: string | null
          gmail_sequence: Json | null
          id: string
          lemlist_campaign_id: string | null
          name: string
          pause_rules: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email_provider?: string | null
          gmail_sequence?: Json | null
          id?: string
          lemlist_campaign_id?: string | null
          name: string
          pause_rules?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email_provider?: string | null
          gmail_sequence?: Json | null
          id?: string
          lemlist_campaign_id?: string | null
          name?: string
          pause_rules?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          id: string
          user_id: string
          email_address: string
          provider: string
          access_token: string
          refresh_token: string
          token_expires_at: string | null
          scope: string
          is_active: boolean
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_address: string
          provider: string
          access_token: string
          refresh_token: string
          token_expires_at?: string | null
          scope: string
          is_active?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_address?: string
          provider?: string
          access_token?: string
          refresh_token?: string
          token_expires_at?: string | null
          scope?: string
          is_active?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_sends: {
        Row: {
          id: string
          campaign_id: string | null
          person_id: string | null
          template_id: string | null
          email_account_id: string | null
          gmail_message_id: string | null
          gmail_thread_id: string | null
          to_email: string
          subject: string
          body_html: string | null
          body_text: string | null
          status: string
          sent_at: string | null
          delivered_at: string | null
          opened_at: string | null
          clicked_at: string | null
          bounced_at: string | null
          replied_at: string | null
          error_message: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          person_id?: string | null
          template_id?: string | null
          email_account_id?: string | null
          gmail_message_id?: string | null
          gmail_thread_id?: string | null
          to_email: string
          subject: string
          body_html?: string | null
          body_text?: string | null
          status?: string
          sent_at?: string | null
          delivered_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounced_at?: string | null
          replied_at?: string | null
          error_message?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string | null
          person_id?: string | null
          template_id?: string | null
          email_account_id?: string | null
          gmail_message_id?: string | null
          gmail_thread_id?: string | null
          to_email?: string
          subject?: string
          body_html?: string | null
          body_text?: string | null
          status?: string
          sent_at?: string | null
          delivered_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounced_at?: string | null
          replied_at?: string | null
          error_message?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      setup_admin_user: {
        Args: { user_email: string; user_role?: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

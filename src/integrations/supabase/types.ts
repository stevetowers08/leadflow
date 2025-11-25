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
      assignment_logs: {
        Row: {
          assigned_at: string | null
          assigned_by: string
          entity_id: string
          entity_type: string
          id: string
          new_owner_id: string | null
          notes: string | null
          old_owner_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by: string
          entity_id: string
          entity_type: string
          id?: string
          new_owner_id?: string | null
          notes?: string | null
          old_owner_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_owner_id?: string | null
          notes?: string | null
          old_owner_id?: string | null
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          automation_preferences: Json | null
          budget_range: string | null
          company_name: string
          company_size: string | null
          created_at: string | null
          created_by: string
          decision_makers: string[] | null
          id: string
          ideal_customer_profile: string | null
          industry: string | null
          lead_scoring_rules: Json | null
          pain_points: string[] | null
          qualification_criteria: Json | null
          sales_process_stages: string[] | null
          target_company_size: string[] | null
          target_industries: string[] | null
          target_job_titles: string[] | null
          target_locations: string[] | null
          target_seniority_levels: string[] | null
          updated_at: string | null
        }
        Insert: {
          automation_preferences?: Json | null
          budget_range?: string | null
          company_name: string
          company_size?: string | null
          created_at?: string | null
          created_by: string
          decision_makers?: string[] | null
          id?: string
          ideal_customer_profile?: string | null
          industry?: string | null
          lead_scoring_rules?: Json | null
          pain_points?: string[] | null
          qualification_criteria?: Json | null
          sales_process_stages?: string[] | null
          target_company_size?: string[] | null
          target_industries?: string[] | null
          target_job_titles?: string[] | null
          target_locations?: string[] | null
          target_seniority_levels?: string[] | null
          updated_at?: string | null
        }
        Update: {
          automation_preferences?: Json | null
          budget_range?: string | null
          company_name?: string
          company_size?: string | null
          created_at?: string | null
          created_by?: string
          decision_makers?: string[] | null
          id?: string
          ideal_customer_profile?: string | null
          industry?: string | null
          lead_scoring_rules?: Json | null
          pain_points?: string[] | null
          qualification_criteria?: Json | null
          sales_process_stages?: string[] | null
          target_company_size?: string[] | null
          target_industries?: string[] | null
          target_job_titles?: string[] | null
          target_locations?: string[] | null
          target_seniority_levels?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      campaign_analytics: {
        Row: {
          bounce_rate: number | null
          campaign_id: string
          created_at: string | null
          id: string
          last_updated: string | null
          open_rate: number | null
          reply_rate: number | null
          total_bounced: number | null
          total_opened: number | null
          total_replied: number | null
          total_sent: number | null
          updated_at: string | null
        }
        Insert: {
          bounce_rate?: number | null
          campaign_id: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          open_rate?: number | null
          reply_rate?: number | null
          total_bounced?: number | null
          total_opened?: number | null
          total_replied?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          bounce_rate?: number | null
          campaign_id?: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          open_rate?: number | null
          reply_rate?: number | null
          total_bounced?: number | null
          total_opened?: number | null
          total_replied?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_email_logs: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          lead_id: string | null
          message_id: string | null
          person_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string
          step_name: string
          subject: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          message_id?: string | null
          person_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status: string
          step_name: string
          subject: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          message_id?: string | null
          person_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          step_name?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "simplified_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_email_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "simplified_campaign_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_email_logs_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_messages: {
        Row: {
          body: string
          campaign_id: string
          channel: string
          created_at: string | null
          delay_days: number | null
          id: string
          step_number: number
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          campaign_id: string
          channel: string
          created_at?: string | null
          delay_days?: number | null
          id?: string
          step_number: number
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          campaign_id?: string
          channel?: string
          created_at?: string | null
          delay_days?: number | null
          id?: string
          step_number?: number
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_participants: {
        Row: {
          assigned_at: string | null
          campaign_id: string
          id: string
          person_id: string
          smartlead_lead_id: string | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          campaign_id: string
          id?: string
          person_id: string
          smartlead_lead_id?: string | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          campaign_id?: string
          id?: string
          person_id?: string
          smartlead_lead_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participants_new_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_participants_new_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequence_executions: {
        Row: {
          email_id: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          sequence_lead_id: string
          status: string
          step_id: string
        }
        Insert: {
          email_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          sequence_lead_id: string
          status: string
          step_id: string
        }
        Update: {
          email_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          sequence_lead_id?: string
          status?: string
          step_id?: string
        }
        Relationships: [
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
          current_step_id: string | null
          exited_at: string | null
          id: string
          last_activity_at: string | null
          lead_id: string
          sequence_id: string
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          current_step_id?: string | null
          exited_at?: string | null
          id?: string
          last_activity_at?: string | null
          lead_id: string
          sequence_id: string
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          current_step_id?: string | null
          exited_at?: string | null
          id?: string
          last_activity_at?: string | null
          lead_id?: string
          sequence_id?: string
          started_at?: string | null
          status?: string
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
            foreignKeyName: "campaign_sequence_leads_person_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "people"
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
          name: string
          order_position: number
          send_immediately: string | null
          send_time: string | null
          sequence_id: string
          step_type: string
          timezone: string | null
          true_next_step_id: string | null
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
          name: string
          order_position: number
          send_immediately?: string | null
          send_time?: string | null
          sequence_id: string
          step_type: string
          timezone?: string | null
          true_next_step_id?: string | null
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
          name?: string
          order_position?: number
          send_immediately?: string | null
          send_time?: string | null
          sequence_id?: string
          step_type?: string
          timezone?: string | null
          true_next_step_id?: string | null
          wait_duration?: number | null
          wait_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "campaign_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sequence_steps_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_sequences: {
        Row: {
          active_leads: number | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: string
          total_leads: number | null
          updated_at: string | null
        }
        Insert: {
          active_leads?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string
          total_leads?: number | null
          updated_at?: string | null
        }
        Update: {
          active_leads?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string
          total_leads?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sequences_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          call_script: string | null
          campaign_type: string
          client_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          email_subject: string | null
          email_template: string | null
          end_date: string | null
          follow_up_message: string | null
          id: string
          is_active: boolean | null
          linkedin_message: string | null
          messaging_template: string | null
          name: string
          smartlead_id: string | null
          start_date: string | null
          status: string
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          call_script?: string | null
          campaign_type: string
          client_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          email_subject?: string | null
          email_template?: string | null
          end_date?: string | null
          follow_up_message?: string | null
          id?: string
          is_active?: boolean | null
          linkedin_message?: string | null
          messaging_template?: string | null
          name: string
          smartlead_id?: string | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          call_script?: string | null
          campaign_type?: string
          client_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          email_subject?: string | null
          email_template?: string | null
          end_date?: string | null
          follow_up_message?: string | null
          id?: string
          is_active?: boolean | null
          linkedin_message?: string | null
          messaging_template?: string | null
          name?: string
          smartlead_id?: string | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_companies: {
        Row: {
          assigned_to: string | null
          client_id: string
          company_id: string
          created_at: string | null
          id: string
          priority: string | null
          qualification_status: string
          qualified_at: string | null
          qualified_by: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          company_id: string
          created_at?: string | null
          id?: string
          priority?: string | null
          qualification_status?: string
          qualified_at?: string | null
          qualified_by?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          company_id?: string
          created_at?: string | null
          id?: string
          priority?: string | null
          qualification_status?: string
          qualified_at?: string | null
          qualified_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_companies_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_companies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_decision_maker_outreach: {
        Row: {
          client_id: string
          contact_method: string | null
          created_at: string | null
          decision_maker_id: string
          first_contact_at: string | null
          id: string
          job_id: string
          last_contact_at: string | null
          notes: string | null
          outreach_status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          contact_method?: string | null
          created_at?: string | null
          decision_maker_id: string
          first_contact_at?: string | null
          id?: string
          job_id: string
          last_contact_at?: string | null
          notes?: string | null
          outreach_status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          contact_method?: string | null
          created_at?: string | null
          decision_maker_id?: string
          first_contact_at?: string | null
          id?: string
          job_id?: string
          last_contact_at?: string | null
          notes?: string | null
          outreach_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_decision_maker_outreach_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_decision_maker_outreach_decision_maker_id_fkey"
            columns: ["decision_maker_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_decision_maker_outreach_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      client_jobs: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          job_id: string
          notes: string | null
          priority_level: string | null
          qualified_at: string | null
          qualified_by: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          job_id: string
          notes?: string | null
          priority_level?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          priority_level?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      client_users: {
        Row: {
          client_id: string
          id: string
          is_primary_contact: boolean | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          client_id: string
          id?: string
          is_primary_contact?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          client_id?: string
          id?: string
          is_primary_contact?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          accounts: Json | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          accounts?: Json | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          accounts?: Json | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          added_by_client_id: string | null
          added_manually: boolean | null
          ai_info: Json | null
          airtable_id: string | null
          automation_active: boolean | null
          automation_started_at: string | null
          company_size: string | null
          confidence_level:
            | Database["public"]["Enums"]["confidence_level_enum"]
            | null
          created_at: string | null
          domain: string | null
          estimated_arr: number | null
          funding_raised: number | null
          head_office: string | null
          id: string
          industry: string | null
          industry_id: string | null
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
          normalized_company_size: string | null
          owner_id: string | null
          pipeline_stage:
            | Database["public"]["Enums"]["company_pipeline_stage_enum"]
            | null
          priority: string | null
          score_reason: string | null
          source: string | null
          source_date: string | null
          source_details: string | null
          source_job_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          added_by_client_id?: string | null
          added_manually?: boolean | null
          ai_info?: Json | null
          airtable_id?: string | null
          automation_active?: boolean | null
          automation_started_at?: string | null
          company_size?: string | null
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level_enum"]
            | null
          created_at?: string | null
          domain?: string | null
          estimated_arr?: number | null
          funding_raised?: number | null
          head_office?: string | null
          id?: string
          industry?: string | null
          industry_id?: string | null
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
          normalized_company_size?: string | null
          owner_id?: string | null
          pipeline_stage?:
            | Database["public"]["Enums"]["company_pipeline_stage_enum"]
            | null
          priority?: string | null
          score_reason?: string | null
          source?: string | null
          source_date?: string | null
          source_details?: string | null
          source_job_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          added_by_client_id?: string | null
          added_manually?: boolean | null
          ai_info?: Json | null
          airtable_id?: string | null
          automation_active?: boolean | null
          automation_started_at?: string | null
          company_size?: string | null
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level_enum"]
            | null
          created_at?: string | null
          domain?: string | null
          estimated_arr?: number | null
          funding_raised?: number | null
          head_office?: string | null
          id?: string
          industry?: string | null
          industry_id?: string | null
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
          normalized_company_size?: string | null
          owner_id?: string | null
          pipeline_stage?:
            | Database["public"]["Enums"]["company_pipeline_stage_enum"]
            | null
          priority?: string | null
          score_reason?: string | null
          source?: string | null
          source_date?: string | null
          source_details?: string | null
          source_job_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_added_by_client_id_fkey"
            columns: ["added_by_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_source_job_id_fkey"
            columns: ["source_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      email_accounts: {
        Row: {
          access_token: string
          created_at: string | null
          email_address: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          refresh_token: string
          scope: string
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          email_address: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          refresh_token: string
          scope?: string
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          email_address?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string
          scope?: string
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_messages: {
        Row: {
          attachments: Json | null
          bcc_emails: string[] | null
          body_html: string | null
          body_text: string | null
          cc_emails: string[] | null
          created_at: string | null
          from_email: string
          gmail_message_id: string
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          person_id: string | null
          received_at: string | null
          sent_at: string | null
          subject: string | null
          sync_status: string | null
          thread_id: string | null
          to_emails: string[]
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          bcc_emails?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          from_email: string
          gmail_message_id: string
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          person_id?: string | null
          received_at?: string | null
          sent_at?: string | null
          subject?: string | null
          sync_status?: string | null
          thread_id?: string | null
          to_emails: string[]
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          bcc_emails?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          from_email?: string
          gmail_message_id?: string
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          person_id?: string | null
          received_at?: string | null
          sent_at?: string | null
          subject?: string | null
          sync_status?: string | null
          thread_id?: string | null
          to_emails?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "email_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_replies: {
        Row: {
          analyzed_at: string | null
          company_id: string | null
          created_at: string
          detected_at: string
          from_email: string
          gmail_message_id: string
          gmail_thread_id: string
          id: string
          interaction_id: string | null
          new_stage: string | null
          person_id: string | null
          previous_stage: string | null
          processed_at: string | null
          processing_error: string | null
          received_at: string
          reply_body_html: string | null
          reply_body_plain: string | null
          reply_subject: string | null
          sentiment: string | null
          sentiment_confidence: number | null
          sentiment_reasoning: string | null
          triggered_stage_change: boolean | null
          updated_at: string
        }
        Insert: {
          analyzed_at?: string | null
          company_id?: string | null
          created_at?: string
          detected_at?: string
          from_email: string
          gmail_message_id: string
          gmail_thread_id: string
          id?: string
          interaction_id?: string | null
          new_stage?: string | null
          person_id?: string | null
          previous_stage?: string | null
          processed_at?: string | null
          processing_error?: string | null
          received_at: string
          reply_body_html?: string | null
          reply_body_plain?: string | null
          reply_subject?: string | null
          sentiment?: string | null
          sentiment_confidence?: number | null
          sentiment_reasoning?: string | null
          triggered_stage_change?: boolean | null
          updated_at?: string
        }
        Update: {
          analyzed_at?: string | null
          company_id?: string | null
          created_at?: string
          detected_at?: string
          from_email?: string
          gmail_message_id?: string
          gmail_thread_id?: string
          id?: string
          interaction_id?: string | null
          new_stage?: string | null
          person_id?: string | null
          previous_stage?: string | null
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          reply_body_html?: string | null
          reply_body_plain?: string | null
          reply_subject?: string | null
          sentiment?: string | null
          sentiment_confidence?: number | null
          sentiment_reasoning?: string | null
          triggered_stage_change?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_replies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_replies_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_replies_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sends: {
        Row: {
          body_html: string | null
          body_text: string | null
          created_at: string | null
          delivered_at: string | null
          email_account_id: string
          error_message: string | null
          failed_at: string | null
          gmail_message_id: string
          gmail_thread_id: string | null
          id: string
          metadata: Json | null
          person_id: string
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
          to_email: string
          updated_at: string | null
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email_account_id: string
          error_message?: string | null
          failed_at?: string | null
          gmail_message_id: string
          gmail_thread_id?: string | null
          id?: string
          metadata?: Json | null
          person_id: string
          sent_at?: string | null
          status?: string
          subject: string
          template_id?: string | null
          to_email: string
          updated_at?: string | null
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email_account_id?: string
          error_message?: string | null
          failed_at?: string | null
          gmail_message_id?: string
          gmail_thread_id?: string | null
          id?: string
          metadata?: Json | null
          person_id?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          to_email?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_email_account_id_fkey"
            columns: ["email_account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          placeholders: Json | null
          preview_data: Json | null
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          placeholders?: Json | null
          preview_data?: Json | null
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          placeholders?: Json | null
          preview_data?: Json | null
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      email_threads: {
        Row: {
          created_at: string | null
          gmail_thread_id: string
          id: string
          is_read: boolean | null
          last_message_at: string | null
          owner_id: string | null
          participants: Json
          person_id: string | null
          subject: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gmail_thread_id: string
          id?: string
          is_read?: boolean | null
          last_message_at?: string | null
          owner_id?: string | null
          participants?: Json
          person_id?: string | null
          subject?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gmail_thread_id?: string
          id?: string
          is_read?: boolean | null
          last_message_at?: string | null
          owner_id?: string | null
          participants?: Json
          person_id?: string | null
          subject?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_threads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_threads_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_tags: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          component_name: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          session_id: string | null
          severity: string | null
          stack: string | null
          timestamp: string | null
          type: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component_name?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          session_id?: string | null
          severity?: string | null
          stack?: string | null
          timestamp?: string | null
          type?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component_name?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          session_id?: string | null
          severity?: string | null
          stack?: string | null
          timestamp?: string | null
          type?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      error_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          notification_email: string | null
          notification_severity: string | null
          slack_webhook_url: string | null
          updated_at: string | null
          user_id: string | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_email?: string | null
          notification_severity?: string | null
          slack_webhook_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_email?: string | null
          notification_severity?: string | null
          slack_webhook_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      hubspot_company_mappings: {
        Row: {
          company_id: string | null
          connection_id: string
          created_at: string | null
          domain: string | null
          hubspot_company_id: string
          id: string
          last_synced_at: string | null
        }
        Insert: {
          company_id?: string | null
          connection_id: string
          created_at?: string | null
          domain?: string | null
          hubspot_company_id: string
          id?: string
          last_synced_at?: string | null
        }
        Update: {
          company_id?: string | null
          connection_id?: string
          created_at?: string | null
          domain?: string | null
          hubspot_company_id?: string
          id?: string
          last_synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_company_mappings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hubspot_company_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "hubspot_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      hubspot_connections: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          hub_id: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          portal_id: string | null
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          hub_id?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          portal_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          hub_id?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          portal_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hubspot_contact_mappings: {
        Row: {
          connection_id: string
          created_at: string | null
          email: string | null
          hubspot_contact_id: string
          id: string
          last_synced_at: string | null
          person_id: string | null
        }
        Insert: {
          connection_id: string
          created_at?: string | null
          email?: string | null
          hubspot_contact_id: string
          id?: string
          last_synced_at?: string | null
          person_id?: string | null
        }
        Update: {
          connection_id?: string
          created_at?: string | null
          email?: string | null
          hubspot_contact_id?: string
          id?: string
          last_synced_at?: string | null
          person_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_contact_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "hubspot_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hubspot_contact_mappings_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      hubspot_sync_logs: {
        Row: {
          connection_id: string
          created_at: string | null
          direction: string
          error_message: string | null
          id: string
          records_failed: number | null
          records_processed: number | null
          records_succeeded: number | null
          status: string
          sync_type: string
          synced_at: string | null
        }
        Insert: {
          connection_id: string
          created_at?: string | null
          direction: string
          error_message?: string | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          records_succeeded?: number | null
          status: string
          sync_type: string
          synced_at?: string | null
        }
        Update: {
          connection_id?: string
          created_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          records_succeeded?: number | null
          status?: string
          sync_type?: string
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hubspot_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "hubspot_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_settings: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          config: Json | null
          connected: boolean | null
          created_at: string | null
          id: string
          platform: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          platform: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          platform?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type_enum"]
          metadata: Json | null
          occurred_at: string
          owner_id: string | null
          person_id: string
          subject: string | null
          template_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type_enum"]
          metadata?: Json | null
          occurred_at?: string
          owner_id?: string | null
          person_id: string
          subject?: string | null
          template_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type_enum"]
          metadata?: Json | null
          occurred_at?: string
          owner_id?: string | null
          person_id?: string
          subject?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_at: string | null
          invited_by: string
          role: string
          status: string
          token: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by: string
          role: string
          status?: string
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string
          role?: string
          status?: string
          token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_filter_configs: {
        Row: {
          client_id: string
          company_size_preferences: string[] | null
          config_name: string
          created_at: string
          excluded_companies: string[] | null
          excluded_industries: string[] | null
          excluded_job_titles: string[] | null
          excluded_keywords: string[] | null
          id: string
          included_companies: string[] | null
          included_industries: string[] | null
          is_active: boolean | null
          job_functions: string[] | null
          max_days_old: number | null
          platform: string
          primary_location: string | null
          remote_options: string[] | null
          required_keywords: string[] | null
          search_radius: number | null
          seniority_levels: string[] | null
          target_job_titles: string[] | null
          updated_at: string
          user_id: string
          work_arrangements: string[] | null
        }
        Insert: {
          client_id: string
          company_size_preferences?: string[] | null
          config_name: string
          created_at?: string
          excluded_companies?: string[] | null
          excluded_industries?: string[] | null
          excluded_job_titles?: string[] | null
          excluded_keywords?: string[] | null
          id?: string
          included_companies?: string[] | null
          included_industries?: string[] | null
          is_active?: boolean | null
          job_functions?: string[] | null
          max_days_old?: number | null
          platform: string
          primary_location?: string | null
          remote_options?: string[] | null
          required_keywords?: string[] | null
          search_radius?: number | null
          seniority_levels?: string[] | null
          target_job_titles?: string[] | null
          updated_at?: string
          user_id: string
          work_arrangements?: string[] | null
        }
        Update: {
          client_id?: string
          company_size_preferences?: string[] | null
          config_name?: string
          created_at?: string
          excluded_companies?: string[] | null
          excluded_industries?: string[] | null
          excluded_job_titles?: string[] | null
          excluded_keywords?: string[] | null
          id?: string
          included_companies?: string[] | null
          included_industries?: string[] | null
          is_active?: boolean | null
          job_functions?: string[] | null
          max_days_old?: number | null
          platform?: string
          primary_location?: string | null
          remote_options?: string[] | null
          required_keywords?: string[] | null
          search_radius?: number | null
          seniority_levels?: string[] | null
          target_job_titles?: string[] | null
          updated_at?: string
          user_id?: string
          work_arrangements?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "job_filter_configs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      lead_sources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mailchimp_connections: {
        Row: {
          access_token: string
          created_at: string | null
          data_center: string
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          primary_list_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          data_center: string
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          primary_list_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          data_center?: string
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          primary_list_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mailchimp_subscriber_mappings: {
        Row: {
          connection_id: string
          created_at: string | null
          email: string
          id: string
          last_synced_at: string | null
          list_id: string | null
          person_id: string | null
          status: string | null
          subscriber_hash: string
          subscriber_id: string | null
        }
        Insert: {
          connection_id: string
          created_at?: string | null
          email: string
          id?: string
          last_synced_at?: string | null
          list_id?: string | null
          person_id?: string | null
          status?: string | null
          subscriber_hash: string
          subscriber_id?: string | null
        }
        Update: {
          connection_id?: string
          created_at?: string | null
          email?: string
          id?: string
          last_synced_at?: string | null
          list_id?: string | null
          person_id?: string | null
          status?: string | null
          subscriber_hash?: string
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailchimp_subscriber_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mailchimp_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailchimp_subscriber_mappings_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      mailchimp_sync_logs: {
        Row: {
          campaign_id: string | null
          connection_id: string
          created_at: string | null
          direction: string
          error_message: string | null
          id: string
          list_id: string | null
          records_failed: number | null
          records_processed: number | null
          records_succeeded: number | null
          status: string
          sync_type: string
          synced_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          connection_id: string
          created_at?: string | null
          direction: string
          error_message?: string | null
          id?: string
          list_id?: string | null
          records_failed?: number | null
          records_processed?: number | null
          records_succeeded?: number | null
          status: string
          sync_type: string
          synced_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          connection_id?: string
          created_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          list_id?: string | null
          records_failed?: number | null
          records_processed?: number | null
          records_succeeded?: number | null
          status?: string
          sync_type?: string
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailchimp_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "mailchimp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_transcripts: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          end_ms: number | null
          id: string
          meeting_id: string
          metadata: Json | null
          speaker: string | null
          start_ms: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          end_ms?: number | null
          id?: string
          meeting_id: string
          metadata?: Json | null
          speaker?: string | null
          start_ms?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          end_ms?: number | null
          id?: string
          meeting_id?: string
          metadata?: Json | null
          speaker?: string | null
          start_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_transcripts_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          created_by: string | null
          daily_room_name: string | null
          ended_at: string | null
          id: string
          participants: string[] | null
          recording_url: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          daily_room_name?: string | null
          ended_at?: string | null
          id?: string
          participants?: string[] | null
          recording_url?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          daily_room_name?: string | null
          ended_at?: string | null
          id?: string
          participants?: string[] | null
          recording_url?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          meeting_id: string | null
          message_type: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          meeting_id?: string | null
          message_type?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          meeting_id?: string | null
          message_type?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string
          client_id: string | null
          content: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          related_lead_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          client_id?: string | null
          content: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          related_lead_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          client_id?: string | null
          content?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          related_lead_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_author_id_user_profiles_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_related_lead_id_fkey"
            columns: ["related_lead_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
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
      simplified_campaign_leads: {
        Row: {
          campaign_id: string
          created_at: string | null
          current_step_index: number | null
          id: string
          last_sent_at: string | null
          next_send_at: string | null
          person_id: string
          status: string | null
          total_sent: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          current_step_index?: number | null
          id?: string
          last_sent_at?: string | null
          next_send_at?: string | null
          person_id: string
          status?: string | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          current_step_index?: number | null
          id?: string
          last_sent_at?: string | null
          next_send_at?: string | null
          person_id?: string
          status?: string | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simplified_campaign_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "simplified_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simplified_campaign_leads_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      simplified_campaigns: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          steps: Json
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          steps?: Json
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          steps?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simplified_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      smartlead_webhook_events: {
        Row: {
          campaign_id: string
          event_type: string
          id: string
          lead_id: string | null
          payload: Json
          processed: boolean | null
          processed_at: string | null
          received_at: string | null
          smartlead_event_id: string
        }
        Insert: {
          campaign_id: string
          event_type: string
          id?: string
          lead_id?: string | null
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          smartlead_event_id: string
        }
        Update: {
          campaign_id?: string
          event_type?: string
          id?: string
          lead_id?: string | null
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
          smartlead_event_id?: string
        }
        Relationships: []
      }
      smartlead_webhooks: {
        Row: {
          campaign_id: string | null
          client_id: string | null
          created_at: string | null
          events: string[]
          id: string
          is_active: boolean | null
          level: string
          smartlead_webhook_id: string
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          client_id?: string | null
          created_at?: string | null
          events: string[]
          id?: string
          is_active?: boolean | null
          level: string
          smartlead_webhook_id: string
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          client_id?: string | null
          created_at?: string | null
          events?: string[]
          id?: string
          is_active?: boolean | null
          level?: string
          smartlead_webhook_id?: string
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smartlead_webhooks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          action_entity_id: string | null
          action_entity_type: string | null
          action_type: string | null
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          priority: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_entity_id?: string | null
          action_entity_type?: string | null
          action_type?: string | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_entity_id?: string | null
          action_entity_type?: string | null
          action_type?: string | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string | null
          updated_at: string | null
          user_limit: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
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
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string | null
          event_id: string | null
          event_type: string
          id: string
          payload: Json | null
          response_status: number | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type?: string | null
          event_id?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          response_status?: number | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string | null
          event_id?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          response_status?: number | null
        }
        Relationships: []
      }
      wrappers_fdw_stats: {
        Row: {
          bytes_in: number | null
          bytes_out: number | null
          create_times: number | null
          created_at: string
          fdw_name: string
          metadata: Json | null
          rows_in: number | null
          rows_out: number | null
          updated_at: string
        }
        Insert: {
          bytes_in?: number | null
          bytes_out?: number | null
          create_times?: number | null
          created_at?: string
          fdw_name: string
          metadata?: Json | null
          rows_in?: number | null
          rows_out?: number | null
          updated_at?: string
        }
        Update: {
          bytes_in?: number | null
          bytes_out?: number | null
          create_times?: number | null
          created_at?: string
          fdw_name?: string
          metadata?: Json | null
          rows_in?: number | null
          rows_out?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_decision_maker_outreach_view: {
        Row: {
          client_id: string | null
          company_name: string | null
          company_role: string | null
          company_website: string | null
          contact_method: string | null
          created_at: string | null
          decision_maker_id: string | null
          decision_maker_name: string | null
          email_address: string | null
          employee_location: string | null
          first_contact_at: string | null
          id: string | null
          job_id: string | null
          job_title: string | null
          last_contact_at: string | null
          linkedin_url: string | null
          notes: string | null
          outreach_status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_decision_maker_outreach_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_decision_maker_outreach_decision_maker_id_fkey"
            columns: ["decision_maker_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_decision_maker_outreach_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_invitation: {
        Args: { invitation_token: string; user_id: string }
        Returns: Json
      }
      airtable_fdw_handler: { Args: never; Returns: unknown }
      airtable_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      airtable_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      analyze_query_performance: { Args: { query_text: string }; Returns: Json }
      auth0_fdw_handler: { Args: never; Returns: unknown }
      auth0_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      auth0_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      backfill_people_timestamps: { Args: never; Returns: number }
      big_query_fdw_handler: { Args: never; Returns: unknown }
      big_query_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      big_query_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      bulk_assign_entities: {
        Args: {
          assigned_by: string
          entity_ids: string[]
          entity_type: string
          new_owner_id: string
        }
        Returns: Json
      }
      bytea_to_text: { Args: { data: string }; Returns: string }
      check_company_exists: {
        Args: { p_domain: string; p_linkedin_url?: string }
        Returns: {
          company_exists: boolean
          company_id: string
        }[]
      }
      cleanup_expired_invitations: { Args: never; Returns: undefined }
      click_house_fdw_handler: { Args: never; Returns: unknown }
      click_house_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      click_house_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      cognito_fdw_handler: { Args: never; Returns: unknown }
      cognito_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      cognito_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      debug_user_profile_access: {
        Args: { user_id: string }
        Returns: {
          can_access: boolean
          policies_count: number
          profile_exists: boolean
          rls_enabled: boolean
          user_exists: boolean
        }[]
      }
      debug_user_session: {
        Args: { user_email: string }
        Returns: {
          email: string
          has_profile: boolean
          last_sign_in: string
          metadata_role: string
          profile_role: string
          user_id: string
        }[]
      }
      duckdb_fdw_handler: { Args: never; Returns: unknown }
      duckdb_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      duckdb_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      firebase_fdw_handler: { Args: never; Returns: unknown }
      firebase_fdw_meta: {
        Args: never
        Returns: {
          author: string
          name: string
          version: string
          website: string
        }[]
      }
      firebase_fdw_validator: {
        Args: { catalog: unknown; options: string[] }
        Returns: undefined
      }
      get_cache_stats: { Args: never; Returns: Json }
      get_client_id: { Args: never; Returns: string }
      get_company_lead_stage_counts: {
        Args: { input_company_id: string }
        Returns: Json
      }
      get_dashboard_counts: {
        Args: never
        Returns: {
          companies: number
          expiring_jobs: number
          jobs: number
          leads: number
          new_jobs_today: number
        }[]
      }
      get_dashboard_data: {
        Args: { end_date: string; start_date: string }
        Returns: {
          automated_jobs: number
          new_companies_today: number
          new_jobs_today: number
          new_leads_today: number
          pending_follow_ups: number
          todays_companies: Json
          todays_jobs: Json
        }[]
      }
      get_database_stats: { Args: never; Returns: Json }
      get_dropdown_options: {
        Args: { dropdown_type: string }
        Returns: {
          label: string
          value: string
        }[]
      }
      get_enum_values: { Args: { enum_type: string }; Returns: string[] }
      get_index_recommendations: { Args: never; Returns: Json }
      get_job_filter_configs_bypass: {
        Args: { client_id_param: string }
        Returns: {
          client_id: string
          company_size_preferences: string[]
          config_name: string
          created_at: string
          excluded_companies: string[]
          excluded_industries: string[]
          excluded_job_titles: string[]
          excluded_keywords: string[]
          experience_levels: string[]
          id: string
          included_companies: string[]
          included_industries: string[]
          is_active: boolean
          job_functions: string[]
          max_days_old: number



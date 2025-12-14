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
      activity_log: {
        Row: {
          activity_type: string;
          created_at: string | null;
          id: string;
          lead_id: string | null;
          metadata: Json | null;
          timestamp: string | null;
        };
        Insert: {
          activity_type: string;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          metadata?: Json | null;
          timestamp?: string | null;
        };
        Update: {
          activity_type?: string;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          metadata?: Json | null;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'activity_log_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      companies: {
        Row: {
          ai_company_intelligence: Json | null;
          ai_funding: Json | null;
          ai_marketi_info: Json | null;
          ai_new_location: Json | null;
          company_size: string | null;
          confidence_level: string | null;
          created_at: string | null;
          estimated_arr: number | null;
          funding_raised: number | null;
          head_office: string | null;
          id: string;
          industry: string | null;
          is_favourite: boolean | null;
          key_info_raw: Json | null;
          last_activity: string | null;
          lead_score: string | null;
          lead_source: string | null;
          linkedin_url: string | null;
          logo_cached_at: string | null;
          logo_url: string | null;
          loxo_company_id: string | null;
          name: string;
          pipeline_stage: string | null;
          priority: string | null;
          score_reason: string | null;
          source_date: string | null;
          source_details: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          ai_company_intelligence?: Json | null;
          ai_funding?: Json | null;
          ai_marketi_info?: Json | null;
          ai_new_location?: Json | null;
          company_size?: string | null;
          confidence_level?: string | null;
          created_at?: string | null;
          estimated_arr?: number | null;
          funding_raised?: number | null;
          head_office?: string | null;
          id?: string;
          industry?: string | null;
          is_favourite?: boolean | null;
          key_info_raw?: Json | null;
          last_activity?: string | null;
          lead_score?: string | null;
          lead_source?: string | null;
          linkedin_url?: string | null;
          logo_cached_at?: string | null;
          logo_url?: string | null;
          loxo_company_id?: string | null;
          name: string;
          pipeline_stage?: string | null;
          priority?: string | null;
          score_reason?: string | null;
          source_date?: string | null;
          source_details?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          ai_company_intelligence?: Json | null;
          ai_funding?: Json | null;
          ai_marketi_info?: Json | null;
          ai_new_location?: Json | null;
          company_size?: string | null;
          confidence_level?: string | null;
          created_at?: string | null;
          estimated_arr?: number | null;
          funding_raised?: number | null;
          head_office?: string | null;
          id?: string;
          industry?: string | null;
          is_favourite?: boolean | null;
          key_info_raw?: Json | null;
          last_activity?: string | null;
          lead_score?: string | null;
          lead_source?: string | null;
          linkedin_url?: string | null;
          logo_cached_at?: string | null;
          logo_url?: string | null;
          loxo_company_id?: string | null;
          name?: string;
          pipeline_stage?: string | null;
          priority?: string | null;
          score_reason?: string | null;
          source_date?: string | null;
          source_details?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      email_replies: {
        Row: {
          analyzed_at: string | null;
          company_id: string | null;
          contact_id: string | null;
          created_at: string;
          detected_at: string;
          from_email: string;
          gmail_message_id: string;
          gmail_thread_id: string;
          id: string;
          lead_id: string | null;
          new_stage: string | null;
          person_id: string | null;
          previous_stage: string | null;
          processed_at: string | null;
          processing_error: string | null;
          received_at: string;
          reply_body_html: string | null;
          reply_body_plain: string | null;
          reply_subject: string | null;
          sentiment: string | null;
          sentiment_confidence: number | null;
          sentiment_reasoning: string | null;
          triggered_stage_change: boolean | null;
          updated_at: string;
        };
        Insert: {
          analyzed_at?: string | null;
          company_id?: string | null;
          contact_id?: string | null;
          created_at?: string;
          detected_at?: string;
          from_email: string;
          gmail_message_id: string;
          gmail_thread_id: string;
          id?: string;
          lead_id?: string | null;
          new_stage?: string | null;
          person_id?: string | null;
          previous_stage?: string | null;
          processed_at?: string | null;
          processing_error?: string | null;
          received_at: string;
          reply_body_html?: string | null;
          reply_body_plain?: string | null;
          reply_subject?: string | null;
          sentiment?: string | null;
          sentiment_confidence?: number | null;
          sentiment_reasoning?: string | null;
          triggered_stage_change?: boolean | null;
          updated_at?: string;
        };
        Update: {
          analyzed_at?: string | null;
          company_id?: string | null;
          contact_id?: string | null;
          created_at?: string;
          detected_at?: string;
          from_email?: string;
          gmail_message_id?: string;
          gmail_thread_id?: string;
          id?: string;
          lead_id?: string | null;
          new_stage?: string | null;
          person_id?: string | null;
          previous_stage?: string | null;
          processed_at?: string | null;
          processing_error?: string | null;
          received_at?: string;
          reply_body_html?: string | null;
          reply_body_plain?: string | null;
          reply_subject?: string | null;
          sentiment?: string | null;
          sentiment_confidence?: number | null;
          sentiment_reasoning?: string | null;
          triggered_stage_change?: boolean | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'email_replies_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'email_replies_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      email_sends: {
        Row: {
          body_html: string | null;
          body_text: string | null;
          bounced_at: string | null;
          clicked_at: string | null;
          created_at: string | null;
          delivered_at: string | null;
          email_account_id: string | null;
          external_id: string | null;
          gmail_message_id: string | null;
          gmail_thread_id: string | null;
          id: string;
          lead_id: string | null;
          metadata: Json | null;
          opened_at: string | null;
          person_id: string | null;
          replied_at: string | null;
          sent_at: string | null;
          status: string | null;
          subject: string | null;
          template_id: string | null;
          to_email: string;
          updated_at: string | null;
        };
        Insert: {
          body_html?: string | null;
          body_text?: string | null;
          bounced_at?: string | null;
          clicked_at?: string | null;
          created_at?: string | null;
          delivered_at?: string | null;
          email_account_id?: string | null;
          external_id?: string | null;
          gmail_message_id?: string | null;
          gmail_thread_id?: string | null;
          id?: string;
          lead_id?: string | null;
          metadata?: Json | null;
          opened_at?: string | null;
          person_id?: string | null;
          replied_at?: string | null;
          sent_at?: string | null;
          status?: string | null;
          subject?: string | null;
          template_id?: string | null;
          to_email: string;
          updated_at?: string | null;
        };
        Update: {
          body_html?: string | null;
          body_text?: string | null;
          bounced_at?: string | null;
          clicked_at?: string | null;
          created_at?: string | null;
          delivered_at?: string | null;
          email_account_id?: string | null;
          external_id?: string | null;
          gmail_message_id?: string | null;
          gmail_thread_id?: string | null;
          id?: string;
          lead_id?: string | null;
          metadata?: Json | null;
          opened_at?: string | null;
          person_id?: string | null;
          replied_at?: string | null;
          sent_at?: string | null;
          status?: string | null;
          subject?: string | null;
          template_id?: string | null;
          to_email?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'email_sends_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          ai_icebreaker: string | null;
          ai_summary: string | null;
          company: string | null;
          created_at: string | null;
          email: string | null;
          enrichment_data: Json | null;
          enrichment_timestamp: string | null;
          first_name: string | null;
          gmail_thread_id: string | null;
          id: string;
          job_title: string | null;
          last_name: string | null;
          notes: string | null;
          phone: string | null;
          quality_rank: string | null;
          scan_image_url: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
          workflow_id: string | null;
          workflow_status: string | null;
        };
        Insert: {
          ai_icebreaker?: string | null;
          ai_summary?: string | null;
          company?: string | null;
          created_at?: string | null;
          email?: string | null;
          enrichment_data?: Json | null;
          enrichment_timestamp?: string | null;
          first_name?: string | null;
          gmail_thread_id?: string | null;
          id?: string;
          job_title?: string | null;
          last_name?: string | null;
          notes?: string | null;
          phone?: string | null;
          quality_rank?: string | null;
          scan_image_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          workflow_id?: string | null;
          workflow_status?: string | null;
        };
        Update: {
          ai_icebreaker?: string | null;
          ai_summary?: string | null;
          company?: string | null;
          created_at?: string | null;
          email?: string | null;
          enrichment_data?: Json | null;
          enrichment_timestamp?: string | null;
          first_name?: string | null;
          gmail_thread_id?: string | null;
          id?: string;
          job_title?: string | null;
          last_name?: string | null;
          notes?: string | null;
          phone?: string | null;
          quality_rank?: string | null;
          scan_image_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          workflow_id?: string | null;
          workflow_status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_workflow_id_fkey';
            columns: ['workflow_id'];
            isOneToOne: false;
            referencedRelation: 'workflows';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profiles: {
        Row: {
          created_at: string | null;
          default_client_id: string | null;
          email: string;
          full_name: string | null;
          id: string;
          is_active: boolean | null;
          metadata: Json | null;
          role: string | null;
          updated_at: string | null;
          user_limit: number | null;
        };
        Insert: {
          created_at?: string | null;
          default_client_id?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          is_active?: boolean | null;
          metadata?: Json | null;
          role?: string | null;
          updated_at?: string | null;
          user_limit?: number | null;
        };
        Update: {
          created_at?: string | null;
          default_client_id?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          metadata?: Json | null;
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
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notifications?: Json | null;
          preferences?: Json | null;
          security?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notifications?: Json | null;
          preferences?: Json | null;
          security?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      workflows: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          email_provider: string | null;
          gmail_sequence: Json | null;
          id: string;
          lemlist_campaign_id: string | null;
          name: string;
          pause_rules: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          email_provider?: string | null;
          gmail_sequence?: Json | null;
          id?: string;
          lemlist_campaign_id?: string | null;
          name: string;
          pause_rules?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          email_provider?: string | null;
          gmail_sequence?: Json | null;
          id?: string;
          lemlist_campaign_id?: string | null;
          name?: string;
          pause_rules?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      integrations: {
        Row: {
          id: string;
          platform: string;
          connected: boolean | null;
          config: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          platform: string;
          connected?: boolean | null;
          config?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          platform?: string;
          connected?: boolean | null;
          config?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_access_entity: {
        Args: { entity_id: string; entity_type: string; user_id: string };
        Returns: boolean;
      };
      can_assign_entity: {
        Args: {
          current_user_id: string;
          entity_id: string;
          entity_type: string;
          new_owner_id: string;
        };
        Returns: boolean;
      };
      get_current_organization_id: { Args: never; Returns: string };
      get_user_client_ids: {
        Args: { user_uuid: string };
        Returns: {
          client_id: string;
        }[];
      };
      get_user_organization_ids: {
        Args: { user_uuid: string };
        Returns: {
          organization_id: string;
        }[];
      };
      setup_admin_user: {
        Args: { user_email: string; user_role?: string };
        Returns: undefined;
      };
      user_has_organization_access: {
        Args: { org_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
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
    Enums: {},
  },
} as const;

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
      Companies: {
        Row: {
          "AI Info": string | null
          Automation: string | null
          "Company Info": string | null
          "Company Name": string | null
          "Company Size": string | null
          Created: string | null
          created_at: string | null
          "Existing Loxo Profile": string | null
          Favourite: string | null
          "Head Office": string | null
          id: string
          "Image Attachment": string | null
          Industry: string | null
          industry_id: string | null
          "Job Description": string | null
          Jobs: string | null
          "Key Info Raw": string | null
          "Lead Score": number | null
          Leads: string | null
          LinkedIn: string | null
          "LinkedIn URL": string | null
          "Loxo Company ID": string | null
          Priority: string | null
          priority_enum: Database["public"]["Enums"]["priority_level"] | null
          "Profile Image URL": string | null
          Remove: string | null
          "Score Reason": string | null
          STATUS: string | null
          status_enum: Database["public"]["Enums"]["company_status"] | null
          updated_at: string | null
          Website: string | null
        }
        Insert: {
          "AI Info"?: string | null
          Automation?: string | null
          "Company Info"?: string | null
          "Company Name"?: string | null
          "Company Size"?: string | null
          Created?: string | null
          created_at?: string | null
          "Existing Loxo Profile"?: string | null
          Favourite?: string | null
          "Head Office"?: string | null
          id?: string
          "Image Attachment"?: string | null
          Industry?: string | null
          industry_id?: string | null
          "Job Description"?: string | null
          Jobs?: string | null
          "Key Info Raw"?: string | null
          "Lead Score"?: number | null
          Leads?: string | null
          LinkedIn?: string | null
          "LinkedIn URL"?: string | null
          "Loxo Company ID"?: string | null
          Priority?: string | null
          priority_enum?: Database["public"]["Enums"]["priority_level"] | null
          "Profile Image URL"?: string | null
          Remove?: string | null
          "Score Reason"?: string | null
          STATUS?: string | null
          status_enum?: Database["public"]["Enums"]["company_status"] | null
          updated_at?: string | null
          Website?: string | null
        }
        Update: {
          "AI Info"?: string | null
          Automation?: string | null
          "Company Info"?: string | null
          "Company Name"?: string | null
          "Company Size"?: string | null
          Created?: string | null
          created_at?: string | null
          "Existing Loxo Profile"?: string | null
          Favourite?: string | null
          "Head Office"?: string | null
          id?: string
          "Image Attachment"?: string | null
          Industry?: string | null
          industry_id?: string | null
          "Job Description"?: string | null
          Jobs?: string | null
          "Key Info Raw"?: string | null
          "Lead Score"?: number | null
          Leads?: string | null
          LinkedIn?: string | null
          "LinkedIn URL"?: string | null
          "Loxo Company ID"?: string | null
          Priority?: string | null
          priority_enum?: Database["public"]["Enums"]["priority_level"] | null
          "Profile Image URL"?: string | null
          Remove?: string | null
          "Score Reason"?: string | null
          STATUS?: string | null
          status_enum?: Database["public"]["Enums"]["company_status"] | null
          updated_at?: string | null
          Website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Companies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      company_sizes: {
        Row: {
          created_at: string | null
          id: string
          name: string
          size_range: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          size_range?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          size_range?: string | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      job_functions: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      Jobs: {
        Row: {
          Company: string | null
          company_size_id: string | null
          Created: string | null
          created_at: string | null
          "Employment Type": string | null
          employment_type_enum:
            | Database["public"]["Enums"]["employment_type"]
            | null
          Function: string | null
          function_id: string | null
          id: string
          Industry: string | null
          "Job Description": string | null
          "Job Location": string | null
          "Job Summary": string | null
          "Job Title": string | null
          "Job URL": string | null
          "Lead Score": number | null
          "Lead Score (from Company)": number | null
          "LinkedIn Job ID": string | null
          Logo: string | null
          "Posted Date": string | null
          Priority: string | null
          Salary: string | null
          "Score Reason (from Company)": string | null
          "Seniority Level": string | null
          seniority_level_enum:
            | Database["public"]["Enums"]["seniority_level"]
            | null
          status_enum: Database["public"]["Enums"]["job_status"] | null
          "Target People": string | null
          updated_at: string | null
          "Valid Through": string | null
        }
        Insert: {
          Company?: string | null
          company_size_id?: string | null
          Created?: string | null
          created_at?: string | null
          "Employment Type"?: string | null
          employment_type_enum?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          Function?: string | null
          function_id?: string | null
          id?: string
          Industry?: string | null
          "Job Description"?: string | null
          "Job Location"?: string | null
          "Job Summary"?: string | null
          "Job Title"?: string | null
          "Job URL"?: string | null
          "Lead Score"?: number | null
          "Lead Score (from Company)"?: number | null
          "LinkedIn Job ID"?: string | null
          Logo?: string | null
          "Posted Date"?: string | null
          Priority?: string | null
          Salary?: string | null
          "Score Reason (from Company)"?: string | null
          "Seniority Level"?: string | null
          seniority_level_enum?:
            | Database["public"]["Enums"]["seniority_level"]
            | null
          status_enum?: Database["public"]["Enums"]["job_status"] | null
          "Target People"?: string | null
          updated_at?: string | null
          "Valid Through"?: string | null
        }
        Update: {
          Company?: string | null
          company_size_id?: string | null
          Created?: string | null
          created_at?: string | null
          "Employment Type"?: string | null
          employment_type_enum?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          Function?: string | null
          function_id?: string | null
          id?: string
          Industry?: string | null
          "Job Description"?: string | null
          "Job Location"?: string | null
          "Job Summary"?: string | null
          "Job Title"?: string | null
          "Job URL"?: string | null
          "Lead Score"?: number | null
          "Lead Score (from Company)"?: number | null
          "LinkedIn Job ID"?: string | null
          Logo?: string | null
          "Posted Date"?: string | null
          Priority?: string | null
          Salary?: string | null
          "Score Reason (from Company)"?: string | null
          "Seniority Level"?: string | null
          seniority_level_enum?:
            | Database["public"]["Enums"]["seniority_level"]
            | null
          status_enum?: Database["public"]["Enums"]["job_status"] | null
          "Target People"?: string | null
          updated_at?: string | null
          "Valid Through"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Jobs_company_size_id_fkey"
            columns: ["company_size_id"]
            isOneToOne: false
            referencedRelation: "company_sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Jobs_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "job_functions"
            referencedColumns: ["id"]
          },
        ]
      }
      People: {
        Row: {
          Account: string | null
          Automation: string | null
          "Automation Date": string | null
          "Automation Status": string | null
          Business: string | null
          "Campaign Finished": string | null
          Campaigns: string | null
          Company: string | null
          "Company Role": string | null
          "Confidence Level": string | null
          "Connection Accepted Date": string | null
          "Connection Request": string | null
          "Connection Request Date": string | null
          Created: string | null
          "Created Date": string | null
          created_at: string | null
          "Email Address": string | null
          "Email Draft": string | null
          "Email Reply": string | null
          "Email Reply Date": string | null
          "Email Sent": string | null
          "Email Sent Date": string | null
          "Employee Location": string | null
          Favourite: string | null
          id: string
          Jobs: string | null
          "Last Contact Date": string | null
          "Last Message": string | null
          "Lead Score": string | null
          "Lead Source": string | null
          LinkedIn: string | null
          "LinkedIn Connected": string | null
          "LinkedIn Connected Message": string | null
          "LinkedIn Follow Up Message": string | null
          "LinkedIn Request Message": string | null
          "LinkedIn Responded": string | null
          "LinkedIn URL": string | null
          "Meeting Booked": string | null
          "Meeting Date": string | null
          "Message Sent": string | null
          "Message Sent Date": string | null
          Name: string | null
          "Next Action Date": string | null
          "Outreach Channels": string | null
          Owner: string | null
          priority_enum: Database["public"]["Enums"]["priority_level"] | null
          Remove: string | null
          "Response Date": string | null
          Stage: string | null
          "Stage Updated": string | null
          stage_enum: Database["public"]["Enums"]["lead_stage"] | null
          Updated: string | null
          updated_at: string | null
        }
        Insert: {
          Account?: string | null
          Automation?: string | null
          "Automation Date"?: string | null
          "Automation Status"?: string | null
          Business?: string | null
          "Campaign Finished"?: string | null
          Campaigns?: string | null
          Company?: string | null
          "Company Role"?: string | null
          "Confidence Level"?: string | null
          "Connection Accepted Date"?: string | null
          "Connection Request"?: string | null
          "Connection Request Date"?: string | null
          Created?: string | null
          "Created Date"?: string | null
          created_at?: string | null
          "Email Address"?: string | null
          "Email Draft"?: string | null
          "Email Reply"?: string | null
          "Email Reply Date"?: string | null
          "Email Sent"?: string | null
          "Email Sent Date"?: string | null
          "Employee Location"?: string | null
          Favourite?: string | null
          id?: string
          Jobs?: string | null
          "Last Contact Date"?: string | null
          "Last Message"?: string | null
          "Lead Score"?: string | null
          "Lead Source"?: string | null
          LinkedIn?: string | null
          "LinkedIn Connected"?: string | null
          "LinkedIn Connected Message"?: string | null
          "LinkedIn Follow Up Message"?: string | null
          "LinkedIn Request Message"?: string | null
          "LinkedIn Responded"?: string | null
          "LinkedIn URL"?: string | null
          "Meeting Booked"?: string | null
          "Meeting Date"?: string | null
          "Message Sent"?: string | null
          "Message Sent Date"?: string | null
          Name?: string | null
          "Next Action Date"?: string | null
          "Outreach Channels"?: string | null
          Owner?: string | null
          priority_enum?: Database["public"]["Enums"]["priority_level"] | null
          Remove?: string | null
          "Response Date"?: string | null
          Stage?: string | null
          "Stage Updated"?: string | null
          stage_enum?: Database["public"]["Enums"]["lead_stage"] | null
          Updated?: string | null
          updated_at?: string | null
        }
        Update: {
          Account?: string | null
          Automation?: string | null
          "Automation Date"?: string | null
          "Automation Status"?: string | null
          Business?: string | null
          "Campaign Finished"?: string | null
          Campaigns?: string | null
          Company?: string | null
          "Company Role"?: string | null
          "Confidence Level"?: string | null
          "Connection Accepted Date"?: string | null
          "Connection Request"?: string | null
          "Connection Request Date"?: string | null
          Created?: string | null
          "Created Date"?: string | null
          created_at?: string | null
          "Email Address"?: string | null
          "Email Draft"?: string | null
          "Email Reply"?: string | null
          "Email Reply Date"?: string | null
          "Email Sent"?: string | null
          "Email Sent Date"?: string | null
          "Employee Location"?: string | null
          Favourite?: string | null
          id?: string
          Jobs?: string | null
          "Last Contact Date"?: string | null
          "Last Message"?: string | null
          "Lead Score"?: string | null
          "Lead Source"?: string | null
          LinkedIn?: string | null
          "LinkedIn Connected"?: string | null
          "LinkedIn Connected Message"?: string | null
          "LinkedIn Follow Up Message"?: string | null
          "LinkedIn Request Message"?: string | null
          "LinkedIn Responded"?: string | null
          "LinkedIn URL"?: string | null
          "Meeting Booked"?: string | null
          "Meeting Date"?: string | null
          "Message Sent"?: string | null
          "Message Sent Date"?: string | null
          Name?: string | null
          "Next Action Date"?: string | null
          "Outreach Channels"?: string | null
          Owner?: string | null
          priority_enum?: Database["public"]["Enums"]["priority_level"] | null
          Remove?: string | null
          "Response Date"?: string | null
          Stage?: string | null
          "Stage Updated"?: string | null
          stage_enum?: Database["public"]["Enums"]["lead_stage"] | null
          Updated?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_enum_values: {
        Args: { enum_type: string }
        Returns: string[]
      }
    }
    Enums: {
      company_status: "active" | "inactive" | "prospect"
      employment_type:
        | "full-time"
        | "part-time"
        | "contract"
        | "internship"
        | "freelance"
      job_status: "draft" | "active" | "paused" | "filled" | "cancelled"
      lead_stage:
        | "new"
        | "contacted"
        | "qualified"
        | "interview"
        | "offer"
        | "hired"
        | "lost"
      priority_level: "low" | "medium" | "high" | "urgent"
      seniority_level:
        | "entry"
        | "junior"
        | "mid"
        | "senior"
        | "lead"
        | "manager"
        | "director"
        | "executive"
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
    Enums: {
      company_status: ["active", "inactive", "prospect"],
      employment_type: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ],
      job_status: ["draft", "active", "paused", "filled", "cancelled"],
      lead_stage: [
        "new",
        "contacted",
        "qualified",
        "interview",
        "offer",
        "hired",
        "lost",
      ],
      priority_level: ["low", "medium", "high", "urgent"],
      seniority_level: [
        "entry",
        "junior",
        "mid",
        "senior",
        "lead",
        "manager",
        "director",
        "executive",
      ],
    },
  },
} as const

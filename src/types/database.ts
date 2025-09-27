// Database schema types based on actual Supabase tables
export interface DatabaseSchema {
  companies: {
    id: string;
    name: string;
    website: string;
    linkedin_url: string;
    head_office: string;
    industry: string;
    company_size: string;
    priority: string;
    confidence_level: string;
    lead_score: string;
    automation_active: boolean;
    is_favourite: boolean;
    created_at: string;
    updated_at: string;
  };
  
  people: {
    id: string;
    name: string;
    company_id: string;
    email_address: string;
    linkedin_url: string;
    employee_location: string;
    company_role: string;
    lead_score: string;
    stage: string;
    automation_started_at: string;
    linkedin_request_message: string;
    linkedin_follow_up_message: string;
    linkedin_connected_message: string;
    connected_at: string;
    last_reply_at: string;
    last_reply_channel: string;
    last_reply_message: string;
    last_interaction_at: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
    confidence_level: string;
    email_draft: string;
    connection_request_date: string;
    connection_accepted_date: string;
    message_sent_date: string;
    response_date: string;
    meeting_booked: string;
    meeting_date: string;
    email_sent_date: string;
    email_reply_date: string;
    stage_updated: string;
    is_favourite: string;
    connection_request_sent: string;
    message_sent: string;
    linkedin_connected: string;
    linkedin_responded: string;
    campaign_finished: string;
    favourite: boolean;
    jobs: string;
    email_sent: string;
    email_reply: string;
    linkedin_profile_id: string;
  };
  
  jobs: {
    id: string;
    title: string;
    company_id: string;
    job_url: string;
    posted_date: string;
    valid_through: string;
    location: string;
    description: string;
    summary: string;
    employment_type: string;
    seniority_level: string;
    linkedin_job_id: string;
    automation_active: boolean;
    automation_started_at: string;
    created_at: string;
    updated_at: string;
    priority: string;
    lead_score_job: number;
    salary: string;
    function: string;
    logo_url: string;
  };
}

export type TableName = keyof DatabaseSchema;
export type CompanyData = DatabaseSchema['companies'];
export type PersonData = DatabaseSchema['people'];
export type JobData = DatabaseSchema['jobs'];

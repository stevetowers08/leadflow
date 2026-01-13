/**
 * Supabase Edge Function MCP Server
 *
 * This creates an MCP server as a Supabase Edge Function.
 * It provides tools for AI models to interact with your CRM data.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// MCP Server implementation for Supabase Edge Functions
class SupabaseMCPServer {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async handleRequest(request: Request): Promise<Response> {
    try {
      const { method, url } = request;
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      // Basic CORS support
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      if (method === 'POST' && path === '/mcp/tools') {
        const res = await this.handleToolCall(request);
        return new Response(await res.text(), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (method === 'GET' && path === '/mcp/tools') {
        const res = await this.listTools();
        return new Response(await res.text(), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  private async listTools(): Promise<Response> {
    const tools = [
      {
        name: 'get_company_info',
        description: 'Get detailed information about a company',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'The ID of the company to retrieve',
            },
          },
          required: ['companyId'],
        },
      },
      {
        name: 'get_company_employees',
        description: 'Get all employees/leads for a company',
        inputSchema: {
          type: 'object',
          properties: {
            companyId: {
              type: 'string',
              description: 'The ID of the company',
            },
          },
          required: ['companyId'],
        },
      },
      {
        name: 'search_leads',
        description: 'Search for leads by name, role, or company',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_lead_details',
        description: 'Get detailed information about a specific lead',
        inputSchema: {
          type: 'object',
          properties: {
            leadId: {
              type: 'string',
              description: 'The ID of the lead to retrieve',
            },
          },
          required: ['leadId'],
        },
      },
    ];

    return new Response(JSON.stringify({ tools }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async handleToolCall(request: Request): Promise<Response> {
    const { name, arguments: args } = await request.json();

    try {
      let result;
      switch (name) {
        case 'get_company_info':
          result = await this.getCompanyInfo(args.companyId);
          break;

        case 'get_company_employees':
          result = await this.getCompanyEmployees(args.companyId);
          break;

        case 'search_leads':
          result = await this.searchLeads(args.query, args.limit || 10);
          break;

        case 'get_lead_details':
          result = await this.getLeadDetails(args.leadId);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return new Response(JSON.stringify({ success: true, result }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: (error as Error).message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  private async getCompanyInfo(companyId: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .select(
        'id, name, website, linkedin_url, head_office, industry, company_size, confidence_level, lead_score, score_reason, is_favourite, priority, logo_url, description, categories, connection_strength, created_at, updated_at'
      )
      .eq('id', companyId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getCompanyEmployees(companyId: string) {
    // First get the company name
    const { data: company, error: companyError } = await this.supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

    if (companyError) throw companyError;
    if (!company) throw new Error('Company not found');

    // Then get leads for that company (leads.company is a text field matching company name)
    const { data, error } = await this.supabase
      .from('leads')
      .select(
        'id, first_name, last_name, email, phone, company, job_title, status, quality_rank, workflow_status, enrichment_status, show_id, created_at'
      )
      .eq('company', company.name)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  private async searchLeads(query: string, limit: number) {
    const { data, error } = await this.supabase
      .from('leads')
      .select(
        'id, first_name, last_name, email, company, job_title, status, quality_rank'
      )
      .or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%,job_title.ilike.%${query}%`
      )
      .limit(limit);

    if (error) throw error;
    return data;
  }

  private async getLeadDetails(leadId: string) {
    const { data, error } = await this.supabase
      .from('leads')
      .select(
        'id, user_id, first_name, last_name, email, phone, company, job_title, scan_image_url, quality_rank, ai_summary, ai_icebreaker, status, gmail_thread_id, workflow_id, workflow_status, enrichment_data, enrichment_timestamp, enrichment_status, show_id, show_name, show_date, linkedin_url, notes, created_at, updated_at'
      )
      .eq('id', leadId)
      .single();

    if (error) throw error;
    return data;
  }
}

// Edge Function handler
serve(async req => {
  // Use environment variables that match the app configuration
  // SUPABASE_URL is automatically available in Edge Functions
  // Use anon key for RLS-respecting queries (matches app's NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const supabaseUrl =
    Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!;
  const supabaseKey =
    Deno.env.get('SUPABASE_ANON_KEY') ||
    Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')!;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({
        error:
          'Missing Supabase configuration. SUPABASE_URL and SUPABASE_ANON_KEY are required.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const mcpServer = new SupabaseMCPServer(supabaseUrl, supabaseKey);
  return await mcpServer.handleRequest(req);
});

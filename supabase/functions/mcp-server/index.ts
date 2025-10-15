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

      if (method === 'POST' && path === '/mcp/tools') {
        return await this.handleToolCall(request);
      }

      if (method === 'GET' && path === '/mcp/tools') {
        return await this.listTools();
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
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
          error: error.message,
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
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getCompanyEmployees(companyId: string) {
    const { data, error } = await this.supabase
      .from('people')
      .select('*')
      .eq('company_id', companyId);

    if (error) throw error;
    return data;
  }

  private async searchLeads(query: string, limit: number) {
    const { data, error } = await this.supabase
      .from('people')
      .select('*')
      .or(`name.ilike.%${query}%,company_role.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data;
  }

  private async getLeadDetails(leadId: string) {
    const { data, error } = await this.supabase
      .from('people')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error) throw error;
    return data;
  }
}

// Edge Function handler
serve(async req => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  const mcpServer = new SupabaseMCPServer(supabaseUrl, supabaseKey);
  return await mcpServer.handleRequest(req);
});

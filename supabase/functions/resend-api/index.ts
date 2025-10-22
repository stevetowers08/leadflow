/**
 * Resend API Routes
 * Handles Resend email service integration
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getResendService } from '../services/resendService.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Route: POST /api/resend/domains - Create domain
    if (path === '/api/resend/domains' && method === 'POST') {
      const { name } = await req.json();

      if (!name) {
        return new Response(
          JSON.stringify({ error: 'Domain name is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const resendService = getResendService();
      const domain = await resendService.createDomain(name);

      // Save to database
      const { data, error } = await supabase
        .from('email_domains')
        .insert({
          provider_id: domain.id,
          name: domain.name,
          status: domain.status,
          dns_records: domain.records,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save domain to database' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ success: true, domain: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: GET /api/resend/domains - List domains
    if (path === '/api/resend/domains' && method === 'GET') {
      const resendService = getResendService();
      const domains = await resendService.listDomains();

      return new Response(JSON.stringify({ success: true, domains }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: GET /api/resend/domains/:id - Get domain
    if (path.startsWith('/api/resend/domains/') && method === 'GET') {
      const domainId = path.split('/').pop();

      if (!domainId) {
        return new Response(
          JSON.stringify({ error: 'Domain ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const resendService = getResendService();
      const domain = await resendService.getDomain(domainId);

      return new Response(JSON.stringify({ success: true, domain }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /api/resend/domains/:id/verify - Verify domain
    if (path.endsWith('/verify') && method === 'POST') {
      const domainId = path.split('/')[3];

      if (!domainId) {
        return new Response(
          JSON.stringify({ error: 'Domain ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const resendService = getResendService();
      const result = await resendService.verifyDomain(domainId);

      // Update database
      const { error } = await supabase
        .from('email_domains')
        .update({ status: result.status })
        .eq('provider_id', domainId);

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update domain status' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: result.status,
          verified: result.verified,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route: DELETE /api/resend/domains/:id - Delete domain
    if (path.startsWith('/api/resend/domains/') && method === 'DELETE') {
      const domainId = path.split('/').pop();

      if (!domainId) {
        return new Response(
          JSON.stringify({ error: 'Domain ID is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const resendService = getResendService();
      const deleted = await resendService.deleteDomain(domainId);

      if (deleted) {
        // Remove from database
        await supabase
          .from('email_domains')
          .delete()
          .eq('provider_id', domainId);
      }

      return new Response(JSON.stringify({ success: true, deleted }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /api/resend/emails/send - Send email
    if (path === '/api/resend/emails/send' && method === 'POST') {
      const emailData = await req.json();

      if (!emailData.from || !emailData.to || !emailData.subject) {
        return new Response(
          JSON.stringify({ error: 'From, to, and subject are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const resendService = getResendService();
      const result = await resendService.sendEmail(emailData);

      // Save email send record to database
      const { error } = await supabase.from('email_sends').insert({
        provider_email_id: result.id,
        from_email: result.from,
        to_email: Array.isArray(result.to) ? result.to.join(',') : result.to,
        subject: emailData.subject,
        body_html: emailData.html,
        body_text: emailData.text,
        status: 'sent',
        sent_at: result.created_at,
      });

      if (error) {
        console.error('Database error:', error);
        // Don't fail the request, just log the error
      }

      return new Response(JSON.stringify({ success: true, email: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /api/resend/emails/batch - Send batch emails
    if (path === '/api/resend/emails/batch' && method === 'POST') {
      const { emails } = await req.json();

      if (!emails || !Array.isArray(emails)) {
        return new Response(
          JSON.stringify({ error: 'Emails array is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const resendService = getResendService();
      const results = await resendService.sendBatchEmails(emails);

      // Save batch email records to database
      const emailRecords = results.map((result, index) => ({
        provider_email_id: result.id,
        from_email: result.from,
        to_email: Array.isArray(result.to) ? result.to.join(',') : result.to,
        subject: emails[index].subject,
        body_html: emails[index].html,
        body_text: emails[index].text,
        status: 'sent',
        sent_at: result.created_at,
      }));

      const { error } = await supabase.from('email_sends').insert(emailRecords);

      if (error) {
        console.error('Database error:', error);
        // Don't fail the request, just log the error
      }

      return new Response(JSON.stringify({ success: true, emails: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: GET /api/resend/emails/:id - Get email details
    if (path.startsWith('/api/resend/emails/') && method === 'GET') {
      const emailId = path.split('/').pop();

      if (!emailId) {
        return new Response(JSON.stringify({ error: 'Email ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const resendService = getResendService();
      const email = await resendService.getEmail(emailId);

      return new Response(JSON.stringify({ success: true, email }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /api/resend/test - Test connection
    if (path === '/api/resend/test' && method === 'POST') {
      const resendService = getResendService();
      const isConnected = await resendService.testConnection();

      return new Response(
        JSON.stringify({ success: true, connected: isConnected }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route not found
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

# Empowr CRM - Integrations Guide

## Table of Contents
- [Overview](#overview)
- [Supabase Integration](#supabase-integration)
- [Google OAuth Setup](#google-oauth-setup)
- [LinkedIn Integration](#linkedin-integration)
- [Expandi Integration](#expandi-integration)
- [Prosp Integration](#prosp-integration)
- [Gmail Integration](#gmail-integration)
- [N8N Automation](#n8n-automation)
- [Error Tracking](#error-tracking)
- [Analytics Integration](#analytics-integration)

## Overview

Empowr CRM integrates with multiple external services to provide comprehensive functionality:

### Core Integrations
- **Supabase**: Database, authentication, and real-time features
- **Google OAuth**: User authentication and Gmail access
- **LinkedIn**: Profile data and connection management
- **Expandi/Prosp**: LinkedIn automation tools
- **Gmail**: Email communication tracking

### Optional Integrations
- **N8N**: Workflow automation
- **Sentry**: Error tracking and monitoring
- **Google Analytics**: Usage analytics
- **Webhooks**: Real-time data synchronization

## Supabase Integration

### Initial Setup

#### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project to be created (2-3 minutes)

#### 2. Get Project Credentials
```bash
# From Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. Database Schema Setup
Run this SQL in Supabase SQL Editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create enum types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'user', 'viewer');
CREATE TYPE person_stage AS ENUM ('new', 'connection_requested', 'connected', 'messaged', 'replied', 'lead_lost', 'in queue');
CREATE TYPE company_stage AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE reply_type AS ENUM ('interested', 'not_interested', 'maybe');
CREATE TYPE interaction_type AS ENUM ('connection_request', 'message', 'reply', 'profile_view');

-- Create tables
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  stage company_stage DEFAULT 'new',
  automation_active BOOLEAN DEFAULT false,
  logo_url TEXT,
  website TEXT,
  employee_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE people (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  stage person_stage DEFAULT 'new',
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  automation_started_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  last_reply_channel TEXT,
  reply_type reply_type,
  linkedin_url TEXT,
  linkedin_connected BOOLEAN DEFAULT false,
  linkedin_responded BOOLEAN DEFAULT false,
  email TEXT,
  phone TEXT,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  function TEXT,
  location TEXT,
  employment_type TEXT DEFAULT 'full-time',
  seniority TEXT DEFAULT 'mid',
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT,
  requirements TEXT[],
  posted_date DATE,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  type interaction_type NOT NULL,
  content TEXT,
  response_type reply_type,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_people_company_id ON people(company_id);
CREATE INDEX idx_people_stage ON people(stage);
CREATE INDEX idx_people_automation_started ON people(automation_started_at) WHERE automation_started_at IS NOT NULL;
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_function ON jobs(function);
CREATE INDEX idx_interactions_person_id ON interactions(person_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_companies_stage ON companies(stage);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4. Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage companies" ON companies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage people" ON people
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage jobs" ON jobs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage interactions" ON interactions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view other profiles" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Real-time Subscriptions
```typescript
// Set up real-time listeners
useEffect(() => {
  const peopleSubscription = supabase
    .channel('people-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'people' },
      (payload) => {
        console.log('People change:', payload);
        queryClient.invalidateQueries(['people']);
      }
    )
    .subscribe();

  const companiesSubscription = supabase
    .channel('companies-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'companies' },
      (payload) => {
        console.log('Companies change:', payload);
        queryClient.invalidateQueries(['companies']);
      }
    )
    .subscribe();

  return () => {
    peopleSubscription.unsubscribe();
    companiesSubscription.unsubscribe();
  };
}, []);
```

## Google OAuth Setup

### 1. Google Cloud Console Setup

#### Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing one
3. Enable required APIs:
   - Google+ API
   - Gmail API (if using Gmail integration)
   - People API (for profile data)

#### Configure OAuth Consent Screen
1. Go to APIs & Services > OAuth consent screen
2. Choose "External" user type
3. Fill in application information:
   ```
   App name: Empowr CRM
   User support email: your-email@domain.com
   Developer contact: your-email@domain.com
   ```
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/gmail.readonly` (if using Gmail)

#### Create OAuth Credentials
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   ```
   # Development
   http://localhost:8080
   
   # Supabase auth callback
   https://your-project-id.supabase.co/auth/v1/callback
   
   # Production domain
   https://your-domain.com
   ```

### 2. Supabase Auth Configuration

#### Enable Google Provider
1. Go to Supabase Dashboard > Authentication > Settings
2. Find "Auth Providers" section
3. Enable Google provider
4. Add your Google OAuth credentials:
   ```
   Client ID: your-google-client-id.apps.googleusercontent.com
   Client Secret: your-google-client-secret
   ```

#### Configure Redirect URLs
```
Site URL: https://your-domain.com
Redirect URLs:
- http://localhost:8080/**
- https://your-domain.com/**
```

### 3. Frontend Implementation
```typescript
// Google OAuth login
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    toast.error('Failed to sign in with Google');
  }
};

// Check auth state
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User signed in successfully
        const { user } = session;
        
        // Create or update user profile
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
          });

        if (error) {
          console.error('Error updating user profile:', error);
        }
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

## LinkedIn Integration

### 1. LinkedIn App Setup

#### Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in app details:
   ```
   App name: Empowr CRM
   LinkedIn Page: Your company page
   Privacy policy URL: https://your-domain.com/privacy
   App logo: Upload your logo
   ```

#### Configure Products
1. Request access to:
   - Sign In with LinkedIn
   - Profile API
   - Share on LinkedIn (if needed)

#### Set Redirect URLs
```
Authorized redirect URLs:
- http://localhost:8080/auth/linkedin/callback
- https://your-domain.com/auth/linkedin/callback
```

### 2. LinkedIn OAuth Flow
```typescript
// LinkedIn OAuth configuration
const LINKEDIN_CONFIG = {
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/linkedin/callback`,
  scope: 'r_liteprofile r_emailaddress',
};

// Initiate LinkedIn OAuth
const signInWithLinkedIn = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CONFIG.clientId,
    redirect_uri: LINKEDIN_CONFIG.redirectUri,
    scope: LINKEDIN_CONFIG.scope,
    state: generateRandomState(), // CSRF protection
  });

  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
};

// Handle OAuth callback
const handleLinkedInCallback = async (code: string) => {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('/api/linkedin/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const { access_token } = await tokenResponse.json();

    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profile = await profileResponse.json();
    
    // Store LinkedIn data
    await supabase
      .from('people')
      .update({
        linkedin_url: `https://linkedin.com/in/${profile.id}`,
        linkedin_connected: true,
      })
      .eq('id', personId);

  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
  }
};
```

### 3. LinkedIn API Integration
```typescript
// LinkedIn API service
class LinkedInService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getProfile(profileId: string) {
    const response = await fetch(`https://api.linkedin.com/v2/people/(id:${profileId})`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    return response.json();
  }

  async getConnections() {
    const response = await fetch('https://api.linkedin.com/v2/connections', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    return response.json();
  }

  async sendMessage(recipientId: string, message: string) {
    const response = await fetch('https://api.linkedin.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        recipients: [recipientId],
        subject: 'Connection Request',
        body: message,
      }),
    });

    return response.json();
  }
}
```

## Expandi Integration

### 1. Expandi API Setup

#### Get API Credentials
1. Log in to your Expandi account
2. Go to Settings > API
3. Generate API key
4. Note your workspace ID

#### Environment Variables
```env
VITE_EXPANDI_API_KEY=your-expandi-api-key
VITE_EXPANDI_WORKSPACE_ID=your-workspace-id
```

### 2. Expandi API Integration
```typescript
// Expandi API service
class ExpandiService {
  private apiKey: string;
  private workspaceId: string;
  private baseUrl = 'https://api.expandi.io/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_EXPANDI_API_KEY;
    this.workspaceId = import.meta.env.VITE_EXPANDI_WORKSPACE_ID;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Expandi API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Start automation campaign
  async startCampaign(campaignData: {
    name: string;
    linkedinProfiles: string[];
    messageSequence: string[];
  }) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        workspace_id: this.workspaceId,
        ...campaignData,
      }),
    });
  }

  // Get campaign statistics
  async getCampaignStats(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/stats`);
  }

  // Get campaign activities
  async getCampaignActivities(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/activities`);
  }

  // Pause/resume campaign
  async updateCampaignStatus(campaignId: string, status: 'active' | 'paused') {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}
```

### 3. Webhook Integration
```typescript
// Webhook handler for Expandi events
export async function handleExpandiWebhook(request: Request) {
  const signature = request.headers.get('x-expandi-signature');
  const body = await request.text();

  // Verify webhook signature
  if (!verifyExpandiSignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case 'connection_request_sent':
      await handleConnectionRequestSent(event.data);
      break;
    
    case 'connection_accepted':
      await handleConnectionAccepted(event.data);
      break;
    
    case 'message_sent':
      await handleMessageSent(event.data);
      break;
    
    case 'reply_received':
      await handleReplyReceived(event.data);
      break;
  }

  return new Response('OK', { status: 200 });
}

// Update person status based on Expandi events
async function handleConnectionRequestSent(data: any) {
  await supabase
    .from('people')
    .update({
      stage: 'connection_requested',
      automation_started_at: new Date().toISOString(),
    })
    .eq('linkedin_url', data.profile_url);

  // Log interaction
  await supabase
    .from('interactions')
    .insert({
      person_id: data.person_id,
      type: 'connection_request',
      content: data.message,
    });
}
```

## Prosp Integration

### 1. Prosp API Setup
```env
VITE_PROSP_API_KEY=your-prosp-api-key
VITE_PROSP_ACCOUNT_ID=your-account-id
```

### 2. Prosp API Service
```typescript
class ProspService {
  private apiKey: string;
  private accountId: string;
  private baseUrl = 'https://api.prosp.io/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_PROSP_API_KEY;
    this.accountId = import.meta.env.VITE_PROSP_ACCOUNT_ID;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Prosp API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Create automation sequence
  async createSequence(sequenceData: {
    name: string;
    steps: Array<{
      type: 'connection_request' | 'message' | 'follow_up';
      delay_days: number;
      content: string;
    }>;
  }) {
    return this.request('/sequences', {
      method: 'POST',
      body: JSON.stringify({
        account_id: this.accountId,
        ...sequenceData,
      }),
    });
  }

  // Add prospects to sequence
  async addProspectsToSequence(sequenceId: string, prospects: Array<{
    linkedin_url: string;
    first_name: string;
    last_name: string;
    company: string;
  }>) {
    return this.request(`/sequences/${sequenceId}/prospects`, {
      method: 'POST',
      body: JSON.stringify({ prospects }),
    });
  }

  // Get sequence performance
  async getSequencePerformance(sequenceId: string) {
    return this.request(`/sequences/${sequenceId}/performance`);
  }
}
```

## Gmail Integration

### 1. Gmail API Setup

#### Enable Gmail API
1. Go to Google Cloud Console
2. Enable Gmail API for your project
3. Add Gmail scope to OAuth consent screen:
   ```
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.send
   ```

### 2. Gmail Service Implementation
```typescript
class GmailService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getMessages(query: string = '', maxResults: number = 10) {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return response.json();
  }

  async getMessage(messageId: string) {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    return response.json();
  }

  async sendMessage(to: string, subject: string, body: string) {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body,
    ].join('\n');

    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail,
        }),
      }
    );

    return response.json();
  }
}
```

### 3. Email Tracking Integration
```typescript
// Track email interactions
const trackEmailInteraction = async (emailData: {
  personId: string;
  type: 'sent' | 'received' | 'opened';
  subject: string;
  content: string;
}) => {
  await supabase
    .from('interactions')
    .insert({
      person_id: emailData.personId,
      type: 'email',
      content: JSON.stringify({
        subject: emailData.subject,
        content: emailData.content,
        action: emailData.type,
      }),
    });

  // Update person's last activity
  if (emailData.type === 'received') {
    await supabase
      .from('people')
      .update({
        last_reply_at: new Date().toISOString(),
        last_reply_channel: 'email',
      })
      .eq('id', emailData.personId);
  }
};
```

## N8N Automation

### 1. N8N Setup
```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/empowr-crm
VITE_N8N_API_KEY=your-n8n-api-key
```

### 2. Workflow Automation
```typescript
// N8N webhook service
class N8NService {
  private webhookUrl: string;
  private apiKey: string;

  constructor() {
    this.webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    this.apiKey = import.meta.env.VITE_N8N_API_KEY;
  }

  async triggerWorkflow(workflowName: string, data: any) {
    const response = await fetch(`${this.webhookUrl}/${workflowName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  // Trigger lead scoring workflow
  async scoreLead(personData: {
    id: string;
    company: string;
    position: string;
    linkedinProfile: string;
  }) {
    return this.triggerWorkflow('score-lead', personData);
  }

  // Trigger automation sequence
  async startAutomation(automationData: {
    personId: string;
    sequenceType: 'cold_outreach' | 'follow_up' | 'nurture';
    customMessage?: string;
  }) {
    return this.triggerWorkflow('start-automation', automationData);
  }
}
```

## Error Tracking

### 1. Sentry Setup
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// Sentry configuration
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

// Error boundary with Sentry
const SentryErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: ({ error, resetError }) => (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <button onClick={resetError}>Try again</button>
    </div>
  ),
});
```

### 2. Custom Error Tracking
```typescript
// Custom error tracking service
class ErrorTrackingService {
  static captureError(error: Error, context?: Record<string, any>) {
    console.error('Error captured:', error);
    
    if (import.meta.env.PROD) {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  }

  static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    console.log(`[${level.toUpperCase()}] ${message}`);
    
    if (import.meta.env.PROD) {
      Sentry.captureMessage(message, level);
    }
  }
}

// Usage in API calls
const fetchData = async () => {
  try {
    const response = await api.getData();
    return response;
  } catch (error) {
    ErrorTrackingService.captureError(error as Error, {
      context: 'fetchData',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};
```

## Analytics Integration

### 1. Google Analytics 4
```typescript
// GA4 setup
import { gtag } from 'ga-gtag';

gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
  page_title: document.title,
  page_location: window.location.href,
});

// Track custom events
const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  gtag('event', eventName, {
    ...parameters,
    timestamp: new Date().toISOString(),
  });
};

// Usage
trackEvent('lead_created', {
  lead_source: 'linkedin',
  company_industry: 'technology',
});

trackEvent('automation_started', {
  automation_type: 'expandi',
  sequence_name: 'cold_outreach_v1',
});
```

### 2. Custom Analytics
```typescript
// Custom analytics service
class AnalyticsService {
  static async trackPageView(page: string) {
    // Track in GA4
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_title: page,
      page_location: window.location.href,
    });

    // Track in custom analytics
    await this.sendEvent('page_view', {
      page,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    });
  }

  static async trackUserAction(action: string, data?: Record<string, any>) {
    await this.sendEvent('user_action', {
      action,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  private static async sendEvent(type: string, data: Record<string, any>) {
    if (import.meta.env.PROD) {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
    }
  }
}
```

---

*For troubleshooting integration issues, see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)*
*For development setup, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)*

# New Client Onboarding Flow

**Documentation**: Client creation process for multi-tenant architecture  
**Date**: January 27, 2025  
**Status**: 📋 Current Implementation Guide

---

## Overview

No new tables are created when a new client signs up. Your architecture uses **shared tables with association tables** - the same pattern used by major SaaS platforms.

---

## Client Setup Process

### Step 1: Create Client Record

**What happens**: Insert into `clients` table

```typescript
// Example: New client signup
async function createNewClient(clientData: ClientData) {
  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      name: 'Acme Recruitment Agency',
      email: 'contact@acme-rec.com',
      company: 'Acme Recruiting',
      // No additional setup needed
    })
    .select()
    .single();

  return client;
}
```

**Result**: One new row in `clients` table

---

### Step 2: Link User to Client

**What happens**: Create entry in `client_users` association table

```typescript
async function linkUserToClient(clientId: string, userId: string) {
  const { data, error } = await supabase.from('client_users').insert({
    client_id: clientId,
    user_id: userId,
    role: 'owner',
    is_primary_contact: true,
  });

  return data;
}
```

**Result**: One new row in `client_users` table

---

### Step 3: Optional - Create Job Filter Config

**What happens**: Set up their job filtering preferences

```typescript
async function createDefaultFilterConfig(clientId: string, userId: string) {
  const { data, error } = await supabase.from('job_filter_configs').insert({
    client_id: clientId,
    user_id: userId,
    config_name: 'Default Configuration',
    platform: 'linkedin',
    is_active: true,
    // Default filters can be set here
  });

  return data;
}
```

**Result**: One new row in `job_filter_configs` table

---

## What Happens Automatically

Once a client is set up, data flows through existing tables:

### When User Qualifies a Job

```typescript
// User qualifies job → Creates entry in client_jobs
await supabase.from('client_jobs').insert({
  client_id: 'acme-client-id',
  job_id: 'job-123',
  status: 'qualify',
  qualified_at: new Date(),
});
```

**Creates**: 1 row in `client_jobs` (association table)

### When User Qualifies a Company

```typescript
// User qualifies job → Creates entry in client_companies
await supabase.from('client_companies').insert({
  client_id: 'acme-client-id',
  company_id: 'company-456',
  qualification_status: 'qualify',
  qualified_at: new Date(),
});
```

**Creates**: 1 row in `client_companies` (association table)

---

## Data Architecture Summary

### **Shared Tables** (All clients share)

- `companies` - Global company database
- `jobs` - Global job database
- `people` - Global people database
- `interactions` - Activity logs

### **Client-Specific Tables** (Association/junction tables)

- `client_companies` - Which companies each client qualified
- `client_jobs` - Which jobs each client qualified
- `client_users` - User-client relationships
- `job_filter_configs` - Client's job filtering preferences

### **Setup Tables** (One-time per client)

- `clients` - Client metadata
- `client_users` - Link users to clients

---

## Example: Complete New Client Setup

```typescript
async function setupNewClient(userData: UserData, companyData: CompanyData) {
  // 1. Create client
  const { data: client } = await supabase
    .from('clients')
    .insert({
      name: companyData.name,
      email: userData.email,
      company: companyData.name,
    })
    .select()
    .single();

  // 2. Link user to client
  await supabase.from('client_users').insert({
    client_id: client.id,
    user_id: userData.id,
    role: 'owner',
    is_primary_contact: true,
  });

  // 3. Create default filter config
  await supabase.from('job_filter_configs').insert({
    client_id: client.id,
    user_id: userData.id,
    config_name: 'Default Configuration',
    is_active: true,
  });

  // ✅ Client is now ready to use the app
  // No additional tables created
  // Data flows through existing shared tables
}
```

---

## Benefits of This Architecture

✅ **No Schema Changes**: Adding clients requires zero database migrations  
✅ **Data Deduplication**: Same company can be qualified by multiple clients  
✅ **Easy Scaling**: Can add 1000s of clients without schema changes  
✅ **Fast Queries**: Indexed association tables for performance  
✅ **RLS Protection**: Row-level security ensures data isolation  
✅ **Industry Standard**: Used by Salesforce, HubSpot, Slack, etc.

---

## Summary

**Answer**: You don't create new tables for each client. You create:

1. One row in `clients` table
2. One row in `client_users` table (to link user to client)
3. One optional row in `job_filter_configs` table

Everything else uses the existing shared tables with association entries as needed.

# Client Registration Implementation Guide

**Last Updated:** January 27, 2025  
**Status:** ✅ Implementation Ready

---

## Overview

This guide shows exactly how to add new clients (recruitment agencies) to your multi-tenant CRM system.

## Architecture

### Two-Step Process

1. **User Registration** - Create auth user + user profile
2. **Client Setup** - Create client record + link to user

### Data Flow

```
User Signup → Auth User → User Profile → Client Record → Client Users Link → Job Filter Config
```

## Implementation

### ✅ Current Implementation

**Files:**

- `src/services/clientRegistrationService.ts` - Core registration logic
- `src/components/auth/AuthModal.tsx` - UI form (updated)

### Registration Methods

#### Method 1: Email/Password Sign-Up

```typescript
import { registerNewClient } from '@/services/clientRegistrationService';

const result = await registerNewClient({
  email: 'contact@acme-rec.com',
  password: 'securepassword123',
  name: 'Acme Recruitment',
  companyName: 'Acme Recruiting Agency',
  fullName: 'John Doe',
  industry: 'Technology Recruitment',
  contactPhone: '+1-555-123-4567',
});

if (result.success) {
  console.log('Client registered:', result.client);
  console.log('User profile:', result.userProfile);
} else {
  console.error('Registration failed:', result.error);
}
```

#### Method 2: OAuth Sign-Up (Google/LinkedIn)

```typescript
import { registerClientAfterOAuth } from '@/services/clientRegistrationService';

const result = await registerClientAfterOAuth(
  userId, // From auth response
  email,
  {
    full_name: 'John Doe',
    company: 'Acme Recruiting',
  }
);
```

### What Happens Behind the Scenes

1. **Creates Auth User** - Supabase auth user with email/password
2. **Creates User Profile** - Entry in `user_profiles` table with role 'owner'
3. **Creates Client Record** - Entry in `clients` table with trial tier
4. **Links User to Client** - Entry in `client_users` table
5. **Creates Default Config** - Optional job filter configuration

### Tables Created/Modified

| Table                | Action | Purpose               |
| -------------------- | ------ | --------------------- |
| `auth.users`         | INSERT | User authentication   |
| `user_profiles`      | INSERT | User profile data     |
| `clients`            | INSERT | Client organization   |
| `client_users`       | INSERT | User → Client link    |
| `job_filter_configs` | INSERT | Default filter config |

## UI Implementation

### Using the Auth Modal

The `AuthModal` component now supports full registration:

```typescript
import { AuthModal } from '@/components/auth/AuthModal';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsAuthOpen(true)}>Sign Up</button>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title="Create Your Account"
        description="Start recruiting with AI-powered tools"
      />
    </>
  );
}
```

### Form Fields

**Required:**

- Full Name
- Email
- Password

**Optional:**

- Company Name
- Industry
- Contact Phone
- Professional Headline

## Alternative: Direct Service Call

If you want to create a custom form instead:

```typescript
// src/components/client/ClientRegistrationForm.tsx
import { useState } from 'react';
import { registerNewClient } from '@/services/clientRegistrationService';

export function ClientRegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerNewClient(formData);

    if (result.success) {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Show error
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Register</button>
    </form>
  );
}
```

## Error Handling

The service returns structured results:

```typescript
interface ClientRegistrationResult {
  success: boolean;
  client?: Client;
  userProfile?: UserProfile;
  error?: string;
}
```

**Success:**

```typescript
{
  success: true,
  client: { id, name, ... },
  userProfile: { id, email, full_name, ... }
}
```

**Failure:**

```typescript
{
  success: false,
  error: "Error message here"
}
```

## With Webhooks (Optional)

If you want webhook notifications:

### 1. Create Edge Function

```typescript
// supabase/functions/new-client-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async req => {
  const { client_id, user_id, client_data } = await req.json();

  // Send to external system (Slack, email, etc.)
  await fetch('https://your-webhook-url.com/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'client_registered',
      client_id,
      user_id,
      client_data,
      timestamp: new Date().toISOString(),
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### 2. Call After Registration

```typescript
import { supabase } from '@/integrations/supabase/client';

// After successful registration
if (result.success) {
  // Trigger webhook
  await supabase.functions.invoke('new-client-webhook', {
    body: {
      client_id: result.client.id,
      user_id: result.userProfile.id,
      client_data: result.client,
    },
  });
}
```

## Testing

### Manual Test

```bash
# 1. Open app
npm run dev

# 2. Click "Sign Up"
# 3. Fill form
# 4. Submit
# 5. Check Supabase dashboard for:
#    - auth.users table
#    - user_profiles table
#    - clients table
#    - client_users table
```

### Unit Test

```typescript
// src/services/__tests__/clientRegistrationService.test.ts
import { registerNewClient } from '../clientRegistrationService';

describe('Client Registration', () => {
  it('should create client with valid data', async () => {
    const result = await registerNewClient({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test Client',
      companyName: 'Test Company',
    });

    expect(result.success).toBe(true);
    expect(result.client).toBeDefined();
    expect(result.userProfile).toBeDefined();
  });

  it('should fail with invalid data', async () => {
    const result = await registerNewClient({
      email: '',
      password: '',
      name: '',
      companyName: '',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## Deployment

### Environment Variables

```env
# Already configured for Supabase Auth
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Migrations

No new migrations needed! The required tables already exist:

- `clients`
- `client_users`
- `user_profiles`
- `job_filter_configs`

## Rollback Strategy

If registration fails mid-process, the service automatically cleans up:

```typescript
// Automatic rollback on failure
if (clientError) {
  await supabase.from('user_profiles').delete().eq('id', userId);
  await supabase.auth.admin.deleteUser(userId);
  throw clientError;
}
```

## Summary

✅ **No custom webhooks needed** - Use Supabase database triggers if needed  
✅ **No edge functions required** - Can add for notifications  
✅ **Simple form implementation** - AuthModal already updated  
✅ **Automatic cleanup** - Failed registrations rollback cleanly  
✅ **Multi-tenant ready** - RLS policies enforce isolation

## Next Steps

1. Test the registration flow
2. Customize form fields as needed
3. Add email verification (optional)
4. Implement welcome email (optional)
5. Add webhooks for notifications (optional)

---

**Questions?** Check the main `.cursorrules` file for architecture patterns.

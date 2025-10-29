# Backend Notes - Future Integrations

## Hidden Integrations (Ready to Enable)

### HubSpot Integration

**Status:** Code complete, needs credentials

**Implementation:** Already in codebase

- Location: `src/services/hubspot/`
- UI Component: `src/components/integrations/HubSpotIntegrationCard.tsx`
- Database Schema: `hubspot_connections`, `hubspot_sync_logs`, `hubspot_contact_mappings`, `hubspot_company_mappings`
- Callback Route: `/integrations/callback`

**To Enable:**

1. Create app at https://developers.hubspot.com
2. Add credentials to Vercel:
   - `VITE_HUBSPOT_CLIENT_ID`
   - `VITE_HUBSPOT_CLIENT_SECRET`
3. Uncomment HubSpot integration in `src/components/IntegrationsPage.tsx`
4. Test OAuth flow

**API Endpoints Used:**

- Auth: `https://app.hubspot.com/oauth/authorize`
- Token: `https://api.hubapi.com/oauth/v1/token`
- API Base: `https://api.hubapi.com/crm/v3`

**Scopes Required:**

- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.companies.read`
- `crm.objects.companies.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`

---

### Mailchimp Integration

**Status:** Code complete, using API key method

**Implementation:** Already in codebase

- Location: `src/services/mailchimp/`
- UI Component: `src/components/integrations/MailchimpIntegrationCard.tsx`
- Database Schema: `mailchimp_connections`, `mailchimp_sync_logs`, `mailchimp_subscriber_mappings`
- Authentication: API Key (user enters their own)

**To Enable:**

1. Uncomment Mailchimp integration in `src/components/IntegrationsPage.tsx`
2. Users enter their API key and data center
3. Stores connection in `mailchimp_connections` table

**Alternative: OAuth 2.0 (Future Enhancement)**

- Would require additional implementation
- Auth URL: `https://login.mailchimp.com/oauth2/authorize`
- Token URL: `https://login.mailchimp.com/oauth2/token`
- Better for multi-user scenarios

---

## Current Active Integrations

### Gmail ✅

- Client ID: `431821374966-6g222eg7q4hsish5e8ln7mmh7t72dgc2.apps.googleusercontent.com`
- Callback: `/auth/gmail-callback`
- Status: Production ready

### Google Calendar 🚧

- Not yet implemented
- Would use same Google OAuth client
- Different scopes and API

---

## Backend Services Ready

All integration infrastructure is in place:

- ✅ Database tables with RLS
- ✅ Service layer implementations
- ✅ OAuth callback handlers
- ✅ UI components
- ✅ Connection management
- ✅ Token encryption/storage

Just need credentials to activate HubSpot and Mailchimp UI.

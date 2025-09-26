# LinkedIn OIDC Configuration via Management API

If your Supabase dashboard is showing "API key" instead of "Client ID", you can configure LinkedIn OIDC using the Management API instead.

## Step 1: Get Your Access Token

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Account → Access Tokens
2. Create a new access token
3. Copy the token

## Step 2: Configure LinkedIn OIDC via API

Run this command in your terminal (replace the values):

```bash
# Set your variables
export SUPABASE_ACCESS_TOKEN="your-access-token-here"
export PROJECT_REF="jedfundfhzytpnbjkspn"
export LINKEDIN_CLIENT_ID="your-linkedin-client-id"
export LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

# Configure LinkedIn OIDC
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_linkedin_oidc_enabled": true,
    "external_linkedin_oidc_client_id": "'$LINKEDIN_CLIENT_ID'",
    "external_linkedin_oidc_secret": "'$LINKEDIN_CLIENT_SECRET'"
  }'
```

## Step 3: Verify Configuration

After running the API command, check your Supabase dashboard to see if LinkedIn OIDC is now enabled.

## Alternative: Check LinkedIn App Credentials

If you're still having issues, double-check your LinkedIn app:

1. Go to [LinkedIn Developer Dashboard](https://www.linkedin.com/developers/apps)
2. Select your app
3. Go to **Auth** tab
4. Look for **Client ID** and **Client Secret** (not API key)
5. If you see "API key", you might need to create a new OAuth app

## Troubleshooting

- **If LinkedIn shows "API key"**: This might be an old app. Create a new OAuth app.
- **If Supabase shows "API key"**: Try refreshing the dashboard or use the Management API.
- **If both show correct fields**: The issue might be elsewhere in the configuration.

## Next Steps

Once configured correctly, test the authentication:

1. Run your app: `npm run dev`
2. Click "Sign in with LinkedIn"
3. Complete the OAuth flow
4. Verify user profile creation

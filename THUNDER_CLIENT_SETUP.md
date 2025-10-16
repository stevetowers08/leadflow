# Thunder Client Setup Guide for Empowr CRM

## 🚀 Quick Setup

### 1. Import Collection

1. Open Thunder Client in VS Code/Cursor
2. Click "Collections" tab
3. Click "Import" button
4. Select `thunder-collection-empowr-crm.json` file
5. Collection will be imported with all API endpoints

### 2. Set Up Environment

1. Click "Environments" tab in Thunder Client
2. Select "Development" environment
3. Update the following variables:
   - `accessToken`: Get from Supabase Auth (sign in first)
   - `refreshToken`: Get from Supabase Auth response
   - `userId`: Your user ID from Supabase
   - `companyId`: A company ID for testing
   - `personId`: A person ID for testing
   - `jobId`: A job ID for testing

### 3. Get Authentication Token

1. Run "Sign In User" request in Authentication folder
2. Copy the `access_token` from response
3. Paste it into `accessToken` environment variable
4. Copy `refresh_token` into `refreshToken` variable

## 📋 Available Endpoints

### Authentication

- **Sign Up User**: Create new user account
- **Sign In User**: Authenticate and get tokens
- **Refresh Token**: Refresh access token

### Companies

- **Get All Companies**: List all companies with pagination
- **Create Company**: Add new company
- **Get Company by ID**: Get specific company details
- **Update Company**: Modify company information
- **Delete Company**: Remove company

### People & Leads

- **Get All People/Leads**: List all people with company info
- **Create Person/Lead**: Add new person/lead

### Jobs

- **Get All Jobs**: List all job postings
- **Create Job**: Add new job posting

### User Profiles

- **Get User Profiles**: List all user profiles
- **Create User Profile**: Add new user profile

### Analytics

- **Get Dashboard Analytics**: Get analytics data via RPC

### Frontend

- **Frontend Health Check**: Verify frontend is running

## 🔧 Environment Variables

### Development Environment

- `supabaseUrl`: https://jedfundfhzytpnbjkspn.supabase.co
- `supabaseAnonKey`: (pre-configured)
- `frontendUrl`: http://localhost:8082
- `accessToken`: Your JWT token
- `refreshToken`: Your refresh token
- `userId`: Your user ID
- `companyId`: Company ID for testing
- `personId`: Person ID for testing
- `jobId`: Job ID for testing

### Production Environment

- `supabaseUrl`: https://jedfundfhzytpnbjkspn.supabase.co
- `supabaseAnonKey`: (pre-configured)
- `frontendUrl`: https://empowr-crm.vercel.app
- `accessToken`: Production JWT token
- `refreshToken`: Production refresh token
- `userId`: Your user ID
- `companyId`: Company ID for testing
- `personId`: Person ID for testing
- `jobId`: Job ID for testing

## 🧪 Testing Workflow

### 1. Start Services

```bash
# Start frontend (if not already running)
npm run dev
```

### 2. Test Authentication

1. Run "Sign In User" request
2. Copy tokens to environment variables
3. Test other endpoints

### 3. Test CRUD Operations

1. Create a company
2. Create a person linked to that company
3. Create a job for that company
4. Test updates and deletions

### 4. Test Analytics

1. Run "Get Dashboard Analytics" to see aggregated data

## 🔍 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if `accessToken` is valid and not expired
2. **403 Forbidden**: User doesn't have permission for that operation
3. **404 Not Found**: Resource doesn't exist or wrong ID
4. **500 Server Error**: Check Supabase logs

### Getting Fresh Tokens

1. Run "Sign In User" request
2. Copy new tokens to environment variables
3. Retry failed requests

## 📚 Supabase API Reference

This collection uses Supabase's REST API:

- **Base URL**: `https://jedfundfhzytpnbjkspn.supabase.co`
- **Authentication**: JWT Bearer tokens
- **API Key**: Required in `apikey` header
- **Content Type**: `application/json`

### Query Parameters

- `select`: Specify columns to return
- `limit`: Number of records to return
- `offset`: Number of records to skip
- `eq.column`: Filter by exact match
- `gt.column`: Filter by greater than
- `lt.column`: Filter by less than

### Headers

- `apikey`: Supabase anon key (required)
- `Authorization`: Bearer token (required for protected routes)
- `Content-Type`: application/json
- `Prefer`: return=representation (for POST/PATCH to return created/updated data)

## 🎯 Next Steps

1. **Import the collection** into Thunder Client
2. **Set up environment variables** with your tokens
3. **Test authentication** by signing in
4. **Explore the API** by running different requests
5. **Create test data** to see the full functionality

Happy testing! 🚀


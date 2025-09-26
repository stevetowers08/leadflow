# Empowr CRM - Company Logo System

This CRM application uses **Clearbit Logo API** for automatic company logo fetching and display.

## Features

- ✅ **Clearbit Logo Integration** - Automatic logo fetching from company domains
- ✅ **Fallback System** - Graceful fallback to company initials when logos unavailable
- ✅ **Real-time Logo Updates** - Dynamic logo generation based on company websites
- ✅ **Responsive Design** - Logos display consistently across all screen sizes
- ✅ **Performance Optimized** - Lazy loading and error handling for logo display

## Logo System Architecture

### Clearbit Integration
The application uses [Clearbit Logo API](https://clearbit.com/logo) to automatically fetch company logos:

- **Primary Source**: `https://logo.clearbit.com/{domain}`
- **Automatic Domain Processing**: Removes protocols, www prefixes, and query parameters
- **Fallback Strategy**: Company initials when Clearbit logos unavailable

### Logo Display Sizes
- **Small (32px)**: Dashboard cards, compact views
- **Medium (40px)**: Table rows, standard cards  
- **Large (48px)**: Company listings, detail views
- **Extra Large (64px)**: Headers, modal views

## Database Schema

The `companies` table stores:
- `name` - Company name
- `website` - Company website URL (used for Clearbit logo generation)
- ~~`profile_image_url`~~ - **REMOVED** (now using Clearbit exclusively)

## Logo Implementation

### Frontend Components
- `OptimizedImage.tsx` - Base image component with lazy loading
- `CompanyLogo.tsx` - Company-specific logo component
- Logo fallback system with company initials

### Backend Services
- `logoService.ts` - Clearbit URL generation and validation
- `logoUtils.ts` - Utility functions for logo handling

## Usage Examples

```typescript
// Generate Clearbit logo URL
const logoUrl = `https://logo.clearbit.com/${domain}`;

// In React components
<img 
  src={logoUrl} 
  alt={companyName}
  onError={(e) => {
    // Fallback to initials
    e.currentTarget.style.display = 'none';
  }}
/>
```

## Performance Benefits

- **No Database Storage**: Logos fetched on-demand from Clearbit
- **Automatic Updates**: Logos stay current without manual updates
- **Reduced Storage**: No need to store logo files in database
- **High Availability**: Clearbit's CDN ensures fast logo delivery

## API Limits

- **Clearbit**: Free tier with no authentication required
- **Rate Limiting**: Built-in delays prevent API overwhelming
- **Caching**: Browser caching reduces repeated requests

---

# Empowr MCP Server - Render Deployment

This is a clean MCP server designed for Render deployment with Supabase integration.

## Features

- ✅ Full MCP 2024-11-05 protocol support
- ✅ n8n MCP Client Tool compatibility
- ✅ Server-Sent Events (SSE) support
- ✅ Supabase integration with your CRM data
- ✅ Root POST endpoint for n8n compatibility

## Environment Variables

Set these in your Render dashboard:

```
SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
SUPABASE_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w
```

## Deployment to Render

1. **Create GitHub Repository**
   - Push this code to a GitHub repository

2. **Deploy to Render**
   - Go to [Render.com](https://render.com)
   - Create new "Web Service"
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `node server.js`
   - Add environment variables above

3. **Configure n8n**
   - Use the Render URL as your MCP server endpoint
   - Set Server Transport to "HTTP Streamable"

## Available Tools

- `execute_sql` - Execute SELECT queries on Supabase
- `list_tables` - List available CRM tables
- `get_table_data` - Get data from specific tables

## Endpoints

- `GET /` - Server info
- `POST /` - Root MCP endpoint (for n8n)
- `POST /mcp/initialize` - MCP initialization
- `POST /mcp/tools/list` - List available tools
- `POST /mcp/tools/call` - Execute tools
- `GET /mcp/sse` - Server-Sent Events
- `GET /health` - Health check
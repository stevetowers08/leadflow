# 🚀 Official Supabase MCP Server for n8n - Render Deployment

Based on the [community discussion](https://thinktank.ottomator.ai/t/supabase-mcp-for-n8n/6932), the official Supabase MCP server **DOES work with n8n**!

## ✅ What's Included:
- ✅ **Official Supabase MCP Server** (`@supabase/mcp-server-supabase@latest`)
- ✅ **HTTP wrapper** for n8n compatibility
- ✅ **SSE endpoint** for HTTP Streamable transport
- ✅ **Your Supabase credentials** built-in
- ✅ **All Supabase tools**: database, docs, account, debugging, development, functions

## 🔧 Deploy to Render:

### Step 1: Go to Render
- Visit [render.com](https://render.com)
- Sign up/Login

### Step 2: Create Web Service
- Click "New +" → "Web Service"
- Choose "Build and deploy from a Git repository" OR "Deploy without Git"

### Step 3: Upload Files
- Upload `package.json` and `server.js` files

### Step 4: Configure Service
- **Name**: `supabase-mcp-official`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: `18` or `20`

### Step 5: Environment Variables
Add these in Render dashboard:
```
SUPABASE_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w
SUPABASE_PROJECT_REF=jedfundfhzytpnbjkspn
```

### Step 6: Deploy!
- Click "Create Web Service"
- Wait for deployment to complete
- Get your Render URL (e.g., `https://supabase-mcp-official.onrender.com`)

## 🎯 Configure n8n:
- **MCP Server URL**: Your Render URL
- **Server Transport**: HTTP Streamable
- **SSE Endpoint**: `https://your-app.onrender.com/mcp/sse`

## 🛠️ Available Supabase Tools:
- `list_tables` - List database tables
- `execute_sql` - Execute SQL queries
- `list_projects` - List Supabase projects
- `get_project` - Get project details
- `search_docs` - Search Supabase documentation
- `get_logs` - Get project logs
- `get_advisors` - Get security/performance advisories
- `list_edge_functions` - List Edge Functions
- `deploy_edge_function` - Deploy Edge Functions
- And many more!

## ✅ Based on Community Success:
This configuration is based on the successful setup from the [n8n community discussion](https://thinktank.ottomator.ai/t/supabase-mcp-for-n8n/6932) where users confirmed it works with n8n!

**Ready to deploy the official Supabase MCP server! 🚀**



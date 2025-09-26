# 🚀 DIRECT RENDER DEPLOYMENT - NO GITHUB NEEDED!

## ✅ Files Ready:
- `package.json` - Dependencies and scripts
- `server.js` - Complete MCP server with your Supabase credentials
- `empowr-mcp-server.tar.gz` - Compressed deployment package

## 🔧 Deploy to Render (Manual Upload):

### Step 1: Go to Render
- Visit [render.com](https://render.com)
- Sign up/Login with your account

### Step 2: Create Web Service
- Click "New +" → "Web Service"
- Choose "Build and deploy from a Git repository"
- **OR** Choose "Deploy without Git" (if available)

### Step 3: Upload Files
- Upload `package.json` and `server.js` files
- Or upload the `empowr-mcp-server.tar.gz` and extract

### Step 4: Configure Service
- **Name**: `empowr-mcp-server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: `18` or `20`

### Step 5: Environment Variables
Add these in Render dashboard:
```
SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
SUPABASE_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w
```

### Step 6: Deploy!
- Click "Create Web Service"
- Wait for deployment to complete
- Get your Render URL (e.g., `https://empowr-mcp-server.onrender.com`)

## 🎯 Configure n8n:
- **MCP Server URL**: Your Render URL
- **Server Transport**: HTTP Streamable
- **SSE Endpoint**: `https://your-app.onrender.com/mcp/sse`

## ✅ What's Included:
- ✅ Root POST endpoint for n8n compatibility
- ✅ Full MCP 2024-11-05 protocol
- ✅ Server-Sent Events (SSE) support
- ✅ Your Supabase credentials built-in
- ✅ All CRM tools: execute_sql, list_tables, get_table_data

**No GitHub required! Direct deployment! 🚀**



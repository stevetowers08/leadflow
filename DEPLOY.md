# Deploy Supabase MCP Server to Railway

## Quick Deploy Steps:

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Create new project:**
```bash
railway new
```

4. **Deploy:**
```bash
railway up
```

## Alternative - Use Render:

1. **Create account at render.com**
2. **Connect GitHub repo**
3. **Deploy with these settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `node supabase-mcp-server.js`
   - **Environment Variables:**
     - `PORT=10000`

## Alternative - Use Vercel:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

## Your n8n Settings Will Be:

**Endpoint:** `https://your-deployed-url.railway.app/mcp`
**Transport:** `HTTP`
**Authentication:** `None`



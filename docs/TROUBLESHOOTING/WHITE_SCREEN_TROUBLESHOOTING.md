# White Screen Troubleshooting Guide

This guide documents common white screen issues and their solutions for the Empowr CRM application.

## 🚨 Quick Diagnosis Checklist

If you're experiencing a white screen, run through these checks in order:

### 1. Node.js Version Check
```bash
node -v
```
**Required**: Node.js >= 18 (Vite 5 requirement)

### 2. Environment Variables
Check that `.env` file exists in project root and contains:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=development
```

### 3. Port Configuration
Ensure consistent port usage:
- `vite.config.ts`: `port: 8081, strictPort: true`
- `package.json`: `"dev": "vite --port 8081 --host"`
- Always use `http://localhost:8081/`

### 4. Browser Console Errors
Open DevTools Console and check for:
- Red error messages
- Network tab: main bundle (index-*.js) should return 200
- No "Unexpected token <" errors on JS files

## 🔧 Common Issues & Solutions

### Issue 1: Missing Environment Variables

**Symptoms**: White screen, console shows missing environment variables

**Solution**:
1. Create `.env` file in project root
2. Add required variables with `VITE_` prefix
3. Restart dev server (`npm run dev`)

### Issue 2: Port Conflicts

**Symptoms**: Server runs on different port than expected, white screen on wrong URL

**Solution**:
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Update configurations for consistency
# vite.config.ts: port: 8081, strictPort: true
# package.json: "dev": "vite --port 8081 --host"
```

### Issue 3: Supabase Service Role Key Exposure

**Symptoms**: Console error: "VITE_SUPABASE_SERVICE_ROLE_KEY appears to be invalid"

**Solution**:
- **Never expose service role key client-side**
- Remove `VITE_SUPABASE_SERVICE_ROLE_KEY` from `.env`
- Only use `VITE_SUPABASE_ANON_KEY` for client-side operations
- Service role key is server-side only

### Issue 4: React Context Errors

**Symptoms**: "useAuth must be used within an AuthProvider"

**Solution**:
Ensure hooks are called within proper React context:
```tsx
// ❌ Wrong - hooks outside AuthProvider
const App = () => {
  useGlobalErrorHandler(); // Error!
  usePerformanceMonitoring(); // Error!
  
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

// ✅ Correct - hooks inside AuthProvider
const AppRoutes = () => {
  useGlobalErrorHandler(); // Works!
  usePerformanceMonitoring(); // Works!
  const { user } = useAuth(); // Works!
  
  return <div>...</div>;
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
```

### Issue 5: NODE_ENV Configuration

**Symptoms**: Vite warning about NODE_ENV=production in .env

**Solution**:
```env
# ✅ Correct for development
NODE_ENV=development

# ❌ Wrong for development
NODE_ENV=production
```

## 🛠️ Debugging Steps

### Step 1: Basic Server Test
Create `test.html` in project root:
```html
<!DOCTYPE html>
<html>
<head><title>Server Test</title></head>
<body>
  <h1>Basic HTML Test</h1>
  <p>If you can see this, the server is working!</p>
  <script>console.log('JavaScript is working!');</script>
</body>
</html>
```
Access `http://localhost:8081/test.html` - should display the page.

### Step 2: Environment Variable Test
Create `env-test.html`:
```html
<!DOCTYPE html>
<html>
<head><title>Env Test</title></head>
<body>
  <h1>Environment Test</h1>
  <div id="env-check"></div>
  <script type="module">
    const envCheck = document.getElementById('env-check');
    envCheck.innerHTML = `
      <p>VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ MISSING'}</p>
      <p>VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING'}</p>
    `;
  </script>
</body>
</html>
```

### Step 3: React Component Test
Create `src/debug-main.tsx`:
```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

const DebugApp = () => {
  return (
    <div>
      <h1>🔍 Debug Mode</h1>
      <p>If you can see this, React is working!</p>
      <div>
        <h2>Environment Check:</h2>
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ MISSING'}</p>
        <p>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING'}</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DebugApp />);
}
```

## 🔄 Clean Restart Procedure

When experiencing persistent issues:

1. **Stop all processes**:
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Clear browser storage**:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

3. **Clean Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm install
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

5. **Hard refresh browser**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## 🎯 Supabase Configuration

### Authentication URL Settings
In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `http://localhost:8081/`
- **Additional Redirect URLs**: 
  - `http://localhost:8081`
  - `http://localhost:8081/`

### Environment Variables Security
```env
# ✅ Client-side (safe to expose)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# ❌ Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📝 Error Logging

Enable error logging in `App.tsx`:
```tsx
import { useGlobalErrorHandler, usePerformanceMonitoring } from './hooks';

const AppRoutes = () => {
  // Enable error logging and performance monitoring
  useGlobalErrorHandler();
  usePerformanceMonitoring();
  
  // ... rest of component
};
```

This will log unhandled errors and performance issues to the console.

## 🚀 Prevention Tips

1. **Always use consistent ports** - configure once, use everywhere
2. **Never expose service keys** - use `VITE_` prefix only for client-safe variables
3. **Keep NODE_ENV=development** for local development
4. **Test with simple components first** - isolate React vs environment issues
5. **Check browser console regularly** - errors often appear there first

## 📞 Still Having Issues?

If the white screen persists after following this guide:

1. **Share console errors** - exact error messages from DevTools Console
2. **Check Network tab** - status of main bundle requests
3. **Verify .env contents** - with sensitive values redacted
4. **Confirm Supabase settings** - screenshot of Auth URL configuration
5. **Test with debug files** - use the simple HTML/React test files above

---

*Last updated: January 2025*
*This guide was created after resolving a complex white screen issue involving environment variables, port conflicts, and React context errors.*

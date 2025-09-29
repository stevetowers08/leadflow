# Vercel Deployment Guide - Empowr CRM

## 🎉 Successfully Deployed!

This guide documents the successful deployment of Empowr CRM to Vercel, including solutions for critical React production build issues.

## 🚀 Quick Start

**Production URL:** `https://4twenty-ovu9ty104-polarislabs.vercel.app`

## 🔧 Critical Issues Resolved

### 1. React `unstable_now` Error Fix

**Problem:** Production builds were failing with:
```
Uncaught TypeError: Cannot set properties of undefined (setting 'unstable_now')
```

**Root Cause:** Vite's aggressive production optimizations were interfering with React's internal scheduler initialization.

**Solution:** Conservative Vite build configuration:

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunking
        format: 'es', // Use ES modules format
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020', // Use older target for better compatibility
    minify: false, // Disable minification to prevent React scheduler issues
    esbuild: {
      drop: mode === 'production' ? ['debugger'] : [],
      treeShaking: false, // Disable tree shaking
    },
    sourcemap: true, // Always enable source maps
  },
}));
```

**Key Settings:**
- ✅ **Minification disabled** - Prevents React scheduler issues
- ✅ **Tree shaking disabled** - Keeps all React internals intact
- ✅ **Manual chunking disabled** - Single bundle prevents initialization order issues
- ✅ **ES2020 target** - More compatible JavaScript target
- ✅ **Source maps enabled** - Better debugging

### 2. OAuth Redirect Configuration

**Problem:** OAuth redirects were going to `localhost:3000` instead of production URL.

**Solution:** Update Supabase and Google OAuth configurations:

#### Supabase Configuration
1. **Supabase Dashboard** → Authentication → URL Configuration
2. **Update Site URL** to: `https://your-domain.vercel.app`
3. **Add Redirect URLs**:
   ```
   https://your-domain.vercel.app/**
   https://your-domain.vercel.app/auth/callback
   ```

#### Google OAuth Configuration
1. **Google Cloud Console** → APIs & Services → Credentials
2. **Edit OAuth 2.0 Client ID**
3. **Add Authorized redirect URIs**:
   ```
   https://jedfundfhzytpnbjkspn.supabase.co/auth/v1/callback
   ```

## 📋 Deployment Checklist

### ✅ Completed Steps

1. **React Version Stabilization**
   - ✅ Downgraded to React 18.2.0 (stable version)
   - ✅ Updated all React dependencies to consistent versions
   - ✅ Added package.json resolutions

2. **Build Configuration**
   - ✅ Switched from SWC to regular React plugin
   - ✅ Disabled aggressive optimizations
   - ✅ Configured conservative build settings

3. **Vercel Configuration**
   - ✅ Simplified vercel.json (removed invalid functions config)
   - ✅ Added proper routing for SPA
   - ✅ Configured build command

4. **Environment Variables**
   - ✅ All Supabase variables configured
   - ✅ Google OAuth variables set
   - ✅ GitHub integration configured

5. **OAuth Setup**
   - ✅ Supabase redirect URLs updated
   - ✅ Google OAuth redirect URLs configured
   - ✅ Authentication flow working

## 🛠️ Technical Stack

- **Frontend:** React 18.2.0 + TypeScript
- **Build Tool:** Vite 7.1.7 (conservative settings)
- **Deployment:** Vercel
- **Database:** Supabase
- **Authentication:** Supabase Auth + Google OAuth
- **Styling:** Tailwind CSS

## 🔍 Debugging Notes

### Local vs Production Differences
- **Local dev server** (port 8081): Works perfectly
- **Production build** (Vercel): Required conservative settings

### Key Learnings
1. **React scheduler is sensitive** to build optimizations
2. **Minification can break** React internals
3. **Tree shaking can remove** critical React code
4. **Manual chunking can cause** initialization order issues

## 🚀 Custom Domain Setup

To connect a custom domain from GoDaddy:

1. **Add domain in Vercel Dashboard**
2. **Configure DNS in GoDaddy:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
3. **Update Supabase redirect URLs** to custom domain
4. **Update Google OAuth** redirect URLs

## 📊 Performance Metrics

- **Build Time:** ~9 seconds
- **Bundle Size:** 1,870.78 kB (unminified for stability)
- **Gzip Size:** 355.91 kB
- **Source Maps:** 3,548.14 kB

## 🎯 Next Steps

1. **Monitor performance** with conservative settings
2. **Gradually re-enable optimizations** if needed
3. **Set up custom domain** for production
4. **Configure monitoring** and error tracking

## 📞 Support

If you encounter similar issues:
1. Check React version consistency
2. Verify Vite build configuration
3. Test local vs production differences
4. Review OAuth redirect URLs

---

**Last Updated:** September 28, 2025  
**Status:** ✅ Successfully Deployed and Working

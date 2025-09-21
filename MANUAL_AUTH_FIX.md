# Manual Authentication State Fix

If you don't see the "Clear Authentication State" button, here's how to manually fix the OAuth state issue:

## Method 1: Browser Developer Tools (Recommended)

1. **Open Developer Tools**:
   - Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Go to the **Console** tab

2. **Run this code**:
   ```javascript
   // Clear all Supabase auth data
   localStorage.removeItem('sb-jedfundfhzytpnbjkspn-auth-token');
   localStorage.removeItem('supabase.auth.token');
   localStorage.removeItem('supabase.auth.refresh_token');
   
   // Clear session storage
   sessionStorage.clear();
   
   // Clear any OAuth parameters from URL
   if (window.location.search.includes('error') || window.location.search.includes('state')) {
     window.history.replaceState({}, document.title, window.location.pathname);
   }
   
   console.log('Authentication state cleared! Please refresh the page.');
   ```

3. **Refresh the page** (`F5` or `Ctrl+R`)

## Method 2: Manual Browser Cleanup

1. **Clear Browser Data**:
   - Press `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
   - Select "Cookies and other site data" and "Cached images and files"
   - Choose "All time" and click "Clear data"

2. **Or use Incognito/Private Mode**:
   - Open a new incognito/private window
   - Navigate to your app URL
   - Try Google sign-in again

## Method 3: Check if App Updated

1. **Hard Refresh**:
   - Press `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)
   - This forces a complete reload without cache

2. **Check Network Tab**:
   - Open Developer Tools → Network tab
   - Look for the authentication files loading
   - Make sure you're seeing the latest version

## Method 4: Restart Development Server

If you're running the app locally:

1. **Stop the server**: `Ctrl+C` in terminal
2. **Clear node modules**: `rm -rf node_modules` (optional)
3. **Reinstall**: `npm install` (if you cleared node_modules)
4. **Restart**: `npm run dev`

## What the Button Should Look Like

The "Clear Authentication State" button should appear:
- Below the email/password form
- Above the blue information box
- As an outlined button with "Clear Authentication State" text

## If Still Not Working

1. **Check Console for Errors**: Look for any JavaScript errors
2. **Verify File Updates**: Make sure the FallbackAuth.tsx file was saved
3. **Try Different Browser**: Test in Chrome, Firefox, or Edge
4. **Check Network**: Ensure you're loading the latest files

---

**Quick Fix**: Use Method 1 (Developer Tools) - it's the fastest way to clear the OAuth state and get back to a working authentication flow.


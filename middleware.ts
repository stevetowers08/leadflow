import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Validate environment variables with strict checks (2025 best practice)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidUrl =
    supabaseUrl &&
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0;
  const isValidKey =
    supabaseAnonKey &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0;

  // If environment variables are missing, skip Supabase auth and allow request to proceed
  // This prevents the middleware from crashing the app (2025 best practice)
  if (!isValidUrl || !isValidKey) {
    // In development, log a warning but don't block requests
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ Middleware: Missing Supabase environment variables. Skipping authentication checks.'
      );
    }
    // Allow request to proceed without auth checks
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl.trim(),
    supabaseAnonKey.trim(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Safely get user, handle errors gracefully
  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // If auth check fails, log in development but don't block request
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Middleware: Failed to get user:', error);
    }
  }

  // 2025 Best Practice: Handle homepage redirect at middleware level (fastest, no JS needed)
  // This runs before any React components, providing instant redirect
  if (request.nextUrl.pathname === '/') {
    const redirectUrl = new URL('/companies', request.url);
    // Preserve query params
    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(redirectUrl);
  }

  // Block deprecated dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/companies', request.url));
  }

  // Protect routes that require authentication
  // Only enforce auth if Supabase is properly configured
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/leads') ||
    request.nextUrl.pathname.startsWith('/campaigns') ||
    request.nextUrl.pathname.startsWith('/settings');

  // Allow auth routes and public routes
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/sign-in';

  // Only enforce auth checks if Supabase is configured
  if (isValidUrl && isValidKey) {
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL('/sign-in', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/companies', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

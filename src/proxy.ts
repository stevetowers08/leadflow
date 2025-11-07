import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple proxy for route structure
 * 
 * Note: Authentication is handled client-side by AuthProvider.
 * Supabase uses localStorage for sessions (client-side only),
 * so proxy can't check auth server-side.
 * 
 * This proxy currently allows all routes and lets the
 * client-side AuthProvider handle authentication redirects.
 * This is the simplest approach that works with Supabase's
 * localStorage-based sessions.
 */
export function proxy(request: NextRequest) {
  // Allow all routes - client-side AuthProvider handles authentication
  // This works best with Supabase's localStorage-based sessions
  return NextResponse.next();
}

// Configure which routes this proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};










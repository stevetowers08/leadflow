import { redirect } from 'next/navigation';

/**
 * Homepage Redirect - 2025 Best Practices
 *
 * Architecture (in order of execution):
 * 1. Middleware: Handles redirect at edge/server level (fastest, no JS needed)
 *    - Runs before React, provides instant redirect
 *    - Preserves query parameters
 * 2. Server Component: redirect() as fallback if middleware misses it
 *    - Server-side redirect for SEO and performance
 *    - Note: redirect() throws internally, so this component rarely renders
 *
 * This follows Next.js 16 best practices:
 * - Server-side redirects for SEO and performance
 * - Minimal client-side JavaScript (middleware handles most cases)
 * - Graceful degradation (server component fallback)
 *
 * The middleware should handle 99.9% of cases. This component is a safety net.
 */
export default async function HomeRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Preserve query params when redirecting
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v));
      } else {
        queryString.append(key, value);
      }
    }
  });

  const redirectUrl = queryString.toString()
    ? `/companies?${queryString.toString()}`
    : '/companies';

  // Server-side redirect (Next.js 16 best practice)
  // This is a fallback if middleware doesn't catch it
  // redirect() throws internally to perform the redirect, so code after this won't execute
  redirect(redirectUrl);
}

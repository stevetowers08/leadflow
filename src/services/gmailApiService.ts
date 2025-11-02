/**
 * API Route Handler for Gmail Token Exchange
 * This handles the frontend calls to Supabase Edge Functions
 */

export class GmailApiService {
  private static readonly SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string) {
    // Use Next.js API route instead of Edge Function
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/gmail-auth' 
      : `${this.SUPABASE_URL}/functions/v1/gmail-auth`; // Fallback for SSR
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string) {
    // Use Next.js API route instead of Edge Function
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/gmail-refresh' 
      : `${this.SUPABASE_URL}/functions/v1/gmail-refresh`; // Fallback for SSR
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    return response.json();
  }
}

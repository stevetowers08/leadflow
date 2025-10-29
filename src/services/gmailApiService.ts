/**
 * API Route Handler for Gmail Token Exchange
 * This handles the frontend calls to Supabase Edge Functions
 */

export class GmailApiService {
  private static readonly SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string) {
    const response = await fetch(
      `${this.SUPABASE_URL}/functions/v1/gmail-auth`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ code }),
      }
    );

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
    const response = await fetch(
      `${this.SUPABASE_URL}/functions/v1/gmail-refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    return response.json();
  }
}

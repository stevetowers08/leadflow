import { NextRequest, NextResponse } from 'next/server';

/**
 * Performance analytics endpoint
 * Receives performance metrics from the client-side performance monitor
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // In production, you might want to:
    // 1. Store this data in a database
    // 2. Send to an analytics service
    // 3. Aggregate for reporting
    // For now, we just acknowledge receipt to prevent 405 errors

    // Optional: Log performance data (remove in production if not needed)
    if (process.env.NODE_ENV === 'development') {
      console.debug('Performance metrics received:', {
        url: data.url,
        score: data.score,
        timestamp: data.timestamp,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Silently handle errors - this is non-critical monitoring
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

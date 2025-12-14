import { NextRequest, NextResponse } from 'next/server';

// Campaign sequences removed - not in PDR. This route is disabled.
// Use workflows table instead for email automation per PDR.

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      message:
        'Campaign sequences not available - use workflows table instead per PDR',
      error: 'Feature removed - campaign sequences not in PDR',
    },
    { status: 410 } // 410 Gone - feature removed
  );
}

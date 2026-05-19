import { NextRequest, NextResponse } from 'next/server';
import { searchSchools } from '@/lib/search';
import { SearchParams, UserTier } from '@/lib/types';

export const runtime = 'nodejs';

/**
 * GET /api/schools
 *
 * Query params:
 *   q             — full-text search query
 *   type          — filter by school type
 *   region        — filter by region
 *   state         — filter by state
 *   religiousOrder
 *   enrollmentRange
 *   faithPosture
 *   page          — pagination (default 1)
 *   limit         — results per page (default 12, max 50)
 *
 * Headers (set by your auth middleware):
 *   x-user-tier   — free | individual | premium | agency | enterprise
 *
 * Returns JSON matching SearchResult type.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Read tier from header set by auth middleware (Clerk or similar)
    // Falls back to 'free' for unauthenticated users
    const tier = (req.headers.get('x-user-tier') ?? 'free') as UserTier;

    const params: SearchParams = {
      query: searchParams.get('q') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      region: searchParams.get('region') ?? undefined,
      state: searchParams.get('state') ?? undefined,
      religiousOrder: searchParams.get('religiousOrder') ?? undefined,
      enrollmentRange: searchParams.get('enrollmentRange') ?? undefined,
      faithPosture: searchParams.get('faithPosture') ?? undefined,
      page: parseInt(searchParams.get('page') ?? '1'),
      limit: Math.min(parseInt(searchParams.get('limit') ?? '12'), 50),
    };

    const result = await searchSchools(params, tier);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-store', // User-specific; don't cache at CDN
      },
    });
  } catch (err) {
    console.error('[/api/schools] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

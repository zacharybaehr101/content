import { NextRequest, NextResponse } from 'next/server';
import { searchSchools } from '@/lib/search';
import { UserTier } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = (req.headers.get('x-user-tier') ?? 'free') as UserTier;
    const result = await searchSchools({
      query: searchParams.get('q') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      region: searchParams.get('region') ?? undefined,
      state: searchParams.get('state') ?? undefined,
      religiousOrder: searchParams.get('religiousOrder') ?? undefined,
      page: parseInt(searchParams.get('page') ?? '1'),
      limit: Math.min(parseInt(searchParams.get('limit') ?? '12'), 50),
    }, tier);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/schools]', err);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

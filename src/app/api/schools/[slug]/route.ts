import { NextRequest, NextResponse } from 'next/server';
import { fetchSchoolBySlug } from '@/lib/sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const school = await fetchSchoolBySlug(params.slug);
    if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 });
    return NextResponse.json(school);
  } catch (err) {
    console.error(`[/api/schools/${params.slug}]`, err);
    return NextResponse.json({ error: 'Failed to fetch school' }, { status: 500 });
  }
}import { NextRequest, NextResponse } from 'next/server';
import { fetchSchoolBySlug } from '@/lib/sheets';
import { applyTierMask } from '@/lib/search';
import { UserTier } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/**
 * GET /api/schools/[slug]
 *
 * Returns a single school profile, field-masked by tier.
 *
 * Headers:
 *   x-user-tier — free | individual | premium | agency | enterprise
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tier = (req.headers.get('x-user-tier') ?? 'free') as UserTier;
    const school = await fetchSchoolBySlug(params.slug);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const masked = applyTierMask(school, tier);

    return NextResponse.json(masked);
  } catch (err) {
    console.error(`[/api/schools/${params.slug}] Error:`, err);
    return NextResponse.json(
      { error: 'Failed to fetch school' },
      { status: 500 }
    );
  }
}

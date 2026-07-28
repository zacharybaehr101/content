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
}

import { NextResponse } from 'next/server';
import { fetchFilterOptions } from '@/lib/sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = await fetchFilterOptions();
    return NextResponse.json(options);
  } catch (err) {
    console.error('[/api/schools/filters]', err);
    return NextResponse.json({ error: 'Failed to fetch filter options' }, { status: 500 });
  }
}

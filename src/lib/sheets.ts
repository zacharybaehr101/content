import { School } from './types';

// Your Google Sheet ID — pull from env
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY!;
const SHEET_NAME = 'Sheet1';

// Cache duration: revalidate every 6 hours
export const CACHE_REVALIDATE_SECONDS = 21600;

/**
 * Generates a URL-safe slug from a school name
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Maps a raw CSV/Sheets row array to a typed School object
 * Column order matches the Google Sheet exactly
 */
function rowToSchool(row: string[]): School {
  const get = (i: number) => (row[i] ?? '').trim();

  const name = get(0);
  return {
    id: slugify(name),
    institutionName: name,
    type: get(1),
    religiousOrder: get(2),
    dioceseOrProvince: get(3),
    city: get(4),
    state: get(5),
    region: get(6),
    enrollmentSize: get(7),
    enrollmentRange: get(8),
    websiteUrl: get(9),
    dateAnalyzed: get(10),
    pagesAnalyzed: get(11),
    instagramUrl: get(12),
    facebookUrl: get(13),
    linkedInUrl: get(14),
    twitterUrl: get(15),
    youtubeUrl: get(16),
    tiktokUrl: get(17),
    primarySocialPlatform: get(18),
    heroHeadline: get(19),
    heroMessageType: get(20),
    primaryAudienceFocus: get(21),
    faithIdentityPosture: get(22),
    catholicOrderNamedOnHomepage: get(23),
    strongestPhrase: get(24),
    weakestPatternIdentified: get(25),
    ctaLabels: get(26),
    financialAidLanguagePresent: get(27),
    outcomesPlacementDataShown: get(28),
    studentQuotesPresent: get(29),
    newsEventsFresh: get(30),
    belongingLanguageStrength: get(31),
    prestigeLanguageLevel: get(32),
    serviceJusticeLanguage: get(33),
    navTopLabels: get(34),
    admissionsCtaProminence: get(35),
    visualTheologyImageType: get(36),
    foundersCharismUsedAsLens: get(37),
    mobileFrictionTapsToInquiry: get(38),
    competitiveDifferentiationVsStateSchool: get(39),
    recommendedOutreachAngle: get(40),
  };
}

/**
 * Fetches all schools from Google Sheets via the Sheets API v4.
 * Uses Next.js fetch cache with ISR revalidation.
 *
 * SETUP REQUIRED:
 *   1. Make your Google Sheet publicly readable (Share → Anyone with link → Viewer)
 *   2. Enable Google Sheets API in Google Cloud Console
 *   3. Create an API key (no OAuth needed for public sheets)
 *   4. Add GOOGLE_SHEET_ID and GOOGLE_SHEETS_API_KEY to .env.local
 */
export async function fetchAllSchools(): Promise<School[]> {
  const range = encodeURIComponent(`${SHEET_NAME}!A2:AO`); // Row 2 onward (skip header)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Google Sheets API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values ?? [];

  return rows
    .filter((row) => row[0]?.trim()) // skip empty rows
    .map(rowToSchool);
}

/**
 * Fetches a single school by slug.
 * Reuses the full fetch (cached) and filters client-side.
 */
export async function fetchSchoolBySlug(slug: string): Promise<School | null> {
  const all = await fetchAllSchools();
  return all.find((s) => s.id === slug) ?? null;
}

/**
 * Returns all unique values for a given field — used to build filter dropdowns.
 */
export async function fetchFilterOptions(): Promise<{
  types: string[];
  regions: string[];
  states: string[];
  religiousOrders: string[];
  enrollmentRanges: string[];
  faithPostures: string[];
}> {
  const schools = await fetchAllSchools();

  const unique = (field: keyof School) =>
    [...new Set(schools.map((s) => s[field] as string).filter(Boolean))].sort();

  return {
    types: unique('type'),
    regions: unique('region'),
    states: unique('state'),
    religiousOrders: unique('religiousOrder'),
    enrollmentRanges: unique('enrollmentRange'),
    faithPostures: unique('faithIdentityPosture'),
  };
}

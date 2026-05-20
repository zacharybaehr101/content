import { School } from './types';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY!;
const SHEET_NAME = 'Sheet1';

export const CACHE_REVALIDATE_SECONDS = 21600;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

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
    pagesAnalyzed: get(10),
    instagramUrl: get(11),
    facebookUrl: get(12),
    linkedInUrl: get(13),
    twitterUrl: get(14),
    youtubeUrl: get(15),
    tiktokUrl: get(16),
    primarySocialPlatform: get(17),
    heroHeadline: get(18),
    heroMessageType: get(19),
    primaryAudienceFocus: get(20),
    faithIdentityPosture: get(21),
    catholicOrderNamedOnHomepage: get(22),
    strongestPhrase: get(23),
    weakestPatternIdentified: get(24),
    ctaLabels: get(25),
    financialAidLanguagePresent: get(26),
    outcomesPlacementDataShown: get(27),
    studentQuotesPresent: get(28),
    newsEventsFresh: get(29),
    belongingLanguageStrength: get(30),
    prestigeLanguageLevel: get(31),
    serviceJusticeLanguage: get(32),
    navTopLabels: get(33),
    admissionsCtaProminence: get(34),
    visualTheologyImageType: get(35),
    foundersCharismUsedAsLens: get(36),
    mobileFrictionTapsToInquiry: get(37),
    competitiveDifferentiationVsStateSchool: get(38),
    recommendedOutreachAngle: get(39),
    // Deep analysis columns (Sheet 2 merged in — columns 40 onward)
    // Skip col 40 (duplicate Name) and 41 (duplicate Institution Name)
    deepPageType: get(42),
    deepPageUrl: get(43),
    deepHeroHeadline: get(44),
    deepPrimaryMessage: get(45),
    deepCtaLabels: get(46),
    deepKeyPhrases: get(47),
    deepNotableStrengths: get(48),
    deepNotableGaps: get(49),
    deepVisualTheologyNote: get(50),
    deepNarrativeAnalysis: get(51),
    dateAnalyzed: '',
  };
}

export async function fetchAllSchools(): Promise<School[]> {
  const range = encodeURIComponent(`${SHEET_NAME}!A2:Z1000`);
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
    .filter((row) => row[0]?.trim())
    .map(rowToSchool);
}

export async function fetchSchoolBySlug(slug: string): Promise<School | null> {
  const all = await fetchAllSchools();
  return all.find((s) => s.id === slug) ?? null;
}

/**
 * Fetches all admissions page analyses from the "Admissions" tab.
 * Returns a map of slugified institution name → AdmissionsAnalysis
 * for fast lookup on school profile pages.
 */
export async function fetchAdmissionsData(): Promise<Map<string, import('./types').AdmissionsAnalysis>> {
  const range = encodeURIComponent(`Admissions!A2:K`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    console.error(`Admissions sheet error: ${res.status}`);
    return new Map();
  }

  const data = await res.json();
  const rows: string[][] = data.values ?? [];
  const map = new Map<string, import('./types').AdmissionsAnalysis>();

  for (const row of rows) {
    const get = (i: number) => (row[i] ?? '').trim();
    const name = get(0);
    if (!name) continue;
    map.set(slugify(name), {
      institutionName: name,
      pageType: get(1),
      pageUrl: get(2),
      heroHeadline: get(3),
      primaryMessage: get(4),
      ctaLabels: get(5),
      keyPhrases: get(6),
      notableStrengths: get(7),
      opportunities: get(8),
      visualTheologyNote: get(9),
      narrativeAnalysis: get(10),
    });
  }

  return map;
}

export async function fetchFilterOptions() {
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

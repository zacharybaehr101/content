import { School, AdmissionsAnalysis } from './types';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY!;

// Tab names — override via env vars if you rename tabs
const TAB_HOME = process.env.SHEET_TAB_HOME ?? 'Home';
const TAB_ADMISSIONS = process.env.SHEET_TAB_ADMISSIONS ?? 'Admissions';

export const CACHE_REVALIDATE_SECONDS = 21600;

// ─── Generic fetcher ──────────────────────────────────────────────────────────
// All sheet reads go through here. Returns [] on any error — never throws.
async function fetchSheet(tab: string, range = 'A2:AZ'): Promise<string[][]> {
  if (!SHEET_ID || !API_KEY) {
    console.error('Missing GOOGLE_SHEET_ID or GOOGLE_SHEETS_API_KEY env vars');
    return [];
  }

  const fullRange = encodeURIComponent(`${tab}!${range}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${fullRange}?key=${API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: CACHE_REVALIDATE_SECONDS } });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheets API error [${tab}!${range}]: ${res.status} — ${body}`);
      return [];
    }

    const data = await res.json();
    return (data.values ?? []) as string[][];
  } catch (err) {
    console.error(`Sheets fetch exception [${tab}!${range}]:`, err);
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(name: string): string {
  return name.toLowerCase()
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

// ─── Public API ───────────────────────────────────────────────────────────────
export async function fetchAllSchools(): Promise<School[]> {
  const rows = await fetchSheet(TAB_HOME);
  return rows.filter(row => row[0]?.trim()).map(rowToSchool);
}

export async function fetchSchoolBySlug(slug: string): Promise<School | null> {
  const all = await fetchAllSchools();
  return all.find(s => s.id === slug) ?? null;
}

export async function fetchAdmissionsData(): Promise<Map<string, AdmissionsAnalysis>> {
  const rows = await fetchSheet(TAB_ADMISSIONS, 'A2:K');
  const map = new Map<string, AdmissionsAnalysis>();

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
    [...new Set(schools.map(s => s[field] as string).filter(Boolean))].sort();

  return {
    types: unique('type'),
    regions: unique('region'),
    states: unique('state'),
    religiousOrders: unique('religiousOrder'),
    enrollmentRanges: unique('enrollmentRange'),
    faithPostures: unique('faithIdentityPosture'),
  };
}

import { School, AdmissionsAnalysis, FullSiteAnalysis, StudentLifeAnalysis, AcademicsAnalysis } from './types';

const SHEET_ID  = process.env.GOOGLE_SHEET_ID!;
const API_KEY   = process.env.GOOGLE_SHEETS_API_KEY!;

const TAB_HOME         = process.env.SHEET_TAB_HOME          ?? 'Home';
const TAB_ADMISSIONS   = process.env.SHEET_TAB_ADMISSIONS    ?? 'Admissions';
const TAB_FULL_SITE    = process.env.SHEET_TAB_FULL_SITE     ?? 'Full Site';
const TAB_STUDENT_LIFE = process.env.SHEET_TAB_STUDENT_LIFE  ?? 'Student Life';
const TAB_ACADEMICS    = process.env.SHEET_TAB_ACADEMICS     ?? 'Academics';

export const CACHE_REVALIDATE_SECONDS = 21600;

async function fetchSheet(tab: string, range = 'A2:AZ'): Promise<string[][]> {
  if (!SHEET_ID || !API_KEY) { console.error('Missing Sheet env vars'); return []; }
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`${tab}!${range}`)}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: CACHE_REVALIDATE_SECONDS } });
    if (!res.ok) { console.error(`Sheets [${tab}]: ${res.status} — ${await res.text()}`); return []; }
    return ((await res.json()).values ?? []) as string[][];
  } catch (err) { console.error(`Sheets exception [${tab}]:`, err); return []; }
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function toMap<T>(rows: string[][], mapper: (row: string[]) => T): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    const name = (row[0] ?? '').trim();
    if (!name) continue;
    map.set(slugify(name), mapper(row));
  }
  return map;
}

function rowToSchool(row: string[]): School {
  const get = (i: number) => (row[i] ?? '').trim();
  const name = get(0);
  return {
    id: slugify(name),
    institutionName: name,
    type: get(1), religiousOrder: get(2), dioceseOrProvince: get(3),
    city: get(4), state: get(5), region: get(6),
    enrollmentSize: get(7), enrollmentRange: get(8), websiteUrl: get(9),
    pagesAnalyzed: get(10), instagramUrl: get(11), facebookUrl: get(12),
    linkedInUrl: get(13), twitterUrl: get(14), youtubeUrl: get(15),
    tiktokUrl: get(16), primarySocialPlatform: get(17), heroHeadline: get(18),
    heroMessageType: get(19), primaryAudienceFocus: get(20), faithIdentityPosture: get(21),
    catholicOrderNamedOnHomepage: get(22), strongestPhrase: get(23),
    weakestPatternIdentified: get(24), ctaLabels: get(25),
    financialAidLanguagePresent: get(26), outcomesPlacementDataShown: get(27),
    studentQuotesPresent: get(28), newsEventsFresh: get(29),
    belongingLanguageStrength: get(30), prestigeLanguageLevel: get(31),
    serviceJusticeLanguage: get(32), navTopLabels: get(33),
    admissionsCtaProminence: get(34), visualTheologyImageType: get(35),
    foundersCharismUsedAsLens: get(36), mobileFrictionTapsToInquiry: get(37),
    competitiveDifferentiationVsStateSchool: get(38), recommendedOutreachAngle: get(39),
    // Deep analysis flag — add "Deep Analysis" column after col 39 in your sheet
    deepAnalysisAvailable: get(40).toLowerCase() === 'yes',
    // Deep analysis content fields start at col 41
    deepPageType: get(41), deepPageUrl: get(42), deepHeroHeadline: get(43),
    deepPrimaryMessage: get(44), deepCtaLabels: get(45), deepKeyPhrases: get(46),
    deepNotableStrengths: get(47), deepNotableGaps: get(48),
    deepVisualTheologyNote: get(49), deepNarrativeAnalysis: get(50),
    dateAnalyzed: '',
  };
}

export async function fetchAllSchools(): Promise<School[]> {
  const rows = await fetchSheet(TAB_HOME);
  return rows.filter(r => r[0]?.trim()).map(rowToSchool);
}

export async function fetchSchoolBySlug(slug: string): Promise<School | null> {
  const all = await fetchAllSchools();
  return all.find(s => s.id === slug) ?? null;
}

export async function fetchFullSiteData(): Promise<Map<string, FullSiteAnalysis>> {
  const rows = await fetchSheet(TAB_FULL_SITE, 'A2:Q');
  return toMap(rows, r => {
    const g = (i: number) => (r[i] ?? '').trim();
    return {
      institutionName: g(0), identityOrder: g(1), homepageUrl: g(2),
      featuredArtUrl: g(3), pagesEvaluated: g(4), linksToEvaluatedPages: g(5),
      socialMediaEvaluated: g(6),
      // Lead with narrative (col 16), then structured fields
      narrative: g(16),
      overallThemeTone: g(7), catholicFactor: g(8), headlineStrategy: g(9),
      visualStorytelling: g(10), outcomeRoiFocus: g(11), navigationEaseOfUse: g(12),
      conversionStrategy: g(13), socialStrategy: g(14), whatToSteal: g(15),
    };
  });
}

export async function fetchAdmissionsData(): Promise<Map<string, AdmissionsAnalysis>> {
  const rows = await fetchSheet(TAB_ADMISSIONS, 'A2:K');
  return toMap(rows, r => {
    const g = (i: number) => (r[i] ?? '').trim();
    return {
      institutionName: g(0), pageType: g(1), pageUrl: g(2), heroHeadline: g(3),
      primaryMessage: g(4), ctaLabels: g(5), keyPhrases: g(6),
      notableStrengths: g(7), opportunities: g(8), visualTheologyNote: g(9),
      narrativeAnalysis: g(10),
    };
  });
}

export async function fetchStudentLifeData(): Promise<Map<string, StudentLifeAnalysis>> {
  const rows = await fetchSheet(TAB_STUDENT_LIFE, 'A2:J');
  return toMap(rows, r => {
    const g = (i: number) => (r[i] ?? '').trim();
    return {
      institutionName: g(0), identityOrder: g(1), overallThemeTone: g(2),
      catholicFactor: g(3), headlineStrategy: g(4), visualStorytelling: g(5),
      belongingCommunityFocus: g(6), navigationEaseOfUse: g(7),
      engagementConversionStrategy: g(8), whatToSteal: g(9),
    };
  });
}

export async function fetchAcademicsData(): Promise<Map<string, AcademicsAnalysis>> {
  const rows = await fetchSheet(TAB_ACADEMICS, 'A2:H');
  return toMap(rows, r => {
    const g = (i: number) => (r[i] ?? '').trim();
    return {
      institutionName: g(0), affiliationHeritage: g(1),
      strategicPositioningCoreMessaging: g(2), primaryContentModules: g(3),
      visualDesignLayoutStrategy: g(4), colorPaletteTypography: g(5),
      ctasNavigationPrompts: g(6), notableFeaturesDifferentiators: g(7),
    };
  });
}

export async function fetchFilterOptions() {
  const schools = await fetchAllSchools();
  const unique = (field: keyof School) =>
    [...new Set(schools.map(s => s[field] as string).filter(Boolean))].sort();
  return {
    types: unique('type'), regions: unique('region'), states: unique('state'),
    religiousOrders: unique('religiousOrder'), enrollmentRanges: unique('enrollmentRange'),
    faithPostures: unique('faithIdentityPosture'),
  };
}

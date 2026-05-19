import { School, SearchParams, SearchResult, UserTier, FREE_FIELDS, INDIVIDUAL_FIELDS, PREMIUM_FIELDS } from './types';
import { fetchAllSchools } from './sheets';

// Search limits per tier per month
export const SEARCH_LIMITS: Record<UserTier, number> = {
  free: 3,
  individual: 30,
  premium: 150,
  agency: 500,
  enterprise: Infinity,
};

// Pages of data accessible per tier
export const PAGE_ACCESS: Record<UserTier, string[]> = {
  free: ['Homepage'],
  individual: ['Homepage', 'Admissions', 'Academics', 'Faith & Mission'],
  premium: ['Homepage', 'Admissions', 'Academics', 'Faith & Mission', 'Student Life'],
  agency: ['All pages'],
  enterprise: ['All pages, unlimited'],
};

/**
 * Strips a school object down to only the fields allowed for a given tier.
 */
export function applyTierMask(school: School, tier: UserTier): Partial<School> {
  let allowedFields: (keyof School)[];

  if (tier === 'free') {
    allowedFields = FREE_FIELDS;
  } else if (tier === 'individual') {
    allowedFields = INDIVIDUAL_FIELDS;
  } else {
    // premium, agency, enterprise — full access
    allowedFields = PREMIUM_FIELDS;
  }

  return Object.fromEntries(
    allowedFields.map((field) => [field, school[field]])
  ) as Partial<School>;
}

/**
 * Full-text + field search with filtering.
 * Returns paginated, tier-masked results.
 */
export async function searchSchools(
  params: SearchParams,
  tier: UserTier = 'free'
): Promise<SearchResult> {
  const {
    query = '',
    type,
    region,
    religiousOrder,
    state,
    enrollmentRange,
    faithPosture,
    page = 1,
    limit = 12,
  } = params;

  const all = await fetchAllSchools();

  let filtered = all.filter((school) => {
    // Full-text search across key text fields
    if (query) {
      const q = query.toLowerCase();
      const searchable = [
        school.institutionName,
        school.heroHeadline,
        school.strongestPhrase,
        school.city,
        school.state,
        school.religiousOrder,
        school.recommendedOutreachAngle,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    // Filters
    if (type && school.type !== type) return false;
    if (region && school.region !== region) return false;
    if (state && school.state !== state) return false;
    if (religiousOrder && school.religiousOrder !== religiousOrder) return false;
    if (enrollmentRange && school.enrollmentRange !== enrollmentRange) return false;
    if (faithPosture && school.faithIdentityPosture !== faithPosture) return false;

    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  // Apply tier field mask
  const schools = paginated.map((s) => applyTierMask(s, tier));

  return {
    schools,
    total,
    page,
    totalPages,
    tier,
  };
}

/**
 * Returns 2–3 schools for side-by-side comparison.
 * Full data for premium+, masked for lower tiers.
 */
export async function compareSchools(
  slugs: string[],
  tier: UserTier = 'free'
): Promise<Partial<School>[]> {
  if (slugs.length < 2 || slugs.length > 3) {
    throw new Error('Compare requires 2 or 3 schools');
  }

  const all = await fetchAllSchools();
  const found = slugs
    .map((slug) => all.find((s) => s.id === slug))
    .filter(Boolean) as School[];

  return found.map((s) => applyTierMask(s, tier));
}

/**
 * Highlights which fields are locked for a given tier,
 * useful for showing upgrade prompts in the UI.
 */
export function getLockedFields(tier: UserTier): (keyof School)[] {
  if (tier === 'premium' || tier === 'agency' || tier === 'enterprise') return [];

  const unlocked = tier === 'free' ? FREE_FIELDS : INDIVIDUAL_FIELDS;
  return PREMIUM_FIELDS.filter((f) => !unlocked.includes(f));
}

import { School, SearchParams, SearchResult, UserTier } from './types';
import { fetchAllSchools } from './sheets';

export const SEARCH_LIMITS: Record<UserTier, number> = {
  free: 3, starter: 30, team: 150, agency: -1,
};

export async function searchSchools(
  params: SearchParams,
  tier: UserTier = 'free'
): Promise<SearchResult> {
  const { query = '', type, region, religiousOrder, state, page = 1, limit = 12 } = params;
  const all = await fetchAllSchools();

  const filtered = all.filter(school => {
    if (query) {
      const q = query.toLowerCase();
      const searchable = [
        school.institutionName, school.heroHeadline, school.strongestPhrase,
        school.city, school.state, school.religiousOrder, school.deepNarrativeAnalysis,
      ].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (type && school.type !== type) return false;
    if (region && school.region !== region) return false;
    if (state && school.state !== state) return false;
    if (religiousOrder && school.religiousOrder !== religiousOrder) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return { schools: paginated, total, page, totalPages, tier };
}

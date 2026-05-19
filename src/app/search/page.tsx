import { searchSchools } from '@/lib/search';
import { fetchFilterOptions } from '@/lib/sheets';

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: string;
    region?: string;
    state?: string;
    religiousOrder?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [result, filters] = await Promise.all([
    searchSchools({
      query: searchParams.q,
      type: searchParams.type,
      region: searchParams.region,
      state: searchParams.state,
      religiousOrder: searchParams.religiousOrder,
      page: parseInt(searchParams.page ?? '1'),
      limit: 12,
    }, 'free'),
    fetchFilterOptions(),
  ]);

  const hasFilters = searchParams.q || searchParams.type || searchParams.region || searchParams.state || searchParams.religiousOrder;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Search header */}
      <div style={{ background: 'var(--navy)', padding: '2.5rem 0 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 400, fontStyle: 'italic', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
            Search the <span style={{ fontWeight: 600, fontStyle: 'normal' }}>database</span>
          </h1>

          {/* Search bar */}
          <form method="GET" action="/search">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q}
                placeholder='Search by school name, phrase, headline, keyword…'
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', whiteSpace: 'nowrap' }}>
                Search →
              </button>
            </div>

            {/* Filter row */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              paddingBottom: '1rem',
              borderBottom: '0.5px solid rgba(255,255,255,0.1)',
            }}>
              <FilterSelect name="type" label="Type" value={searchParams.type} options={filters.types} />
              <FilterSelect name="region" label="Region" value={searchParams.region} options={filters.regions} />
              <FilterSelect name="state" label="State" value={searchParams.state} options={filters.states} />
              <FilterSelect name="religiousOrder" label="Religious Order" value={searchParams.religiousOrder} options={filters.religiousOrders} />
              {hasFilters && (
                <a href="/search" style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-faint)',
                  padding: '6px 10px', letterSpacing: '0.06em',
                }}>
                  Clear all ×
                </a>
              )}
            </div>
          </form>

          {/* Results count */}
          <div style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
              {result.total} {result.total === 1 ? 'school' : 'schools'} found
              {searchParams.q ? ` for "${searchParams.q}"` : ''}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>
              Free plan · 3 searches/mo ·{' '}
              <a href="/pricing" style={{ color: 'var(--parchment-dark)' }}>Upgrade →</a>
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: '2rem' }}>
        {result.schools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ink-light)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No schools found</p>
            <p style={{ fontSize: '0.88rem' }}>Try a different search term or clear your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {result.schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}

        {/* Upgrade gate */}
        <div style={{
          marginTop: '3rem',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, var(--navy), var(--red))',
          }} />
          <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.75rem' }}>
            Free plan · 3 searches remaining
          </p>
          <h3 style={{ marginBottom: '0.75rem' }}>Unlock the full database</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-mid)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Individual plan gives you 30 searches/month, verbatim phrases, CTA labels, outcomes data, and CSV export.
          </p>
          <a href="/pricing" className="btn btn-primary">See plans & pricing →</a>
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
            {result.page > 1 && (
              <a href={`/search?${new URLSearchParams({ ...searchParams, page: String(result.page - 1) })}`} className="btn btn-outline">← Prev</a>
            )}
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: 'var(--ink-light)', padding: '0 12px' }}>
              Page {result.page} of {result.totalPages}
            </span>
            {result.page < result.totalPages && (
              <a href={`/search?${new URLSearchParams({ ...searchParams, page: String(result.page + 1) })}`} className="btn btn-outline">Next →</a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ name, label, value, options }: {
  name: string;
  label: string;
  value?: string;
  options: string[];
}) {
  return (
    <select name={name} defaultValue={value ?? ''} style={{
      background: value ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
      border: `1px solid ${value ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
      borderRadius: 'var(--radius)',
      padding: '6px 28px 6px 10px',
      fontSize: '0.75rem',
      color: value ? '#fff' : 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--font-body)',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
    }}>
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function SchoolCard({ school }: { school: Record<string, any> }) {
  return (
    <a href={`/school/${school.id}`} style={{
      display: 'block',
      background: 'var(--white)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      textDecoration: 'none',
      transition: 'border-color 0.15s',
    }}>
      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {school.type && (
          <span className="tag tag-red" style={{ fontSize: '0.65rem' }}>
            {school.type.includes('High School') ? 'High School' : 'University'}
          </span>
        )}
        {school.region && <span className="tag" style={{ fontSize: '0.65rem' }}>{school.region}</span>}
        {school.religiousOrder && school.religiousOrder !== 'N/A' && school.religiousOrder !== 'N/A (Diocesan)' && (
          <span className="tag tag-navy" style={{ fontSize: '0.65rem' }}>{school.religiousOrder.split('(')[0].trim()}</span>
        )}
      </div>

      {/* Name */}
      <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
        {school.institutionName}
      </h3>

      {/* Hero headline */}
      {school.heroHeadline && (
        <p style={{
          fontSize: '0.8rem',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          color: 'var(--ink-mid)',
          borderLeft: '2px solid var(--red)',
          paddingLeft: '10px',
          marginBottom: '12px',
          lineHeight: 1.5,
        }}>
          "{school.heroHeadline.replace(/^"|"$/g, '').slice(0, 90)}{school.heroHeadline.length > 90 ? '…' : ''}"
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--ink-faint)' }}>
          {school.city && school.state ? `${school.city}, ${school.state}` : ''}
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {school.belongingLanguageStrength && (
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: '3px',
              background: school.belongingLanguageStrength === 'Strong' ? 'var(--navy-light)' : 'var(--parchment-mid)',
              color: school.belongingLanguageStrength === 'Strong' ? 'var(--navy)' : 'var(--ink-light)',
              fontWeight: 600,
            }}>
              {school.belongingLanguageStrength}
            </span>
          )}
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--navy)', letterSpacing: '0.03em' }}>→</span>
        </div>
      </div>
    </a>
  );
}

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

export const dynamic = 'force-dynamic';

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
      <div style={{ background: 'var(--navy)', padding: '2.5rem 0 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontWeight: 400, fontStyle: 'italic', fontSize: '2.25rem', marginBottom: '1.5rem' }}>
            Search the <span style={{ fontWeight: 600, fontStyle: 'normal' }}>database</span>
          </h1>

          <form method="GET" action="/search">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search by school name, phrase, headline, keyword…"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius)',
                  padding: '12px 18px',
                  fontSize: '1rem',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                Search →
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
              <FilterSelect name="type" label="Type" value={searchParams.type} options={filters.types} />
              <FilterSelect name="region" label="Region" value={searchParams.region} options={filters.regions} />
              <FilterSelect name="state" label="State" value={searchParams.state} options={filters.states} />
              <FilterSelect name="religiousOrder" label="Religious Order" value={searchParams.religiousOrder} options={filters.religiousOrders} />
              {hasFilters && (
                <a href="/search" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-faint)', padding: '6px 10px' }}>
                  Clear all ×
                </a>
              )}
            </div>
          </form>

          <div style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--ink-faint)' }}>
              {result.total} {result.total === 1 ? 'school' : 'schools'} found
              {searchParams.q ? ` for "${searchParams.q}"` : ''}
            </span>
            <span style={{ fontSize: '0.88rem', color: 'var(--ink-faint)' }}>
              Free plan · 3 searches/mo ·{' '}
              <a href="/pricing" style={{ color: 'var(--parchment-dark)' }}>Upgrade →</a>
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem' }}>
        {result.schools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ink-light)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No schools found</p>
            <p style={{ fontSize: '1rem' }}>Try a different search term or clear your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {result.schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.75rem' }}>
            Free plan · 3 searches remaining
          </p>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Unlock the full database</h3>
          <p style={{ fontSize: '1rem', color: 'var(--ink-mid)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Individual plan gives you 30 searches/month, verbatim phrases, CTA labels, outcomes data, and CSV export.
          </p>
          <a href="/pricing" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>See plans & pricing →</a>
        </div>

        {result.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
            {result.page > 1 && (
              <a href={`/search?${new URLSearchParams({ ...searchParams, page: String(result.page - 1) })}`} className="btn btn-outline">← Prev</a>
            )}
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', color: 'var(--ink-light)', padding: '0 12px' }}>
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
    <select
      name={name}
      defaultValue={value ?? ''}
      style={{
        background: '#ffffff',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 'var(--radius)',
        padding: '8px 32px 8px 12px',
        fontSize: '0.9rem',
        color: '#1a2744',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%231a2744'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        minWidth: '120px',
      }}
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function SchoolCard({ school }: { school: Record<string, any> }) {
  return (
    <a href={`/school/${school.id}`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textDecoration: 'none' }}>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {school.type && (
          <span className="tag tag-red" style={{ fontSize: '0.75rem' }}>
            {school.type.includes('High School') ? 'High School' : 'University'}
          </span>
        )}
        {school.region && <span className="tag" style={{ fontSize: '0.75rem' }}>{school.region}</span>}
        {school.religiousOrder && school.religiousOrder !== 'N/A' && school.religiousOrder !== 'N/A (Diocesan)' && (
          <span className="tag tag-navy" style={{ fontSize: '0.75rem' }}>{school.religiousOrder.split('(')[0].trim()}</span>
        )}
      </div>

      <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
        {school.institutionName}
      </h3>

      {school.heroHeadline && (
        <p style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-mid)', borderLeft: '2px solid var(--red)', paddingLeft: '10px', marginBottom: '14px', lineHeight: 1.5 }}>
          &ldquo;{school.heroHeadline.replace(/^"|"$/g, '').slice(0, 90)}{school.heroHeadline.length > 90 ? '…' : ''}&rdquo;
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
          {school.city && school.state ? `${school.city}, ${school.state}` : ''}
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {school.belongingLanguageStrength && (
            <span style={{ fontSize: '0.78rem', padding: '3px 8px', borderRadius: '3px', background: school.belongingLanguageStrength === 'Strong' ? 'var(--navy-light)' : 'var(--parchment-mid)', color: school.belongingLanguageStrength === 'Strong' ? 'var(--navy)' : 'var(--ink-light)', fontWeight: 600 }}>
              {school.belongingLanguageStrength}
            </span>
          )}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>→</span>
        </div>
      </div>
    </a>
  );
}

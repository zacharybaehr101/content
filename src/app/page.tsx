import { fetchAllSchools, fetchFilterOptions } from '@/lib/sheets';
import { School } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let schools: School[] = [];
  let filters = { regions: [] as string[], types: [] as string[], states: [] as string[], religiousOrders: [] as string[], enrollmentRanges: [] as string[], faithPostures: [] as string[] };

  try {
    [schools, filters] = await Promise.all([fetchAllSchools(), fetchFilterOptions()]);
  } catch (err) {
    console.error('Homepage data error:', err);
  }

  const totalSchools = schools.length;
  const highSchools = schools.filter(s => s.type?.includes('High School')).length;
  const universities = schools.filter(s => s.type?.includes('University')).length;
  const featured = schools.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'var(--parchment)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 0 4rem',
      }}>
        <div className="container">
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '1px', background: 'var(--red)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)' }}>
                Catholic School Intelligence
              </span>
            </div>
            <h1 style={{ marginBottom: '1.25rem', fontStyle: 'italic', fontWeight: 400 }}>
              See how the best Catholic schools<br />
              <span style={{ fontWeight: 600, fontStyle: 'normal' }}>tell their story.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--ink-mid)', marginBottom: '2rem', maxWidth: '520px' }}>
              Search, compare, and learn from the words, images, and messaging strategies of {totalSchools}+ Catholic schools — high schools and universities across the country.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/search" className="btn btn-primary" style={{ fontSize: '0.78rem' }}>
                Search the database →
              </a>
              <a href="/pricing" className="btn btn-outline" style={{ fontSize: '0.78rem' }}>
                View pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--navy)', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { value: totalSchools, label: 'Schools analyzed' },
              { value: highSchools, label: 'High schools' },
              { value: universities, label: 'Universities' },
              { value: filters.regions.length, label: 'Regions covered' },
              { value: '41', label: 'Data points per school' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#fff', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '3rem' }}>
            <h2>What's in the database</h2>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)', marginBottom: '4px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                label: 'Website Copy',
                items: ['Hero headlines (verbatim)', 'CTA labels & placement', 'Navigation structure', 'Admissions language'],
              },
              {
                label: 'Messaging Strategy',
                items: ['Faith identity posture', 'Audience focus', 'Belonging vs. prestige signals', 'Strongest & weakest phrases'],
              },
              {
                label: 'Visual & UX',
                items: ['Image theology & style', 'Mobile friction score', 'Admissions CTA prominence', "Founder's charism deployment"],
              },
              {
                label: 'Strategic Analysis',
                items: ['Differentiation vs. state schools', 'Recommended outreach angle', 'Financial aid language audit', 'Social platform presence'],
              },
            ].map(({ label, items }) => (
              <div key={label} style={{
                background: 'var(--white)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}>
                <div style={{
                  fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1rem',
                }}>{label}</div>
                {items.map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.88rem', color: 'var(--ink-mid)',
                    padding: '5px 0',
                    borderBottom: '0.5px solid var(--border-light)',
                  }}>
                    <span style={{ color: 'var(--navy)', fontSize: '0.7rem' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured schools */}
      <section style={{ padding: '0 0 5rem', background: 'var(--parchment-mid)' }}>
        <div className="container" style={{ paddingTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
            <h2>From the database</h2>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)', marginBottom: '4px' }} />
            <a href="/search" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', whiteSpace: 'nowrap' }}>View all →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {featured.map(school => (
              <a key={school.id} href={`/school/${school.id}`} style={{
                display: 'block',
                background: 'var(--white)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--navy)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
              }}
              >
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className="tag tag-red">{school.type?.includes('High School') ? 'High School' : 'University'}</span>
                  <span className="tag">{school.region}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--navy)' }}>{school.institutionName}</h3>
                {school.heroHeadline && (
                  <p style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    color: 'var(--ink-mid)',
                    borderLeft: '2px solid var(--red)',
                    paddingLeft: '10px',
                    marginBottom: '12px',
                    lineHeight: 1.5,
                  }}>
                    "{school.heroHeadline.replace(/^"|"$/g, '').slice(0, 100)}{school.heroHeadline.length > 100 ? '…' : ''}"
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>{school.city}, {school.state}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--navy)', letterSpacing: '0.04em' }}>View profile →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '560px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to see what works?</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ink-mid)' }}>
            Start free with 3 searches per month — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/signup" className="btn btn-primary">Start for free →</a>
            <a href="/pricing" className="btn btn-outline">See all plans</a>
          </div>
        </div>
      </section>
    </>
  );
}

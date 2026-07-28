import { fetchAllSchools, fetchFullSiteData } from '@/lib/sheets';
import { hasValue } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Full Analysis — CampusVox',
  description: 'Deep multi-page content analysis for Catholic schools.',
};

export default async function AnalysisPage() {
  const [schools, fullSiteMap] = await Promise.all([fetchAllSchools(), fetchFullSiteData()]);
  const deepSchools = schools.filter(s => s.deepAnalysisAvailable);

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', letterSpacing: '0.08em' }}>Premium Profiles</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.75rem' }}>Full Analysis</h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '580px', lineHeight: 1.7 }}>
            {deepSchools.length} Catholic schools with complete multi-page analysis — homepage, admissions, student life, academics, full site, and social media.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--parchment-mid)', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--ink-mid)' }}>{deepSchools.length} fully-analyzed schools</span>
          <a href="/submit" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--red)', textDecoration: 'none' }}>+ Submit your school</a>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {deepSchools.map(school => {
            const fs = fullSiteMap.get(school.id);
            return (
              <a key={school.id} href={`/school/${school.id}`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', marginTop: '6px' }}>
                  <span className="tag tag-red" style={{ fontSize: '0.68rem' }}>Full Analysis</span>
                  <span className="tag" style={{ fontSize: '0.68rem' }}>{school.region}</span>
                  {hasValue(school.religiousOrder) && <span className="tag tag-navy" style={{ fontSize: '0.68rem' }}>{school.religiousOrder.split('(')[0].trim()}</span>}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>{school.institutionName}</h3>
                {fs?.narrative && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {fs.narrative.slice(0, 120)}…
                  </p>
                )}
                {fs?.whatToSteal && (
                  <div style={{ background: 'var(--navy-light)', borderRadius: 'var(--radius)', padding: '8px 10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>What to steal</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--navy)', lineHeight: 1.5 }}>{fs.whatToSteal.slice(0, 80)}…</p>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>{school.city}, {school.state}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>View full profile →</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

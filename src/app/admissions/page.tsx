import { fetchAdmissionsData } from '@/lib/sheets';
import { hasValue } from '@/lib/format';
import { AdmissionsAnalysis } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admissions Pages — Catholic School Marketing Intelligence',
  description: 'See how Catholic colleges and universities present their admissions pages. Hero headlines, CTAs, key phrases, and full narrative analysis.',
};

export default async function AdmissionsPage() {
  const admissionsMap = await fetchAdmissionsData();
  const schools = Array.from(admissionsMap.entries());

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--red)' }}>Browse by Topic</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            Admissions Pages
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.7 }}>
            See how {schools.length} Catholic colleges present their admissions experience — what they say, how they say it, and what&apos;s working.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--parchment-mid)', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--ink-mid)' }}>{schools.length} schools analyzed</span>
          <a href="/submit" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--red)', textDecoration: 'none' }}>+ Submit your school</a>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        {schools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--ink-light)' }}>No admissions data yet. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {schools.map(([slug, data]) => (
              <AdmissionsCard key={slug} slug={slug} data={data} />
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>Want the full admissions picture?</h3>
          <p style={{ fontSize: '1rem', color: 'var(--ink-mid)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Individual plan unlocks complete admissions analysis plus homepage, academics, and faith & mission pages.
          </p>
          <a href="/pricing" className="btn btn-primary">See plans & pricing →</a>
        </div>
      </div>
    </div>
  );
}

function AdmissionsCard({ slug, data }: { slug: string; data: AdmissionsAnalysis }) {
  return (
    <a href={`/school/${slug}?tab=admissions`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textDecoration: 'none' }}>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <span className="tag tag-red" style={{ fontSize: '0.72rem' }}>Admissions</span>
        {hasValue(data.pageType) && <span className="tag" style={{ fontSize: '0.72rem' }}>{data.pageType}</span>}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '10px' }}>
        {data.institutionName}
      </h3>
      {hasValue(data.heroHeadline) && (
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '2px solid var(--red)', paddingLeft: '10px', marginBottom: '12px', lineHeight: 1.4 }}>
          {data.heroHeadline.replace(/^"|"$/g, '').slice(0, 80)}{data.heroHeadline.length > 80 ? '…' : ''}
        </div>
      )}
      {hasValue(data.narrativeAnalysis) && (
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.65, marginBottom: '12px' }}>
          {data.narrativeAnalysis.slice(0, 120)}…
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {hasValue(data.notableStrengths) && (
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', maxWidth: '75%' }}>
            ✓ {data.notableStrengths.slice(0, 55)}{data.notableStrengths.length > 55 ? '…' : ''}
          </span>
        )}
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', marginLeft: 'auto' }}>View →</span>
      </div>
    </a>
  );
}

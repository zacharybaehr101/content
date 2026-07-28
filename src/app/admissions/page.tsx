import { fetchAdmissionsData } from '@/lib/sheets';
import { hasValue } from '@/lib/format';
import { AdmissionsAnalysis } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Admissions Pages — CampusVox',
  description: 'How Catholic colleges present their admissions pages — hero headlines, CTAs, key phrases, and narrative analysis.',
};

export default async function AdmissionsPage() {
  const map = await fetchAdmissionsData();
  const schools = Array.from(map.entries());

  return <BrowsePage
    title="Admissions Pages"
    subtitle={`${schools.length} Catholic schools — admissions page content, CTAs, key phrases, and narrative analysis.`}
    tab="admissions"
    count={schools.length}
    items={schools.map(([slug, d]) => ({
      slug, name: d.institutionName,
      headline: d.heroHeadline, summary: d.narrativeAnalysis,
      strength: d.notableStrengths, tag: d.pageType,
    }))}
  />;
}

function BrowsePage({ title, subtitle, tab, count, items }: {
  title: string; subtitle: string; tab: string; count: number;
  items: { slug: string; name: string; headline?: string; summary?: string; strength?: string; tag?: string }[];
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', letterSpacing: '0.08em' }}>Browse by Topic</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.75rem' }}>{title}</h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '580px', lineHeight: 1.7 }}>{subtitle}</p>
        </div>
      </div>

      <div style={{ background: 'var(--parchment-mid)', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--ink-mid)' }}>{count} schools analyzed</span>
          <a href="/submit" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--red)', textDecoration: 'none' }}>+ Submit your school</a>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {items.map(item => (
            <a key={item.slug} href={`/school/${item.slug}?tab=${tab}`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span className="tag tag-red" style={{ fontSize: '0.68rem' }}>{title.replace(' Pages', '').replace(' Analysis', '')}</span>
                {item.tag && hasValue(item.tag) && <span className="tag" style={{ fontSize: '0.68rem' }}>{item.tag}</span>}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>{item.name}</h3>
              {item.headline && hasValue(item.headline) && (
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '2px solid var(--red)', paddingLeft: '10px', marginBottom: '10px', lineHeight: 1.4 }}>
                  {item.headline.replace(/^"|"$/g, '').slice(0, 80)}{item.headline.length > 80 ? '…' : ''}
                </div>
              )}
              {item.summary && hasValue(item.summary) && (
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: '10px' }}>
                  {item.summary.slice(0, 110)}…
                </p>
              )}
              {item.strength && hasValue(item.strength) && (
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
                  ✓ {item.strength.slice(0, 60)}{item.strength.length > 60 ? '…' : ''}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>View →</span>
              </div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '3rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>Want the full picture?</h3>
          <p style={{ fontSize: '1rem', color: 'var(--ink-mid)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Starter plan unlocks all content tabs, the Inspiration Finder, and your personal Pinboard.
          </p>
          <a href="/pricing" className="btn btn-primary">See plans & pricing →</a>
        </div>
      </div>
    </div>
  );
}

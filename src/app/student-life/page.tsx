import { fetchStudentLifeData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Student Life — CampusVox',
  description: 'How Catholic schools present student life — belonging, community, Catholic identity, and engagement strategy.',
};

export default async function StudentLifePage() {
  const map = await fetchStudentLifeData();
  const schools = Array.from(map.entries());

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', letterSpacing: '0.08em' }}>Browse by Topic</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.75rem' }}>Student Life</h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '580px', lineHeight: 1.7 }}>
            {schools.length} Catholic schools — how they present belonging, community, Catholic identity, and student engagement.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {schools.map(([slug, d]) => (
            <a key={slug} href={`/school/${slug}?tab=studentlife`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span className="tag tag-red" style={{ fontSize: '0.68rem' }}>Student Life</span>
                {d.identityOrder && <span className="tag tag-navy" style={{ fontSize: '0.68rem' }}>{d.identityOrder.split('(')[0].trim()}</span>}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>{d.institutionName}</h3>
              {d.belongingCommunityFocus && (
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '2px solid var(--red)', paddingLeft: '10px', marginBottom: '10px', lineHeight: 1.4 }}>
                  {d.belongingCommunityFocus.slice(0, 90)}…
                </div>
              )}
              {d.whatToSteal && (
                <div style={{ background: 'var(--navy-light)', borderRadius: 'var(--radius)', padding: '8px 10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>What to steal</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--navy)', lineHeight: 1.5 }}>{d.whatToSteal.slice(0, 80)}…</p>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>View →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

import { fetchAllSchools, fetchFilterOptions, fetchAdmissionsData } from '@/lib/sheets';
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

  // Featured: pick 3 schools with good data spread
  const withHeadline = schools.filter(s => s.heroHeadline && s.heroHeadline.length > 10);
  const featured = [
    withHeadline[2] ?? schools[2],
    withHeadline[5] ?? schools[5],
    withHeadline[10] ?? schools[10],
  ].filter(Boolean);

  return (
    <>
      {/* Hero — full width image, text flush left */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '460px', position: 'relative', overflow: 'hidden' }}>
          <img src="/hero.png" alt="Catholic school campus with students" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,39,68,0.92) 45%, rgba(26,39,68,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingLeft: 'max(2rem, calc((100vw - 1200px) / 2 + 2rem))', maxWidth: '620px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '1px', background: 'var(--red)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                  Catholic School Intelligence
                </span>
              </div>
              <h1 style={{ marginBottom: '1rem', fontWeight: 600, color: '#fff', fontSize: 'clamp(1.9rem, 3.5vw, 3rem)', lineHeight: 1.1 }}>
                See how the best Catholic schools tell their story.
              </h1>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)', marginBottom: '1.75rem', maxWidth: '460px', lineHeight: 1.7 }}>
                Search, compare, and learn from the messaging strategies of {totalSchools > 0 ? `${totalSchools}+` : '100+'} Catholic schools.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="/search" className="btn btn-primary" style={{ fontSize: '0.88rem', background: 'var(--red)', borderColor: 'var(--red)' }}>Search the database →</a>
                <a href="/pricing" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', padding: '10px 20px', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 'var(--radius)', textDecoration: 'none' }}>View pricing</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--navy)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { value: totalSchools || '100+', label: 'Schools analyzed' },
              { value: highSchools || '38', label: 'High schools' },
              { value: universities || '64', label: 'Universities' },
              { value: filters.regions.length || '14', label: 'Regions covered' },
              { value: '41', label: 'Data points per school' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginTop: '3px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-hero: Search. Compare. Learn. + Video */}
      <section style={{ padding: '3.5rem 0', background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left: value props */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)' }}>How it works</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', marginBottom: '2rem', lineHeight: 1.15 }}>
                Search. Compare. Learn.
              </h2>
              {[
                { icon: '🔍', label: 'Search', desc: 'Find any Catholic school by name, phrase, religious order, region, or messaging style.' },
                { icon: '⚖️', label: 'Compare', desc: 'See how schools differ in faith posture, belonging language, CTA strategy, and visual theology.' },
                { icon: '💡', label: 'Learn', desc: 'Read full narrative analysis and apply what works to your own school\'s communications.' },
              ].map(({ icon, label, desc }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--navy-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem', marginBottom: '3px' }}>{label}</div>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-mid)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <a href="/search" className="btn btn-primary" style={{ marginTop: '0.5rem', fontSize: '0.88rem' }}>Start searching →</a>
            </div>

            {/* Right: video */}
            <div>
              <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', display: 'block', borderRadius: '10px' }}
                >
                  <source src="/home_page_embed.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside — 3 columns, tighter */}
      <section style={{ padding: '3rem 0', background: 'var(--parchment-mid)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.4rem', whiteSpace: 'nowrap' }}>Inside every profile</h2>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              {
                label: 'Website & Copy',
                items: ['Hero headlines (verbatim)', 'CTA labels & placement', 'Nav structure', 'Admissions language', 'Faith identity posture'],
              },
              {
                label: 'Messaging Intelligence',
                items: ['Audience focus', 'Belonging vs. prestige signals', 'Strongest phrases', 'Key phrase collection', 'Narrative full analysis'],
              },
              {
                label: 'Visual & Strategy',
                items: ['Image theology & style', 'Mobile friction score', 'Founder\'s charism use', 'Financial aid signals', 'Social platform presence'],
              },
            ].map(({ label, items }) => (
              <div key={label} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.1rem 1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.75rem' }}>{label}</div>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.88rem', color: 'var(--ink-mid)', padding: '4px 0', borderBottom: '0.5px solid var(--border-light)' }}>
                    <span style={{ color: 'var(--navy)', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured profiles — rotate through homepage, admissions, linkedin */}
      <section style={{ padding: '3rem 0 4rem', background: 'var(--parchment)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Sample profiles</h2>
            <div style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
            <a href="/search" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--red)', whiteSpace: 'nowrap', textDecoration: 'none' }}>View all →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.1rem' }}>
            {/* Homepage profile card */}
            {featured[0] && (
              <a href={`/school/${featured[0].id}`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.35rem', textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  <span className="tag tag-red" style={{ fontSize: '0.68rem' }}>Homepage</span>
                  <span className="tag" style={{ fontSize: '0.68rem' }}>{featured[0].region}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>{featured[0].institutionName}</h3>
                {featured[0].heroHeadline && (
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '2px solid var(--red)', paddingLeft: '10px', marginBottom: '10px', lineHeight: 1.4 }}>
                    {featured[0].heroHeadline.replace(/^"|"$/g, '').slice(0, 80)}{featured[0].heroHeadline.length > 80 ? '…' : ''}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>{featured[0].city}, {featured[0].state}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>View profile →</span>
                </div>
              </a>
            )}

            {/* Admissions card */}
            {featured[1] && (
              <a href={`/school/${featured[1].id}?tab=admissions`} style={{ display: 'block', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.35rem', textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  <span className="tag tag-navy" style={{ fontSize: '0.68rem' }}>Admissions</span>
                  <span className="tag" style={{ fontSize: '0.68rem' }}>{featured[1].region}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>{featured[1].institutionName}</h3>
                {featured[1].deepPrimaryMessage && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {featured[1].deepPrimaryMessage.slice(0, 100)}…
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>{featured[1].city}, {featured[1].state}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)' }}>View admissions →</span>
                </div>
              </a>
            )}

            {/* LinkedIn coming soon card */}
            <a href="/linkedin" style={{ display: 'block', background: 'var(--navy)', border: '0.5px solid var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.35rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '2px 7px', borderRadius: '3px' }}>LinkedIn</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--red)', color: '#fff', padding: '2px 7px', borderRadius: '3px' }}>Coming soon</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>LinkedIn Content Analysis</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--parchment-dark)', lineHeight: 1.6, marginBottom: '10px' }}>
                See how top Catholic schools use LinkedIn — content themes, story types, post frequency, and what drives engagement.
              </p>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--parchment-dark)' }}>Get notified →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0', textAlign: 'center', background: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.75rem' }}>Ready to see what works?</h2>
          <p style={{ marginBottom: '1.75rem', color: 'var(--ink-mid)', fontSize: '1rem' }}>
            Start free — 3 searches per month, no credit card required.
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

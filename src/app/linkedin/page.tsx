export const metadata = {
  title: 'LinkedIn Profiles — Catholic School Marketing Intelligence',
  description: 'Coming soon: See how Catholic schools use LinkedIn to share stories, engage alumni, and build brand presence.',
};

export default function LinkedInPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--red)' }}>Browse by Topic</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            LinkedIn Profiles
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.7 }}>
            Coming soon — analysis of how Catholic schools use LinkedIn to share stories, engage alumni, and build brand presence.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '5rem 2rem', maxWidth: '600px' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />

          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>LinkedIn analysis is coming</h2>
          <p style={{ color: 'var(--ink-mid)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '1rem' }}>
            We are building out LinkedIn profile analysis for Catholic schools — covering content types, story themes, post frequency, engagement style, and what the top performers are doing differently.
          </p>
          <p style={{ color: 'var(--ink-mid)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '1rem' }}>
            Subscribe below to be notified when it launches. Individual plan subscribers get early access.
          </p>

          <form action="/api/subscribe" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto' }}>
            <input type="hidden" name="interest" value="linkedin" />
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', fontSize: '1rem', fontFamily: 'var(--font-body)', color: 'var(--ink)', background: 'var(--parchment)' }}
            />
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '0.9rem' }}>
              Notify me when it launches →
            </button>
          </form>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-light)', marginBottom: '0.75rem' }}>In the meantime, explore what we have:</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/search" className="btn btn-outline">Browse all schools</a>
            <a href="/admissions" className="btn btn-outline">Admissions pages</a>
          </div>
        </div>
      </div>
    </div>
  );
}

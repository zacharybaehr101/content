export const metadata = { title: 'Sign In — CampusVox' };

export default function LoginPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--parchment-mid)' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', width: '100%', maxWidth: '420px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>Campus</span><span style={{ color: 'var(--navy)', fontWeight: 600 }}>Vox</span>
          </a>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sign in</h1>
          <p style={{ color: 'var(--ink-mid)', fontSize: '0.9rem' }}>Access your CampusVox account</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '5px' }}>Email</label>
            <input type="email" placeholder="you@school.org" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.95rem', fontFamily: 'var(--font-body)', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '5px' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.95rem', fontFamily: 'var(--font-body)', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ background: 'var(--navy-light)', borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--navy)', lineHeight: 1.6 }}>
              Full authentication coming soon. <a href="/signup" style={{ color: 'var(--red)', fontWeight: 600 }}>Sign up to join the waitlist →</a>
            </p>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
          No account? <a href="/signup" style={{ color: 'var(--red)', fontWeight: 600 }}>Get access →</a>
        </p>
      </div>
    </div>
  );
}

export const metadata = { title: 'Get Access — CampusVox' };

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', background: 'var(--parchment-mid)' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--navy), var(--red))' }} />
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>Campus</span><span style={{ color: 'var(--navy)', fontWeight: 600 }}>Vox</span>
            </a>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Get access</h1>
            <p style={{ color: 'var(--ink-mid)', fontSize: '0.95rem' }}>Start free — no credit card required</p>
          </div>

          <form action="/api/subscribe" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="hidden" name="interest" value="signup" />
            {[
              { label: 'Your name', name: 'name', type: 'text', placeholder: 'First and last name', required: true },
              { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@school.org', required: true },
              { label: 'School or organization', name: 'organization', type: 'text', placeholder: 'e.g. Benet Academy', required: false },
            ].map(f => (
              <div key={f.name}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '5px' }}>
                  {f.label}{f.required && <span style={{ color: 'var(--red)', marginLeft: '3px' }}>*</span>}
                </label>
                <input type={f.type} name={f.name} required={f.required} placeholder={f.placeholder} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.95rem', color: 'var(--ink)', background: 'var(--parchment)', fontFamily: 'var(--font-body)', boxSizing: 'border-box' as const }} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '0.95rem', padding: '12px', marginTop: '0.5rem' }}>
              Create free account →
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            {['3 free searches per month', 'Homepage analysis for all schools', 'No credit card required'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--ink-mid)', marginBottom: '6px' }}>
                <span style={{ color: 'var(--navy)', fontWeight: 700 }}>✓</span>{item}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
            Already have an account? <a href="/login" style={{ color: 'var(--red)', fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
          Want full access? <a href="/pricing" style={{ color: 'var(--navy)' }}>See all plans →</a>
        </p>
      </div>
    </div>
  );
}

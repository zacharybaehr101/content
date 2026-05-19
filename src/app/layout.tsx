import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SchoolContent — Catholic School Marketing Intelligence',
    template: '%s — SchoolContent',
  },
  description: 'Search, compare, and analyze how 100+ Catholic schools use their websites, social media, and news stories to promote enrollment. The definitive marketing intelligence database for Catholic school communications professionals.',
  keywords: [
    'Catholic school marketing',
    'Catholic school communications',
    'school enrollment marketing',
    'Catholic high school website analysis',
    'Catholic university marketing intelligence',
    'school admissions messaging',
    'Catholic school branding',
    'enrollment marketing benchmarking',
  ],
  authors: [{ name: 'SchoolContent' }],
  creator: 'SchoolContent',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://content-mu.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'SchoolContent',
    title: 'SchoolContent — Catholic School Marketing Intelligence',
    description: 'See how 100+ Catholic schools tell their story. Search hero headlines, CTAs, faith messaging, and strategic analysis across high schools and universities.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SchoolContent — Catholic School Marketing Intelligence',
    description: 'See how 100+ Catholic schools tell their story. Search, compare, and benchmark school marketing.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  const navLinkStyle = {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--parchment-dark)',
    padding: '6px 12px',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <header style={{ background: 'var(--navy)', borderBottom: '1px solid var(--navy-mid)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '1rem' }}>
        
        {/* Logo */}
        <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--parchment)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>School</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>Content</span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
          <a href="/search" style={navLinkStyle}>Search</a>

          {/* Browse dropdown */}
          <div style={{ position: 'relative' }} className="browse-dropdown">
            <button style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Browse ▾
            </button>
            <div className="dropdown-menu" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px',
              minWidth: '200px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 200,
              display: 'none',
            }}>
              {[
                { label: 'All Schools', href: '/search', desc: 'Homepage analysis' },
                { label: 'Admissions Pages', href: '/admissions', desc: 'Admissions content' },
                { label: 'LinkedIn Profiles', href: '/linkedin', desc: 'Social content' },
                { label: 'Submit Your School', href: '/submit', desc: 'Add to database' },
              ].map(({ label, href, desc }) => (
                <a key={href} href={href} style={{ display: 'block', padding: '8px 12px', borderRadius: 'var(--radius)', textDecoration: 'none', marginBottom: '2px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-light)' }}>{desc}</div>
                </a>
              ))}
            </div>
          </div>

          <a href="/pricing" style={navLinkStyle}>Pricing</a>
          <a href="/login" style={{ ...navLinkStyle, marginLeft: '4px', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius)' }}>Sign in</a>
          <a href="/signup" style={{ ...navLinkStyle, marginLeft: '4px', background: 'var(--red)', color: '#fff', border: '1.5px solid var(--red)', borderRadius: 'var(--radius)' }}>Get Access</a>
        </nav>
      </div>

      {/* Dropdown CSS — pure CSS hover, no JS needed */}
      <style>{`
        .browse-dropdown:hover .dropdown-menu { display: block !important; }
        .dropdown-menu a:hover { background: var(--parchment-mid); }
      `}</style>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer style={{ background: 'var(--navy)', borderTop: '1px solid var(--navy-mid)', padding: '3rem 0', marginTop: '6rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--parchment)', marginBottom: '8px' }}>
            <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>School</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>Content</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)', maxWidth: '280px', lineHeight: 1.6 }}>
            Catholic school marketing intelligence — see how the best schools tell their story.
          </p>
          {/* Email signup */}
          <form action="/api/subscribe" method="POST" style={{ marginTop: '1rem', display: 'flex', gap: '6px' }}>
            <input type="email" name="email" placeholder="Your email" required style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-body)', width: '200px' }} />
            <button type="submit" style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Subscribe
            </button>
          </form>
        </div>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { heading: 'Browse', links: [
              { label: 'All Schools', href: '/search' },
              { label: 'Admissions Pages', href: '/admissions' },
              { label: 'LinkedIn Profiles', href: '/linkedin' },
              { label: 'Submit Your School', href: '/submit' },
            ]},
            { heading: 'Product', links: [
              { label: 'Pricing', href: '/pricing' },
              { label: 'Sign In', href: '/login' },
              { label: 'Get Access', href: '/signup' },
            ]},
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '10px' }}>{heading}</p>
              {links.map(l => (
                <a key={l.label} href={l.href} style={{ display: 'block', fontSize: '0.88rem', color: 'var(--parchment-dark)', marginBottom: '6px', textDecoration: 'none' }}>{l.label}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>© {new Date().getFullYear()} SchoolContent. All rights reserved.</p>
      </div>
    </footer>
  );
}

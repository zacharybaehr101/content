import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CampusVox — Digital Content Analysis for Catholic Schools',
    template: '%s — CampusVox',
  },
  description: 'CampusVox is the digital content analysis platform for Catholic schools. Search, compare, and benchmark how 100+ Catholic high schools and universities use their websites, admissions pages, and social media to promote enrollment.',
  keywords: [
    'Catholic school digital content analysis',
    'Catholic school marketing intelligence',
    'Catholic school communications',
    'Catholic high school website analysis',
    'Catholic university admissions messaging',
    'school enrollment marketing benchmarking',
    'Catholic school branding analysis',
    'CampusVox',
  ],
  authors: [{ name: 'CampusVox' }],
  creator: 'CampusVox',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://getcampusvox.com'),
  openGraph: {
    type: 'website',
    siteName: 'CampusVox',
    title: 'CampusVox — Digital Content Analysis for Catholic Schools',
    description: 'Search, compare, and analyze how 100+ Catholic schools tell their story online. The definitive content analysis platform for Catholic school communicators.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusVox — Digital Content Analysis for Catholic Schools',
    description: 'The digital content analysis platform for Catholic schools. Search, compare, and benchmark.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}} />
          </>
        )}
      </head>
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '0.5rem' }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', flexShrink: 0, gap: '2px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1 }}>
            Campus<span style={{ color: 'var(--red)' }}>Vox</span>
          </span>
          <span style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', lineHeight: 1 }}>
            Digital Content Analysis for Catholic Schools
          </span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          <a href="/search" style={navLinkStyle}>Search</a>

          {/* Browse dropdown */}
          <div style={{ position: 'relative' }} className="browse-dropdown">
            <button style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Browse ▾
            </button>
            <div className="dropdown-menu" style={{
              position: 'absolute', top: '100%', left: 0,
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '6px',
              minWidth: '210px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 200, display: 'none',
            }}>
              {[
                { label: 'All Schools', href: '/search', desc: 'Homepage analysis' },
                { label: 'Admissions Pages', href: '/admissions', desc: 'Admissions content' },
                { label: 'LinkedIn Profiles', href: '/linkedin', desc: 'Social content' },
                { label: 'Submit Your School', href: '/submit', desc: 'Add to database' },
              ].map(({ label, href, desc }) => (
                <a key={href} href={href} style={{ display: 'block', padding: '8px 12px', borderRadius: 'var(--radius)', textDecoration: 'none', marginBottom: '2px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink-light)' }}>{desc}</div>
                </a>
              ))}
            </div>
          </div>

          <a href="/pricing" style={navLinkStyle}>Pricing</a>
          <a href="/login" style={{ ...navLinkStyle, marginLeft: '4px', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius)' }}>Sign in</a>
          <a href="/signup" style={{ ...navLinkStyle, marginLeft: '4px', background: 'var(--red)', color: '#fff', border: '1.5px solid var(--red)', borderRadius: 'var(--radius)' }}>Get Access</a>
        </nav>
      </div>

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
        <div style={{ maxWidth: '300px' }}>
          {/* Logo */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#fff', fontWeight: 600 }}>
              Campus<span style={{ color: 'var(--red)' }}>Vox</span>
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px' }}>
            Digital Content Analysis for Catholic Schools
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            Search, compare, and benchmark how Catholic schools tell their story online.
          </p>
          <form action="/api/subscribe" method="POST" style={{ display: 'flex', gap: '6px' }}>
            <input type="email" name="email" placeholder="Your email" required style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-body)', width: '185px' }} />
            <button type="submit" style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
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
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '10px' }}>{heading}</p>
              {links.map(l => (
                <a key={l.label} href={l.href} style={{ display: 'block', fontSize: '0.88rem', color: 'var(--parchment-dark)', marginBottom: '6px', textDecoration: 'none' }}>{l.label}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>© {new Date().getFullYear()} CampusVox. All rights reserved.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="https://www.linkedin.com/company/campusvox/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-faint)', display: 'flex', alignItems: 'center' }} aria-label="CampusVox on LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <p style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>getcampusvox.com</p>
        </div>
      </div>
    </footer>
  );
}

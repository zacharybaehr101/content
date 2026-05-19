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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
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
  return (
    <header style={{
      background: 'var(--navy)',
      borderBottom: '1px solid var(--navy-mid)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          color: 'var(--parchment)',
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}>
          <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>School</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>Content</span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { label: 'Search', href: '/search' },
            { label: 'Compare', href: '/compare' },
            { label: 'Pricing', href: '/pricing' },
          ].map(({ label, href }) => (
            <a key={href} href={href} style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--parchment-dark)',
              padding: '6px 12px',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
            }}>
              {label}
            </a>
          ))}
          <a href="/login" style={{
            marginLeft: '8px',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--parchment)',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            textDecoration: 'none',
          }}>
            Sign in
          </a>
          <a href="/signup" style={{
            marginLeft: '4px',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            background: 'var(--red)',
            border: '1.5px solid var(--red)',
            textDecoration: 'none',
          }}>
            Get access
          </a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer style={{
      background: 'var(--navy)',
      borderTop: '1px solid var(--navy-mid)',
      padding: '3rem 0',
      marginTop: '6rem',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--parchment)',
            marginBottom: '8px',
          }}>
            <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>School</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>Content</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', maxWidth: '280px', lineHeight: 1.6 }}>
            Catholic school marketing intelligence — see how the best schools tell their story.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { heading: 'Product', links: ['Search', 'Compare', 'Pricing', 'API'] },
            { heading: 'Company', links: ['About', 'Blog', 'Contact'] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '10px' }}>{heading}</p>
              {links.map(l => (
                <a key={l} href={`/${l.toLowerCase()}`} style={{ display: 'block', fontSize: '0.82rem', color: 'var(--parchment-dark)', marginBottom: '6px', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>© {new Date().getFullYear()} SchoolContent. All rights reserved.</p>
      </div>
    </footer>
  );
}

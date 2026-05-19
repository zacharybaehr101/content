import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SchoolContent — Catholic School Marketing Intelligence',
  description: 'Search, compare, and learn from how Catholic schools use their websites, social media, and news stories to promote enrollment.',
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
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--parchment-dark)')}
            >
              {label}
            </a>
          ))}
          <a href="/login" className="btn btn-outline" style={{
            marginLeft: '8px',
            color: 'var(--parchment)',
            borderColor: 'rgba(255,255,255,0.25)',
            fontSize: '0.72rem',
          }}>
            Sign in
          </a>
          <a href="/signup" className="btn btn-primary" style={{
            marginLeft: '4px',
            background: 'var(--red)',
            borderColor: 'var(--red)',
            fontSize: '0.72rem',
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
                <a key={l} href={`/${l.toLowerCase()}`} style={{ display: 'block', fontSize: '0.82rem', color: 'var(--parchment-dark)', marginBottom: '6px' }}>{l}</a>
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

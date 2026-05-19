export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      annual: '',
      tagline: 'Curious browsers, designers',
      featured: false,
      cta: 'Start free',
      ctaHref: '/signup',
      websitePages: ['Homepage only'],
      websiteLocked: ['Admissions', 'Academics', 'Faith & mission', 'Student life'],
      social: ['Instagram / Facebook'],
      socialLocked: ['LinkedIn / TikTok'],
      athletics: null,
      athleticsLocked: true,
      tools: { searches: 3, export: false, reports: false, whiteLabel: false, seats: null, api: false },
    },
    {
      name: 'Individual',
      price: '$49',
      period: '/mo',
      annual: '$450 / year',
      tagline: 'Lone Wolf — comms director, solo marketer',
      featured: false,
      cta: 'Get started',
      ctaHref: '/signup?plan=individual',
      websitePages: ['Homepage', 'Admissions', 'Academics', 'Faith & mission'],
      websiteLocked: ['Student life'],
      social: ['Instagram / Facebook'],
      socialLocked: ['LinkedIn / TikTok'],
      athletics: null,
      athleticsLocked: true,
      tools: { searches: 30, export: true, reports: false, whiteLabel: false, seats: null, api: false },
    },
    {
      name: 'Premium',
      price: '$149',
      period: '/mo',
      annual: '$1,400 / year',
      tagline: 'Growth Team — small college marketing team',
      featured: true,
      cta: 'Get Premium',
      ctaHref: '/signup?plan=premium',
      websitePages: ['Homepage', 'Admissions', 'Academics', 'Faith & mission', 'Student life'],
      websiteLocked: [],
      social: ['Instagram / Facebook'],
      socialLocked: ['LinkedIn / TikTok'],
      athletics: null,
      athleticsLocked: true,
      tools: { searches: 150, export: true, reports: true, whiteLabel: false, seats: null, api: false },
    },
    {
      name: 'Agency',
      price: '$349',
      period: '/mo',
      annual: '$3,200 / year',
      tagline: 'Multi-school agencies & consultants',
      featured: false,
      cta: 'Get Agency',
      ctaHref: '/signup?plan=agency',
      websitePages: ['All pages'],
      websiteLocked: [],
      social: ['All platforms'],
      socialLocked: [],
      athletics: 'Add-on — $49/mo',
      athleticsLocked: false,
      tools: { searches: 500, export: true, reports: true, whiteLabel: true, seats: 5, api: true },
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      annual: '$2,500–$7,500+ / yr',
      tagline: 'National universities & dioceses',
      featured: false,
      cta: 'Contact us',
      ctaHref: '/contact',
      websitePages: ['All pages, unlimited'],
      websiteLocked: [],
      social: ['All platforms'],
      socialLocked: [],
      athletics: 'Included',
      athleticsLocked: false,
      tools: { searches: null, export: true, reports: true, whiteLabel: true, seats: 15, api: true, dedicated: true },
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '24px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Pricing</span>
            <div style={{ width: '24px', height: '1px', background: 'var(--red)' }} />
          </div>
          <h1 style={{ color: '#fff', fontWeight: 400, fontStyle: 'italic', marginBottom: '1rem' }}>
            Choose your <span style={{ fontWeight: 600, fontStyle: 'normal' }}>plan</span>
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
            Start free. Upgrade when you're ready to go deeper.
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: 'var(--white)',
              border: plan.featured ? '2px solid var(--navy)' : '0.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              position: 'relative',
            }}>
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--navy)', color: '#fff', fontSize: '0.65rem', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px',
                  borderRadius: '20px', whiteSpace: 'nowrap',
                }}>
                  Most popular
                </div>
              )}

              {/* Plan name & price */}
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '4px' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: plan.price === 'Custom' ? '1.5rem' : '2rem', color: 'var(--navy)', fontWeight: 600 }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-light)' }}>{plan.period}</span>
                </div>
                {plan.annual && <div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)' }}>{plan.annual}</div>}
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-mid)', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.4 }}>
                  {plan.tagline}
                </p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '1.25rem' }}>
                <FeatureGroup label="Website pages">
                  {plan.websitePages.map(p => <FeatureRow key={p} label={p} included />)}
                  {plan.websiteLocked.map(p => <FeatureRow key={p} label={p} included={false} />)}
                </FeatureGroup>

                <FeatureGroup label="Social media">
                  {plan.social.map(p => <FeatureRow key={p} label={p} included />)}
                  {plan.socialLocked.map(p => <FeatureRow key={p} label={p} included={false} />)}
                </FeatureGroup>

                <FeatureGroup label="Athletics">
                  {plan.athleticsLocked
                    ? <FeatureRow label="Not included" included={false} />
                    : <FeatureRow label={plan.athletics!} included />
                  }
                </FeatureGroup>

                <FeatureGroup label="Tools">
                  {plan.tools.searches !== null
                    ? <FeatureRow label={`${plan.tools.searches} searches / mo`} included />
                    : <FeatureRow label="Unlimited searches" included />
                  }
                  {plan.tools.export
                    ? <FeatureRow label="CSV export" included />
                    : <FeatureRow label="Exports" included={false} />
                  }
                  {plan.tools.reports
                    ? <FeatureRow label={plan.tools.whiteLabel ? 'White-label PDF reports' : 'PDF reports'} included />
                    : <FeatureRow label="Reports" included={false} />
                  }
                  {plan.tools.seats && <FeatureRow label={`${plan.tools.seats} team seats`} included />}
                  {plan.tools.api && <FeatureRow label="API access" included />}
                  {(plan.tools as any).dedicated && <FeatureRow label="Dedicated account manager" included />}
                </FeatureGroup>
              </div>

              <a href={plan.ctaHref} className="btn btn-primary" style={{
                width: '100%',
                justifyContent: 'center',
                background: plan.featured ? 'var(--navy)' : plan.name === 'Enterprise' ? 'transparent' : 'var(--navy)',
                borderColor: plan.featured ? 'var(--navy)' : plan.name === 'Enterprise' ? 'var(--border)' : 'var(--navy)',
                color: plan.name === 'Enterprise' ? 'var(--navy)' : '#fff',
                fontSize: '0.75rem',
              }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '8px 0 4px' }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function FeatureRow({ label, included }: { label: string; included: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 0' }}>
      <span style={{ fontSize: '0.7rem', color: included ? 'var(--navy)' : 'var(--ink-faint)', flexShrink: 0 }}>
        {included ? '✓' : '×'}
      </span>
      <span style={{ fontSize: '0.75rem', color: included ? 'var(--ink)' : 'var(--ink-faint)' }}>
        {label}
      </span>
    </div>
  );
}

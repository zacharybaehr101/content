export const metadata = {
  title: 'Pricing — CampusVox',
  description: 'CampusVox pricing plans for Catholic school digital content analysis.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      annual: '',
      tagline: 'Browse before you commit',
      featured: false,
      cta: 'Start free',
      ctaHref: '/signup',
      badge: null,
      websitePages: ['Homepage only'],
      websiteLocked: ['Admissions', 'Student Life', 'Academics', 'Full Site'],
      tools: { searches: 3, pins: false, inspiration: false, export: false, seats: 1, pdf: false, api: false, whiteLabel: false },
    },
    {
      name: 'Starter',
      price: '$19',
      period: '/mo',
      annual: '$24/mo after first 25 subscribers',
      tagline: 'Solo comms director or marketer',
      featured: false,
      cta: 'Get started',
      ctaHref: '/signup?plan=starter',
      badge: 'Intro pricing',
      websitePages: ['Homepage', 'Admissions'],
      websiteLocked: ['Student Life', 'Academics', 'Full Site'],
      tools: { searches: 30, pins: 10, inspiration: '5 results', export: 'CSV', seats: 1, pdf: false, api: false, whiteLabel: false },
    },
    {
      name: 'Team',
      price: '$79',
      period: '/mo',
      annual: '',
      tagline: 'Small college marketing team',
      featured: true,
      cta: 'Get Team',
      ctaHref: '/signup?plan=team',
      badge: 'Most popular',
      websitePages: ['Homepage', 'Admissions', 'Student Life', 'Academics', 'Full Site'],
      websiteLocked: [],
      tools: { searches: 150, pins: 'Unlimited', inspiration: '15 results', export: 'CSV', seats: 5, pdf: 'PDF reports', api: false, whiteLabel: false },
    },
    {
      name: 'Agency',
      price: '$149',
      period: '/mo',
      annual: '',
      tagline: 'Full teams & agencies',
      featured: false,
      cta: 'Get Agency',
      ctaHref: '/signup?plan=agency',
      badge: null,
      websitePages: ['All pages, unlimited'],
      websiteLocked: [],
      tools: { searches: 'Unlimited', pins: 'Unlimited', inspiration: 'Unlimited results', export: 'CSV', seats: 'Unlimited', pdf: 'White-label PDF', api: true, whiteLabel: true, customRequests: true, priority: true },
    },
  ];

  return (
    <div>
      <div style={{ background: 'var(--navy)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '24px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Pricing</span>
            <div style={{ width: '24px', height: '1px', background: 'var(--red)' }} />
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '2.5rem' }}>
            Choose your plan
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Start free. Upgrade when you need more depth, more tools, or more seats.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: 'var(--white)',
              border: plan.featured ? '2px solid var(--navy)' : '0.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              position: 'relative',
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: plan.featured ? 'var(--navy)' : 'var(--red)',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '4px' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: plan.price === '$0' ? '1.75rem' : '2rem', color: 'var(--navy)', fontWeight: 600 }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-light)' }}>{plan.period}</span>
                </div>
                {plan.annual && <div style={{ fontSize: '0.68rem', color: 'var(--ink-faint)', lineHeight: 1.4 }}>{plan.annual}</div>}
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-mid)', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.4 }}>
                  {plan.tagline}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <FeatureGroup label="Pages">
                  {plan.websitePages.map(p => <FeatureRow key={p} label={p} included />)}
                  {plan.websiteLocked.map(p => <FeatureRow key={p} label={p} included={false} />)}
                </FeatureGroup>

                <FeatureGroup label="Tools">
                  <FeatureRow label={`${plan.tools.searches} searches / mo`} included={!!plan.tools.searches} />
                  <FeatureRow label={plan.tools.pins ? `${plan.tools.pins} pins` : 'No pinboard'} included={!!plan.tools.pins} />
                  <FeatureRow label={plan.tools.inspiration ? `Inspiration Finder — ${plan.tools.inspiration}` : 'No Inspiration Finder'} included={!!plan.tools.inspiration} />
                  {plan.tools.export && <FeatureRow label={`${plan.tools.export} export`} included />}
                  {plan.tools.pdf && <FeatureRow label={String(plan.tools.pdf)} included />}
                  <FeatureRow label={`${plan.tools.seats} ${Number(plan.tools.seats) === 1 ? 'seat' : 'seats'}`} included />
                  {plan.tools.api && <FeatureRow label="API access" included />}
                  {(plan.tools as any).customRequests && <FeatureRow label="Custom school requests" included />}
                  {(plan.tools as any).priority && <FeatureRow label="Priority support" included />}
                </FeatureGroup>
              </div>

              <a href={plan.ctaHref} className="btn btn-primary" style={{
                width: '100%', justifyContent: 'center',
                background: plan.featured ? 'var(--navy)' : plan.name === 'Free' ? 'transparent' : 'var(--navy)',
                borderColor: plan.featured ? 'var(--navy)' : plan.name === 'Free' ? 'var(--border)' : 'var(--navy)',
                color: plan.name === 'Free' ? 'var(--navy)' : '#fff',
                fontSize: '0.78rem',
              }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ / notes */}
        <div style={{ marginTop: '3rem', maxWidth: '680px', margin: '3rem auto 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { q: 'What counts as a search?', a: 'Any query submitted in the main search bar or Inspiration Finder counts as one search.' },
              { q: 'Can I upgrade or downgrade?', a: 'Yes — you can change plans at any time. Changes take effect at the next billing cycle.' },
              { q: 'What is the intro pricing?', a: 'The first 25 subscribers lock in $19/mo permanently. After that, Starter is $24/mo.' },
              { q: 'What are custom school requests?', a: 'Agency subscribers can request specific schools to be added to the database. We typically add them within 2 weeks.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>{q}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-mid)', lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '3px 0' }}>
      <span style={{ fontSize: '0.7rem', color: included ? 'var(--navy)' : 'var(--ink-faint)', flexShrink: 0, marginTop: '2px' }}>
        {included ? '✓' : '×'}
      </span>
      <span style={{ fontSize: '0.78rem', color: included ? 'var(--ink)' : 'var(--ink-faint)', lineHeight: 1.4 }}>
        {label}
      </span>
    </div>
  );
}

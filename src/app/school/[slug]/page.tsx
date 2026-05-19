import { fetchSchoolBySlug, fetchAllSchools } from '@/lib/sheets';
import { applyTierMask } from '@/lib/search';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const schools = await fetchAllSchools();
  return schools.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const school = await fetchSchoolBySlug(params.slug);
  if (!school) return { title: 'School not found' };
  return {
    title: `${school.institutionName} — SchoolContent`,
    description: `Marketing intelligence profile for ${school.institutionName}. Hero headline, messaging strategy, CTA analysis, and more.`,
  };
}

export default async function SchoolProfilePage({ params }: { params: { slug: string } }) {
  const school = await fetchSchoolBySlug(params.slug);
  if (!school) notFound();

  // Show free tier data — auth middleware will handle real tier in Phase 4
  const tier = 'free';
  const masked = applyTierMask(school, tier);

  const isLocked = (value: any) => value === undefined || value === null;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Profile header */}
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <a href="/search" style={{ fontSize: '0.72rem', color: 'var(--ink-faint)', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
            ← Back to search
          </a>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="tag tag-red">{school.type?.includes('High School') ? 'High School' : 'University'}</span>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{school.region}</span>
            {school.religiousOrder && school.religiousOrder !== 'N/A' && (
              <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{school.religiousOrder}</span>
            )}
          </div>

          <h1 style={{ color: '#fff', fontWeight: 400, fontStyle: 'italic', marginBottom: '4px' }}>
            {school.institutionName}
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '0.88rem' }}>
            {school.city}, {school.state} ·{' '}
            <a href={`https://${school.websiteUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--parchment-dark)' }}>
              {school.websiteUrl} ↗
            </a>
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Hero headline */}
            <ProfileSection title="Hero Headline">
              {school.heroHeadline ? (
                <blockquote style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: 'var(--navy)',
                  borderLeft: '3px solid var(--red)',
                  paddingLeft: '1.25rem',
                  margin: '0 0 1rem',
                  lineHeight: 1.4,
                }}>
                  "{school.heroHeadline.replace(/^"|"$/g, '')}"
                </blockquote>
              ) : null}
              <DataRow label="Message type" value={school.heroMessageType} />
              <DataRow label="Primary audience" value={masked.primaryAudienceFocus} locked={isLocked(masked.primaryAudienceFocus)} />
              <DataRow label="Faith identity posture" value={school.faithIdentityPosture} />
            </ProfileSection>

            {/* Messaging analysis */}
            <ProfileSection title="Messaging Analysis">
              <DataRow label="Strongest phrase" value={masked.strongestPhrase} locked={isLocked(masked.strongestPhrase)} verbatim />
              <DataRow label="Weakest pattern" value={masked.weakestPatternIdentified} locked={isLocked(masked.weakestPatternIdentified)} />
              <DataRow label="CTA labels" value={masked.ctaLabels} locked={isLocked(masked.ctaLabels)} verbatim />
              <DataRow label="Nav top labels" value={(masked as any).navTopLabels} locked={isLocked((masked as any).navTopLabels)} />
            </ProfileSection>

            {/* Signals */}
            <ProfileSection title="Content Signals">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <SignalBadge label="Financial aid language" value={masked.financialAidLanguagePresent} locked={isLocked(masked.financialAidLanguagePresent)} />
                <SignalBadge label="Outcomes / placement data" value={masked.outcomesPlacementDataShown} locked={isLocked(masked.outcomesPlacementDataShown)} />
                <SignalBadge label="Student quotes" value={masked.studentQuotesPresent} locked={isLocked(masked.studentQuotesPresent)} />
                <SignalBadge label="Fresh news & events" value={masked.newsEventsFresh} locked={isLocked(masked.newsEventsFresh)} />
              </div>
            </ProfileSection>

            {/* Strategic analysis — locked for free */}
            <ProfileSection title="Strategic Analysis">
              <LockedSection
                label="Competitive differentiation vs. state schools"
                value={(masked as any).competitiveDifferentiationVsStateSchool}
                locked={isLocked((masked as any).competitiveDifferentiationVsStateSchool)}
              />
              <LockedSection
                label="Recommended outreach angle"
                value={(masked as any).recommendedOutreachAngle}
                locked={isLocked((masked as any).recommendedOutreachAngle)}
              />
              <LockedSection
                label="Visual theology — image type"
                value={(masked as any).visualTheologyImageType}
                locked={isLocked((masked as any).visualTheologyImageType)}
              />
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Scores */}
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1rem' }}>
                Strength signals
              </div>
              <ScoreRow label="Belonging language" value={school.belongingLanguageStrength} />
              <ScoreRow label="Prestige language" value={school.prestigeLanguageLevel} />
              <ScoreRow label="Admissions CTA" value={masked.admissionsCtaProminence} locked={isLocked(masked.admissionsCtaProminence)} />
              <ScoreRow label="Mobile friction" value={masked.mobileFrictionTapsToInquiry} locked={isLocked(masked.mobileFrictionTapsToInquiry)} />
            </div>

            {/* Upgrade CTA */}
            <div style={{
              background: 'var(--navy)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px' }}>
                Free plan
              </div>
              <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>
                Unlock the full profile
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Get verbatim phrases, strategic analysis, and all 41 data points.
              </p>
              <a href="/pricing" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}>
                Upgrade — from $49/mo
              </a>
            </div>

            {/* School info */}
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1rem' }}>
                School info
              </div>
              <DataRow label="Diocese / Province" value={masked.dioceseOrProvince} locked={isLocked(masked.dioceseOrProvince)} />
              <DataRow label="Enrollment" value={school.enrollmentRange} />
              <DataRow label="Primary social" value={school.primarySocialPlatform} />
              <DataRow label="Analyzed" value={school.dateAnalyzed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1.25rem' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value, locked, verbatim }: { label: string; value?: any; locked?: boolean; verbatim?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '8px 0', borderBottom: '0.5px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--ink-light)', flexShrink: 0, minWidth: '140px' }}>{label}</span>
      {locked ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🔒</span> <a href="/pricing" style={{ color: 'var(--red)', fontSize: '0.72rem' }}>Upgrade to unlock</a>
        </span>
      ) : (
        <span style={{ fontSize: '0.82rem', color: 'var(--ink)', textAlign: 'right', fontStyle: verbatim ? 'italic' : 'normal', fontFamily: verbatim ? 'var(--font-display)' : 'inherit' }}>
          {value || '—'}
        </span>
      )}
    </div>
  );
}

function ScoreRow({ label, value, locked }: { label: string; value?: any; locked?: boolean }) {
  const color = value === 'Strong' ? 'var(--navy)' : value === 'Weak' || value === 'Absent' ? 'var(--ink-faint)' : 'var(--ink-mid)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--ink-light)' }}>{label}</span>
      {locked ? (
        <span style={{ fontSize: '0.7rem', color: 'var(--ink-faint)' }}>🔒</span>
      ) : (
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color }}>{value || '—'}</span>
      )}
    </div>
  );
}

function SignalBadge({ label, value, locked }: { label: string; value?: any; locked?: boolean }) {
  const isYes = typeof value === 'string' && (value.toLowerCase().startsWith('yes') || value.toLowerCase() === 'true');
  return (
    <div style={{ background: 'var(--parchment)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--ink-light)', marginBottom: '4px' }}>{label}</div>
      {locked ? (
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>🔒 <a href="/pricing" style={{ color: 'var(--red)' }}>Unlock</a></span>
      ) : (
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isYes ? 'var(--navy)' : 'var(--ink-light)' }}>
          {value || '—'}
        </span>
      )}
    </div>
  );
}

function LockedSection({ label, value, locked }: { label: string; value?: any; locked?: boolean }) {
  if (!locked && value) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.6 }}>{value}</p>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: '1rem', background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', border: '0.5px solid var(--border)' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--ink-faint)', filter: 'blur(4px)', userSelect: 'none' }}>
          This content is only visible on paid plans.
        </span>
      </div>
      <a href="/pricing" style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600, display: 'inline-block', marginTop: '6px' }}>
        🔒 Upgrade to read →
      </a>
    </div>
  );
}

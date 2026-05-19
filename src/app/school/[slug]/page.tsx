import { fetchSchoolBySlug, fetchAllSchools } from '@/lib/sheets';
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
    description: `Marketing intelligence profile for ${school.institutionName}.`,
  };
}

export default async function SchoolProfilePage({ params }: { params: { slug: string } }) {
  const school = await fetchSchoolBySlug(params.slug);
  if (!school) notFound();

  // Free tier shows full profile — paid tiers unlock more pages and export
  const s = school;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <a href="/search" style={{ fontSize: '0.9rem', color: 'var(--ink-faint)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem', textDecoration: 'none' }}>
            ← Back to search
          </a>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="tag tag-red">{s.type?.includes('High School') ? 'High School' : 'University'}</span>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{s.region}</span>
            {s.religiousOrder && s.religiousOrder !== 'N/A' && (
              <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{s.religiousOrder}</span>
            )}
          </div>

          <h1 style={{ color: '#fff', fontWeight: 400, fontStyle: 'italic', marginBottom: '6px', fontSize: '2.5rem' }}>
            {s.institutionName}
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem' }}>
            {s.city}, {s.state} ·{' '}
            <a href={`https://${s.websiteUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--parchment-dark)' }}>
              {s.websiteUrl} ↗
            </a>
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <ProfileSection title="Hero Headline">
              {s.heroHeadline && (
                <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--navy)', borderLeft: '3px solid var(--red)', paddingLeft: '1.25rem', margin: '0 0 1.25rem', lineHeight: 1.4 }}>
                  &ldquo;{s.heroHeadline.replace(/^"|"$/g, '')}&rdquo;
                </blockquote>
              )}
              <DataRow label="Message type" value={s.heroMessageType} />
              <DataRow label="Primary audience" value={s.primaryAudienceFocus} />
              <DataRow label="Faith identity posture" value={s.faithIdentityPosture} />
              <DataRow label="Catholic order named on homepage" value={s.catholicOrderNamedOnHomepage} />
            </ProfileSection>

            <ProfileSection title="Messaging Analysis">
              <DataRow label="Strongest phrase" value={s.strongestPhrase} verbatim />
              <DataRow label="Weakest pattern" value={s.weakestPatternIdentified} />
              <DataRow label="CTA labels" value={s.ctaLabels} verbatim />
              <DataRow label="Nav top labels" value={s.navTopLabels} />
            </ProfileSection>

            <ProfileSection title="Content Signals">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <SignalBadge label="Financial aid language" value={s.financialAidLanguagePresent} />
                <SignalBadge label="Outcomes / placement data" value={s.outcomesPlacementDataShown} />
                <SignalBadge label="Student quotes" value={s.studentQuotesPresent} />
                <SignalBadge label="Fresh news & events" value={s.newsEventsFresh} />
              </div>
            </ProfileSection>

            <ProfileSection title="Strategic Analysis">
              <AnalysisBlock label="Competitive differentiation vs. state schools" value={s.competitiveDifferentiationVsStateSchool} />
              <AnalysisBlock label="Recommended outreach angle" value={s.recommendedOutreachAngle} />
              <AnalysisBlock label="Visual theology — image type" value={s.visualTheologyImageType} />
              <AnalysisBlock label="Founder's charism used as lens" value={s.foundersCharismUsedAsLens} />
            </ProfileSection>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1rem' }}>
                Strength signals
              </div>
              <ScoreRow label="Belonging language" value={s.belongingLanguageStrength} />
              <ScoreRow label="Prestige language" value={s.prestigeLanguageLevel} />
              <ScoreRow label="Service / justice language" value={s.serviceJusticeLanguage} />
              <ScoreRow label="Admissions CTA" value={s.admissionsCtaProminence} />
              <ScoreRow label="Mobile friction (taps)" value={s.mobileFrictionTapsToInquiry} />
            </div>

            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1rem' }}>
                School info
              </div>
              <DataRow label="Diocese / Province" value={s.dioceseOrProvince} />
              <DataRow label="Enrollment" value={s.enrollmentRange} />
              <DataRow label="Primary social" value={s.primarySocialPlatform} />
              <DataRow label="Pages analyzed" value={s.pagesAnalyzed} />
              <DataRow label="Date analyzed" value={s.dateAnalyzed} />
            </div>

            <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '8px' }}>
                Want more?
              </div>
              <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.1rem', marginBottom: '8px' }}>
                Unlock all pages & export
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Individual plan adds admissions, academics, and faith pages plus CSV export.
              </p>
              <a href="/pricing" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                Upgrade — from $49/mo
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1.25rem' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value, verbatim }: { label: string; value?: any; verbatim?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ink-light)', flexShrink: 0, minWidth: '160px' }}>{label}</span>
      <span style={{ fontSize: '0.95rem', color: 'var(--ink)', textAlign: 'right', fontStyle: verbatim ? 'italic' : 'normal', fontFamily: verbatim ? 'var(--font-display)' : 'inherit' }}>
        {value || '—'}
      </span>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value?: any }) {
  const color = typeof value === 'string' && value.toLowerCase().startsWith('strong') ? 'var(--navy)'
    : typeof value === 'string' && (value.toLowerCase().startsWith('weak') || value.toLowerCase() === 'absent') ? 'var(--ink-faint)'
    : 'var(--ink-mid)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: '0.5px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.88rem', color: 'var(--ink-light)' }}>{label}</span>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color, textAlign: 'right', maxWidth: '55%' }}>{value || '—'}</span>
    </div>
  );
}

function SignalBadge({ label, value }: { label: string; value?: any }) {
  const isYes = typeof value === 'string' && (value.toLowerCase().startsWith('yes') || value.toLowerCase() === 'true');
  return (
    <div style={{ background: 'var(--parchment)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
      <div style={{ fontSize: '0.78rem', color: 'var(--ink-light)', marginBottom: '5px' }}>{label}</div>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isYes ? 'var(--navy)' : 'var(--ink-light)' }}>
        {value || '—'}
      </span>
    </div>
  );
}

function AnalysisBlock({ label, value }: { label: string; value?: any }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{label}</div>
      <p style={{ fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.65 }}>{value || '—'}</p>
    </div>
  );
}

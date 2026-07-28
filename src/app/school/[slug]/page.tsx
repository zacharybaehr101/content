import {
  fetchSchoolBySlug, fetchAllSchools, fetchAdmissionsData,
  fetchFullSiteData, fetchStudentLifeData, fetchAcademicsData,
} from '@/lib/sheets';
import { cleanHeadline, cleanQuote, toTitleCase, hasValue } from '@/lib/format';
import { AdmissionsAnalysis, FullSiteAnalysis, StudentLifeAnalysis, AcademicsAnalysis } from '@/lib/types';
import { PinButton } from '@/components/PinButton';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try { const s = await fetchAllSchools(); return s.map(s => ({ slug: s.id })); }
  catch { return []; }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const school = await fetchSchoolBySlug(params.slug);
  if (!school) return { title: 'School not found' };
  return {
    title: `${school.institutionName} — Digital Content Analysis`,
    description: `CampusVox digital content analysis for ${school.institutionName}. Homepage, admissions, student life, academics, and full site analysis.`,
    alternates: { canonical: `/school/${params.slug}` },
  };
}

export default async function SchoolProfilePage({ params, searchParams }: { params: { slug: string }, searchParams: { tab?: string } }) {
  const [school, admissionsMap, fullSiteMap, studentLifeMap, academicsMap] = await Promise.all([
    fetchSchoolBySlug(params.slug),
    fetchAdmissionsData(), fetchFullSiteData(), fetchStudentLifeData(), fetchAcademicsData(),
  ]);
  if (!school) notFound();

  const s = school;
  const activeTab = searchParams.tab ?? 'homepage';
  const admissions = admissionsMap.get(params.slug);
  const fullSite = fullSiteMap.get(params.slug);
  const studentLife = studentLifeMap.get(params.slug);
  const academics = academicsMap.get(params.slug);
  const headline = cleanHeadline(s.heroHeadline);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${s.institutionName} — CampusVox Digital Content Analysis`,
    about: { '@type': 'EducationalOrganization', name: s.institutionName, address: { '@type': 'PostalAddress', addressLocality: s.city, addressRegion: s.state } },
    publisher: { '@type': 'Organization', name: 'CampusVox' },
  };

  const tabs = [
    { id: 'homepage',    label: 'Homepage',     hasData: true },
    { id: 'fullsite',    label: 'Full Site',    hasData: !!fullSite },
    { id: 'admissions',  label: 'Admissions',   hasData: !!admissions },
    { id: 'studentlife', label: 'Student Life', hasData: !!studentLife },
    { id: 'academics',   label: 'Academics',    hasData: !!academics },
    { id: 'linkedin',    label: 'LinkedIn',     hasData: false, comingSoon: true },
  ];

  const schoolForPin = {
    id: s.id, institutionName: s.institutionName, type: s.type ?? '',
    region: s.region ?? '', city: s.city ?? '', state: s.state ?? '',
    heroHeadline: headline ?? '',
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ background: 'var(--navy)', padding: '3rem 0 0' }}>
        <div className="container">
          <a href="/search" style={{ fontSize: '0.9rem', color: 'var(--ink-faint)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem', textDecoration: 'none' }}>← Back to search</a>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span className="tag tag-red">{s.type?.includes('High School') ? 'High School' : 'University'}</span>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{s.region}</span>
                {hasValue(s.religiousOrder) && <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{s.religiousOrder}</span>}
                {s.deepAnalysisAvailable && <span className="tag" style={{ background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }}>Full Analysis</span>}
              </div>
              <h1 style={{ color: '#fff', fontWeight: 600, marginBottom: '6px', fontSize: '2.25rem' }}>{s.institutionName}</h1>
              <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', marginBottom: '1.5rem' }}>
                {s.city}, {s.state}
                {hasValue(s.websiteUrl) && <> · <a href={`https://${s.websiteUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--parchment-dark)' }}>{s.websiteUrl} ↗</a></>}
              </p>
            </div>
            <div style={{ paddingTop: '0.5rem' }}>
              <PinButton school={schoolForPin} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <a key={tab.id} href={tab.comingSoon ? '/linkedin' : `/school/${params.slug}?tab=${tab.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600,
                borderRadius: 'var(--radius) var(--radius) 0 0',
                background: activeTab === tab.id ? 'var(--parchment)' : tab.hasData ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                color: activeTab === tab.id ? 'var(--navy)' : tab.hasData ? 'var(--parchment-dark)' : 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                borderBottom: activeTab === tab.id ? '1px solid var(--parchment)' : '1px solid transparent',
              }}>
                {tab.label}
                {tab.comingSoon && <span style={{ fontSize: '0.6rem', background: 'var(--red)', color: '#fff', padding: '1px 4px', borderRadius: '3px' }}>Soon</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        {activeTab === 'fullsite' && (fullSite ? <FullSiteTab data={fullSite} /> : <LockedTab label="Full Site" message="Full site analysis is coming for this school." />)}
        {activeTab === 'admissions' && (admissions ? <AdmissionsTab admissions={admissions} /> : <LockedTab label="Admissions" message="Admissions page analysis is coming for this school. More schools are added regularly." />)}
        {activeTab === 'studentlife' && (studentLife ? <StudentLifeTab data={studentLife} /> : <LockedTab label="Student Life" message="Student life analysis is coming for this school." />)}
        {activeTab === 'academics' && (academics ? <AcademicsTab data={academics} /> : <LockedTab label="Academics" message="Academics analysis is coming for this school." />)}
        {activeTab === 'linkedin' && <LockedTab label="LinkedIn" message="LinkedIn content analysis is coming soon." />}

        {activeTab === 'homepage' && (
          <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {hasValue(s.deepNarrativeAnalysis) && (
                <NavyCard title="Full Analysis">
                  <p style={{ fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.8 }}>{s.deepNarrativeAnalysis}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                    {hasValue(s.deepNotableStrengths) && <SubField title="Notable Strengths" value={s.deepNotableStrengths!} />}
                    {hasValue(s.deepNotableGaps) && <SubField title="Opportunities" value={s.deepNotableGaps!} />}
                  </div>
                </NavyCard>
              )}

              <ProfileSection title="Hero Headline">
                {hasValue(headline) && <Headline text={headline!} />}
                {hasValue(s.deepPrimaryMessage) && <MessageBox label="Primary Message" value={s.deepPrimaryMessage!} />}
                <DataRow label="Message type" value={s.heroMessageType} />
                <DataRow label="Primary audience" value={s.primaryAudienceFocus} />
                <DataRow label="Faith identity posture" value={s.faithIdentityPosture} />
                <DataRow label="Catholic order named" value={s.catholicOrderNamedOnHomepage} />
              </ProfileSection>

              <ProfileSection title="Messaging Analysis">
                {hasValue(s.deepKeyPhrases) && <MessageBox label="Key Phrases" value={cleanQuote(s.deepKeyPhrases)!} navy />}
                <DataRow label="Strongest phrase" value={cleanQuote(s.strongestPhrase)} />
                <DataRow label="CTA labels" value={cleanQuote(s.ctaLabels)} />
                {hasValue(s.deepCtaLabels) && <DataRow label="Page CTAs" value={cleanQuote(s.deepCtaLabels)} />}
                <DataRow label="Nav labels" value={toTitleCase(s.navTopLabels)} />
              </ProfileSection>

              <ProfileSection title="Visual Theology">
                {hasValue(s.deepVisualTheologyNote) && <MessageBox label="" value={s.deepVisualTheologyNote!} navy />}
                <DataRow label="Image type" value={s.visualTheologyImageType} />
                <DataRow label="Founder's charism" value={s.foundersCharismUsedAsLens} />
              </ProfileSection>

              <ProfileSection title="Content Signals">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <SignalBadge label="Financial aid language" value={s.financialAidLanguagePresent} />
                  <SignalBadge label="Outcomes / placement data" value={s.outcomesPlacementDataShown} />
                  <SignalBadge label="Student quotes" value={s.studentQuotesPresent} />
                  <SignalBadge label="Fresh news & events" value={s.newsEventsFresh} />
                </div>
              </ProfileSection>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>Strength Signals</div>
                <ScoreRow label="Belonging language" value={s.belongingLanguageStrength} />
                <ScoreRow label="Prestige language" value={s.prestigeLanguageLevel} />
                <ScoreRow label="Service / justice" value={s.serviceJusticeLanguage} />
                <ScoreRow label="Admissions CTA" value={s.admissionsCtaProminence} />
                <ScoreRow label="Mobile friction" value={s.mobileFrictionTapsToInquiry} />
              </div>
              <UpgradeCTA />
              <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>School Info</div>
                <DataRow label="Diocese / Province" value={s.dioceseOrProvince} />
                <DataRow label="Enrollment" value={s.enrollmentRange} />
                <DataRow label="Primary social" value={s.primarySocialPlatform} />
                <DataRow label="Pages analyzed" value={s.pagesAnalyzed} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab components ────────────────────────────────────────────────────

function FullSiteTab({ data }: { data: FullSiteAnalysis }) {
  return (
    <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {hasValue(data.narrative) && <NavyCard title="Full Site Narrative"><p style={{ fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.8 }}>{data.narrative}</p></NavyCard>}
        {hasValue(data.whatToSteal) && <NavyCard title="What to Steal" accent><p style={{ fontSize: '1rem', color: 'var(--parchment)', lineHeight: 1.75 }}>{data.whatToSteal}</p></NavyCard>}
        <ProfileSection title="Strategic Analysis">
          <DataRow label="Overall theme & tone" value={data.overallThemeTone} />
          <DataRow label="The Catholic factor" value={data.catholicFactor} />
          <DataRow label="Headline strategy" value={data.headlineStrategy} />
          <DataRow label="Visual storytelling" value={data.visualStorytelling} />
          <DataRow label="Outcome / ROI focus" value={data.outcomeRoiFocus} />
          <DataRow label="Navigation & ease of use" value={data.navigationEaseOfUse} />
          <DataRow label="Conversion strategy" value={data.conversionStrategy} />
          <DataRow label="Social strategy" value={data.socialStrategy} />
        </ProfileSection>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <UpgradeCTA />
        <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>Site Info</div>
          <DataRow label="Identity / Order" value={data.identityOrder} />
          <DataRow label="Pages evaluated" value={data.pagesEvaluated} />
          <DataRow label="Social evaluated" value={data.socialMediaEvaluated} />
          {hasValue(data.homepageUrl) && <div style={{ padding: '10px 0' }}><a href={data.homepageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.88rem', color: 'var(--red)', fontWeight: 600 }}>Visit homepage ↗</a></div>}
        </div>
      </div>
    </div>
  );
}

function AdmissionsTab({ admissions }: { admissions: AdmissionsAnalysis }) {
  return (
    <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {hasValue(admissions.narrativeAnalysis) && (
          <NavyCard title="Admissions Page Analysis">
            <p style={{ fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.8 }}>{admissions.narrativeAnalysis}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
              {hasValue(admissions.notableStrengths) && <SubField title="Notable Strengths" value={admissions.notableStrengths} />}
              {hasValue(admissions.opportunities) && <SubField title="Opportunities" value={admissions.opportunities} />}
            </div>
          </NavyCard>
        )}
        <ProfileSection title="Admissions Page Content">
          {hasValue(admissions.heroHeadline) && <Headline text={admissions.heroHeadline.replace(/^"|"$/g, '')} />}
          {hasValue(admissions.primaryMessage) && <MessageBox label="Primary Message" value={admissions.primaryMessage} />}
          {hasValue(admissions.keyPhrases) && <MessageBox label="Key Phrases" value={admissions.keyPhrases} navy />}
          <DataRow label="CTA labels" value={admissions.ctaLabels} />
          <DataRow label="Visual theology" value={admissions.visualTheologyNote} />
          {hasValue(admissions.pageUrl) && <div style={{ padding: '10px 0' }}><a href={admissions.pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--red)', fontWeight: 600 }}>View admissions page ↗</a></div>}
        </ProfileSection>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <UpgradeCTA />
        <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>Page Info</div>
          <DataRow label="Page type" value={admissions.pageType} />
        </div>
      </div>
    </div>
  );
}

function StudentLifeTab({ data }: { data: StudentLifeAnalysis }) {
  return (
    <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {hasValue(data.whatToSteal) && <NavyCard title="What to Steal" accent><p style={{ fontSize: '1rem', color: 'var(--parchment)', lineHeight: 1.75 }}>{data.whatToSteal}</p></NavyCard>}
        <ProfileSection title="Student Life Analysis">
          <DataRow label="Overall theme & tone" value={data.overallThemeTone} />
          <DataRow label="The Catholic factor" value={data.catholicFactor} />
          <DataRow label="Headline strategy" value={data.headlineStrategy} />
          <DataRow label="Visual storytelling" value={data.visualStorytelling} />
          <DataRow label="Belonging & community" value={data.belongingCommunityFocus} />
          <DataRow label="Navigation & ease of use" value={data.navigationEaseOfUse} />
          <DataRow label="Engagement & conversion" value={data.engagementConversionStrategy} />
        </ProfileSection>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <UpgradeCTA />
        <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>School Info</div>
          <DataRow label="Identity / Order" value={data.identityOrder} />
        </div>
      </div>
    </div>
  );
}

function AcademicsTab({ data }: { data: AcademicsAnalysis }) {
  return (
    <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {hasValue(data.strategicPositioningCoreMessaging) && <NavyCard title="Strategic Positioning"><p style={{ fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.8 }}>{data.strategicPositioningCoreMessaging}</p></NavyCard>}
        {hasValue(data.notableFeaturesDifferentiators) && <NavyCard title="Notable Differentiators" accent><p style={{ fontSize: '1rem', color: 'var(--parchment)', lineHeight: 1.75 }}>{data.notableFeaturesDifferentiators}</p></NavyCard>}
        <ProfileSection title="Academics Page Analysis">
          <DataRow label="Content modules & focus" value={data.primaryContentModules} />
          <DataRow label="Visual design & layout" value={data.visualDesignLayoutStrategy} />
          <DataRow label="Color palette & typography" value={data.colorPaletteTypography} />
          <DataRow label="CTAs & navigation prompts" value={data.ctasNavigationPrompts} />
        </ProfileSection>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <UpgradeCTA />
        <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>School Info</div>
          <DataRow label="Affiliation / Heritage" value={data.affiliationHeritage} />
        </div>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────

function NavyCard({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent ? 'linear-gradient(90deg,#c0392b,var(--red))' : 'linear-gradient(90deg,var(--red),#c0392b)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
        <div style={{ width: '28px', height: '1px', background: 'var(--parchment-dark)' }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--parchment-dark)' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function SubField({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment-dark)', marginBottom: '6px' }}>{title}</div>
      <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}

function Headline({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '3px solid var(--red)', paddingLeft: '1.25rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
      {text}
    </div>
  );
}

function MessageBox({ label, value, navy }: { label: string; value: string; navy?: boolean }) {
  return (
    <div style={{ background: navy ? 'var(--navy-light)' : 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: '1rem' }}>
      {label && <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-light)', marginBottom: '4px' }}>{label}</div>}
      <p style={{ fontSize: '0.95rem', color: 'var(--navy)', lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}

function LockedTab({ label, message }: { label: string; message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
      <h3 style={{ marginBottom: '0.75rem' }}>{label} Analysis</h3>
      <p style={{ color: 'var(--ink-mid)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{message}</p>
      <a href="/pricing" className="btn btn-primary">See plans & pricing →</a>
    </div>
  );
}

function UpgradeCTA() {
  return (
    <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-faint)', marginBottom: '8px' }}>Want more?</div>
      <p style={{ fontWeight: 600, color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>Unlock all pages & tools</p>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)', marginBottom: '1.25rem', lineHeight: 1.5 }}>Starter plan unlocks all content tabs, Inspiration Finder, and Pinboard.</p>
      <a href="/pricing" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
        Upgrade — from $19/mo
      </a>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1.25rem' }}>{title}</div>
      {children}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value?: any }) {
  if (!hasValue(value)) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ink-light)', flexShrink: 0, minWidth: '160px' }}>{label}</span>
      <span style={{ fontSize: '0.95rem', color: 'var(--ink)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value?: any }) {
  if (!hasValue(value)) return null;
  const v = (value as string).toLowerCase();
  const color = v.startsWith('strong') ? 'var(--navy)' : (v.startsWith('weak') || v === 'absent') ? 'var(--ink-faint)' : 'var(--ink-mid)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '8px 0', borderBottom: '0.5px solid var(--border-light)' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--ink-light)' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
    </div>
  );
}

function SignalBadge({ label, value }: { label: string; value?: any }) {
  if (!hasValue(value)) return null;
  const isYes = typeof value === 'string' && value.toLowerCase().startsWith('yes');
  return (
    <div style={{ background: 'var(--parchment)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: '5px' }}>{label}</div>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isYes ? 'var(--navy)' : 'var(--ink-light)' }}>{value}</span>
    </div>
  );
}

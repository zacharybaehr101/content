import { fetchSchoolBySlug, fetchAllSchools, fetchAdmissionsData } from '@/lib/sheets';
import { cleanHeadline, cleanQuote, toTitleCase, hasValue } from '@/lib/format';
import { AdmissionsAnalysis } from '@/lib/types';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const schools = await fetchAllSchools();
    return schools.map((s) => ({ slug: s.id }));
  } catch (err) {
    console.error('generateStaticParams error:', err);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const school = await fetchSchoolBySlug(params.slug);
  if (!school) return { title: 'School not found' };
  return {
    title: `${school.institutionName} — Catholic School Marketing Profile`,
    description: `Marketing intelligence profile for ${school.institutionName}. Analyze hero headlines, faith messaging, CTA strategy, belonging language, and full narrative analysis.`,
    openGraph: {
      title: `${school.institutionName} — SchoolContent`,
      description: `See how ${school.institutionName} uses its website to promote enrollment.`,
    },
    alternates: { canonical: `/school/${params.slug}` },
  };
}

export default async function SchoolProfilePage({ params, searchParams }: { params: { slug: string }, searchParams: { tab?: string } }) {
  const [school, admissionsMap] = await Promise.all([
    fetchSchoolBySlug(params.slug),
    fetchAdmissionsData(),
  ]);
  if (!school) notFound();

  const s = school;
  const activeTab = searchParams.tab ?? 'homepage';
  const admissions = admissionsMap.get(params.slug);
  const hasAdmissions = !!admissions;
  const hasDeepAnalysis = hasValue(s.deepNarrativeAnalysis);
  const headline = cleanHeadline(s.heroHeadline);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${s.institutionName} — Catholic School Marketing Profile`,
    description: `Marketing intelligence analysis of ${s.institutionName}, a ${s.type} in ${s.city}, ${s.state}.`,
    about: {
      '@type': 'EducationalOrganization',
      name: s.institutionName,
      address: { '@type': 'PostalAddress', addressLocality: s.city, addressRegion: s.state },
      url: s.websiteUrl ? `https://${s.websiteUrl}` : undefined,
    },
    publisher: { '@type': 'Organization', name: 'SchoolContent' },
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ background: 'var(--navy)', padding: '3rem 0 0' }}>
        <div className="container">
          <a href="/search" style={{ fontSize: '0.9rem', color: 'var(--ink-faint)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem', textDecoration: 'none' }}>
            ← Back to search
          </a>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="tag tag-red">{s.type?.includes('High School') ? 'High School' : 'University'}</span>
            <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{s.region}</span>
            {hasValue(s.religiousOrder) && (
              <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--parchment-dark)', borderColor: 'rgba(255,255,255,0.2)' }}>{s.religiousOrder}</span>
            )}
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, marginBottom: '6px', fontSize: '2.25rem' }}>
            {s.institutionName}
          </h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', marginBottom: '1.5rem' }}>
            {s.city}, {s.state}
            {hasValue(s.websiteUrl) && (
              <> · <a href={`https://${s.websiteUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--parchment-dark)' }}>{s.websiteUrl} ↗</a></>
            )}
          </p>

          <div style={{ display: 'flex', gap: '4px' }}>
            <TabLink href={`/school/${params.slug}`} label="Homepage" active={activeTab === 'homepage'} />
            <TabLink href={`/school/${params.slug}?tab=admissions`} label="Admissions" active={activeTab === 'admissions'} locked={!hasAdmissions} tier="Individual" />
            <TabLink href={`/school/${params.slug}?tab=linkedin`} label="LinkedIn" active={activeTab === 'linkedin'} locked={true} tier="Individual" />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>

        {activeTab === 'admissions' && admissions && (
          <AdmissionsTab admissions={admissions} slug={params.slug} />
        )}

        {activeTab === 'admissions' && !admissions && (
          <LockedTab label="Admissions" message="Admissions page analysis is available for schools in our deep-analysis database. More schools are added regularly." />
        )}

        {activeTab === 'linkedin' && (
          <LockedTab label="LinkedIn" message="LinkedIn content analysis is coming soon. Upgrade to Individual to be notified when it launches." />
        )}

        {activeTab === 'homepage' && (
          <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {hasDeepAnalysis && (
                <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--red), #c0392b)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <div style={{ width: '28px', height: '1px', background: 'var(--parchment-dark)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--parchment-dark)' }}>Full Analysis</span>
                  </div>
                  <p style={{ fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.8 }}>{s.deepNarrativeAnalysis}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                    {hasValue(s.deepNotableStrengths) && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment-dark)', marginBottom: '6px' }}>Notable Strengths</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', lineHeight: 1.6 }}>{s.deepNotableStrengths}</p>
                      </div>
                    )}
                    {hasValue(s.deepNotableGaps) && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment-dark)', marginBottom: '6px' }}>Opportunities</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', lineHeight: 1.6 }}>{s.deepNotableGaps}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <ProfileSection title="Hero Headline">
                {hasValue(headline) && (
                  <div style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '3px solid var(--red)', paddingLeft: '1.25rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    {headline}
                  </div>
                )}
                {hasValue(s.deepPrimaryMessage) && (
                  <div style={{ background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-light)', marginBottom: '4px' }}>Primary Message</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.6 }}>{s.deepPrimaryMessage}</p>
                  </div>
                )}
                <DataRow label="Message type" value={s.heroMessageType} />
                <DataRow label="Primary audience" value={s.primaryAudienceFocus} />
                <DataRow label="Faith identity posture" value={s.faithIdentityPosture} />
                <DataRow label="Catholic order named" value={s.catholicOrderNamedOnHomepage} />
              </ProfileSection>

              <ProfileSection title="Messaging Analysis">
                {hasValue(s.deepKeyPhrases) && (
                  <div style={{ background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-light)', marginBottom: '6px' }}>Key Phrases</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--navy)', lineHeight: 1.6 }}>{cleanQuote(s.deepKeyPhrases)}</p>
                  </div>
                )}
                <DataRow label="Strongest phrase" value={cleanQuote(s.strongestPhrase)} />
                <DataRow label="Weakest pattern" value={s.weakestPatternIdentified} />
                <DataRow label="CTA labels" value={cleanQuote(s.ctaLabels)} />
                {hasValue(s.deepCtaLabels) && <DataRow label="Page CTAs" value={cleanQuote(s.deepCtaLabels)} />}
                <DataRow label="Nav labels" value={toTitleCase(s.navTopLabels)} />
              </ProfileSection>

              <ProfileSection title="Visual Theology">
                {hasValue(s.deepVisualTheologyNote) && (
                  <div style={{ background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--navy)', lineHeight: 1.65 }}>{s.deepVisualTheologyNote}</p>
                  </div>
                )}
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
                <ScoreRow label="Service / justice language" value={s.serviceJusticeLanguage} />
                <ScoreRow label="Admissions CTA" value={s.admissionsCtaProminence} />
                <ScoreRow label="Mobile friction (taps)" value={s.mobileFrictionTapsToInquiry} />
              </div>

              <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-faint)', marginBottom: '8px' }}>Want more?</div>
                <p style={{ fontWeight: 600, color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>Unlock all pages & export</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Individual plan adds admissions, academics, and faith pages plus CSV export.
                </p>
                <a href="/pricing" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                  Upgrade — from $49/mo
                </a>
              </div>

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

function TabLink({ href, label, active, locked, tier }: { href: string; label: string; active: boolean; locked?: boolean; tier?: string }) {
  return (
    <a href={locked ? '/pricing' : href} style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600,
      borderRadius: 'var(--radius) var(--radius) 0 0',
      background: active ? 'var(--parchment)' : 'rgba(255,255,255,0.08)',
      color: active ? 'var(--navy)' : 'var(--parchment-dark)',
      textDecoration: 'none',
      border: active ? '1px solid var(--border)' : '1px solid transparent',
      borderBottom: active ? '1px solid var(--parchment)' : '1px solid transparent',
    }}>
      {label}
      {locked && (
        <span style={{ fontSize: '0.65rem', background: 'var(--red)', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
          {tier}
        </span>
      )}
    </a>
  );
}

function AdmissionsTab({ admissions, slug }: { admissions: AdmissionsAnalysis; slug: string }) {
  return (
    <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {hasValue(admissions.narrativeAnalysis) && (
          <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--red), #c0392b)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '28px', height: '1px', background: 'var(--parchment-dark)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--parchment-dark)' }}>Admissions Page Analysis</span>
            </div>
            <p style={{ fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.8 }}>{admissions.narrativeAnalysis}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
              {hasValue(admissions.notableStrengths) && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment-dark)', marginBottom: '6px' }}>Notable Strengths</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', lineHeight: 1.6 }}>{admissions.notableStrengths}</p>
                </div>
              )}
              {hasValue(admissions.opportunities) && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--parchment-dark)', marginBottom: '6px' }}>Opportunities</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--parchment-dark)', lineHeight: 1.6 }}>{admissions.opportunities}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <ProfileSection title="Admissions Page Content">
          {hasValue(admissions.heroHeadline) && (
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--navy)', borderLeft: '3px solid var(--red)', paddingLeft: '1.25rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              {admissions.heroHeadline.replace(/^"|"$/g, '')}
            </div>
          )}
          {hasValue(admissions.primaryMessage) && (
            <div style={{ background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-light)', marginBottom: '4px' }}>Primary Message</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.6 }}>{admissions.primaryMessage}</p>
            </div>
          )}
          {hasValue(admissions.keyPhrases) && (
            <div style={{ background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-light)', marginBottom: '4px' }}>Key Phrases</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--navy)', lineHeight: 1.6 }}>{cleanQuote(admissions.keyPhrases)}</p>
            </div>
          )}
          <DataRow label="CTA labels" value={cleanQuote(admissions.ctaLabels)} />
          <DataRow label="Visual theology" value={admissions.visualTheologyNote} />
          {hasValue(admissions.pageUrl) && (
            <div style={{ padding: '10px 0' }}>
              <a href={admissions.pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--red)', fontWeight: 600 }}>
                View admissions page ↗
              </a>
            </div>
          )}
        </ProfileSection>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-faint)', marginBottom: '8px' }}>Want more?</div>
          <p style={{ fontWeight: 600, color: '#fff', fontSize: '1rem', marginBottom: '8px' }}>See all pages & export</p>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Upgrade to access academics, faith & mission pages and CSV export.
          </p>
          <a href="/pricing" className="btn btn-primary" style={{ background: 'var(--red)', borderColor: 'var(--red)', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
            Upgrade — from $49/mo
          </a>
        </div>
        <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>Page Info</div>
          <DataRow label="Page type" value={admissions.pageType} />
        </div>
      </div>
    </div>
  );
}

function LockedTab({ label, message }: { label: string; message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
      <h3 style={{ marginBottom: '0.75rem' }}>{label} Analysis</h3>
      <p style={{ color: 'var(--ink-mid)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{message}</p>
      <a href="/pricing" className="btn btn-primary">See plans & pricing →</a>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: '0.5px solid var(--border-light)' }}>
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

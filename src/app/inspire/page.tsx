'use client';

import { useState, useEffect } from 'react';

const CHIPS = [
  'Known for academic excellence',
  'Strong Jesuit identity',
  'Belonging and community',
  'Faith and service',
  'Preparing students for careers',
  'Small school, big experience',
  'NCAA athletics and faith',
  'Women\'s education and leadership',
  'Urban school, global mission',
  'First-generation college students',
];

const EXCLUSION_CHIPS = [
  'Too prestige-heavy',
  'Too outcomes-focused',
  'Too generic Catholic',
  'Too academic/formal',
  'Too athletics-focused',
  'Too mission-heavy',
];

interface Result {
  schoolId: string;
  institutionName: string;
  city: string;
  state: string;
  type: string;
  region: string;
  matchedTab: string;
  matchReason: string;
  keyPhrases: string[];
  pageUrl?: string;
  deepAnalysis?: boolean;
}

const TAB_LABELS: Record<string, string> = {
  homepage: 'Homepage', admissions: 'Admissions', fullSite: 'Full Site',
  studentLife: 'Student Life', academics: 'Academics',
};

export default function InspirePage() {
  const [goals, setGoals] = useState('');
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [excludeText, setExcludeText] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!goals.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals, exclusions, excludeText, tier: 'starter' }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else { setResults(data.results ?? []); setSearched(true); }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function toggleExclusion(chip: string) {
    setExclusions(prev => prev.includes(chip) ? prev.filter(e => e !== chip) : [...prev, chip]);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', letterSpacing: '0.08em' }}>Paid Feature</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.5rem' }}>Inspiration Finder</h1>
          <p style={{ color: 'var(--ink-faint)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.7 }}>
            Tell us what your school is known for — or wants to be known for. We'll find Catholic schools using similar language and pull the exact phrases they use.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Main */}
          <div>
            {/* Goals input */}
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>
                What is your school known for — or what do you want it to be known for?
              </div>

              {/* Suggestion chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {CHIPS.map(chip => (
                  <button key={chip} onClick={() => setGoals(chip)} style={{
                    fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
                    background: goals === chip ? 'var(--navy)' : 'var(--parchment-mid)',
                    color: goals === chip ? '#fff' : 'var(--ink-mid)',
                    border: `1px solid ${goals === chip ? 'var(--navy)' : 'var(--border)'}`,
                    fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'all 0.15s',
                  }}>
                    {chip}
                  </button>
                ))}
              </div>

              <textarea
                value={goals}
                onChange={e => setGoals(e.target.value)}
                placeholder="Or describe in your own words... e.g. 'We want to be known for our strong sense of community, Franciscan values, and preparing students for meaningful careers'"
                rows={4}
                style={{
                  width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '12px 14px', fontSize: '0.95rem', color: 'var(--ink)',
                  background: 'var(--parchment)', fontFamily: 'var(--font-body)',
                  resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6,
                }}
              />
            </div>

            {/* Exclusions */}
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '0.5rem' }}>
                What do you NOT want to be associated with?
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: '1rem' }}>Optional — helps filter results</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {EXCLUSION_CHIPS.map(chip => (
                  <button key={chip} onClick={() => toggleExclusion(chip)} style={{
                    fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
                    background: exclusions.includes(chip) ? '#2a2a2a' : 'var(--parchment-mid)',
                    color: exclusions.includes(chip) ? '#fff' : 'var(--ink-mid)',
                    border: `1px solid ${exclusions.includes(chip) ? '#2a2a2a' : 'var(--border)'}`,
                    fontFamily: 'var(--font-body)', fontWeight: 500,
                  }}>
                    {exclusions.includes(chip) ? `✕ ${chip}` : chip}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={excludeText}
                onChange={e => setExcludeText(e.target.value)}
                placeholder="Or describe what to avoid..."
                style={{
                  width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '10px 14px', fontSize: '0.9rem', color: 'var(--ink)',
                  background: 'var(--parchment)', fontFamily: 'var(--font-body)', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !goals.trim()}
              style={{
                background: loading || !goals.trim() ? 'var(--ink-faint)' : 'var(--red)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius)',
                padding: '14px 32px', fontSize: '0.95rem', fontWeight: 600,
                cursor: loading || !goals.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', width: '100%', marginBottom: '2rem',
              }}
            >
              {loading ? 'Finding schools…' : 'Find Inspiration →'}
            </button>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem', color: '#991b1b', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-light)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontSize: '1rem' }}>Searching {`>`} 200 schools across all pages…</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)', marginTop: '0.5rem' }}>This takes about 10 seconds</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.2rem' }}>Top matches for your goals</h2>
                  <div style={{ flex: 1, borderTop: '1px solid var(--border)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-faint)' }}>{results.length} schools</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {results.map((result, i) => (
                    <div key={result.schoolId} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: i < 3 ? 'var(--red)' : 'var(--border)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', paddingLeft: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <span className="tag tag-red" style={{ fontSize: '0.65rem' }}>
                              {TAB_LABELS[result.matchedTab] ?? result.matchedTab}
                            </span>
                            <span className="tag" style={{ fontSize: '0.65rem' }}>{result.region}</span>
                            {result.deepAnalysis && (
                              <span className="tag tag-navy" style={{ fontSize: '0.65rem' }}>Full Analysis</span>
                            )}
                          </div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>
                            {result.institutionName}
                          </h3>
                          <p style={{ fontSize: '0.82rem', color: 'var(--ink-faint)' }}>{result.city}, {result.state} · {result.type?.includes('High School') ? 'High School' : 'University'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <a href={`/school/${result.schoolId}`} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                            Profile →
                          </a>
                          {result.pageUrl && (
                            <a href={result.pageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--red)', borderRadius: 'var(--radius)' }}>
                              Live page ↗
                            </a>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: '12px', paddingLeft: '8px' }}>
                        {result.matchReason}
                      </p>

                      {result.keyPhrases?.length > 0 && (
                        <div style={{ paddingLeft: '8px' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Key phrases from this school</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {result.keyPhrases.map((phrase, pi) => (
                              <div key={pi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>"</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 500, lineHeight: 1.5 }}>{phrase}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searched && results.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-light)' }}>
                <p style={{ fontSize: '1rem' }}>No strong matches found. Try different goals or fewer exclusions.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--navy)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '1rem' }}>How it works</div>
              {[
                { step: '1', text: 'Describe your school\'s goals or identity' },
                { step: '2', text: 'Optionally exclude language you want to avoid' },
                { step: '3', text: 'AI searches across all pages for every school' },
                { step: '4', text: 'Get matched schools with the exact phrases they use' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {step}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--parchment-dark)', lineHeight: 1.5, marginTop: '3px' }}>{text}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '0.75rem' }}>Your plan</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-mid)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Starter plan returns 5 matches per search. Upgrade to Team for 15, Agency for unlimited.
              </p>
              <a href="/pricing" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}>View all plans →</a>
            </div>

            <div style={{ background: 'var(--parchment-mid)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)', marginBottom: '0.75rem' }}>Pro tip</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-mid)', lineHeight: 1.6 }}>
                Pin schools you like to your Pinboard and add notes about what specifically inspired you.
              </p>
              <a href="/pins" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', textDecoration: 'none', display: 'block', marginTop: '0.5rem' }}>Go to Pinboard →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

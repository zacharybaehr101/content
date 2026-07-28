import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSchools, fetchAdmissionsData, fetchFullSiteData, fetchStudentLifeData, fetchAcademicsData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

const SUGGESTION_CHIPS = [
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

export async function GET() {
  return NextResponse.json({ chips: SUGGESTION_CHIPS });
}

export async function POST(req: NextRequest) {
  try {
    const { goals, exclusions, excludeText, tier = 'free' } = await req.json();

    if (!goals?.trim()) {
      return NextResponse.json({ error: 'Goals are required' }, { status: 400 });
    }

    const resultLimit = tier === 'agency' ? 999 : tier === 'team' ? 15 : 5;

    // Fetch all data in parallel
    const [schools, admissionsMap, fullSiteMap, studentLifeMap, academicsMap] = await Promise.all([
      fetchAllSchools(),
      fetchAdmissionsData(),
      fetchFullSiteData(),
      fetchStudentLifeData(),
      fetchAcademicsData(),
    ]);

    // Build condensed dataset for Claude
    const dataset = schools.slice(0, 120).map(school => {
      const admissions = admissionsMap.get(school.id);
      const fullSite = fullSiteMap.get(school.id);
      const studentLife = studentLifeMap.get(school.id);
      const academics = academicsMap.get(school.id);

      return {
        id: school.id,
        name: school.institutionName,
        type: school.type,
        region: school.region,
        city: school.city,
        state: school.state,
        religiousOrder: school.religiousOrder,
        homepage: {
          headline: school.heroHeadline,
          faithPosture: school.faithIdentityPosture,
          strongestPhrase: school.strongestPhrase,
          keyPhrases: school.deepKeyPhrases,
          belonging: school.belongingLanguageStrength,
          narrative: school.deepNarrativeAnalysis?.slice(0, 200),
        },
        admissions: admissions ? {
          headline: admissions.heroHeadline,
          message: admissions.primaryMessage,
          keyPhrases: admissions.keyPhrases,
          strengths: admissions.notableStrengths,
        } : null,
        fullSite: fullSite ? {
          theme: fullSite.overallThemeTone,
          catholic: fullSite.catholicFactor,
          whatToSteal: fullSite.whatToSteal,
          narrative: fullSite.narrative?.slice(0, 200),
        } : null,
        studentLife: studentLife ? {
          belonging: studentLife.belongingCommunityFocus,
          catholic: studentLife.catholicFactor,
          whatToSteal: studentLife.whatToSteal,
        } : null,
        academics: academics ? {
          positioning: academics.strategicPositioningCoreMessaging?.slice(0, 150),
          differentiators: academics.notableFeaturesDifferentiators,
        } : null,
      };
    });

    const prompt = `You are a Catholic school marketing intelligence analyst. A user is looking for inspiration from other Catholic schools.

USER GOALS: "${goals}"
${exclusions?.length ? `AVOID SCHOOLS THAT ARE: ${exclusions.join(', ')}` : ''}
${excludeText?.trim() ? `ALSO AVOID: ${excludeText}` : ''}

Here is the database of Catholic schools and their content analysis:
${JSON.stringify(dataset, null, 0)}

Find the ${resultLimit} most relevant schools that match the user's goals. For each match:
1. Identify which page/tab has the most relevant content (homepage, admissions, fullSite, studentLife, academics)
2. Pull 2-3 specific phrases or quotes from that school's data that align with the user's goals
3. Explain briefly why this school is a good match

Return ONLY valid JSON in this exact format:
{
  "results": [
    {
      "schoolId": "school-slug",
      "institutionName": "Full School Name",
      "city": "City",
      "state": "ST",
      "type": "High School or University",
      "region": "Region",
      "matchedTab": "homepage|admissions|fullSite|studentLife|academics",
      "matchReason": "One sentence explaining why this school matches the goals",
      "keyPhrases": ["phrase 1", "phrase 2", "phrase 3"]
    }
  ]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);

    // Enrich results with page URLs
    const enriched = parsed.results.map((r: any) => {
      const school = schools.find(s => s.id === r.schoolId);
      const admissions = admissionsMap.get(r.schoolId);
      const fullSite = fullSiteMap.get(r.schoolId);
      let pageUrl = school?.websiteUrl ? `https://${school.websiteUrl}` : '';
      if (r.matchedTab === 'admissions' && admissions?.pageUrl) pageUrl = admissions.pageUrl;
      if (r.matchedTab === 'fullSite' && fullSite?.homepageUrl) pageUrl = fullSite.homepageUrl;
      return { ...r, pageUrl, deepAnalysis: school?.deepAnalysisAvailable };
    });

    return NextResponse.json({ results: enriched, chips: SUGGESTION_CHIPS });

  } catch (err) {
    console.error('Inspire API error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

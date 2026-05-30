import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const get = (key: string) => formData.get(key)?.toString() ?? '';

    const body = `
New School Submission — SchoolContent

SCHOOL INFORMATION
------------------
Name: ${get('institutionName')}
Type: ${get('type')}
Religious Order: ${get('religiousOrder')}
City: ${get('city')}, ${get('state')}

WEBSITE URLS
------------
Main site: ${get('websiteUrl')}
Admissions: ${get('admissionsUrl')}
Academics: ${get('academicsUrl')}
Faith & Mission: ${get('faithUrl')}

SOCIAL MEDIA
------------
Instagram: ${get('instagram')}
Facebook: ${get('facebook')}
LinkedIn: ${get('linkedin')}
Twitter/X: ${get('twitter')}
YouTube: ${get('youtube')}
TikTok: ${get('tiktok')}

CONTACT
-------
Name: ${get('contactName')}
Email: ${get('contactEmail')}
Role: ${get('contactRole')}

NOTES
-----
${get('notes')}
    `.trim();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.SUBMISSION_EMAIL;

    if (RESEND_API_KEY && TO_EMAIL) {
      // Email to you
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [TO_EMAIL],
          reply_to: get('contactEmail') || undefined,
          subject: `New School Submission: ${get('institutionName')}`,
          text: body,
        }),
      });

      // Confirmation to submitter
      if (get('contactEmail')) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: [get('contactEmail')],
            subject: `We received your submission — ${get('institutionName')}`,
            text: `Hi ${get('contactName')},\n\nThanks for submitting ${get('institutionName')} to SchoolContent. We'll analyze your website and social profiles and notify you when your profile is live — usually within 2 weeks.\n\nIn the meantime, browse other profiles at https://content-mu.vercel.app/search\n\n— The SchoolContent Team`,
          }),
        });
      }
    }

    // Always redirect to thank you page — 303 required for HTML form POST redirects
    return NextResponse.redirect(new URL('/submit/thanks', req.url), 303);

  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.redirect(new URL('/submit/thanks', req.url), 303);
  }
}

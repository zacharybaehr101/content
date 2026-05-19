import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const get = (key: string) => formData.get(key)?.toString() ?? '';

    // Build email body
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
Subscribe to notifications: ${get('subscribe') ? 'Yes' : 'No'}

NOTES
-----
${get('notes')}
    `.trim();

    // Send via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.SUBMISSION_EMAIL || process.env.CONTACT_EMAIL;

    if (RESEND_API_KEY && TO_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SchoolContent <submissions@schoolcontent.com>',
          to: [TO_EMAIL],
          reply_to: get('contactEmail'),
          subject: `New School Submission: ${get('institutionName')}`,
          text: body,
        }),
      });

      // Send confirmation to submitter if they want notifications
      if (get('subscribe') && get('contactEmail')) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'SchoolContent <hello@schoolcontent.com>',
            to: [get('contactEmail')],
            subject: `We received your submission — ${get('institutionName')}`,
            text: `Hi ${get('contactName')},

Thanks for submitting ${get('institutionName')} to SchoolContent. We've received your information and will notify you when your school's profile is live — usually within 2 weeks.

In the meantime, you can browse other school profiles at https://content-mu.vercel.app/search

Thanks,
The SchoolContent Team`,
          }),
        });
      }
    }

    // Redirect to thank you
    return NextResponse.redirect(new URL('/submit/thanks', req.url));

  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.redirect(new URL('/submit?error=1', req.url));
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email')?.toString()?.trim();
    const name = formData.get('name')?.toString() ?? '';

    if (!email) {
      return NextResponse.redirect(new URL('/subscribed', req.url), 303);
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
    const NOTIFY_EMAIL = process.env.SUBMISSION_EMAIL;

    if (RESEND_API_KEY) {
      // Add to Resend Audience
      if (RESEND_AUDIENCE_ID) {
        const audienceRes = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, first_name: name, unsubscribed: false }),
        });
        if (!audienceRes.ok) {
          const err = await audienceRes.text();
          console.error('Resend audience error:', err);
        }
      }

      // Notify you of new subscriber — send to your own email
      if (NOTIFY_EMAIL) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'onboarding@resend.dev', // Resend's pre-verified test sender
            to: [NOTIFY_EMAIL],
            subject: `New CampusVox subscriber: ${email}`,
            text: `New subscriber:\n\nEmail: ${email}\nName: ${name || '(not provided)'}\n\nManage at resend.com/audiences`,
          }),
        });
      }
    }

    return NextResponse.redirect(new URL('/subscribed', req.url), 303);

  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.redirect(new URL('/subscribed', req.url), 303);
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email')?.toString()?.trim();
    const interest = formData.get('interest')?.toString() ?? 'general';

    if (!email) {
      return NextResponse.redirect(new URL('/?subscribed=error', req.url));
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

    if (RESEND_API_KEY) {
      // Add to Resend Audience if configured
      if (RESEND_AUDIENCE_ID) {
        await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
            data: { interest, tier: 'free', source: 'website' },
          }),
        });
      }

      // Send welcome email
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SchoolContent <hello@schoolcontent.com>',
          to: [email],
          subject: 'Welcome to SchoolContent',
          text: `Thanks for subscribing to SchoolContent.

You'll hear from us when we add new schools to the database, publish new analysis, and launch new features like LinkedIn profile analysis.

In the meantime, explore the database:
https://content-mu.vercel.app/search

Browse admissions pages:
https://content-mu.vercel.app/admissions

— The SchoolContent Team

To unsubscribe, reply to this email.`,
        }),
      });
    }

    // Redirect back with success flag
    const referer = req.headers.get('referer') ?? '/';
    const url = new URL(referer);
    url.searchParams.set('subscribed', 'true');
    return NextResponse.redirect(url);

  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.redirect(new URL('/?subscribed=error', req.url));
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email')?.toString()?.trim();
    const interest = formData.get('interest')?.toString() ?? 'general';
    const name = formData.get('name')?.toString() ?? '';

    if (!email) {
      return NextResponse.redirect(new URL('/?error=email', req.url));
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

    if (RESEND_API_KEY) {
      // Add to Resend Audience
      if (RESEND_AUDIENCE_ID) {
        await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, first_name: name, unsubscribed: false }),
        });
      }

      // Welcome email
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'SchoolContent <hello@schoolcontent.com>',
          to: [email],
          subject: 'Welcome to SchoolContent',
          text: `${name ? `Hi ${name},\n\n` : ''}Thanks for subscribing to SchoolContent.\n\nYou'll hear from us when we add new schools, publish new analysis, and launch new features like LinkedIn profile analysis.\n\nExplore the database: https://content-mu.vercel.app/search\n\n— The SchoolContent Team`,
        }),
      });
    }

    // Always redirect to confirmation page — 303 required for HTML form POST redirects
    return NextResponse.redirect(new URL('/subscribed', req.url), 303);

  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.redirect(new URL('/subscribed', req.url), 303);
  }
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://content-mu.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/search', '/school/', '/pricing', '/compare'],
        disallow: ['/api/', '/login', '/signup', '/dashboard'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

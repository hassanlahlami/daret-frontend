import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://daret.ma';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private/app areas out of the index.
      disallow: ['/api/', '/fr/admin', '/ar/admin', '/darija/admin', '/fr/compliance', '/ar/compliance', '/darija/compliance']
    },
    sitemap: `${BASE}/sitemap.xml`
  };
}

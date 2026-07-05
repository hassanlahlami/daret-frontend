import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://daret.ma';

// Public, indexable routes (auth-gated app pages are intentionally excluded).
const PATHS = ['', '/tarifs', '/securite', '/login', '/register'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7
    }))
  );
}

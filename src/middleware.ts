import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, generated icons/OG images, Next
  // internals, and files with an extension (manifest.webmanifest, sw.js, …).
  matcher: ['/((?!api|icons|opengraph-image|twitter-image|_next|_vercel|.*\\..*).*)']
};

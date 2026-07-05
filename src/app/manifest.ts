import type { MetadataRoute } from 'next';

// Web app manifest (served at /manifest.webmanifest). Makes the app installable
// as a PWA: home-screen icon, standalone display, splash, theme color.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daret — épargne tournante',
    short_name: 'Daret',
    description:
      'Digitalise la daret marocaine (ROSCA) : cercles, mise en relation, scoring et confiance. Les fonds transitent par un partenaire de paiement agréé.',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0f172a',
    theme_color: '#0f766e',
    lang: 'fr',
    dir: 'ltr',
    categories: ['finance', 'productivity'],
    icons: [
      { src: '/icons/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}

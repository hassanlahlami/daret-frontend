import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, dirFor, type Locale } from '@/i18n/routing';
import { Providers } from '@/app/providers';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { PWARegister } from '@/components/PWARegister';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://daret.ma';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Daret — épargne tournante digitale',
    template: '%s · Daret'
  },
  description:
    'Digitalise la daret marocaine (ROSCA) : mise en relation, scoring, planification et confiance. Les fonds transitent par un partenaire de paiement agréé — la plateforme ne détient jamais votre argent.',
  keywords: ['daret', 'tontine', 'ROSCA', 'épargne tournante', 'Maroc', 'darija', 'cercle d’épargne', 'fintech'],
  openGraph: {
    type: 'website',
    siteName: 'Daret',
    title: 'Daret — épargne tournante digitale',
    description:
      'La daret marocaine, digitale et de confiance : cercles, scoring, planification. Les fonds transitent par un partenaire de paiement agréé.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daret — épargne tournante digitale',
    description: 'La daret marocaine, digitale et de confiance.'
  },
  manifest: '/manifest.webmanifest',
  applicationName: 'Daret',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Daret' },
  icons: {
    icon: [
      { url: '/icons/192', sizes: '192x192', type: 'image/png' },
      { url: '/icons/512', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/icons/180', sizes: '180x180', type: 'image/png' }]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f766e' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ]
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  const themeInit =
    "(function(){try{var t=localStorage.getItem('theme');" +
    "var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);" +
    "document.documentElement.classList.toggle('dark',d);}catch(e){}})();";

  return (
    <html lang={locale} dir={dirFor(locale)} className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <PWARegister />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Nav />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

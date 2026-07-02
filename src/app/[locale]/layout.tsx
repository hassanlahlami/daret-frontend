import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, dirFor, type Locale } from '@/i18n/routing';
import { Providers } from '@/app/providers';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Daret — épargne tournante digitale',
  description:
    'Digitalise la daret marocaine (ROSCA) : mise en relation, scoring, planification et confiance. Les fonds transitent par un partenaire de paiement agréé — la plateforme ne détient jamais votre argent.'
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

  return (
    <html lang={locale} dir={dirFor(locale)} className={inter.variable}>
      <body className="font-sans">
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

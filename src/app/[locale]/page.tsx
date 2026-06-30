import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { HealthStatus } from '@/components/HealthStatus';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { use } from 'react';

export default function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const tCommon = useTranslations('Common');
  const t = useTranslations('Home');

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand">{tCommon('appName')}</h1>
          <p className="text-sm text-slate-500">{tCommon('tagline')}</p>
        </div>
        <LocaleSwitcher />
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t('heading')}</h2>
        <p className="leading-relaxed text-slate-600">{t('intro')}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('healthTitle')}
        </h3>
        <HealthStatus />
      </section>
    </main>
  );
}

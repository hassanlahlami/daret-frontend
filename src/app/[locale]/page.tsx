import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge, buttonClass, Card, Container, Eyebrow } from '@/components/ui';
import { IconArrow, IconChart, IconCoins, IconLock, IconShield } from '@/components/Icons';
import { HealthStatus } from '@/components/HealthStatus';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('Landing');

  const steps = [
    { n: 1, title: t('step1Title'), body: t('step1Body') },
    { n: 2, title: t('step2Title'), body: t('step2Body') },
    { n: 3, title: t('step3Title'), body: t('step3Body') }
  ];
  const values = [
    { icon: IconShield, title: t('v1Title'), body: t('v1Body') },
    { icon: IconCoins, title: t('v2Title'), body: t('v2Body') },
    { icon: IconChart, title: t('v3Title'), body: t('v3Body') },
    { icon: IconLock, title: t('v4Title'), body: t('v4Body') }
  ];
  const invariants = [t('c1'), t('c2'), t('c3'), t('c4')];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="absolute inset-0 -z-10 bg-dot-grid opacity-60" />
        <Container className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="flex flex-col gap-6 animate-fade-up">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              {t('title')} <span className="text-brand-600">{t('titleAccent')}</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">{t('subtitle')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/register" className={buttonClass('primary', 'lg')}>
                {t('ctaPrimary')} <IconArrow className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href="/circles" className={buttonClass('outline', 'lg')}>{t('ctaSecondary')}</Link>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge tone="green">{t('trust1')}</Badge>
              <Badge tone="brand">{t('trust2')}</Badge>
              <Badge tone="amber">{t('trust3')}</Badge>
            </div>
          </div>

          {/* Hero visual card */}
          <div className="animate-fade-up lg:justify-self-end">
            <Card className="w-full max-w-sm shadow-glow">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{t('cardTitle')}</span>
                <Badge tone="brand">{t('cardTag')}</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                      {i}
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-brand-500"
                        style={{ width: `${[100, 100, 60, 0][i - 1]}%` }}
                      />
                    </div>
                    <span className="w-16 text-end text-xs text-slate-400">
                      {['payé', 'payé', 'en cours', 'à venir'][i - 1]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <HealthStatus />
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <Container className="py-16">
        <div className="mb-10 text-center">
          <Eyebrow>{t('stepsEyebrow')}</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{t('stepsTitle')}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.n}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </Card>
          ))}
        </div>
      </Container>

      {/* Value props */}
      <Container className="py-16">
        <div className="mb-10 text-center">
          <Eyebrow>{t('valueEyebrow')}</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{t('valueTitle')}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Card key={i}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <v.icon />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.body}</p>
            </Card>
          ))}
        </div>
      </Container>

      {/* Compliance band */}
      <section className="bg-brand-900 py-16 text-white">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              {t('complianceEyebrow')}
            </span>
            <h2 className="mt-2 text-3xl font-bold">{t('complianceTitle')}</h2>
            <p className="mt-3 max-w-md leading-relaxed text-brand-100">{t('complianceBody')}</p>
          </div>
          <ul className="grid gap-3">
            {invariants.map((c, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3">
                <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                <span className="text-sm text-brand-50">{c}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Final CTA */}
      <Container className="py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900">{t('ctaTitle')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{t('ctaBody')}</p>
        <div className="mt-6 flex justify-center">
          <Link href="/register" className={buttonClass('primary', 'lg')}>
            {t('ctaButton')} <IconArrow className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </Container>
    </div>
  );
}

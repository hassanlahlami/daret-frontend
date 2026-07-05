import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge, buttonClass, Card, Container, Eyebrow } from '@/components/ui';
import { IconArrow, IconShield } from '@/components/Icons';
import { WaitlistForm } from '@/components/WaitlistForm';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Pricing' });
  return { title: t('eyebrow'), description: t('subtitle') };
}

type Plan = { key: 'member' | 'organizer' | 'business'; featured: boolean; href: string };

const PLANS: Plan[] = [
  { key: 'member', featured: false, href: '/register' },
  { key: 'organizer', featured: true, href: '/register' },
  { key: 'business', featured: false, href: '#waitlist' }
];

export default function PricingPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('Pricing');

  return (
    <div>
      <section className="bg-hero-radial">
        <Container className="py-16 text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">{t('subtitle')}</p>
        </Container>
      </section>

      <Container className="pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => {
            const features = t.raw(`${p.key}Features`) as string[];
            return (
              <Card
                key={p.key}
                className={
                  p.featured
                    ? 'relative border-brand-300 ring-2 ring-brand-200'
                    : 'relative'
                }
              >
                {p.featured && (
                  <span className="absolute -top-3 start-6">
                    <Badge tone="brand">{t('popular')}</Badge>
                  </span>
                )}
                <h2 className="text-lg font-bold text-slate-900">{t(`${p.key}Name`)}</h2>
                <p className="mt-1 text-sm text-slate-500">{t(`${p.key}Tag`)}</p>
                <p className="mt-4 text-3xl font-bold text-slate-900">{t(`${p.key}Price`)}</p>
                <ul className="mt-5 flex flex-col gap-2 text-sm text-slate-600">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 text-brand-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={buttonClass(p.featured ? 'primary' : 'outline', 'md', 'mt-6 w-full')}
                >
                  {t(`${p.key}Cta`)}
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>

      {/* Fee transparency */}
      <section className="bg-brand-900 py-16 text-white">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              {t('feeEyebrow')}
            </span>
            <h2 className="mt-2 text-2xl font-bold">{t('feeTitle')}</h2>
            <p className="mt-3 max-w-md leading-relaxed text-brand-100">{t('feeBody')}</p>
          </div>
          <ul className="grid gap-3">
            {(t.raw('feePoints') as string[]).map((c, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3">
                <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                <span className="text-sm text-brand-50">{c}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Waitlist / CTA */}
      <section id="waitlist">
      <Container className="py-16">
        <Card className="mx-auto max-w-2xl text-center shadow-glow">
          <Eyebrow>{t('ctaEyebrow')}</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{t('ctaBody')}</p>
          <div className="mt-6">
            <WaitlistForm />
          </div>
          <div className="mt-6">
            <Link href="/register" className={buttonClass('primary', 'lg')}>
              {t('ctaButton')} <IconArrow className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </Card>
      </Container>
      </section>
    </div>
  );
}

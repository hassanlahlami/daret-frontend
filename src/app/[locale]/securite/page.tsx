import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge, buttonClass, Card, Container, Eyebrow } from '@/components/ui';
import { IconArrow, IconChart, IconCoins, IconLock, IconShield } from '@/components/Icons';

export default function SecurityPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('Security');

  const invariants = [
    { icon: IconCoins, title: t('i1Title'), body: t('i1Body'), law: 'Loi 103-12' },
    { icon: IconShield, title: t('i2Title'), body: t('i2Body'), law: 'Sharia' },
    { icon: IconLock, title: t('i3Title'), body: t('i3Body'), law: 'SHA-256' },
    { icon: IconShield, title: t('i4Title'), body: t('i4Body'), law: 'CNDP · 09-08' },
    { icon: IconShield, title: t('i5Title'), body: t('i5Body'), law: 'AML / KYC' },
    { icon: IconChart, title: t('i6Title'), body: t('i6Body'), law: 'Exposure cap' }
  ];
  const refs = [t('ref1'), t('ref2'), t('ref3'), t('ref4')];

  return (
    <div>
      <section className="bg-hero-radial">
        <Container className="py-16 text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mx-auto mt-2 max-w-2xl text-4xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{t('subtitle')}</p>
        </Container>
      </section>

      <Container className="pb-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invariants.map((inv, i) => (
            <Card key={i} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <inv.icon />
                </div>
                <Badge tone="brand">{inv.law}</Badge>
              </div>
              <h3 className="font-semibold text-slate-900">{inv.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{inv.body}</p>
            </Card>
          ))}
        </div>
      </Container>

      {/* How the audit chain works */}
      <section className="py-14">
        <Container>
          <div className="rounded-2xl bg-brand-900 p-8 text-white">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              {t('auditEyebrow')}
            </span>
            <h2 className="mt-2 text-2xl font-bold">{t('auditTitle')}</h2>
            <p className="mt-2 max-w-2xl text-brand-100">{t('auditBody')}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 px-4 py-3 font-mono text-xs">
                    <div className="text-brand-300">event #{n}</div>
                    <div className="text-brand-50">hash = SHA-256(prev + payload)</div>
                  </div>
                  {n < 3 && <IconArrow className="h-4 w-4 text-brand-300 rtl:rotate-180" />}
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-brand-200">{t('auditFormula')}</p>
          </div>
        </Container>
      </section>

      {/* Legal references */}
      <Container className="pb-16">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{t('refTitle')}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {refs.map((r, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {r}
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link href="/register" className={buttonClass('primary', 'lg')}>
            {t('ctaButton')} <IconArrow className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </Container>
    </div>
  );
}

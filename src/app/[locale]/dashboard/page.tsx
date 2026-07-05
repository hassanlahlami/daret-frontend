'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@/i18n/navigation';
import { RequireAuth } from '@/components/RequireAuth';
import { ScoreGauge } from '@/components/ScoreGauge';
import { BarChart } from '@/components/BarChart';
import { EmptyState } from '@/components/EmptyState';
import { OnboardingChecklist, type OnboardingStep } from '@/components/OnboardingChecklist';
import { IconCoins, IconChart } from '@/components/Icons';
import { Button, Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api-client';

function daysUntil(dateIso: string): number {
  const d = new Date(dateIso + 'T00:00:00');
  return Math.round((d.getTime() - Date.now()) / 86_400_000);
}

function DashboardInner() {
  const t = useTranslations('Dashboard');
  const to = useTranslations('Onboarding');
  const locale = useLocale();

  const score = useQuery({ queryKey: ['score'], queryFn: api.myScore });
  const obligations = useQuery({ queryKey: ['obligations'], queryFn: api.myObligations });
  const payouts = useQuery({ queryKey: ['payouts'], queryFn: api.myPayouts });
  const vouches = useQuery({ queryKey: ['vouches'], queryFn: api.myVouches });
  const history = useQuery({ queryKey: ['scoreHistory'], queryFn: api.myScoreHistory });
  const kyc = useQuery({ queryKey: ['kyc'], queryFn: api.getKyc, retry: false });
  const circles = useQuery({ queryKey: ['myCircles'], queryFn: api.myCircles });

  const kycVerified = kyc.data?.status === 'VERIFIED';
  const hasCircle = (circles.data?.length ?? 0) > 0;
  const hasActive = circles.data?.some((c) => c.status === 'ACTIVE' || c.status === 'COMPLETED') ?? false;
  const steps: OnboardingStep[] = [
    { label: to('stepKycLabel'), hint: to('stepKycHint'), done: kycVerified, href: '/kyc', cta: to('stepKycCta') },
    { label: to('stepCircleLabel'), hint: to('stepCircleHint'), done: hasCircle, href: '/circles', cta: to('stepCircleCta') },
    { label: to('stepActiveLabel'), hint: to('stepActiveHint'), done: hasActive, href: '/circles', cta: to('stepActiveCta') }
  ];
  const qc = useQueryClient();
  const pay = useMutation({
    mutationFn: (id: string) => api.payObligation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['obligations'] });
      qc.invalidateQueries({ queryKey: ['payouts'] });
    }
  });

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);

  const dueLabel = (iso: string) => {
    const n = daysUntil(iso);
    return n < 0 ? t('overdue') : t('dueIn', { n });
  };

  return (
    <Container className="max-w-3xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-slate-900">{t('title')}</h1>

      <OnboardingChecklist steps={steps} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Score */}
        <Card className="flex items-center gap-5">
          {score.data && <ScoreGauge score={score.data.score} tier={score.data.tier} />}
          <div>
            <p className="text-sm text-slate-500">{t('score')}</p>
            <p className="text-lg font-semibold text-slate-800">{score.data?.score ?? '—'} / 1000</p>
            <p className="mt-1 text-sm text-slate-500">{t('tier')}: <span className="font-semibold">{score.data?.tier ?? '—'}</span></p>
            <p className="mt-1 text-sm text-slate-500">{t('vouches')}: <span className="font-semibold">{vouches.data?.received ?? 0}</span></p>
          </div>
        </Card>

        {/* Next obligation summary */}
        <Card>
          <p className="text-sm text-slate-500">{t('obligations')}</p>
          {obligations.data?.length ? (
            <>
              <p className="mt-1 text-2xl font-bold text-slate-900">{obligations.data.length}</p>
              <p className="text-sm text-slate-500">
                {t('next')}: {money(obligations.data[0].amount)} · {dueLabel(obligations.data[0].dueDate)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">{t('none')}</p>
          )}
        </Card>
      </div>

      {/* Score trend */}
      {(history.data?.length ?? 0) >= 2 && (
        <Card className="mt-6">
          <BarChart
            title={t('scoreTrend')}
            data={history.data!.map((p) => ({
              label: new Date(p.at).toLocaleDateString(locale === 'darija' ? 'fr' : locale, { month: '2-digit', day: '2-digit' }),
              count: p.score
            }))}
          />
        </Card>
      )}

      {/* My circles */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('myCircles')}</h2>
          <Link href="/circles" className="text-sm text-brand-700 hover:underline">{t('discoverLink')}</Link>
        </div>
        {circles.data?.length ? (
          <Card className="divide-y divide-slate-100 p-0">
            {circles.data.map((c) => (
              <Link key={c.id} href={`/circles/${c.id}`}
                className="flex items-center justify-between px-5 py-3 text-sm transition hover:bg-slate-50">
                <span className="font-medium text-slate-800">{c.name}</span>
                <span className="text-slate-500">{c.filledSeats}/{c.seatCount}</span>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </Card>
        ) : (
          <EmptyState icon={<IconChart />} title={t('emptyCirclesTitle')} description={t('emptyCirclesDesc')}
            ctaLabel={t('discoverLink')} ctaHref="/circles" />
        )}
      </section>

      {/* Obligations list */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('obligations')}</h2>
        {obligations.data?.length ? (
          <Card className="divide-y divide-slate-100 p-0">
            {obligations.data.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-slate-500">{t('cycle')} {c.cycleIndex}</span>
                <span className="font-medium">{money(c.amount)}</span>
                <span className="text-slate-500">{dueLabel(c.dueDate)}</span>
                <StatusBadge status={c.status} />
                <Button size="sm" variant="outline" onClick={() => pay.mutate(c.id)} disabled={pay.isPending}>
                  {t('payNow')}
                </Button>
              </div>
            ))}
          </Card>
        ) : (
          <EmptyState icon={<IconCoins />} title={t('emptyObligationsTitle')} description={t('emptyObligationsDesc')} />
        )}
      </section>

      {/* Payouts */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('payouts')}</h2>
        {payouts.data?.length ? (
          <Card className="divide-y divide-slate-100 p-0">
            {payouts.data.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-slate-500">{t('cycle')} {p.cycleIndex}</span>
                <span className="font-medium">{money(p.amount)}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </Card>
        ) : (
          <EmptyState icon={<IconCoins />} title={t('emptyPayoutsTitle')} description={t('emptyPayoutsDesc')} />
        )}
      </section>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}

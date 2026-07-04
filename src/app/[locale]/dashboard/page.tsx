'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button, Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api-client';

function daysUntil(dateIso: string): number {
  const d = new Date(dateIso + 'T00:00:00');
  return Math.round((d.getTime() - Date.now()) / 86_400_000);
}

function DashboardInner() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();

  const score = useQuery({ queryKey: ['score'], queryFn: api.myScore });
  const obligations = useQuery({ queryKey: ['obligations'], queryFn: api.myObligations });
  const payouts = useQuery({ queryKey: ['payouts'], queryFn: api.myPayouts });
  const vouches = useQuery({ queryKey: ['vouches'], queryFn: api.myVouches });
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
        ) : <p className="text-sm text-slate-500">{t('none')}</p>}
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
        ) : <p className="text-sm text-slate-500">{t('none')}</p>}
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

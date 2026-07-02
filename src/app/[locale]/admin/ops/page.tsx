'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { Button, Card, Container, Eyebrow } from '@/components/ui';
import { api } from '@/lib/api-client';

function OpsInner() {
  const t = useTranslations('Admin');
  const [asOf, setAsOf] = useState('');

  const cycle = useMutation({ mutationFn: () => api.runCycle(asOf || undefined) });
  const sweep = useMutation({ mutationFn: () => api.runDefaultSweep(asOf || undefined) });

  const field = 'rounded-xl border border-slate-300 px-3 py-2 text-sm';

  return (
    <Container className="max-w-3xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('ops')}</h1>
      <AdminTabs />

      <label className="mb-4 flex flex-col gap-1 text-sm text-slate-600">
        {t('asOf')}
        <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className={`${field} w-fit`} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <p className="font-semibold text-slate-800">{t('runCycle')}</p>
          <Button onClick={() => cycle.mutate()} disabled={cycle.isPending} className="w-fit">{t('run')}</Button>
          {cycle.data && (
            <p className="text-sm text-slate-500">
              {t('result')}: {cycle.data.collectionsIssued} / {cycle.data.payoutsIssued} / {cycle.data.eventsRelayed}
            </p>
          )}
        </Card>

        <Card className="flex flex-col gap-3">
          <p className="font-semibold text-slate-800">{t('runSweep')}</p>
          <Button variant="outline" onClick={() => sweep.mutate()} disabled={sweep.isPending} className="w-fit">{t('run')}</Button>
          {sweep.data && (
            <p className="text-sm text-slate-500">
              {t('result')}: missed {sweep.data.missedMarked} · late {sweep.data.membersLate} · defaulted {sweep.data.membersDefaulted}
            </p>
          )}
        </Card>
      </div>
    </Container>
  );
}

export default function AdminOpsPage() {
  return (
    <RequireAuth role="ADMIN">
      <OpsInner />
    </RequireAuth>
  );
}

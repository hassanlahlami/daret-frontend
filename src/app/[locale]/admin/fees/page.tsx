'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { Button, Card, Container, Eyebrow } from '@/components/ui';
import { api, ApiError } from '@/lib/api-client';

const TIERS = ['A', 'B', 'C', 'D', 'E'] as const;

function FeesInner() {
  const t = useTranslations('Admin');
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['feeSchedules'], queryFn: api.listFeeSchedules });

  const [name, setName] = useState('');
  const [serviceFee, setServiceFee] = useState(25);
  const [baseFee, setBaseFee] = useState(50);
  const [redistribution, setRedistribution] = useState(40);
  const [mult, setMult] = useState<Record<string, number>>({ A: 1.0, B: 1.15, C: 1.35, D: 1.6, E: 2.0 });
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () =>
      api.createFeeSchedule({ name, serviceFee, baseFee, redistributionShare: redistribution, tierMultipliers: mult }),
    onSuccess: () => { setName(''); qc.invalidateQueries({ queryKey: ['feeSchedules'] }); },
    onError: (e) => setError(e instanceof ApiError ? e.message : 'error')
  });

  const field = 'rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('fees')}</h1>
      <AdminTabs />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <ul className="divide-y divide-slate-100 text-sm">
            {data?.map((f) => (
              <li key={f.id} className="flex items-center justify-between py-2">
                <span className="font-medium">{f.name}</span>
                <span className="text-slate-500">svc {f.serviceFee} · base {f.baseFee} · redist {f.redistributionShare}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <form onSubmit={(e) => { e.preventDefault(); setError(null); create.mutate(); }} className="flex flex-col gap-3">
            <input required placeholder={t('name')} value={name} onChange={(e) => setName(e.target.value)} className={field} />
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs text-slate-500">{t('serviceFee')}
                <input type="number" step="0.01" value={serviceFee} onChange={(e) => setServiceFee(+e.target.value)} className={field} />
              </label>
              <label className="text-xs text-slate-500">{t('baseFee')}
                <input type="number" step="0.01" value={baseFee} onChange={(e) => setBaseFee(+e.target.value)} className={field} />
              </label>
              <label className="text-xs text-slate-500">{t('redistributionShare')}
                <input type="number" step="0.01" value={redistribution} onChange={(e) => setRedistribution(+e.target.value)} className={field} />
              </label>
            </div>
            <p className="text-xs text-slate-400">{t('tierMultipliers')}</p>
            <div className="grid grid-cols-5 gap-2">
              {TIERS.map((tier) => (
                <label key={tier} className="text-xs text-slate-500">{tier}
                  <input type="number" step="0.05" value={mult[tier]}
                    onChange={(e) => setMult({ ...mult, [tier]: +e.target.value })} className={field} />
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-400">{t('feesHint')}</p>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button disabled={create.isPending}>{t('create')}</Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}

export default function AdminFeesPage() {
  return (
    <RequireAuth role="ADMIN">
      <FeesInner />
    </RequireAuth>
  );
}

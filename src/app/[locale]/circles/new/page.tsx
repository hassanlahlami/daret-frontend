'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { RequireAuth } from '@/components/RequireAuth';
import { Button, Card, Container, Eyebrow } from '@/components/ui';
import { api, ApiError, type SlotPreference } from '@/lib/api-client';

function CreateInner() {
  const t = useTranslations('CreateCircle');
  const router = useRouter();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(500);
  const [seats, setSeats] = useState(4);
  const [cycle, setCycle] = useState(30);
  const [sharia, setSharia] = useState(true);
  const [pref, setPref] = useState<SlotPreference>('FLEXIBLE');
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () =>
      api.createCircle({
        name, contributionAmount: amount, seatCount: seats,
        cycleLengthDays: cycle, shariaMode: sharia, ownerSlotPreference: pref
      }),
    onSuccess: (c) => router.replace(`/circles/${c.id}`),
    onError: (e) => setError(e instanceof ApiError ? e.message : 'error')
  });

  const field = 'rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100';
  const label = 'flex flex-col gap-1.5 text-sm font-medium text-slate-700';

  return (
    <Container className="max-w-lg py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-slate-900">{t('title')}</h1>
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); setError(null); create.mutate(); }} className="flex flex-col gap-4">
          <label className={label}>{t('name')}
            <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={label}>{t('amount')}
              <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={field} />
            </label>
            <label className={label}>{t('seats')}
              <input type="number" min={2} max={60} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className={field} />
            </label>
          </div>
          <label className={label}>{t('cycle')}
            <input type="number" min={1} max={366} value={cycle} onChange={(e) => setCycle(Number(e.target.value))} className={field} />
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
            <input type="checkbox" checked={sharia} onChange={(e) => setSharia(e.target.checked)} />
            {t('sharia')}
          </label>
          <label className={label}>{t('ownerPref')}
            <select value={pref} onChange={(e) => setPref(e.target.value as SlotPreference)} className={field}>
              <option value="EARLY">EARLY</option>
              <option value="FLEXIBLE">FLEXIBLE</option>
              <option value="LATE">LATE</option>
            </select>
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button size="lg" disabled={create.isPending}>{t('submit')}</Button>
        </form>
      </Card>
    </Container>
  );
}

export default function CreateCirclePage() {
  return (
    <RequireAuth>
      <CreateInner />
    </RequireAuth>
  );
}

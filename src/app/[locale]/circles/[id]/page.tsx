'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { FeePreviewSlider } from '@/components/FeePreviewSlider';
import { useSession } from '@/components/SessionProvider';
import { Badge, Button, Card, Container, StatusBadge } from '@/components/ui';
import { api, ApiError, type SlotPreference } from '@/lib/api-client';

function CircleInner() {
  const t = useTranslations('Circle');
  const locale = useLocale();
  const { session } = useSession();
  const qc = useQueryClient();
  const params = useParams();
  const id = String(params.id);

  const [pref, setPref] = useState<SlotPreference>('FLEXIBLE');
  const [error, setError] = useState<string | null>(null);

  const { data } = useQuery({ queryKey: ['circle', id], queryFn: () => api.getCircle(id) });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['circle', id] });
    qc.invalidateQueries({ queryKey: ['circles'] });
  };
  const join = useMutation({
    mutationFn: () => api.joinCircle(id, pref),
    onSuccess: invalidate,
    onError: (e) => setError(e instanceof ApiError ? e.message : 'error')
  });
  const activate = useMutation({
    mutationFn: () => api.activateCircle(id),
    onSuccess: invalidate,
    onError: (e) => setError(e instanceof ApiError ? e.message : 'error')
  });

  if (!data) return null;
  const { circle, members } = data;
  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);

  const isMember = members.some((m) => m.userId === session?.userId);
  const isOwner = circle.ownerId === session?.userId;
  const forming = circle.status === 'FORMING';

  return (
    <Container className="max-w-2xl py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{circle.name}</h1>
        <StatusBadge status={circle.status} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Badge tone="slate">{circle.filledSeats}/{circle.seatCount} {t('members')}</Badge>
        <Badge tone="slate">{money(circle.contributionAmount)}</Badge>
        {circle.shariaMode && <Badge tone="green">Sharia</Badge>}
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('members')}</h2>
        <Card className="divide-y divide-slate-100 p-0">
          {members.map((m) => (
            <div key={m.userId} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-mono text-xs text-slate-500">{m.userId.slice(0, 8)}</span>
              <span className="text-slate-500">{t('seat')}: {m.slotPosition ?? t('unassigned')}</span>
              <Badge tone="slate">{m.slotPreference}</Badge>
              <StatusBadge status={m.standing} />
            </div>
          ))}
        </Card>
      </section>

      {forming && !isMember && (
        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('previewTitle')}</h2>
          <FeePreviewSlider circleId={id} seatCount={circle.seatCount} />
          <div className="flex items-center gap-3">
            <select value={pref} onChange={(e) => setPref(e.target.value as SlotPreference)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="EARLY">EARLY</option>
              <option value="FLEXIBLE">FLEXIBLE</option>
              <option value="LATE">LATE</option>
            </select>
            <Button onClick={() => { setError(null); join.mutate(); }} disabled={join.isPending}>
              {t('join')}
            </Button>
          </div>
        </section>
      )}

      {isMember && (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{t('joined')}</p>
      )}

      {forming && isOwner && (
        <Button variant="outline" className="mt-6"
          onClick={() => { setError(null); activate.mutate(); }} disabled={activate.isPending}>
          {t('activate')}
        </Button>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </Container>
  );
}

export default function CircleDetailPage() {
  return (
    <RequireAuth>
      <CircleInner />
    </RequireAuth>
  );
}

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
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [dSubject, setDSubject] = useState('');
  const [dBody, setDBody] = useState('');
  const [disputeSent, setDisputeSent] = useState(false);

  const { data } = useQuery({ queryKey: ['circle', id], queryFn: () => api.getCircle(id) });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['circle', id] });
    qc.invalidateQueries({ queryKey: ['circles'] });
  };
  const onErr = (e: unknown) => setError(e instanceof ApiError ? e.message : 'error');
  const join = useMutation({
    mutationFn: () => api.joinCircle(id, pref, inviteCode || undefined),
    onSuccess: invalidate, onError: onErr
  });
  const activate = useMutation({ mutationFn: () => api.activateCircle(id), onSuccess: invalidate, onError: onErr });
  const invite = useMutation({ mutationFn: () => api.createInvite(id), onSuccess: (r) => setNewCode(r.code), onError: onErr });
  const vouch = useMutation({
    mutationFn: (userId: string) => api.vouchFor(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['circle', id] }), onError: onErr
  });
  const dispute = useMutation({
    mutationFn: () => api.raiseDispute(id, dSubject, dBody),
    onSuccess: () => { setDisputeSent(true); setDSubject(''); setDBody(''); }, onError: onErr
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
        {circle.inviteOnly && <Badge tone="amber">{t('private')}</Badge>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Badge tone="slate">{circle.filledSeats}/{circle.seatCount} {t('members')}</Badge>
        <Badge tone="slate">{money(circle.contributionAmount)}</Badge>
        {circle.shariaMode && <Badge tone="green">Sharia</Badge>}
      </div>

      {/* Owner can mint invite codes for a private circle */}
      {isMember && forming && (
        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => { setError(null); invite.mutate(); }} disabled={invite.isPending}>
            {t('createInvite')}
          </Button>
          {newCode && <span className="font-mono text-sm text-brand-700">{t('inviteShare', { code: newCode })}</span>}
        </div>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('members')}</h2>
        <Card className="divide-y divide-slate-100 p-0">
          {members.map((m) => (
            <div key={m.userId} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="font-mono text-xs text-slate-500">{m.userId.slice(0, 8)}</span>
              <span className="text-slate-500">{t('seat')}: {m.slotPosition ?? t('unassigned')}</span>
              <Badge tone="slate">{m.slotPreference}</Badge>
              <StatusBadge status={m.standing} />
              {m.userId !== session?.userId && (
                <Button size="sm" variant="ghost" onClick={() => { setError(null); vouch.mutate(m.userId); }} disabled={vouch.isPending}>
                  {t('vouch')}
                </Button>
              )}
            </div>
          ))}
        </Card>
      </section>

      {forming && !isMember && (
        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('previewTitle')}</h2>
          <FeePreviewSlider circleId={id} seatCount={circle.seatCount} />
          {circle.inviteOnly && (
            <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder={t('inviteCode')}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono" />
          )}
          <div className="flex items-center gap-3">
            <select value={pref} onChange={(e) => setPref(e.target.value as SlotPreference)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="EARLY">EARLY</option>
              <option value="FLEXIBLE">FLEXIBLE</option>
              <option value="LATE">LATE</option>
            </select>
            <Button onClick={() => { setError(null); join.mutate(); }} disabled={join.isPending}>{t('join')}</Button>
          </div>
        </section>
      )}

      {isMember && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{t('joined')}</p>}

      {forming && isOwner && (
        <Button variant="outline" className="mt-6"
          onClick={() => { setError(null); activate.mutate(); }} disabled={activate.isPending}>
          {t('activate')}
        </Button>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {/* Raise a dispute */}
      <details className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700">{t('raiseDispute')}</summary>
        {disputeSent ? (
          <p className="mt-3 text-emerald-600">{t('disputeSent')}</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setError(null); dispute.mutate(); }} className="mt-3 flex flex-col gap-2">
            <input required placeholder={t('disputeSubject')} value={dSubject} onChange={(e) => setDSubject(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2" />
            <textarea required placeholder={t('disputeBody')} value={dBody} onChange={(e) => setDBody(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2" rows={3} />
            <Button size="sm" disabled={dispute.isPending} className="w-fit">{t('disputeSubmit')}</Button>
          </form>
        )}
      </details>
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

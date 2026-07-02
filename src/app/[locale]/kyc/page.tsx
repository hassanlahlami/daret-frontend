'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { Stepper } from '@/components/Stepper';
import { Button, Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { IconShield } from '@/components/Icons';
import { api } from '@/lib/api-client';

function KycInner() {
  const t = useTranslations('Kyc');
  const to = useTranslations('Onboarding');
  const qc = useQueryClient();
  const [partnerRef, setPartnerRef] = useState('');
  const [consent, setConsent] = useState(false);

  const { data } = useQuery({ queryKey: ['kyc'], queryFn: api.getKyc });
  const submit = useMutation({
    mutationFn: () => api.submitKyc(partnerRef),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kyc'] })
  });

  const field =
    'rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

  return (
    <Container className="max-w-xl py-10">
      <Stepper steps={[to('stepRegister'), to('stepKyc'), to('stepDiscover')]} current={1} />

      <div className="mt-8">
        <Eyebrow>{to('title')}</Eyebrow>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('gateNote')}</p>
      </div>

      {data && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-slate-500">{t('status')}:</span>
          <StatusBadge status={data.status} />
        </div>
      )}

      <Card className="mt-6">
        <form
          onSubmit={(e) => { e.preventDefault(); if (consent) submit.mutate(); }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            {t('partnerRef')}
            <input required placeholder={t('partnerRefHint')} value={partnerRef}
              onChange={(e) => setPartnerRef(e.target.value)} className={field} />
          </label>

          <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
              className="mt-1" />
            <span className="flex items-start gap-2">
              <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              {t('consent')}
            </span>
          </label>

          <Button size="lg" disabled={!consent || submit.isPending}>{t('submit')}</Button>
        </form>
      </Card>

      <p className="mt-4 text-xs text-slate-400">{t('noDocsNote')}</p>
    </Container>
  );
}

export default function KycPage() {
  return (
    <RequireAuth>
      <KycInner />
    </RequireAuth>
  );
}

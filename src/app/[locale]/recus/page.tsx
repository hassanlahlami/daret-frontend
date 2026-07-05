'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { EmptyState } from '@/components/EmptyState';
import { IconCoins } from '@/components/Icons';
import { Badge, Button, Card, Container, Eyebrow } from '@/components/ui';
import { api } from '@/lib/api-client';

function ReceiptsInner() {
  const t = useTranslations('Receipts');
  const locale = useLocale();
  const { data } = useQuery({ queryKey: ['receipts'], queryFn: api.myReceipts });

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);
  const date = (iso: string) => new Date(iso).toLocaleDateString(locale === 'darija' ? 'fr' : locale);

  return (
    <Container className="max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between" data-noprint>
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('title')}</h1>
        </div>
        {(data?.length ?? 0) > 0 && (
          <Button size="sm" variant="outline" onClick={() => window.print()}>{t('print')}</Button>
        )}
      </div>

      {(data?.length ?? 0) === 0 ? (
        <EmptyState icon={<IconCoins />} title={t('emptyTitle')} description={t('emptyDesc')} />
      ) : (
        <div className="flex flex-col gap-4">
          {data!.map((r) => (
            <Card key={r.reference} className="print:shadow-none">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-brand-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-500">
                    <span className="h-2 w-2 rounded-full bg-accent-400" />
                  </span>
                  Daret
                </div>
                <div className="text-end text-xs text-slate-400">
                  <div className="font-mono">{r.reference}</div>
                  <div>{date(r.at)}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <Badge tone={r.type === 'PAYOUT' ? 'green' : 'brand'}>
                    {r.type === 'PAYOUT' ? t('payout') : t('contribution')}
                  </Badge>
                  <p className="mt-2 text-sm text-slate-600">
                    {r.circleName ?? '—'} · {t('cycle')} {r.cycleIndex}
                  </p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{money(r.amount)}</p>
              </div>
              <p className="mt-3 text-xs text-slate-400">{t('note')}</p>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default function ReceiptsPage() {
  return (
    <RequireAuth>
      <ReceiptsInner />
    </RequireAuth>
  );
}

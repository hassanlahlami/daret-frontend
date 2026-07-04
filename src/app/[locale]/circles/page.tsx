'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/i18n/navigation';
import { RequireAuth } from '@/components/RequireAuth';
import { Badge, buttonClass, Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { IconArrow } from '@/components/Icons';
import { api } from '@/lib/api-client';

function DiscoverInner() {
  const t = useTranslations('Discover');
  const locale = useLocale();
  const [sharia, setSharia] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const params: Record<string, string> = {};
  if (sharia) params.shariaMode = sharia;
  if (minAmount) params.minAmount = minAmount;
  if (maxAmount) params.maxAmount = maxAmount;

  const { data, isLoading } = useQuery({
    queryKey: ['circles', params],
    queryFn: () => api.discoverCircles(params)
  });

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);

  const field = 'rounded-xl border border-slate-300 px-3 py-2 text-sm';

  return (
    <Container className="max-w-4xl py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Eyebrow>{t('title')}</Eyebrow>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('title')}</h1>
        </div>
        <Link href="/circles/new" className={buttonClass('primary')}>
          {t('create')} <IconArrow className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <select value={sharia} onChange={(e) => setSharia(e.target.value)} className={field} aria-label={t('sharia')}>
          <option value="">{t('all')}</option>
          <option value="true">{t('sharia')}</option>
          <option value="false">{t('nonSharia')}</option>
        </select>
        <input type="number" min={0} value={minAmount} onChange={(e) => setMinAmount(e.target.value)}
          placeholder={t('min')} className={`${field} w-28`} />
        <input type="number" min={0} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)}
          placeholder={t('max')} className={`${field} w-28`} />
      </div>

      {!isLoading && (data?.content.length ?? 0) === 0 && (
        <Card className="text-center text-sm text-slate-500">{t('empty')}</Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {data?.content.map((c) => {
          const pct = Math.round((c.filledSeats / c.seatCount) * 100);
          return (
            <Card key={c.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-slate-900">{c.name}</h2>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge tone="slate">{money(c.contributionAmount)}</Badge>
                <Badge tone="slate">{t('days', { n: c.cycleLengthDays })}</Badge>
                {c.shariaMode && <Badge tone="green">{t('sharia')}</Badge>}
                {c.inviteOnly && <Badge tone="amber">🔒</Badge>}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>{t('seats')}</span>
                  <span>{c.filledSeats}/{c.seatCount}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <Link href={`/circles/${c.id}`} className={buttonClass('outline', 'sm', 'mt-1 w-fit')}>
                {t('view')}
              </Link>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

export default function CirclesPage() {
  return (
    <RequireAuth>
      <DiscoverInner />
    </RequireAuth>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api-client';

function OverviewInner() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const { data } = useQuery({ queryKey: ['adminOverview'], queryFn: api.adminOverview });

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('overview')}</h1>
      <AdminTabs />

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">{t('kpiUsers')}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{data.totalUsers}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">{t('kpiRevenue')}</p>
              <p className="mt-1 text-2xl font-bold text-brand-700">{money(data.platformRevenue)}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">{t('kpiExposure')}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{money(data.platformExposure)}</p>
              <p className="text-xs text-slate-400">{t('kpiGapFilled')}: {data.gapFilledSlots}</p>
            </Card>
          </div>

          <Card className="mt-4">
            <p className="mb-3 text-sm font-semibold text-slate-500">{t('kpiCircles')}</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(data.circlesByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  <span className="text-lg font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </Container>
  );
}

export default function AdminOverviewPage() {
  return (
    <RequireAuth role="ADMIN">
      <OverviewInner />
    </RequireAuth>
  );
}

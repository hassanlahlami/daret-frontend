'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { EmptyState } from '@/components/EmptyState';
import { IconCoins } from '@/components/Icons';
import { Card, Container, Eyebrow } from '@/components/ui';
import { api } from '@/lib/api-client';

function GrowthInner() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const overview = useQuery({ queryKey: ['adminOverview'], queryFn: api.adminOverview });
  const waitlist = useQuery({ queryKey: ['adminWaitlist'], queryFn: api.adminWaitlist });

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);

  const users = overview.data?.totalUsers ?? 0;
  const signups = waitlist.data?.count ?? 0;

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('growthTitle')}</h1>
      <AdminTabs />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">{t('kpiRevenue')}</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{money(overview.data?.platformRevenue ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">{t('kpiWaitlist')}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{signups}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">{t('kpiUsers')}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{users}</p>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('waitlistRecent')}</h2>
        {waitlist.data?.entries.length ? (
          <Card className="divide-y divide-slate-100 p-0">
            {waitlist.data.entries.slice(0, 25).map((e) => (
              <div key={e.email} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-medium text-slate-800">{e.email}</span>
                <span className="text-xs uppercase text-slate-400">{e.locale}</span>
                <span className="text-slate-500">{new Date(e.at).toLocaleDateString()}</span>
              </div>
            ))}
          </Card>
        ) : (
          <EmptyState icon={<IconCoins />} title={t('waitlistEmpty')} />
        )}
      </section>
    </Container>
  );
}

export default function AdminGrowthPage() {
  return (
    <RequireAuth role="ADMIN">
      <GrowthInner />
    </RequireAuth>
  );
}

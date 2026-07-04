'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { BarChart } from '@/components/BarChart';
import { Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api-client';

function StatusRow({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(counts).map(([status, n]) => (
        <div key={status} className="flex items-center gap-2">
          <StatusBadge status={status} />
          <span className="text-lg font-semibold">{n}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsInner() {
  const t = useTranslations('Admin');
  const { data } = useQuery({ queryKey: ['adminAnalytics'], queryFn: api.adminAnalytics });

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('analytics')}</h1>
      <AdminTabs />

      {data && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">{t('openDisputes')}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{data.openDisputes}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">{t('openAml')}</p>
              <p className="mt-1 text-3xl font-bold text-amber-600">{data.openAmlFlags}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">{t('totalVouches')}</p>
              <p className="mt-1 text-3xl font-bold text-brand-700">{data.totalVouches}</p>
            </Card>
          </div>

          <Card>
            <BarChart title={t('newCircles')} data={data.newCirclesPerWeek} />
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <p className="mb-3 text-sm font-semibold text-slate-500">{t('contributions')}</p>
              <StatusRow counts={data.contributions} />
            </Card>
            <Card>
              <p className="mb-3 text-sm font-semibold text-slate-500">{t('payouts')}</p>
              <StatusRow counts={data.payouts} />
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <RequireAuth role="ADMIN">
      <AnalyticsInner />
    </RequireAuth>
  );
}

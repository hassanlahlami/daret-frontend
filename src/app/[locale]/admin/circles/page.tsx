'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { Button, Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { api, type CircleStatus } from '@/lib/api-client';

const STATUSES: CircleStatus[] = ['DRAFT', 'FORMING', 'ACTIVE', 'COMPLETED', 'DISSOLVED'];

function CirclesInner() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const qc = useQueryClient();
  const [status, setStatus] = useState<CircleStatus | ''>('');

  const { data } = useQuery({
    queryKey: ['adminCircles', status],
    queryFn: () => api.adminCircles(status || undefined)
  });
  const cancel = useMutation({
    mutationFn: (id: string) => api.cancelCircle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminCircles'] })
  });

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, { style: 'currency', currency: 'MAD' }).format(n);

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('circles')}</h1>
      <AdminTabs />

      <select value={status} onChange={(e) => setStatus(e.target.value as CircleStatus | '')}
        className="mb-4 rounded-xl border border-slate-300 px-3 py-2 text-sm">
        <option value="">{t('allStatuses')}</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-slate-400">
            <tr>
              <th className="px-5 py-2 text-start font-medium">{t('name')}</th>
              <th className="px-5 py-2 text-start font-medium">{t('seats')}</th>
              <th className="px-5 py-2 text-start font-medium">{t('amount')}</th>
              <th className="px-5 py-2 text-start font-medium">Status</th>
              <th className="px-5 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((c) => (
              <tr key={c.id} className="border-t border-slate-50">
                <td className="px-5 py-2 font-medium text-slate-700">{c.name}</td>
                <td className="px-5 py-2 text-slate-500">{c.filledSeats}/{c.seatCount}</td>
                <td className="px-5 py-2 text-slate-500">{money(c.contributionAmount)}</td>
                <td className="px-5 py-2"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-2 text-end">
                  {c.status === 'FORMING' && (
                    <Button size="sm" variant="ghost" className="text-red-600"
                      onClick={() => cancel.mutate(c.id)} disabled={cancel.isPending}>
                      {t('cancel')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}

export default function AdminCirclesPage() {
  return (
    <RequireAuth role="ADMIN">
      <CirclesInner />
    </RequireAuth>
  );
}

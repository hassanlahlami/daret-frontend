'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { Badge, Button, Card, Container, Eyebrow } from '@/components/ui';
import { api, type DataExport } from '@/lib/api-client';

function DataRightsInner() {
  const t = useTranslations('DataRights');
  const qc = useQueryClient();
  const [bundle, setBundle] = useState<DataExport | null>(null);
  const [reason, setReason] = useState('');

  const requests = useQuery({ queryKey: ['erasureRequests'], queryFn: api.myErasureRequests });

  const exportData = useMutation({
    mutationFn: api.dataExport,
    onSuccess: (data) => {
      setBundle(data);
      // Offer the raw bundle as a downloadable file (right of access).
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'daret-mes-donnees.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  const erase = useMutation({
    mutationFn: () => api.requestErasure(reason),
    onSuccess: () => {
      setReason('');
      qc.invalidateQueries({ queryKey: ['erasureRequests'] });
    }
  });

  return (
    <Container className="max-w-2xl py-10">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('title')}</h1>
      <p className="mt-2 text-sm text-slate-500">{t('intro')}</p>

      {/* Right of access */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('accessTitle')}</h2>
        <Card className="mt-2">
          <p className="text-sm text-slate-600">{t('accessBody')}</p>
          <Button className="mt-3" onClick={() => exportData.mutate()} disabled={exportData.isPending}>
            {t('exportButton')}
          </Button>
          {bundle && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm" data-testid="export-summary">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{t('email')}</span>
                <span className="font-medium text-slate-800">{bundle.profile.email}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-500">{t('score')}</span>
                <Badge tone="green">{bundle.score.score} · {bundle.score.tier}</Badge>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-500">{t('circles')}</span>
                <span className="font-medium">{bundle.memberships.length}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-500">{t('contributions')}</span>
                <span className="font-medium">{bundle.contributions.length}</span>
              </div>
              <p className="mt-3 text-xs text-slate-400">{t('downloaded')}</p>
            </div>
          )}
        </Card>
      </section>

      {/* Right to erasure */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('erasureTitle')}</h2>
        <Card className="mt-2">
          <p className="text-sm text-slate-600">{t('erasureBody')}</p>
          <form
            onSubmit={(e) => { e.preventDefault(); erase.mutate(); }}
            className="mt-3 flex flex-col gap-2"
          >
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('reasonPlaceholder')}
              rows={3}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <Button size="sm" variant="outline" className="w-fit" disabled={erase.isPending}>
              {t('erasureButton')}
            </Button>
          </form>

          {(requests.data?.length ?? 0) > 0 && (
            <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
              {requests.data?.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-500">{new Date(r.at).toLocaleDateString()}</span>
                  <Badge tone={r.status === 'PENDING' ? 'amber' : r.status === 'APPROVED' ? 'green' : 'slate'}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </Container>
  );
}

export default function DataRightsPage() {
  return (
    <RequireAuth>
      <DataRightsInner />
    </RequireAuth>
  );
}

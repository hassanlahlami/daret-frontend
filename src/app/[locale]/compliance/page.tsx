'use client';

import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AuditTimeline } from '@/components/AuditTimeline';
import { Badge, Button, Card, Container, Eyebrow } from '@/components/ui';
import { IconShield } from '@/components/Icons';
import { api, type KycStatus } from '@/lib/api-client';

function ComplianceInner() {
  const t = useTranslations('Compliance');
  const qc = useQueryClient();

  const chain = useQuery({ queryKey: ['audit'], queryFn: () => api.auditChain(50) });
  const integrity = useQuery({ queryKey: ['audit', 'verify'], queryFn: api.auditVerify });
  const queue = useQuery({ queryKey: ['kycQueue'], queryFn: api.kycQueue });
  const flags = useQuery({ queryKey: ['aml'], queryFn: api.amlFlags });
  const disputes = useQuery({ queryKey: ['disputes'], queryFn: api.complianceDisputes });
  const resolve = useMutation({
    mutationFn: (id: string) => api.resolveDispute(id, 'Reviewed by compliance'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['disputes'] })
  });

  const decide = useMutation({
    mutationFn: ({ userId, decision }: { userId: string; decision: KycStatus }) =>
      api.decideKyc(userId, decision),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kycQueue'] })
  });

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-slate-900">{t('title')}</h1>

      {/* Integrity */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconShield />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{t('integrity')}</p>
            {integrity.data && (
              <p className={`text-sm ${integrity.data.valid ? 'text-emerald-600' : 'text-red-600'}`}>
                {integrity.data.valid
                  ? t('valid', { n: integrity.data.eventsChecked })
                  : t('invalid', { seq: integrity.data.brokenAtSeq ?? 0 })}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => integrity.refetch()}>{t('verify')}</Button>
      </Card>

      {/* KYC queue */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('kycQueue')}</h2>
        {queue.data?.length ? (
          <Card className="divide-y divide-slate-100 p-0">
            {queue.data.map((k) => (
              <div key={k.userId} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-mono text-xs text-slate-500">{k.userId.slice(0, 8)}</span>
                <span className="flex gap-2">
                  <Button size="sm" onClick={() => decide.mutate({ userId: k.userId, decision: 'VERIFIED' })}>
                    {t('approve')}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600"
                    onClick={() => decide.mutate({ userId: k.userId, decision: 'REJECTED' })}>
                    {t('reject')}
                  </Button>
                </span>
              </div>
            ))}
          </Card>
        ) : <p className="text-sm text-slate-500">{t('noAml')}</p>}
      </section>

      {/* AML flags */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('aml')}</h2>
        {flags.data?.length ? (
          <div className="flex flex-col gap-2">
            {flags.data.map((f) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm">
                <Badge tone={f.severity === 'HIGH' ? 'red' : 'amber'}>{f.type}</Badge>
                <span className="font-mono text-xs text-slate-600">{f.userId.slice(0, 8)}</span>
                <span className="text-slate-600">{f.reason}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-slate-500">{t('noAml')}</p>}
      </section>

      {/* Disputes */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('disputes')}</h2>
        {disputes.data?.length ? (
          <Card className="divide-y divide-slate-100 p-0">
            {disputes.data.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-700">{d.subject}</p>
                  <p className="text-xs text-slate-500">{d.description}</p>
                </div>
                <Button size="sm" onClick={() => resolve.mutate(d.id)} disabled={resolve.isPending}>{t('resolve')}</Button>
              </div>
            ))}
          </Card>
        ) : <p className="text-sm text-slate-500">{t('noDisputes')}</p>}
      </section>

      {/* Audit chain */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{t('auditChain')}</h2>
        <Card>
          {chain.data && chain.data.length > 0
            ? <AuditTimeline events={[...chain.data].sort((a, b) => a.seq - b.seq)} />
            : <p className="text-sm text-slate-500">{t('noAml')}</p>}
        </Card>
      </section>
    </Container>
  );
}

export default function CompliancePage() {
  return (
    <RequireAuth role="COMPLIANCE_OFFICER">
      <ComplianceInner />
    </RequireAuth>
  );
}

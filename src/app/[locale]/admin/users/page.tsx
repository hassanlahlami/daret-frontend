'use client';

import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminTabs } from '@/components/AdminTabs';
import { Badge, Button, Card, Container, Eyebrow, StatusBadge } from '@/components/ui';
import { api } from '@/lib/api-client';

function UsersInner() {
  const t = useTranslations('Admin');
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['adminUsers'], queryFn: api.adminUsers });
  const toggle = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => api.setUserEnabled(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminUsers'] })
  });

  return (
    <Container className="max-w-4xl py-10">
      <Eyebrow>{t('title')}</Eyebrow>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('users')}</h1>
      <AdminTabs />

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-slate-400">
            <tr>
              <th className="px-5 py-2 text-start font-medium">{t('email')}</th>
              <th className="px-5 py-2 text-start font-medium">{t('roles')}</th>
              <th className="px-5 py-2 text-start font-medium">{t('kyc')}</th>
              <th className="px-5 py-2 text-start font-medium">{t('enabled')}</th>
              <th className="px-5 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((u) => (
              <tr key={u.id} className="border-t border-slate-50">
                <td className="px-5 py-2 text-slate-700">{u.email ?? u.phone ?? u.id.slice(0, 8)}</td>
                <td className="px-5 py-2">
                  <span className="flex flex-wrap gap-1">
                    {u.roles.map((r) => <Badge key={r} tone="slate">{r}</Badge>)}
                  </span>
                </td>
                <td className="px-5 py-2">{u.kycStatus ? <StatusBadge status={u.kycStatus} /> : '—'}</td>
                <td className="px-5 py-2">
                  <Badge tone={u.enabled ? 'green' : 'red'}>{u.enabled ? '✓' : '✕'}</Badge>
                </td>
                <td className="px-5 py-2 text-end">
                  <Button size="sm" variant="ghost"
                    className={u.enabled ? 'text-red-600' : 'text-emerald-600'}
                    onClick={() => toggle.mutate({ id: u.id, enabled: !u.enabled })}
                    disabled={toggle.isPending}>
                    {u.enabled ? t('disable') : t('enable')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireAuth role="ADMIN">
      <UsersInner />
    </RequireAuth>
  );
}

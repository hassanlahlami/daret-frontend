'use client';

import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RequireAuth } from '@/components/RequireAuth';
import { Badge, Button, Card, Container, Eyebrow } from '@/components/ui';
import { api } from '@/lib/api-client';

function NotificationsInner() {
  const t = useTranslations('Notifications');
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['notifications'], queryFn: api.notifications });
  const markRead = useMutation({
    mutationFn: api.markNotificationsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  return (
    <Container className="max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Eyebrow>{t('title')}</Eyebrow>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{t('title')}</h1>
        </div>
        {(data?.length ?? 0) > 0 && (
          <Button size="sm" variant="outline" onClick={() => markRead.mutate()} disabled={markRead.isPending}>
            {t('markRead')}
          </Button>
        )}
      </div>

      {(data?.length ?? 0) === 0 ? (
        <Card className="text-center text-sm text-slate-500">{t('empty')}</Card>
      ) : (
        <Card className="divide-y divide-slate-100 p-0">
          {data?.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-3 text-sm">
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
              <div className={n.read ? 'text-slate-500' : 'text-slate-800'}>
                <div className="flex items-center gap-2">
                  <Badge tone="slate">{n.type}</Badge>
                  <span className="text-xs text-slate-400">{new Date(n.at).toLocaleDateString()}</span>
                </div>
                <p className="mt-1">{n.message}</p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </Container>
  );
}

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <NotificationsInner />
    </RequireAuth>
  );
}

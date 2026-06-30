'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { fetchHealth } from '@/lib/api';

/** Proves end-to-end wiring: calls the backend health endpoint via TanStack Query. */
export function HealthStatus() {
  const t = useTranslations('Home');
  const { data, isPending, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth
  });

  const dotClass = isPending
    ? 'bg-amber-400'
    : isError
      ? 'bg-red-500'
      : 'bg-emerald-500';

  const label = isPending
    ? t('healthChecking')
    : isError
      ? t('healthDown')
      : t('healthUp');

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className={`inline-block h-3 w-3 rounded-full ${dotClass}`} aria-hidden />
      <span className="text-sm font-medium">{label}</span>
      {data?.time && (
        <span className="ms-auto text-xs text-slate-400">{data.time}</span>
      )}
    </div>
  );
}

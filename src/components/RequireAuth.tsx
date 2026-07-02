'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSession } from '@/components/SessionProvider';
import { useTranslations } from 'next-intl';

/**
 * Client-side route guard: redirects to /login when unauthenticated, and can
 * additionally require a role (e.g. COMPLIANCE_OFFICER for the console).
 */
export function RequireAuth({ role, children }: { role?: string; children: React.ReactNode }) {
  const { session, ready, hasRole } = useSession();
  const router = useRouter();
  const t = useTranslations('Errors');

  useEffect(() => {
    if (ready && !session) router.replace('/login');
  }, [ready, session, router]);

  if (!ready || !session) {
    return <main className="p-8 text-slate-400">{t('loading')}</main>;
  }
  if (role && !hasRole(role)) {
    return <main className="p-8 text-red-500">{t('title')}</main>;
  }
  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSession } from '@/components/SessionProvider';
import { useTranslations } from 'next-intl';

/**
 * Client-side route guard: redirects to /login when unauthenticated, and can
 * additionally require a role (e.g. COMPLIANCE_OFFICER for the console).
 *
 * A role-less guard marks a MEMBER area: admins are kept out of member features
 * and redirected to their own console (/admin).
 */
export function RequireAuth({ role, children }: { role?: string; children: React.ReactNode }) {
  const { session, ready, hasRole } = useSession();
  const router = useRouter();
  const t = useTranslations('Errors');

  // Member area = a guard with no explicit role requirement.
  const adminInMemberArea = !role && hasRole('ADMIN');

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace('/login');
    else if (adminInMemberArea) router.replace('/admin');
  }, [ready, session, adminInMemberArea, router]);

  if (!ready || !session || adminInMemberArea) {
    return <main className="p-8 text-slate-400">{t('loading')}</main>;
  }
  if (role && !hasRole(role)) {
    return <main className="p-8 text-red-500">{t('title')}</main>;
  }
  return <>{children}</>;
}

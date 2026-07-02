'use client';

import { Link, useRouter } from '@/i18n/navigation';
import { useSession } from '@/components/SessionProvider';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { LogoMark } from '@/components/LogoMark';
import { buttonClass } from '@/components/ui';
import { cn } from '@/lib/cn';
import { useTranslations } from 'next-intl';

export function Nav() {
  const { session, hasRole, logout } = useSession();
  const t = useTranslations('Nav');
  const router = useRouter();

  const linkClass = 'text-slate-600 transition hover:text-brand-700';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center gap-5 px-6 py-3 text-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <LogoMark />
          <span className="text-base tracking-tight">Daret</span>
        </Link>

        {session && (
          <div className="hidden items-center gap-5 sm:flex">
            <Link href="/circles" className={linkClass}>{t('discover')}</Link>
            <Link href="/dashboard" className={linkClass}>{t('dashboard')}</Link>
            <Link href="/kyc" className={linkClass}>{t('kyc')}</Link>
            {hasRole('COMPLIANCE_OFFICER') && (
              <Link href="/compliance" className={cn(linkClass, 'text-brand-700')}>{t('compliance')}</Link>
            )}
            {hasRole('ADMIN') && (
              <Link href="/admin" className={cn(linkClass, 'text-brand-700')}>{t('admin')}</Link>
            )}
          </div>
        )}

        <div className="ms-auto flex items-center gap-3">
          <LocaleSwitcher />
          {session ? (
            <button
              onClick={() => { logout(); router.replace('/login'); }}
              className={buttonClass('ghost', 'sm')}
            >
              {t('logout')}
            </button>
          ) : (
            <Link href="/login" className={buttonClass('primary', 'sm')}>{t('login')}</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

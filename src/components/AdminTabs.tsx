'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

const tabs = [
  { href: '/admin', key: 'overview' },
  { href: '/admin/circles', key: 'circles' },
  { href: '/admin/users', key: 'users' },
  { href: '/admin/fees', key: 'fees' },
  { href: '/admin/ops', key: 'ops' }
] as const;

export function AdminTabs() {
  const t = useTranslations('Admin');
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b border-slate-200 text-sm">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 font-medium transition',
              active
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-brand-700'
            )}
          >
            {t(tab.key)}
          </Link>
        );
      })}
    </nav>
  );
}

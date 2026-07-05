import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LogoMark } from '@/components/LogoMark';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="mt-16 border-t border-slate-200 bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-semibold text-brand-700">
          <LogoMark className="h-5 w-5" />
          Daret
        </div>
        <p className="max-w-md">{t('disclaimer')}</p>
        <div className="flex items-center gap-4">
          <Link href="/tarifs" className="text-brand-700 hover:underline">{t('pricing')}</Link>
          <Link href="/securite" className="text-brand-700 hover:underline">{t('security')}</Link>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} Daret</span>
        </div>
      </div>
    </footer>
  );
}

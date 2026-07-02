import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** Locale-scoped 404 page. */
export default function NotFound() {
  const t = useTranslations('Errors');
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-lg font-semibold">{t('notFoundTitle')}</h1>
      <p className="text-sm text-slate-500">{t('notFoundBody')}</p>
      <Link href="/" className="text-sm font-medium text-brand underline">
        Daret
      </Link>
    </main>
  );
}

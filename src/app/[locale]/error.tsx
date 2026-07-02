'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { reportError } from '@/lib/observability';

/** Route-segment error boundary (Next.js App Router). */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('Errors');

  useEffect(() => {
    reportError(error, 'route-error-boundary');
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-lg font-semibold">{t('title')}</h1>
      <button
        onClick={reset}
        className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        {t('retry')}
      </button>
    </main>
  );
}

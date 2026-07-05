'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui';
import { api, ApiError } from '@/lib/api-client';

/** Public pre-launch email capture (G7). */
export function WaitlistForm() {
  const t = useTranslations('Waitlist');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const join = useMutation({
    mutationFn: () => api.joinWaitlist(email, locale),
    onError: (e) => setError(e instanceof ApiError ? t('error') : t('error'))
  });

  if (join.isSuccess) {
    return (
      <p className="rounded-xl bg-brand-50 px-4 py-3 text-center text-sm font-medium text-brand-700">
        {t('thanks')}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setError(null); join.mutate(); }}
      className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('placeholder')}
        aria-label={t('placeholder')}
        className="flex-1 rounded-xl border border-slate-300 bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <Button type="submit" size="lg" disabled={join.isPending}>{t('cta')}</Button>
      {error && <p className="text-sm text-red-500 sm:hidden">{error}</p>}
    </form>
  );
}

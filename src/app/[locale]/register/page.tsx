'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useSession } from '@/components/SessionProvider';
import { Button, Card } from '@/components/ui';
import { LogoMark } from '@/components/LogoMark';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const { register } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setBusy(true);
    try {
      await register(email, password);
      router.replace('/kyc');
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const field = 'rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <LogoMark className="h-9 w-9 text-brand-600" />
          <h1 className="text-xl font-semibold">{t('registerTitle')}</h1>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input type="email" required placeholder={t('email')} value={email}
            onChange={(e) => setEmail(e.target.value)} className={field} />
          <input type="password" required minLength={8} placeholder={t('password')} value={password}
            onChange={(e) => setPassword(e.target.value)} className={field} />
          {error && <p className="text-sm text-red-500">{t('failed')}</p>}
          <Button size="lg" disabled={busy} className="mt-1">{t('submitRegister')}</Button>
        </form>
        <Link href="/login" className="mt-4 block text-center text-sm text-brand-700 hover:underline">
          {t('toLogin')}
        </Link>
      </Card>
    </main>
  );
}

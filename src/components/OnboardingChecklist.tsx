'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Card, Eyebrow, buttonClass } from '@/components/ui';

export type OnboardingStep = { label: string; hint: string; done: boolean; href: string; cta: string };

/**
 * First-run guidance: a dismissible checklist that walks a new member from
 * KYC to their first active circle. Auto-hides once every step is complete.
 */
export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const t = useTranslations('Onboarding');
  const done = steps.filter((s) => s.done).length;
  if (steps.length === 0 || done === steps.length) return null;

  const next = steps.find((s) => !s.done);
  const pct = Math.round((done / steps.length) * 100);

  return (
    <Card className="mb-6 border-brand-100 bg-gradient-to-b from-brand-50/60 to-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>{t('getStarted')}</Eyebrow>
          <h2 className="mt-1 text-lg font-bold text-slate-900">{t('welcome')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('welcomeSub')}</p>
        </div>
        <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800">
          {done}/{steps.length}
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <ol className="mt-4 flex flex-col gap-2">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-sm">
            <span
              className={
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ' +
                (s.done ? 'bg-brand-500 text-white' : 'border border-slate-300 text-slate-400')
              }
            >
              {s.done ? '✓' : ''}
            </span>
            <div className="min-w-0 flex-1">
              <p className={s.done ? 'font-medium text-slate-400 line-through' : 'font-medium text-slate-800'}>
                {s.label}
              </p>
              {!s.done && <p className="text-xs text-slate-500">{s.hint}</p>}
            </div>
            {!s.done && s === next && (
              <Link href={s.href} className={buttonClass('primary', 'sm')}>{s.cta}</Link>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}

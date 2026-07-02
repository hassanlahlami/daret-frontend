import { cn } from '@/lib/cn';

/** Onboarding progress: register → KYC → discover. `current` is 0-based. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={i} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                done && 'bg-brand-600 text-white',
                active && 'bg-brand-100 text-brand-700 ring-2 ring-brand-300',
                !done && !active && 'bg-slate-100 text-slate-400'
              )}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={cn(
                'text-xs font-medium',
                active ? 'text-slate-800' : 'text-slate-400'
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
          </li>
        );
      })}
    </ol>
  );
}

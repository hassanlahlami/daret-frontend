import { Link } from '@/i18n/navigation';
import { buttonClass } from '@/components/ui';

/**
 * A polished empty state: a soft icon, a short message, and an optional CTA.
 * Used wherever a list/section has no data yet, so the app never feels dead.
 */
export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className={buttonClass('primary', 'sm', 'mt-4')}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

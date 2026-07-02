import { cn } from '@/lib/cn';

// ---- Layout ----

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-5xl px-6', className)}>{children}</div>;
}

// ---- Button (also usable to style <Link>) ----

type Variant = 'primary' | 'outline' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none';
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };
  const variants: Record<Variant, string> = {
    primary: 'bg-brand-600 text-white shadow-soft hover:bg-brand-700',
    accent: 'bg-accent-400 text-accent-900 shadow-soft hover:bg-accent-300',
    outline: 'border border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:text-brand-700',
    ghost: 'text-slate-700 hover:bg-slate-100'
  };
  return cn(base, sizes[size], variants[variant], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: { variant?: Variant; size?: Size } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

// ---- Card ----

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow-soft', className)}>
      {children}
    </div>
  );
}

// ---- Badge ----

type Tone = 'brand' | 'green' | 'amber' | 'red' | 'slate';

export function Badge({
  tone = 'slate',
  className,
  children
}: { tone?: Tone; className?: string; children: React.ReactNode }) {
  const tones: Record<Tone, string> = {
    brand: 'bg-brand-100 text-brand-800',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-600'
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}

// ---- Section heading ----

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{children}</span>
  );
}

// ---- Status badge: renders the raw status code with a semantic tone ----

const STATUS_TONE: Record<string, Tone> = {
  DRAFT: 'slate', FORMING: 'brand', ACTIVE: 'green', COMPLETED: 'green', DISSOLVED: 'red',
  SCHEDULED: 'slate', PAID: 'green', MISSED: 'red', FAILED: 'red',
  GOOD: 'green', LATE: 'amber', DEFAULTED: 'red',
  PENDING: 'amber', VERIFIED: 'green', REJECTED: 'red'
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'slate'}>{status}</Badge>;
}

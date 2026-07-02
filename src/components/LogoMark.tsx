/** Daret emblem: dots rotating around a ring — the rotating-savings motif. */
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="16" cy="5" r="2.6" fill="currentColor" />
      <circle cx="25.5" cy="12" r="2.2" fill="currentColor" opacity="0.8" />
      <circle cx="22" cy="24" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="10" cy="24" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="6.5" cy="12" r="2.2" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

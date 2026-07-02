/** Circular credit-score gauge (0–1000) coloured by tier. */
export function ScoreGauge({ score, tier }: { score: number; tier: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 1000));
  const color =
    tier === 'A' || tier === 'B' ? '#14a06f' : tier === 'C' ? '#f9a825' : '#ef4444';

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{score}</span>
        <span className="text-xs font-semibold" style={{ color }}>{tier}</span>
      </div>
    </div>
  );
}

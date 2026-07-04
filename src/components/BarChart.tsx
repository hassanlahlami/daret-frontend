/**
 * Minimal single-series bar chart (dataviz mark specs): brand-hued thin bars,
 * 4px rounded tops anchored to the baseline, 2px surface gaps, per-bar hover
 * tooltip. Single series → no legend; the title names it.
 */
export function BarChart({
  data,
  title
}: {
  data: { label: string; count: number }[];
  title?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <figure>
      {title && <figcaption className="mb-3 text-sm font-medium text-slate-700">{title}</figcaption>}
      <div className="flex h-40 items-end gap-0.5 border-b border-slate-200">
        {data.map((d, i) => (
          <div
            key={i}
            className="group flex-1 rounded-t bg-brand-500 transition hover:bg-brand-600"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? '4px' : '2px' }}
            title={`${d.label}: ${d.count}`}
          />
        ))}
      </div>
      <div className="mt-1 flex gap-0.5">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] text-slate-400">{d.label}</span>
        ))}
      </div>
    </figure>
  );
}

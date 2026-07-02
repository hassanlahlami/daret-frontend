'use client';

import type { AuditEventView } from '@/lib/api-client';

/** Visual, tamper-evident audit chain: each node links to the previous by hash. */
export function AuditTimeline({ events }: { events: AuditEventView[] }) {
  return (
    <ol className="relative ms-3 border-s border-slate-200">
      {events.map((e) => (
        <li key={e.seq} className="relative ms-6 pb-6 last:pb-0">
          <span className="absolute -start-[31px] mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-100 ring-4 ring-white">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">#{e.seq}</span>
            <span className="font-medium text-slate-800">{e.action}</span>
            <span className="font-mono text-xs text-slate-400">
              {e.actor.length > 12 ? e.actor.slice(0, 8) : e.actor}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <span title={e.prevHash}>{e.prevHash.slice(0, 8)}</span>
            <span aria-hidden>→</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-brand-700" title={e.hash}>
              {e.hash.slice(0, 10)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

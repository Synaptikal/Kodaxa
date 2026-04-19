/**
 * system/_components.tsx
 * Kodaxa OS — Design System reference: presentational atoms.
 * One concern: reusable display components used only by system/page.tsx.
 *
 * Extracted to keep system/page.tsx under the 400-line warning threshold.
 * Do not import from outside /system — these are reference-page-specific.
 */

import { SectionLabel } from '@/components/ui/section-label';
import { Badge } from '@/components/ui/badge';

// ── Section wrapper ────────────────────────────────────────────────────
export function Section({ id, label, sub, children }: {
  id: string; label: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 scroll-mt-16">
      <div className="flex items-baseline gap-3 border-b border-sr-border pb-2">
        <SectionLabel text={label} sub={sub} />
      </div>
      {children}
    </section>
  );
}

// ── Color swatch ───────────────────────────────────────────────────────
export function Swatch({ bg, label, hex }: { bg: string; label: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`h-8 w-full border border-sr-border/40 ${bg}`} />
      <p className="text-xs font-mono text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-mono text-sr-subtle">{hex}</p>
    </div>
  );
}

// ── Sample contract row ────────────────────────────────────────────────
export function ContractRow({ id, item, qty, reward, state, claimer }: {
  id: string; item: string; qty: number; reward: string;
  state: 'queued' | 'claimed' | 'in-fabrication' | 'awaiting-transit' | 'fulfilled' | 'flagged';
  claimer?: string;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 border-b border-sr-border/40 hover:bg-sr-surface/60 transition-colors group">
      <span className="text-xs font-mono text-sr-muted shrink-0 w-28 tracking-wider">{id}</span>
      <span className="text-xs font-mono text-slate-300 flex-1">{item}</span>
      <span className="text-xs font-mono text-slate-500 w-8 text-right shrink-0">×{qty}</span>
      <span className="text-[10px] font-mono text-amber-500 w-20 text-right shrink-0">{reward}</span>
      <span className="text-xs font-mono text-sr-muted w-24 shrink-0">{claimer ?? '—'}</span>
      <Badge variant={state} className="shrink-0 w-32 justify-center" />
    </div>
  );
}

// ── Vocabulary row ─────────────────────────────────────────────────────
export function VocabRow({ generic, inWorld, context }: {
  generic: string; inWorld: string; context: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-4 px-4 py-2 border-b border-sr-border/30 text-xs font-mono">
      <span className="text-slate-500">{generic}</span>
      <span className="text-cyan-400">{inWorld}</span>
      <span className="text-sr-subtle">{context}</span>
    </div>
  );
}

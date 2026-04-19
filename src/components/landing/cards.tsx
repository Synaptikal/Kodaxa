/**
 * cards.tsx
 * Landing page card sub-components extracted from page.tsx.
 * One concern: FeaturedTransmission, DispatchCard, ToolCard rendering.
 */

import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/dispatch';
import type { DispatchPost } from '@/types/dispatch';
import { Badge } from '@/components/ui/badge';
import type { ToolCardProps } from '@/app/landing-config';

const SPACE_VISTA = 'https://i0.wp.com/starsreach.com/wp-content/uploads/2025/01/SR_Surveying-Space_V2.jpg';

// ── Featured Transmission ─────────────────────────────────────────────

export function FeaturedTransmission({ post }: { post: DispatchPost }) {
  return (
    <Link href={`/dispatch/${post.slug}`} className="group relative block overflow-hidden border border-sr-border bg-sr-surface/30 hover:bg-sr-surface/50 transition-colors">
      <Image src={SPACE_VISTA} alt="" fill className="object-cover opacity-[0.13] group-hover:opacity-[0.2] transition-opacity pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">
        <div className="px-4 py-3 border-b border-sr-border/40 bg-sr-surface/60">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-mono text-sr-muted tracking-[0.2em] uppercase">Transmission · Kodaxa Dispatch</span>
            {post.ref_id && <span className="text-xs font-mono text-sr-subtle tracking-[0.15em] uppercase">Ref: {post.ref_id}</span>}
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-xs font-mono text-sr-subtle">Filed: {post.published_at}</span>
            <span className="text-xs font-mono text-sr-subtle uppercase">Division: {post.author}</span>
            <span className="text-xs font-mono text-sr-subtle">Classification: Public</span>
            {post.tag && (
              <span className="text-[10px] font-mono text-cyan-600 bg-cyan-950/40 px-1.5 py-0.5 uppercase tracking-wide">● {post.tag}</span>
            )}
          </div>
        </div>
        <div className="px-4 py-5 space-y-3">
          <span className={`text-xs font-mono uppercase tracking-[0.15em] px-2 py-0.5 border ${CATEGORY_COLORS[post.category]}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
          <h2 className="text-base font-bold font-mono text-slate-100 group-hover:text-white transition-colors leading-snug tracking-wide">
            {post.title}
          </h2>
          <p className="text-xs font-mono text-sr-muted leading-relaxed">{post.summary}</p>
          <span className="text-xs font-mono text-cyan-700 group-hover:text-cyan-400 transition-colors tracking-[0.15em] uppercase border-b border-cyan-900/40 group-hover:border-cyan-700/60">
            Read Full Dispatch →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Dispatch card — compact, for recent list ──────────────────────────

export function DispatchCard({ post }: { post: DispatchPost }) {
  return (
    <Link href={`/dispatch/${post.slug}`} className="group flex flex-col gap-1.5 py-3 px-1 hover:bg-sr-surface/40 transition-colors">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 border ${CATEGORY_COLORS[post.category]}`}>
          {CATEGORY_LABELS[post.category]}
        </span>
        <span className="text-xs font-mono text-sr-subtle">{post.published_at} · {post.author.toUpperCase()}</span>
      </div>
      <h3 className="text-xs font-bold font-mono text-slate-300 group-hover:text-slate-100 transition-colors tracking-wide">{post.title}</h3>
      <p className="text-[10px] font-mono text-sr-muted leading-relaxed line-clamp-2">{post.summary}</p>
    </Link>
  );
}

// ── Tool card ─────────────────────────────────────────────────────────

export function ToolCard({ href, codexName, realName, description, stats, accent, cta, deployStatus, division }: ToolCardProps) {
  return (
    <Link href={href} className={`group flex flex-col border border-sr-border bg-sr-surface/30 p-4 hover:bg-sr-surface/60 transition-colors ${accent}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant={deployStatus} />
        <Badge variant={division} />
      </div>
      <p className="text-xs font-mono uppercase tracking-[0.15em] text-sr-muted">{codexName}</p>
      <h3 className="mt-1 text-sm font-bold font-mono text-slate-200 group-hover:text-slate-100 transition-colors">{realName}</h3>
      <p className="mt-2 flex-1 text-xs font-mono text-sr-muted leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-sr-border/30 pt-3">
        <div className="flex gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className={`text-sm font-bold font-mono tabular-nums ${cta}`}>{s.value}</span>
              <span className="text-xs font-mono text-sr-subtle uppercase tracking-[0.1em]">{s.label}</span>
            </div>
          ))}
        </div>
        <span className={`text-sm font-mono ${cta} opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
      </div>
    </Link>
  );
}

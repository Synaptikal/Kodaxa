/**
 * makers/page.tsx
 * Maker's Mark — registry of Stars Reach crafters who've staked a brand.
 * One concern: fetch visible crafters with a maker_mark + render the gallery.
 *
 * Server component. Data from supabase via getMakersDirectory().
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import { MakerCard } from '@/components/makers/maker-card';
import { getMakersDirectory } from '@/lib/makers/queries';
import type { MakerWithPortfolio } from '@/types/makers';

export const metadata: Metadata = {
  title: "Maker's Mark — Kodaxa Studios",
  description:
    'Registry of Stars Reach crafters and the brands they stand behind. Browse maker marks, featured works, and commission availability.',
};

export const revalidate = 120;

export default async function MakersPage() {
  const makers = await getMakersDirectory();

  const open    = makers.filter((m) => m.commission_status === 'open');
  const limited = makers.filter((m) => m.commission_status === 'limited');
  const other   = makers.filter(
    (m) => m.commission_status !== 'open' && m.commission_status !== 'limited',
  );

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500">
              Commerce Division // Brand Registry
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Maker&apos;s Mark</h1>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Every signature on a Stars Reach deliverable tells a story. Find
              the maker, vet their work, and commission directly. Your maker
              mark is the first thing buyers see — make it count.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>
              <span className="text-amber-400">{makers.length}</span> makers
            </span>
            <span>
              <span className="text-emerald-400">{open.length}</span> open
            </span>
            <span>
              <span className="text-amber-400">{limited.length}</span> limited
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-8">
        {makers.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {open.length > 0 && (
              <Section title="Open for Commissions" makers={open} tone="open" />
            )}
            {limited.length > 0 && (
              <Section title="Limited Availability" makers={limited} tone="limited" />
            )}
            {other.length > 0 && (
              <Section title="Registered Makers" makers={other} tone="neutral" />
            )}
          </>
        )}

        {/* Cross-links */}
        <div className="pt-6 flex flex-wrap gap-3 border-t border-slate-800">
          <Link
            href="/directory/me"
            className="text-xs px-3 py-1.5 rounded-md bg-amber-800/40 text-amber-200 border border-amber-700/50 hover:bg-amber-800/60 transition-colors"
          >
            Manage My Maker&apos;s Mark →
          </Link>
          <Link
            href="/directory"
            className="text-xs px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            Full Directory →
          </Link>
          <Link
            href="/market"
            className="text-xs px-3 py-1.5 rounded-md bg-amber-900/30 text-amber-300 border border-amber-800/40 hover:bg-amber-900/50 transition-colors"
          >
            Market Prices →
          </Link>
        </div>
      </main>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function Section({
  title,
  makers,
  tone,
}: {
  title: string;
  makers: MakerWithPortfolio[];
  tone: 'open' | 'limited' | 'neutral';
}) {
  const toneColor =
    tone === 'open'      ? 'text-emerald-400'
    : tone === 'limited' ? 'text-amber-400'
    :                      'text-slate-400';

  return (
    <section className="space-y-3">
      <h2 className={`text-[11px] font-mono uppercase tracking-[0.2em] ${toneColor}`}>
        {title} <span className="text-slate-600">· {makers.length}</span>
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {makers.map((m) => (
          <MakerCard key={m.id} maker={m} />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-10 text-center space-y-3">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500">
        Registry Empty
      </p>
      <p className="text-sm text-slate-300 font-medium">
        No maker marks registered yet.
      </p>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Be the first to stake a brand. Set a maker mark on your profile and
        showcase your signature works here.
      </p>
      <Link
        href="/directory/me"
        className="inline-block text-xs px-3 py-1.5 rounded-md bg-amber-800/40 text-amber-200 border border-amber-700/50 hover:bg-amber-800/60 transition-colors"
      >
        Register my mark →
      </Link>
    </div>
  );
}

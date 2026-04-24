/**
 * creatures/page.tsx
 * Creature Database — Stars Reach wildlife reference.
 * One concern: load static creature data and render the browser.
 *
 * Server component: data sourced from src/data/creatures/ (confirmed from
 * Twilight Update + Brave New Worlds patch notes).
 * Client filtering delegated to CreaturesBrowser.
 */

import type { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import { CreaturesBrowser } from '@/components/creatures/creatures-browser';
import { getAllCreatures, getCreatureStats } from '@/data/creatures/index';

export const metadata: Metadata = {
  title: 'Creature Database — Kodaxa Studios',
  description:
    'Stars Reach creature reference: behaviors, threat tiers, biomes, drops, and abilities. Compiled from Twilight Update and Brave New Worlds patch notes.',
};

interface CreaturesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CreaturesPage({ searchParams }: CreaturesPageProps) {
  const { q } = await searchParams;
  const creatures = getAllCreatures();
  const stats = getCreatureStats();

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      {/* Header strip — division identity + stats */}
      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-violet-500">
              Intelligence Division // Field Biology
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Creature Database</h1>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Confirmed wildlife catalogued from official patch notes. Entries
              marked <span className="text-amber-500 font-mono">UNCONFIRMED</span> are
              community-sourced and pending verification.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>
              <span className="text-slate-300">{stats.total}</span> entries
            </span>
            <span>
              <span className="text-emerald-400">{stats.confirmed}</span> confirmed
            </span>
          </div>
        </div>
      </header>

      <CreaturesBrowser creatures={creatures} initialQuery={q} />
    </div>
  );
}

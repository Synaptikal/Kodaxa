/**
 * atlas/page.tsx
 * Resource Atlas — crowdsourced PQRV reference, planet-by-planet.
 * One concern: server-load aggregated stats and render browser + form.
 *
 * Data comes from the resource_stats view. If the migration isn't applied
 * yet the queries return [] and the browser shows an empty state — the
 * submission form still works for authenticated scouts.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import { AtlasBrowser } from '@/components/atlas/atlas-browser';
import { ReadingForm } from '@/components/atlas/reading-form';
import { getResourceStats, getAtlasStats } from '@/lib/atlas/queries';
import { createClient } from '@/lib/supabase/server';
import { getAllBiomes } from '@/data/biomes';

export const metadata: Metadata = {
  title: 'Resource Atlas — Kodaxa Studios',
  description:
    'Crowdsourced Stars Reach resource PQRV (Potential / Quality / Resilience / Versatility) readings, planet by planet. Kodaxa Commerce Division.',
};

// Always fresh — this page shows live user contributions.
export const revalidate = 60;

export default async function AtlasPage() {
  // Parallel fetch: stats + auth state + atlas stats
  const supabase = await createClient();
  const [{ data: { user } }, stats, atlasStats] = await Promise.all([
    supabase.auth.getUser(),
    getResourceStats({ limit: 200 }),
    getAtlasStats(),
  ]);

  const biomes = getAllBiomes();

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      {/* Header strip */}
      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500">
              Commerce Division // Scout Logistics
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Resource Atlas</h1>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              A living PQRV map of the known worlds, compiled from every
              associate scout report. Browse peak or average stats for any
              resource on any planet — or file your own reading to the right.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>
              <span className="text-amber-400">{atlasStats.totalReadings}</span> readings
            </span>
            <span>
              <span className="text-slate-300">{atlasStats.uniquePairs}</span> pairs
            </span>
            <span>
              <span className="text-emerald-400">{atlasStats.uniquePlanets}</span> planets
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_minmax(320px,380px)] gap-6 items-start">
          <AtlasBrowser stats={stats} />
          <ReadingForm isAuthenticated={!!user} biomes={biomes} />
        </div>

        {/* Cross-links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/crafting"
            className="text-xs px-3 py-1.5 rounded-md bg-orange-800/30 text-orange-300 border border-orange-800/40 hover:bg-orange-800/50 transition-colors"
          >
            → Feed values into Crafting Calc
          </Link>
          <Link
            href="/biome-guide"
            className="text-xs px-3 py-1.5 rounded-md bg-emerald-900/30 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/50 transition-colors"
          >
            Biome Field Guide →
          </Link>
          <Link
            href="/creatures"
            className="text-xs px-3 py-1.5 rounded-md bg-violet-900/30 text-violet-300 border border-violet-800/40 hover:bg-violet-900/50 transition-colors"
          >
            Creature Database →
          </Link>
        </div>
      </main>
    </div>
  );
}

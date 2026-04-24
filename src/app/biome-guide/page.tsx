/**
 * biome-guide/page.tsx
 * Biome Field Guide — Stars Reach procedural biome reference.
 * One concern: load static biome data, show the 3×2 temp/moisture grid,
 * and hand off to the client browser for search + filter.
 *
 * Server component. Data sourced from src/data/biomes/index.ts,
 * grounded in Twilight + Brave New Worlds patch notes.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import { BiomesBrowser } from '@/components/biomes/biomes-browser';
import {
  getAllBiomes,
  getGridBiomes,
  getBiomeStats,
} from '@/data/biomes/index';
import {
  TEMPERATURE_COLORS,
  MOISTURE_COLORS,
  HAZARD_COLORS,
  HAZARD_LABELS,
} from '@/types/biomes';

export const metadata: Metadata = {
  title: 'Biome Field Guide — Kodaxa Studios',
  description:
    'Stars Reach biome reference: temperature × moisture grid, overlay biomes, hazards, flora, creatures, and resources. Compiled from Twilight and Brave New Worlds patch notes.',
};

// ── Static grid layout ───────────────────────────────────────────────

const TEMPS = ['cold', 'temperate', 'hot'] as const;
const MOISTURES = ['arid', 'humid'] as const;

interface BiomeGuidePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BiomeGuidePage({ searchParams }: BiomeGuidePageProps) {
  const { q } = await searchParams;
  const biomes = getAllBiomes();
  const grid = getGridBiomes();
  const stats = getBiomeStats();

  // Look up function for the grid cells
  const gridMap = new Map(grid.map((b) => [`${b.temperature}_${b.moisture}`, b]));

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      {/* Header strip — division identity + stats */}
      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-500">
              Intelligence Division // Terrain Survey
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Biome Field Guide</h1>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Stars Reach uses a temperature × moisture biome grid on every
              terrestrial planet, plus overlay biomes where local geology
              applies. Entries are grounded in patch notes; overlay biomes
              marked <span className="text-amber-500 font-mono">UNCONFIRMED</span> are
              community-extrapolated.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>
              <span className="text-slate-300">{stats.total}</span> biomes
            </span>
            <span>
              <span className="text-emerald-400">{stats.confirmed}</span> confirmed
            </span>
            <span>
              <span className="text-slate-300">{stats.gridBiomes}</span> grid ·{' '}
              <span className="text-violet-400">{stats.overlayBiomes}</span> overlay
            </span>
          </div>
        </div>
      </header>

      {/* Grid matrix */}
      <section className="border-b border-slate-800 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-3">
            Temperature × Moisture Matrix
          </p>

          <div className="overflow-x-auto">
            <table role="grid" className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th scope="col" className="w-24 py-2 text-left font-mono text-xs uppercase tracking-wider text-sr-muted">
                    Temp ↓ / Moist →
                  </th>
                  {MOISTURES.map((m) => (
                    <th
                      key={m}
                      scope="col"
                      className={`py-2 px-3 text-left font-mono text-xs uppercase tracking-wider border-b border-slate-800 ${MOISTURE_COLORS[m]}`}
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEMPS.map((t) => (
                  <tr key={t}>
                    <td
                      className={`py-3 pr-2 align-top font-mono text-xs uppercase tracking-wider border-b border-slate-800 ${TEMPERATURE_COLORS[t]}`}
                    >
                      {t}
                    </td>
                    {MOISTURES.map((m) => {
                      const biome = gridMap.get(`${t}_${m}`);
                      if (!biome) {
                        return (
                          <td
                            key={m}
                            className="py-3 px-3 align-top border-b border-slate-800 text-sr-subtle text-xs"
                          >
                            —
                          </td>
                        );
                      }
                      return (
                        <td
                          key={m}
                          className="py-3 px-3 align-top border-b border-slate-800"
                        >
                          <Link
                            href={`#${biome.id}`}
                            className="block group hover:bg-slate-800/40 -mx-2 px-2 py-1 rounded transition-colors"
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                {biome.name}
                              </span>
                              <span className={`text-xs font-mono ${HAZARD_COLORS[biome.hazard]}`}>
                                {HAZARD_LABELS[biome.hazard]}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-snug line-clamp-2 mt-0.5">
                              {biome.description}
                            </p>
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Full browser */}
      <BiomesBrowser biomes={biomes} initialQuery={q} />

      {/* Cross-links */}
      <div className="max-w-6xl mx-auto px-4 pb-10 pt-2 flex flex-wrap gap-3">
        <Link
          href="/creatures"
          className="text-xs px-3 py-1.5 rounded-md bg-violet-900/30 text-violet-300 border border-violet-800/40 hover:bg-violet-900/50 transition-colors"
        >
          Creature Database →
        </Link>
        <Link
          href="/atlas"
          className="text-xs px-3 py-1.5 rounded-md bg-amber-900/30 text-amber-300 border border-amber-800/40 hover:bg-amber-900/50 transition-colors"
        >
          Resource Atlas →
        </Link>
        <Link
          href="/items"
          className="text-xs px-3 py-1.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          Data Terminal →
        </Link>
      </div>
    </div>
  );
}

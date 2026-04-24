/**
 * biomes-browser.tsx
 * Client-side biome field guide browser with search + temperature filter.
 * One concern: filtering and rendering biome cards from static data.
 *
 * Follows the creatures-browser / items-browser pattern:
 *   - Server page loads data, passes as props
 *   - Client handles filter state
 *   - No data fetching
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Biome, BiomeTemperature } from '@/types/biomes';
import {
  TEMPERATURE_LABELS,
  TEMPERATURE_COLORS,
  MOISTURE_LABELS,
  MOISTURE_COLORS,
  HAZARD_LABELS,
  HAZARD_COLORS,
} from '@/types/biomes';
import { SearchInput } from '@/components/ui/search-input';
import { FilterPillGroup } from '@/components/ui/filter-pill';

export interface BiomesBrowserProps {
  biomes: Biome[];
  initialQuery?: string;
}

type TempOrOverlay = BiomeTemperature | 'overlay';

const TEMP_OPTIONS: { id: TempOrOverlay; label: string }[] = [
  { id: 'cold',      label: 'Cold' },
  { id: 'temperate', label: 'Temperate' },
  { id: 'hot',       label: 'Hot' },
  { id: 'overlay',   label: 'Overlay' },
];

export function BiomesBrowser({ biomes, initialQuery }: BiomesBrowserProps) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [tempFilters, setTempFilters] = useState<TempOrOverlay[]>([]);

  // Counts per temperature bucket (+ overlay = null temperature)
  const counts = useMemo(() => {
    const c: Partial<Record<TempOrOverlay, number>> = {};
    for (const b of biomes) {
      const key: TempOrOverlay = b.temperature ?? 'overlay';
      c[key] = (c[key] ?? 0) + 1;
    }
    return c;
  }, [biomes]);

  const filtered = useMemo(() => {
    let list = biomes;

    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.aliases?.some((a) => a.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q) ||
          b.flora.some((f) => f.toLowerCase().includes(q)) ||
          b.resources.some((r) => r.toLowerCase().includes(q)) ||
          b.creatures.some((c) => c.toLowerCase().includes(q)),
      );
    }

    if (tempFilters.length > 0) {
      list = list.filter((b) => {
        const key: TempOrOverlay = b.temperature ?? 'overlay';
        return tempFilters.includes(key);
      });
    }

    // Overlay biomes sort last; otherwise sort cold→temperate→hot then name.
    const TEMP_RANK: Record<string, number> = { cold: 0, temperate: 1, hot: 2, overlay: 3 };
    return [...list].sort((a, b) => {
      const ak = a.temperature ?? 'overlay';
      const bk = b.temperature ?? 'overlay';
      return (TEMP_RANK[ak] - TEMP_RANK[bk]) || a.name.localeCompare(b.name);
    });
  }, [biomes, query, tempFilters]);

  const toggleTemp = (id: string) => {
    setTempFilters((prev) =>
      prev.includes(id as TempOrOverlay)
        ? prev.filter((t) => t !== id)
        : [...prev, id as TempOrOverlay],
    );
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-6xl mx-auto w-full">
      {/* Controls */}
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search biomes by name, flora, resource, or creature…"
        />
        <FilterPillGroup
          options={TEMP_OPTIONS.map((o) => ({ ...o, count: counts[o.id] ?? 0 }))}
          selected={tempFilters}
          onToggle={toggleTemp}
          onClear={tempFilters.length > 0 ? () => setTempFilters([]) : undefined}
          accent="teal"
        />
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {filtered.length} of {biomes.length} biome{biomes.length === 1 ? '' : 's'}
        </span>
        <span className="text-xs text-sr-muted font-mono">
          Grid biomes confirmed · overlay biomes vary by planet geology
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border border-sr-border bg-sr-surface/30 p-10 text-center space-y-1">
          <p className="text-sm font-mono text-sr-muted">No biome records match the current filter configuration.</p>
          <p className="text-xs font-mono text-sr-subtle">Adjust filters to broaden the planetary survey scope.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((b) => (
            <BiomeCard key={b.id} biome={b} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────

function BiomeCard({ biome }: { biome: Biome }) {
  const tempClass = biome.temperature ? TEMPERATURE_COLORS[biome.temperature] : 'text-violet-400 bg-violet-900/30 border-violet-800/40';
  const moistureClass = biome.moisture ? MOISTURE_COLORS[biome.moisture] : '';
  const hazardClass = HAZARD_COLORS[biome.hazard];

  return (
    <article className="flex flex-col gap-2.5 p-4 border border-slate-800 bg-sr-surface/60 hover:border-slate-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-100">{biome.name}</h3>
          {biome.aliases && biome.aliases.length > 0 && (
            <p className="text-xs text-sr-muted font-mono">
              aka {biome.aliases.join(', ')}
            </p>
          )}
        </div>
        {!biome.confirmed && (
          <span className="text-[8px] font-mono text-amber-500 bg-amber-900/30 border border-amber-800/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
            Unconfirmed
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${tempClass}`}>
          {biome.temperature ? TEMPERATURE_LABELS[biome.temperature] : 'Overlay'}
        </span>
        {biome.moisture && (
          <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${moistureClass}`}>
            {MOISTURE_LABELS[biome.moisture]}
          </span>
        )}
        <span className={`text-[9px] font-mono uppercase tracking-wider ${hazardClass}`}>
          Hazard · {HAZARD_LABELS[biome.hazard]}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-sr-muted leading-relaxed">{biome.description}</p>

      {/* Terrain */}
      {biome.terrain.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Terrain:</span>
          {biome.terrain.map((t) => (
            <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Flora */}
      {biome.flora.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider">Flora:</span>
          {biome.flora.map((f) => (
            <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/20 text-emerald-400 border border-emerald-800/30">
              {f}
            </span>
          ))}
        </div>
      )}

      {/* Resources */}
      {biome.resources.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-amber-600 uppercase tracking-wider">Resources:</span>
          {biome.resources.map((r) => (
            <span key={r} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/20 text-amber-400 border border-amber-800/30">
              {r.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Creatures — link to Creature Database filtered by name */}
      {biome.creatures.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-violet-600 uppercase tracking-wider">Creatures:</span>
          {biome.creatures.map((c) => (
            <Link
              key={c}
              href={`/creatures?q=${encodeURIComponent(c.replace(/_/g, ' '))}`}
              className="text-[9px] px-1.5 py-0.5 rounded bg-violet-900/20 text-violet-400 border border-violet-800/30 hover:bg-violet-900/50 hover:text-violet-300 transition-colors"
            >
              {c.replace(/_/g, ' ')}
            </Link>
          ))}
        </div>
      )}

      {/* Hazards */}
      {biome.hazards && biome.hazards.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-red-600 uppercase tracking-wider">Hazards:</span>
          {biome.hazards.map((h) => (
            <span key={h} className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/20 text-red-400 border border-red-800/30">
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Preparation */}
      {biome.preparation && biome.preparation.length > 0 && (
        <p className="text-xs text-sr-muted font-mono leading-relaxed">
          <span className="text-slate-700">Prep:</span>{' '}
          {biome.preparation.join(' · ')}
        </p>
      )}
    </article>
  );
}

/**
 * creatures-browser.tsx
 * Client-side creature database browser with search + behavior filter.
 * One concern: filtering and rendering creature cards from static data.
 *
 * Follows the items-browser / recipes-browser pattern:
 *   - Server page loads data, passes as props
 *   - Client handles filter state
 *   - No data fetching
 */

'use client';

import { useState, useMemo } from 'react';
import type { Creature, CreatureBehavior } from '@/types/creatures';
import {
  BEHAVIOR_LABELS,
  BEHAVIOR_COLORS,
  CLASS_LABELS,
  SIZE_LABELS,
  THREAT_LABELS,
  THREAT_COLORS,
} from '@/types/creatures';
import { SearchInput } from '@/components/ui/search-input';
import { FilterPillGroup } from '@/components/ui/filter-pill';

export interface CreaturesBrowserProps {
  creatures: Creature[];
}

const BEHAVIOR_OPTIONS: { id: CreatureBehavior; label: string }[] = [
  { id: 'docile',      label: 'Docile' },
  { id: 'skittish',    label: 'Skittish' },
  { id: 'defensive',   label: 'Defensive' },
  { id: 'territorial', label: 'Territorial' },
  { id: 'aggressive',  label: 'Aggressive' },
  { id: 'flocking',    label: 'Flocking' },
];

export function CreaturesBrowser({ creatures }: CreaturesBrowserProps) {
  const [query, setQuery] = useState('');
  const [behaviorFilters, setBehaviorFilters] = useState<CreatureBehavior[]>([]);

  // Behavior counts
  const counts = useMemo(() => {
    const c: Partial<Record<CreatureBehavior, number>> = {};
    for (const cr of creatures) c[cr.behavior] = (c[cr.behavior] ?? 0) + 1;
    return c;
  }, [creatures]);

  const filtered = useMemo(() => {
    let list = creatures;
    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.aliases?.some((a) => a.toLowerCase().includes(q)) ||
          c.description.toLowerCase().includes(q) ||
          c.drops.some((d) => d.toLowerCase().includes(q)),
      );
    }
    if (behaviorFilters.length > 0) {
      list = list.filter((c) => behaviorFilters.includes(c.behavior));
    }
    return list.sort((a, b) => a.threatTier - b.threatTier || a.name.localeCompare(b.name));
  }, [creatures, query, behaviorFilters]);

  const toggleBehavior = (id: string) => {
    setBehaviorFilters((prev) =>
      prev.includes(id as CreatureBehavior)
        ? prev.filter((b) => b !== id)
        : [...prev, id as CreatureBehavior],
    );
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-6xl mx-auto w-full">
      {/* Controls */}
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search creatures by name, description, or drop…"
        />
        <FilterPillGroup
          options={BEHAVIOR_OPTIONS.map((o) => ({ ...o, count: counts[o.id] ?? 0 }))}
          selected={behaviorFilters}
          onToggle={toggleBehavior}
          onClear={behaviorFilters.length > 0 ? () => setBehaviorFilters([]) : undefined}
          accent="violet"
        />
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {filtered.length} of {creatures.length} creature{creatures.length === 1 ? '' : 's'}
        </span>
        <span className="text-[10px] text-slate-600 font-mono">
          Data sourced from Twilight + Brave New Worlds patch notes
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-10 text-center">
          <p className="text-sm text-slate-500">No creatures match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c) => (
            <CreatureCard key={c.id} creature={c} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────

function CreatureCard({ creature }: { creature: Creature }) {
  const behaviorClass = BEHAVIOR_COLORS[creature.behavior];
  const threatClass = THREAT_COLORS[creature.threatTier];

  return (
    <article className="flex flex-col gap-2.5 p-4 rounded-xl border border-slate-800 bg-sr-surface/60 hover:border-slate-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-100">{creature.name}</h3>
          {creature.aliases && creature.aliases.length > 0 && (
            <p className="text-[10px] text-slate-600 font-mono">
              aka {creature.aliases.join(', ')}
            </p>
          )}
        </div>
        {!creature.confirmed && (
          <span className="text-[8px] font-mono text-amber-500 bg-amber-900/30 border border-amber-800/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
            Unconfirmed
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${behaviorClass}`}>
          {BEHAVIOR_LABELS[creature.behavior]}
        </span>
        <span className={`text-[9px] font-mono uppercase tracking-wider ${threatClass}`}>
          {THREAT_LABELS[creature.threatTier]}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
          {SIZE_LABELS[creature.size]} · {CLASS_LABELS[creature.classification]}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-sr-muted leading-relaxed">{creature.description}</p>

      {/* Drops */}
      {creature.drops.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Drops:</span>
          {creature.drops.map((d) => (
            <span key={d} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {d.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Abilities */}
      {creature.abilities && creature.abilities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[9px] font-mono text-orange-600 uppercase tracking-wider">Abilities:</span>
          {creature.abilities.map((a) => (
            <span key={a} className="text-[9px] px-1.5 py-0.5 rounded bg-orange-900/20 text-orange-400 border border-orange-800/30">
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Biomes */}
      {creature.biomes.length > 0 && (
        <p className="text-[10px] text-slate-600 font-mono">
          <span className="text-slate-700">Biomes:</span>{' '}
          {creature.biomes.map((b) => b.replace(/_/g, ' ')).join(' · ')}
        </p>
      )}
    </article>
  );
}

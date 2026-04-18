/**
 * atlas-browser.tsx
 * Client-side Resource Atlas browser — filter + table over aggregated stats.
 * One concern: filter state + table render.
 *
 * Data is pre-fetched server-side (page.tsx) and passed as a prop.
 */

'use client';

import { useState, useMemo } from 'react';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_CATEGORY_COLORS,
  PQRV_TIER_COLORS,
  pqrvTier,
  type ResourceCategory,
  type ResourceStat,
} from '@/types/atlas';
import { SearchInput } from '@/components/ui/search-input';
import { FilterPillGroup } from '@/components/ui/filter-pill';

export interface AtlasBrowserProps {
  stats: ResourceStat[];
}

export function AtlasBrowser({ stats }: AtlasBrowserProps) {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [showAvg, setShowAvg] = useState(false);

  const counts = useMemo(() => {
    const c: Partial<Record<ResourceCategory, number>> = {};
    for (const s of stats) {
      if (s.resource_category) {
        c[s.resource_category] = (c[s.resource_category] ?? 0) + 1;
      }
    }
    return c;
  }, [stats]);

  const filtered = useMemo(() => {
    let list = stats;

    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (s) =>
          s.resource_name.toLowerCase().includes(q) ||
          s.planet.toLowerCase().includes(q) ||
          s.planet_key.includes(q),
      );
    }

    if (categories.length > 0) {
      list = list.filter(
        (s) => s.resource_category && categories.includes(s.resource_category),
      );
    }

    return list;
  }, [stats, query, categories]);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.includes(id as ResourceCategory)
        ? prev.filter((c) => c !== id)
        : [...prev, id as ResourceCategory],
    );
  };

  if (stats.length === 0) {
    return <EmptyAtlas />;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by resource or planet…"
        />
        <div className="flex flex-wrap items-center gap-3">
          <FilterPillGroup
            options={RESOURCE_CATEGORIES.map((c) => ({
              id: c,
              label: RESOURCE_CATEGORY_LABELS[c],
              count: counts[c] ?? 0,
            }))}
            selected={categories}
            onToggle={toggleCategory}
            onClear={categories.length > 0 ? () => setCategories([]) : undefined}
            accent="amber"
          />
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={showAvg}
              onChange={(e) => setShowAvg(e.target.checked)}
              className="accent-amber-500"
            />
            Show average (default: peak)
          </label>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {filtered.length} of {stats.length} entries
        </span>
        <span className="text-[10px] text-slate-600 font-mono">
          Sorted by sample density
        </span>
      </div>

      {/* Table */}
      <div className="border border-slate-800 bg-slate-900/30 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <HeaderCell>Resource</HeaderCell>
              <HeaderCell>Planet</HeaderCell>
              <HeaderCell align="right">P</HeaderCell>
              <HeaderCell align="right">Q</HeaderCell>
              <HeaderCell align="right">R</HeaderCell>
              <HeaderCell align="right">V</HeaderCell>
              <HeaderCell align="right">N</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <Row key={`${s.resource_name}__${s.planet_key}`} stat={s} showAvg={showAvg} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Row ──────────────────────────────────────────────────────────────

function Row({ stat, showAvg }: { stat: ResourceStat; showAvg: boolean }) {
  const p = showAvg ? stat.avg_potential   : stat.max_potential;
  const q = showAvg ? stat.avg_quality     : stat.max_quality;
  const r = showAvg ? stat.avg_resilience  : stat.max_resilience;
  const v = showAvg ? stat.avg_versatility : stat.max_versatility;

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
      <td className="py-2 px-3 min-w-[180px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-100 font-medium">{stat.resource_name}</span>
          {stat.resource_category && (
            <span
              className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${RESOURCE_CATEGORY_COLORS[stat.resource_category]}`}
            >
              {RESOURCE_CATEGORY_LABELS[stat.resource_category]}
            </span>
          )}
        </div>
      </td>
      <td className="py-2 px-3 text-slate-300">{stat.planet}</td>
      <StatCell value={p} />
      <StatCell value={q} />
      <StatCell value={r} />
      <StatCell value={v} />
      <td className="py-2 px-3 text-right text-[11px] font-mono text-slate-500">
        {stat.sample_count}
      </td>
    </tr>
  );
}

function StatCell({ value }: { value: number }) {
  const tier = pqrvTier(value);
  return (
    <td className={`py-2 px-3 text-right font-mono tabular-nums ${PQRV_TIER_COLORS[tier]}`}>
      {value}
    </td>
  );
}

function HeaderCell(props: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={`py-2 px-3 font-mono text-[10px] uppercase tracking-wider text-slate-500 ${
        props.align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {props.children}
    </th>
  );
}

// ── Empty state ──────────────────────────────────────────────────────

function EmptyAtlas() {
  return (
    <div className="border border-slate-800 bg-slate-900/30 p-8 text-center space-y-2">
      <p className="text-sm text-slate-300 font-medium">No readings yet</p>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Be the first scout to file a PQRV reading. Every contribution
        improves the Atlas for everyone. Fill out the form to the right.
      </p>
    </div>
  );
}
